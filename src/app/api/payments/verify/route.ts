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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification fields' },
        { status: 400 }
      )
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Update order -> Payment Successful
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      },
      include: { user: true },
    })

    // Clear cart after success
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    // Mark promo usage if applicable
    if (
      order.promoCode &&
      order.discount &&
      Number(order.discount) > 0 // ✅ Fixed Decimal comparison
    ) {
      await prisma.promoCodeUsage.create({
        data: {
          code: order.promoCode,
          userId: session.user.id,
          orderId: order.id,
        },
      })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
