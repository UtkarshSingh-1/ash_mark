import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const razorpay_order_id =
      body.razorpay_order_id || body.razorpayOrderId
    const razorpay_payment_id =
      body.razorpay_payment_id || body.razorpayPaymentId
    const razorpay_signature =
      body.razorpay_signature || body.razorpaySignature
    const orderId = body.orderId

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { error: 'Order mismatch' },
        { status: 400 }
      )
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ success: true, alreadyVerified: true })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json(
        { error: 'Payment verification not configured' },
        { status: 500 }
      )
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentMethod: 'PREPAID',
        paymentStatus: 'PAID',
        status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
        updatedAt: new Date(),
      },
    })

    if (order.promoCode) {
      const existingUsage = await prisma.promoCodeUsage.findUnique({
        where: { orderId },
      })

      if (!existingUsage) {
        await prisma.promoCodeUsage.create({
          data: {
            code: order.promoCode,
            userId: order.userId,
            orderId: order.id,
          },
        })
      }
    }

    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
