import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reason, newSize, newColor } = await request.json()

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: 'DELIVERED',
      },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found or not eligible' }, { status: 404 })
    }

    const item = order.items[0] // simplifying since no item selector UI yet

    await prisma.exchangeRequest.create({
      data: {
        orderId,
        userId: session.user.id,
        reason,
        oldSize: item.size,
        newSize: newSize ?? item.size,
        oldColor: item.color,
        newColor: newColor ?? item.color,
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { exchangeStatus: 'REQUESTED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Exchange Request Error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
