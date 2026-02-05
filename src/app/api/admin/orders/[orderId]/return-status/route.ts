import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { refundToOriginal } from "@/lib/razorpay-refund"
import { creditWallet } from "@/lib/wallet"

const allowed = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "PICKUP_COMPLETED",
  "REFUND_INITIATED",
  "REFUND_COMPLETED",
  "REJECTED",
  "NONE",
]

const transitions: Record<string, string[]> = {
  NONE: ["REQUESTED"],
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PICKUP_SCHEDULED", "PICKUP_COMPLETED"],
  PICKUP_SCHEDULED: ["PICKUP_COMPLETED"],
  PICKUP_COMPLETED: ["REFUND_INITIATED"],
  REFUND_INITIATED: ["REFUND_COMPLETED"],
  REFUND_COMPLETED: [],
  REJECTED: [],
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params
  const { status } = await req.json()
  console.info("[returns] admin status update", { orderId, status })

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const current = order.returnStatus || "NONE"
  const nextAllowed = transitions[current] || []
  if (status !== current && !nextAllowed.includes(status)) {
    return NextResponse.json(
      { error: `Transition ${current} -> ${status} not allowed` },
      { status: 400 }
    )
  }

  const orderUpdate: any = { returnStatus: status }

  // Auto-refund after pickup completed
  if (status === "PICKUP_COMPLETED") {
    if (order.paymentStatus === "PAID") {
      if (!order.razorpayPaymentId) {
        return NextResponse.json(
          { error: "Refund failed: missing payment ID" },
          { status: 400 }
        )
      }

      const refundResult = await refundToOriginal(
        order.razorpayPaymentId,
        Number(order.total)
      )

      if (!refundResult.success) {
        return NextResponse.json(
          { error: "Refund failed. Please try again." },
          { status: 502 }
        )
      }

      orderUpdate.returnStatus = "REFUND_INITIATED"
      orderUpdate.refundStatus = "INITIATED"
      orderUpdate.refundMethod = "ORIGINAL_SOURCE"
      orderUpdate.refundAmount = Number(order.total)
      orderUpdate.paymentStatus = "REFUNDED"
    } else if (order.paymentMethod === "COD") {
      await creditWallet(order.userId, order.id, Number(order.total))
      orderUpdate.returnStatus = "REFUND_COMPLETED"
      orderUpdate.refundStatus = "COMPLETED"
      orderUpdate.refundMethod = "WALLET"
      orderUpdate.refundAmount = Number(order.total)
      orderUpdate.paymentStatus = "REFUNDED"
    }
  }

  if (status === "REFUND_INITIATED") {
    orderUpdate.refundStatus = "INITIATED"
  }
  if (status === "REFUND_COMPLETED") {
    orderUpdate.refundStatus = "COMPLETED"
    orderUpdate.paymentStatus = "REFUNDED"
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: orderUpdate,
  })

  await prisma.returnRequest.updateMany({
    where: { orderId, status: { not: "REJECTED" } },
    data: { status: orderUpdate.returnStatus || status },
  })

  return NextResponse.json({ success: true, order: updatedOrder })
}
