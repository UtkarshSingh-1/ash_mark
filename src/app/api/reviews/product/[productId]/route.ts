import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params
  const { searchParams } = new URL(req.url)

  const sort = searchParams.get("sort") || "newest"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 5
  const skip = (page - 1) * limit
  const withImages = searchParams.get("withImages") === "true"

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" }
  if (sort === "top") orderBy = { rating: "desc" }

  const where = {
    productId,
    ...(withImages ? { media: { not: "[]" } } : {})
  }

  const [reviews, total, ratingGroups] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    }),
    prisma.review.count({ where }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true }
    })
  ])

  const counts = ratingGroups.reduce<Record<number, number>>(
    (acc, g) => {
      acc[g.rating] = g._count.rating
      return acc
    },
    {}
  )
  return NextResponse.json({ reviews, total, counts, page, limit })
}
