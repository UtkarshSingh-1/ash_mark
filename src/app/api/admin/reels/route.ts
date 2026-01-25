import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const reels = await prisma.reel.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ reels })
}
