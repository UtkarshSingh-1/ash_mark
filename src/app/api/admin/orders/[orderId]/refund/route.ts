import Razorpay from "razorpay"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params
  const { amount } = await req.json()
  console.info("[refund] admin refund request", { orderId, amount })

  const order = await prisma.order.findUnique({ where: { id: orderId } })

  if (!order || order.paymentStatus !== "PAID") {
    return NextResponse.json({ error: "Refund not allowed" }, { status: 400 })
  }

  const refund = await razorpay.payments.refund(order.razorpayPaymentId!, {
    amount: Math.round(amount * 100)
  })

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "REFUNDED",
      refundMethod: "ORIGINAL_SOURCE",
      refundStatus: "INITIATED",
      refundAmount: amount,
      returnStatus: "REFUND_INITIATED",
      updatedAt: new Date()
    }
  })

  await prisma.returnRequest.updateMany({
    where: { orderId, status: { not: "REJECTED" } },
    data: { status: "REFUND_INITIATED" },
  })

  return NextResponse.json({ success: true, refund })
}
