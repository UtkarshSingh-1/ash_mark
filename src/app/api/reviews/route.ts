import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit
    const orderBy: any = {}
    orderBy[sort] = order

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.review.count({ where: { productId } }),
    ])

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    })

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true },
    })

    type RatingGroup = (typeof ratingDistribution)[number]

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating: avgRating._avg.rating || 0,
      ratingDistribution: ratingDistribution.reduce(
        (acc: Record<number, number>, group: RatingGroup) => {
          acc[group.rating] = group._count.rating
          return acc
        },
        {}
      ),
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
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

    const { productId, rating, title, comment } = await request.json()

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Product ID and valid rating (1-5) are required' },
        { status: 400 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if user has purchased this product (optional validation)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: 'DELIVERED',
        },
      },
    })

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title: title || null,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}