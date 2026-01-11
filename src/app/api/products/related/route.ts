import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId') || ''
    const excludeId = searchParams.get('excludeId') || ''
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!categoryId) {
      return NextResponse.json({ products: [] })
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId,
        NOT: { id: excludeId || undefined },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })

    // type RelatedProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number]
    type RelatedProduct = (typeof products)[number]

    const serialized = products.map((product: RelatedProduct) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    }))

    return NextResponse.json({ products: serialized })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ products: [] }, { status: 200 })
  }
}