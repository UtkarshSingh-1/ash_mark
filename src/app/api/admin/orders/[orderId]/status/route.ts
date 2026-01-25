import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
      'PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED',
      'RETURN_REQUESTED','RETURN_APPROVED','RETURN_REJECTED','RETURNED',
      'EXCHANGE_REQUESTED','EXCHANGE_APPROVED','EXCHANGE_REJECTED','EXCHANGED'
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
      SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
      DELIVERED: ['RETURN_REQUESTED', 'EXCHANGE_REQUESTED'],
      RETURN_REQUESTED: ['RETURN_APPROVED', 'RETURN_REJECTED'],
      RETURN_APPROVED: ['RETURNED'],
      EXCHANGE_REQUESTED: ['EXCHANGE_APPROVED', 'EXCHANGE_REJECTED'],
      EXCHANGE_APPROVED: ['EXCHANGED']
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
    }

    if (status === 'RETURNED' || status === 'EXCHANGED') {
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
