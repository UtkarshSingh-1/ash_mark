import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { id, publicId } = await req.json();

  // Delete from DB
  await prisma.reel.delete({ where: { id }});

  // Delete from Cloudinary
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });

  return NextResponse.json({ success: true });
}
