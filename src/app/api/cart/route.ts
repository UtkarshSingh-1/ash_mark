import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const ALLOWED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
type SizeValue = (typeof ALLOWED_SIZES)[number]

const ALLOWED_COLORS = [
  'BLACK',
  'WHITE',
  'GRAY',
  'RED',
  'BLUE',
  'GREEN',
  'YELLOW',
  'ORANGE',
  'PURPLE',
  'PINK',
] as const
type ColorValue = (typeof ALLOWED_COLORS)[number]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const productId: string = String(body.productId || '')
    const quantity: number = Math.max(1, Math.min(99, Number(body.quantity || 1)))
    // Normalize variant values to Prisma enums if provided
    const requestedSize = body.size ? String(body.size).toUpperCase() : null
    const requestedColor = body.color ? String(body.color).toUpperCase() : null

    if (requestedSize && !ALLOWED_SIZES.includes(requestedSize as SizeValue)) {
      return NextResponse.json({ error: 'Invalid size value' }, { status: 400 })
    }

    if (requestedColor && !ALLOWED_COLORS.includes(requestedColor as ColorValue)) {
      return NextResponse.json({ error: 'Invalid color value' }, { status: 400 })
    }

    const size: SizeValue | null = requestedSize as SizeValue | null
    const color: ColorValue | null = requestedColor as ColorValue | null

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const existing = await prisma.cartItem.findFirst({
      where: { userId: session.user.id, productId, size, color },
    })

    let cartItem
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
          size,
          color,
        },
        include: { product: true },
      })
    }

    const serialized = {
      ...cartItem,
      product: {
        ...cartItem.product,
        price: Number(cartItem.product.price),
        comparePrice: cartItem.product.comparePrice ? Number(cartItem.product.comparePrice) : null,
      }
    }

    return NextResponse.json({ success: true, cartItem: serialized })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    })

    type CartItemWithProduct = typeof items[number]

    const cartItems = items.map((item: CartItemWithProduct) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
      },
    }))

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('Fetch cart error:', error)
    return NextResponse.json({ cartItems: [] }, { status: 200 })
  }
}
