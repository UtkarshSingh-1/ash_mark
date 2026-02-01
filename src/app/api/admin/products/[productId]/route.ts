import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateProductSchema = z.object({
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
})

interface ProductParams {
  params: Promise<{
    productId: string
  }>
}

// PUT /api/admin/products/[productId]
export async function PUT(
  request: NextRequest,
  context: ProductParams
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)
    const { productId } = await context.params

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (validatedData.slug !== existingProduct.slug) {
      const conflictingProduct = await prisma.product.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: productId }
        },
      })

      if (conflictingProduct) {
        validatedData.slug = `${validatedData.slug}-${Date.now()}`
      }
    }

    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    const allowedSizes = ['XS','S','M','L','XL','XXL']
    const allowedColors = ['BLACK','WHITE','GRAY','RED','BLUE','GREEN','YELLOW','ORANGE','PURPLE','PINK']

    const sizesEnum = (validatedData.sizes || [])
      .map(s => s.toUpperCase())
      .filter(s => allowedSizes.includes(s)) as any

    const colorsEnum = (validatedData.colors || [])
      .map(c => c.toUpperCase())
      .filter(c => allowedColors.includes(c)) as any

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...validatedData,
        sizes: sizesEnum,
        colors: colorsEnum,
        updatedAt: new Date(),
      },
      include: { category: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[productId]
export async function DELETE(
  request: NextRequest,
  context: ProductParams
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await context.params

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Manual delete ONLY for OrderItem (blocks deletion)
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { productId } })
      await tx.product.delete({ where: { id: productId } })
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

