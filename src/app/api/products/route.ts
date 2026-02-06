import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const timeoutId = setTimeout(() => {
    console.error('Products API timeout - operation took too long')
  }, 10000) // 10 second timeout

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Cap at 50 items
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const orderBy: any = {}
    orderBy[sort] = order

    // Add timeout to database operations
    const productsPromise = prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      skip,
      take: limit,
      orderBy,
    })

    const countPromise = prisma.product.count({ where })

    const [products, total] = await Promise.race([
      Promise.all([productsPromise, countPromise]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      )
    ]) as [any[], number]

    clearTimeout(timeoutId)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Error fetching products:', error)
    
    // Return empty result instead of error for better UX
    return NextResponse.json({
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
      error: 'Unable to load products at this time'
    }, { status: 200 })
  }
}
