import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = await params
    const { itemId, reason, newSize, newColor } = await request.json()
    console.info("[exchanges] request", { orderId, userId: session.user.id, itemId, newSize, newColor })

    if (!reason || !itemId || !newSize || !newColor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "DELIVERED",
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not eligible for exchange" }, { status: 400 })
    }

    const existing = await prisma.exchangeRequest.findFirst({
      where: {
        orderId,
        userId: session.user.id,
        status: { in: ["REQUESTED", "APPROVED", "PICKUP_SCHEDULED", "PICKUP_COMPLETED", "EXCHANGE_PROCESSING"] },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Exchange already requested" }, { status: 400 })
    }

    await prisma.exchangeRequest.create({
      data: {
        orderId,
        userId: session.user.id,
        reason: reason.trim(),
        newSize,
        newColor,
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { exchangeStatus: "REQUESTED" },
    })

    console.info("[exchanges] created", { orderId, userId: session.user.id })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Exchange Error:", error)
    return NextResponse.json({ error: "Failed to submit exchange request" }, { status: 500 })
  }
}
