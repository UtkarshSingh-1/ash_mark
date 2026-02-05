import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const allowed = [
  "REQUESTED",
  "APPROVED",
  "PICKUP_SCHEDULED",
  "PICKUP_COMPLETED",
  "EXCHANGE_PROCESSING",
  "EXCHANGE_COMPLETED",
  "REJECTED",
  "NONE",
]

const transitions: Record<string, string[]> = {
  NONE: ["REQUESTED"],
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PICKUP_SCHEDULED", "PICKUP_COMPLETED"],
  PICKUP_SCHEDULED: ["PICKUP_COMPLETED"],
  PICKUP_COMPLETED: ["EXCHANGE_PROCESSING"],
  EXCHANGE_PROCESSING: ["EXCHANGE_COMPLETED"],
  EXCHANGE_COMPLETED: [],
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
  console.info("[exchanges] admin status update", { orderId, status })

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const current = order.exchangeStatus || "NONE"
  const nextAllowed = transitions[current] || []
  if (status !== current && !nextAllowed.includes(status)) {
    return NextResponse.json(
      { error: `Transition ${current} -> ${status} not allowed` },
      { status: 400 }
    )
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { exchangeStatus: status },
  })

  await prisma.exchangeRequest.updateMany({
    where: { orderId, status: { not: "REJECTED" } },
    data: { status },
  })

  return NextResponse.json({ success: true, order: updatedOrder })
}
