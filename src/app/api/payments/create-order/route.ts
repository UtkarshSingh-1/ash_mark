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
      amount,
      addressId,
      idempotencyKey,
      promoCode,
      paymentMethod,
    } = await request.json()

    // Load cart items to create order items from real data
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    })

    type CartItemWithProduct = (typeof cartItems)[number]

    // Guard against empty carts (can happen if client and DB go out of sync)
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Your cart is empty. Please add items again.' },
        { status: 400 }
      )
    }

    // Compute totals from cart to avoid hardcoded values
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItemWithProduct) => sum + Number(item.product.price) * item.quantity,
      0
    )
    const shipping = subtotal > 1000 ? 0 : (cartItems.length > 0 ? 100 : 0)
    
    // Validate and apply promo code if provided
    let discount = 0
    let appliedPromoCode: string | null = null
    
    if (promoCode) {
      // Get user to check if they're a new user
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true },
      })

      if (user) {
        const userIsNew = isNewUser(user.createdAt)
        
        // Check if user has already used this promo code
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

        // Validate promo code
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

    const computedTotal = subtotal + shipping - discount

    // If client sent amount, prefer computed to avoid tampering
    const finalAmount = computedTotal
    const normalizedPaymentMethod = paymentMethod === 'COD' ? 'COD' : 'ONLINE'
    const orderItemsPayload = cartItems.map((ci: CartItemWithProduct) => ({
      productId: ci.productId,
      quantity: ci.quantity,
      price: Number(ci.product.price),
      size: ci.size || undefined,
      color: ci.color || undefined,
    }))

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
          addressId,
          shippingAddressId: addressId,
          items: {
            create: orderItemsPayload,
          },
        },
      })

      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      if (appliedPromoCode && discount > 0) {
        await prisma.promoCodeUsage.create({
          data: {
            code: appliedPromoCode,
            userId: session.user.id,
            orderId: order.id,
          },
        })
      }

      return NextResponse.json({
        orderId: order.id,
        amount: finalAmount,
        currency: 'INR',
        paymentMethod: 'COD',
      })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })

    // Idempotent create/update: if idempotencyKey (orderId) provided, update it; else create new
    let order
    if (idempotencyKey) {
      order = await prisma.order.update({
        where: { id: idempotencyKey },
        data: {
          total: finalAmount,
          subtotal: subtotal,
          tax: 0,
          shipping: shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          razorpayOrderId: razorpayOrder.id,
          addressId,
          shippingAddressId: addressId, // Set shippingAddressId to link the address
          paymentMethod: 'ONLINE',
          paymentStatus: 'PENDING',
        },
      })
    } else {
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          total: finalAmount,
          subtotal: subtotal,
          tax: 0,
          shipping: shipping,
          discount: discount > 0 ? discount : null,
          promoCode: appliedPromoCode,
          razorpayOrderId: razorpayOrder.id,
          addressId,
          shippingAddressId: addressId, // Set shippingAddressId to link the address
          paymentMethod: 'ONLINE',
          paymentStatus: 'PENDING',
          status: 'PENDING',
          items: {
            create: orderItemsPayload,
          },
        },
      })

      // Track promo code usage if applied
      if (appliedPromoCode && discount > 0) {
        await prisma.promoCodeUsage.create({
          data: {
            code: appliedPromoCode,
            userId: session.user.id,
            orderId: order.id,
          },
        })
      }
    }

    return NextResponse.json({
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
