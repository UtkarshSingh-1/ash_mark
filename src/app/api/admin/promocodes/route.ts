import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(promos)
}

export async function POST(req: Request) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const promo = await prisma.promoCode.create({
    data: {
      code: body.code.toUpperCase(),
      description: body.description || null,
      discountType: body.discountType,
      discountValue: Number(body.discountValue),
      minOrderValue: body.minOrderValue
        ? Number(body.minOrderValue)
        : null,
      firstOrderOnly: Boolean(body.firstOrderOnly),
      showInBanner: Boolean(body.showInBanner),
      isActive: Boolean(body.isActive ?? true),
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  })

  return NextResponse.json(promo)
}
