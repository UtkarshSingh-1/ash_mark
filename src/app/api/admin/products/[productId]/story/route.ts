import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await params
    const { storyTitle, storyContent, storyImages } = await request.json()

    if (!storyTitle || !storyContent) {
      return NextResponse.json(
        { error: 'Story title and content are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update product with story
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        storyTitle: storyTitle,
        storyContent: storyContent,
        storyImages: storyImages || [],
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error('Error updating product story:', error)
    return NextResponse.json(
      { error: 'Failed to update product story' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Remove story from product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        storyTitle: null,
        storyContent: null,
        storyImages: [],
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error('Error removing product story:', error)
    return NextResponse.json(
      { error: 'Failed to remove product story' },
      { status: 500 }
    )
  }
}