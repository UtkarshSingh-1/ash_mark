import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface OrderCancelParams {
  params: Promise<{
    orderId: string
  }>
}

export async function POST(
  request: NextRequest,
  context: OrderCancelParams
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findFirst({
      where: {
        id: (await context.params).orderId,
        userId: session.user.id,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Order cannot be cancelled at this stage' },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: (await context.params).orderId },
      data: { 
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      order: updatedOrder
    })
  } catch {
    console.error('Error cancelling order')
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
