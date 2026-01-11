import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 400 })
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    })

    return NextResponse.json({ wishlistItem })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
