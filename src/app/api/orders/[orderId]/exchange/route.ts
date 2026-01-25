import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { orderId } = await params
  const { itemId, reason, newSize, newColor } = await req.json()

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: "DELIVERED" },
    include: { items: true }
  })

  if (!order) return NextResponse.json({ error: "Not eligible" }, { status: 400 })

  const item = order.items.find(i => i.id === itemId)

  await prisma.exchangeRequest.create({
    data: {
      orderId,
      userId: session.user.id,
      reason,
      oldSize: item?.size ?? null,
      newSize,
      oldColor: item?.color ?? null,
      newColor,
    }
  })

  await prisma.order.update({
    where: { id: orderId },
    data: { exchangeStatus: "REQUESTED" }
  })

  return NextResponse.json({ success: true })
}
