import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { buildMediaUrl } from "@/lib/media";

export async function POST(req: Request) {
  const { videoUrl, publicId, mediaId } = await req.json();

  if (!videoUrl && !mediaId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const finalUrl = videoUrl || buildMediaUrl("reels", mediaId);

  await prisma.reel.create({
    data: { videoUrl: finalUrl, publicId: publicId || null, mediaId: mediaId || null } as Prisma.ReelUncheckedCreateInput
  });

  return NextResponse.json({ success: true });
}
