import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  slug: z.string().min(1, "Slug is required"),
  hasStory: z.boolean().optional(),
  storyTitle: z.string().optional(),
  storyContent: z.string().optional(),
  storyImages: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured')
    const trending = searchParams.get('trending')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.categoryId = category
    }
    
    if (featured !== null) {
      where.featured = featured === 'true'
    }
    
    if (trending !== null) {
      where.trending = trending === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              orderItems: true,
              wishlistItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ])

    // Serialize Decimal and Json fields
    // type AdminProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number]
    type AdminProduct = (typeof products)[number]


    const serializedProducts = products.map((product: AdminProduct) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      images: Array.isArray(product.images) ? product.images.filter((item: unknown): item is string => typeof item === 'string') : [],
      sizes: Array.isArray(product.sizes) ? product.sizes.filter((item: unknown): item is string => typeof item === 'string') : [],
      colors: Array.isArray(product.colors) ? product.colors.filter((item: unknown): item is string => typeof item === 'string') : [],
      storyImages: Array.isArray(product.storyImages) ? product.storyImages.filter((item: unknown): item is string => typeof item === 'string') : [],
    }))

    return NextResponse.json({
      products: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingProduct) {
      // Generate unique slug
      const timestamp = Date.now()
      validatedData.slug = `${validatedData.slug}-${timestamp}`
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    // Map incoming strings to Prisma enums for sizes and colors
    const allowedSizes = ['XS','S','M','L','XL','XXL']
    const allowedColors = ['BLACK','WHITE','GRAY','RED','BLUE','GREEN','YELLOW','ORANGE','PURPLE','PINK']

    const sizesEnum = (validatedData.sizes || [])
      .map((s) => (typeof s === 'string' ? s.toUpperCase() : s))
      .filter((s) => allowedSizes.includes(s)) as any

    const colorsEnum = (validatedData.colors || [])
      .map((c) => (typeof c === 'string' ? c.toUpperCase() : c))
      .filter((c) => allowedColors.includes(c)) as any

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        comparePrice: validatedData.comparePrice,
        categoryId: validatedData.categoryId,
        images: validatedData.images,
        sizes: sizesEnum,
        colors: colorsEnum,
        stock: validatedData.stock,
        featured: validatedData.featured,
        trending: validatedData.trending,
        slug: validatedData.slug,
        storyTitle: validatedData.hasStory ? validatedData.storyTitle : null,
        storyContent: validatedData.hasStory ? validatedData.storyContent : null,
        storyImages: validatedData.hasStory ? (validatedData.storyImages || []) : [],
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
