import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const media = await prisma.media.findUnique({
    where: { id: resolvedParams.id },
    select: { data: true, mimeType: true, size: true },
  })

  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return new NextResponse(media.data, {
    status: 200,
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": media.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
