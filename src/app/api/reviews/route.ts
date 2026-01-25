import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const withImages = searchParams.get("withImages") === "true"

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Ensure sortOrder is Prisma.SortOrder ("asc" | "desc")
    const sortOrder: Prisma.SortOrder =
      order === "asc" || order === "desc" ? order : "desc"

    const orderBy: Prisma.ReviewOrderByWithRelationInput =
      sort === "rating" ? { rating: sortOrder } : { createdAt: sortOrder }

    // Fetch all reviews for filtering & pagination
    let reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        votes: true, // to reflect helpful/notHelpful votes
      },
      orderBy,
    })

    // Filter reviews with media if requested
    if (withImages) {
      reviews = reviews.filter(r => Array.isArray(r.media) && r.media.length > 0)
    }

    const total = reviews.length
    const paginated = reviews.slice(skip, skip + limit)

    // average rating
    const avgRating = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    })

    // rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true },
    })

    return NextResponse.json({
      reviews: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating: avgRating._avg.rating || 0,
      ratingDistribution: Object.fromEntries(
        ratingDistribution.map(r => [r.rating, r._count.rating])
      ),
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, rating, title, comment, media } = await request.json()

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Product ID and valid rating (1-5) are required" },
        { status: 400 }
      )
    }

    // check duplicate review by same user
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
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    // optional delivered check (Flipkart style)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: "DELIVERED",
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
        media: media || [], // JSON array of {url, type}
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
