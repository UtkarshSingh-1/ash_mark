import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { videoUrl, publicId } = await req.json();

  await prisma.reel.create({
    data: { videoUrl, publicId }
  });

  return NextResponse.json({ success: true });
}
