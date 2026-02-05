import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { refundToOriginal } from '@/lib/razorpay-refund'
import { creditWallet } from '@/lib/wallet'

interface Params {
  params: Promise<{ orderId: string }>
}

export async function PUT(request: NextRequest, context: Params) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, courierName, trackingId } = body

    const allowedStatuses = [
      'PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','COMPLETED','CANCELLED'
    ]

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid Status' }, { status: 400 })
    }

    const { orderId } = await context.params

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Transition Rules
    const transitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED', 'CANCELLED'],
      DELIVERED: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: []
    }

    const current = order.status
    const nextAllowed = transitions[current] || []

    if (status !== current && !nextAllowed.includes(status)) {
      return NextResponse.json({
        error: `Transition ${current} → ${status} not allowed`
      }, { status: 400 })
    }

    const updateData: any = { status, updatedAt: new Date() }

    // Shipping Info
    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date()
      updateData.courierName = courierName
      updateData.trackingId = trackingId
    }

    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    }

    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date()

      // Auto-refund for prepaid orders cancelled before shipping
      const isBeforeShipping = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)
      if (isBeforeShipping && order.paymentStatus === 'PAID') {
        if (!order.razorpayPaymentId) {
          return NextResponse.json({ error: 'Refund failed: missing payment ID' }, { status: 400 })
        }

        const refundResult = await refundToOriginal(
          order.razorpayPaymentId,
          Number(order.total)
        )

        if (!refundResult.success) {
          return NextResponse.json({ error: 'Refund failed. Please try again.' }, { status: 502 })
        }

        updateData.paymentStatus = 'REFUNDED'
        updateData.refundMethod = 'ORIGINAL_SOURCE'
        updateData.refundStatus = 'INITIATED'
        updateData.refundAmount = Number(order.total)
      } else if (isBeforeShipping && order.paymentMethod === 'COD') {
        await creditWallet(order.userId, order.id, Number(order.total))
        updateData.paymentStatus = 'REFUNDED'
        updateData.refundMethod = 'WALLET'
        updateData.refundStatus = 'COMPLETED'
        updateData.refundAmount = Number(order.total)
      }
    }

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Order updated to ${status}`
    })

  } catch (err) {
    console.error('Order status update error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
