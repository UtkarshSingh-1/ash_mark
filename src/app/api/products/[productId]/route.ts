import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { jsonToStringArray } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const serializedProduct = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      images: jsonToStringArray(product.images),
      sizes: jsonToStringArray(product.sizes),
      colors: jsonToStringArray(product.colors),
      storyImages: jsonToStringArray(product.storyImages),
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}