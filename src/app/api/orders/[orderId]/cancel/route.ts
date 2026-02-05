import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { refundToOriginal } from '@/lib/razorpay-refund'
import { creditWallet } from '@/lib/wallet'

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

    const orderId = (await context.params).orderId

    let refundData: {
      paymentStatus?: 'REFUNDED'
      refundMethod?: 'ORIGINAL_SOURCE'
      refundStatus?: 'INITIATED'
      refundAmount?: number
    } = {}

    if (order.paymentStatus === 'PAID') {
      if (!order.razorpayPaymentId) {
        return NextResponse.json(
          { error: 'Refund failed: missing payment ID' },
          { status: 400 }
        )
      }

      const refundResult = await refundToOriginal(
        order.razorpayPaymentId,
        Number(order.total)
      )

      if (!refundResult.success) {
        return NextResponse.json(
          { error: 'Refund failed. Please try again.' },
          { status: 502 }
        )
      }

      refundData = {
        paymentStatus: 'REFUNDED',
        refundMethod: 'ORIGINAL_SOURCE',
        refundStatus: 'INITIATED',
        refundAmount: Number(order.total),
      }
    } else if (order.paymentMethod === 'COD') {
      await creditWallet(order.userId, order.id, Number(order.total))
      refundData = {
        paymentStatus: 'REFUNDED',
        refundMethod: 'WALLET',
        refundStatus: 'COMPLETED',
        refundAmount: Number(order.total),
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        updatedAt: new Date(),
        ...refundData,
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
