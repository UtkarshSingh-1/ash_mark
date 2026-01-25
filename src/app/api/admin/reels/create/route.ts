import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { videoUrl } = await req.json()
  if (!videoUrl) return NextResponse.json({ error: "Missing URL" }, { status: 400 })

  await prisma.reel.create({ data: { videoUrl } })

  return NextResponse.json({ success: true })
}
