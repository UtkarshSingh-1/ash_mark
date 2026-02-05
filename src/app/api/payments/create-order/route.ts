import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Razorpay from 'razorpay'
import { validatePromoCode, isNewUser } from '@/lib/promo-codes'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      addressId,
      idempotencyKey,
      promoCode,
      paymentMethod,
    } = await request.json()

    // 🔹 Fetch address for snapshot
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    })

    if (!address) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Please add items again.' },
        { status: 400 }
      )
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    const shipping = 0

    let discount = 0
    let appliedPromoCode: string | null = null

    if (promoCode) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true },
      })

      if (user) {
        const userIsNew = isNewUser(user.createdAt)

        const existingUsage = await prisma.promoCodeUsage.findUnique({
          where: {
            userId_code: {
              userId: session.user.id,
              code: promoCode.toUpperCase().trim(),
            },
          },
        })

        if (existingUsage) {
          return NextResponse.json(
            { error: 'This promo code has already been used' },
            { status: 400 }
          )
        }

        const validation = validatePromoCode(promoCode, subtotal, userIsNew)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || 'Invalid promo code' },
            { status: 400 }
          )
        }

        discount = validation.discount || 0
        appliedPromoCode = promoCode.toUpperCase().trim()
      }
    }

    const finalAmount = subtotal + shipping - discount
    const normalizedPaymentMethod = paymentMethod === 'COD' ? 'COD' : 'ONLINE'

    // 🔹 FIX: Remove undefined fields
    const orderItemsPayload = cartItems.map((ci) => ({
      productId: ci.productId,
      quantity: ci.quantity,
      price: Number(ci.product.price),
      ...(ci.size ? { size: ci.size } : {}),
      ...(ci.color ? { color: ci.color } : {}),
    }))

    // ---------- COD ORDER ----------
    if (normalizedPaymentMethod === 'COD') {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total: finalAmount,
          subtotal,
          tax: 0,
          shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          status: 'CONFIRMED',

          // ✅ Billing + Shipping
          addressId,
          shippingAddressId: addressId,

          // ✅ Snapshot
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          shippingCountry: address.country,

          items: { create: orderItemsPayload },
        },
      })

      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      return NextResponse.json({
        success: true,
        orderId: order.id,
      })
    }

    // ---------- ONLINE PAYMENT ----------
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })

    let order

    if (idempotencyKey) {
      order = await prisma.order.update({
        where: { id: idempotencyKey },
        data: {
          total: finalAmount,
          subtotal,
          tax: 0,
          shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          razorpayOrderId: razorpayOrder.id,
          addressId,
          shippingAddressId: addressId,
          paymentMethod: 'ONLINE',
          paymentStatus: 'PENDING',
        },
      })
    } else {
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total: finalAmount,
          subtotal,
          tax: 0,
          shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          razorpayOrderId: razorpayOrder.id,
          addressId,
          shippingAddressId: addressId,
          paymentMethod: 'ONLINE',
          paymentStatus: 'PENDING',
          status: 'PENDING',

          shippingName: address.name,
          shippingPhone: address.phone,
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPincode: address.pincode,
          shippingCountry: address.country,

          items: { create: orderItemsPayload },
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
