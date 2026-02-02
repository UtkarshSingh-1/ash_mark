import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { reviewId, vote } = await req.json()

  if (!reviewId || !vote) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const existingVote = await prisma.reviewVote.findUnique({
    where: {
      reviewId_userId: {
        reviewId,
        userId: session.user.id,
      },
    },
  })

  if (existingVote) {
    return NextResponse.json({ error: "Already voted" }, { status: 400 })
  }

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
      helpful: vote === "helpful" ? { increment: 1 } : undefined,
      notHelpful: vote === "notHelpful" ? { increment: 1 } : undefined,
    },
  })

  return NextResponse.json({ success: true })
}
