import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validatePromoCode, isNewUser } from '@/lib/promo-codes'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { promoCode, subtotal } = await request.json()

    if (!promoCode || typeof promoCode !== 'string') {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 })
    }

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json({ error: 'Valid subtotal is required' }, { status: 400 })
    }

    // Get user to check if they're a new user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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

    return NextResponse.json({
      valid: true,
      discount: validation.discount,
      code: promoCode.toUpperCase().trim(),
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    )
  }
}

