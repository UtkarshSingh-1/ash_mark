import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json([], { status: 401 });
  }

  const data = await prisma.returnRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data);
}
