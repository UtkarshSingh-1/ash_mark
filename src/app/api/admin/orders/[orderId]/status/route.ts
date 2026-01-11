import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface OrderStatusParams {
  params: Promise<{
    orderId: string
  }>
}

export async function PUT(
  request: NextRequest,
  context: OrderStatusParams
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    const validStatuses = [
      'PENDING',
      'CONFIRMED', 
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'RETURNED'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const { orderId } = await context.params

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true,
      order: updatedOrder,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
