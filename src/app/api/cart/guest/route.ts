import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, quantity = 1, size, color } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get product details
    const product = await prisma.product.findUnique({ 
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        comparePrice: true,
        images: true,
        slug: true,
        stock: true,
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ 
        error: `Only ${product.stock} items available in stock` 
      }, { status: 400 })
    }

    const cartItem = {
      id: `guest-${Date.now()}-${Math.random()}`,
      productId,
      quantity: Math.max(1, Math.min(99, quantity)),
      size: size || null,
      color: color || null,
      product: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        images: product.images,
        slug: product.slug,
      }
    }

    return NextResponse.json({ success: true, cartItem })
  } catch (error) {
    console.error('Guest add to cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}