import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface OrderReturnRequestParams {
  params: Promise<{
    orderId: string
  }>
}

export async function POST(
  request: NextRequest,
  context: OrderReturnRequestParams
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

    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Only delivered orders can be returned' },
        { status: 400 }
      )
    }

    // Check if return window is still open (30 days)
    const deliveryDate = order.updatedAt
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    if (deliveryDate < thirtyDaysAgo) {
      return NextResponse.json(
        { error: 'Return window has expired' },
        { status: 400 }
      )
    }

    // Update order status to return requested
    const updatedOrder = await prisma.order.update({
      where: { id: (await context.params).orderId },
      data: { 
        status: 'RETURNED',
        updatedAt: new Date(),
      },
    })

    // Here you would typically:
    // 1. Send notification to admin
    // 2. Create return request record
    // 3. Send email to customer

    return NextResponse.json({ 
      success: true, 
      message: 'Return request submitted successfully',
      order: updatedOrder
    })
  } catch (error) {
    console.error('Error requesting return:', error)
    return NextResponse.json(
      { error: 'Failed to submit return request' },
      { status: 500 }
    )
  }
}
