import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reviewId, vote } = await request.json()

    if (!reviewId || !["helpful", "notHelpful"].includes(vote)) {
      return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 })
    }

    // Check if vote already exists
    const existing = await prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: session.user.id,
        },
      },
    })

    if (existing) {
      // User already voted -> toggle behavior
      if (existing.vote === vote) {
        // Remove vote & decrement
        await prisma.reviewVote.delete({
          where: { reviewId_userId: { reviewId, userId: session.user.id } },
        })

        await prisma.review.update({
          where: { id: reviewId },
          data: {
            [vote]: { decrement: 1 },
          },
        })

        return NextResponse.json({ status: "removed" })
      } else {
        // Switch vote from helpful <-> notHelpful
        await prisma.reviewVote.update({
          where: { reviewId_userId: { reviewId, userId: session.user.id } },
          data: { vote },
        })

        await prisma.review.update({
          where: { id: reviewId },
          data: {
            helpful: vote === "helpful" ? { increment: 1 } : { decrement: 1 },
            notHelpful: vote === "notHelpful" ? { increment: 1 } : { decrement: 1 },
          },
        })

        return NextResponse.json({ status: "updated" })
      }
    }

    // No previous vote -> create new
    await prisma.reviewVote.create({
      data: {
        reviewId,
        userId: session.user.id,
        vote,
      },
    })

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        [vote]: { increment: 1 },
      },
    })

    return NextResponse.json({ status: "created" })
  } catch (error) {
    console.error("Error in voting:", error)
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 })
  }
}
