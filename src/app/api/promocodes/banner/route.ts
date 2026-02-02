import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const promos = await prisma.promoCode.findMany({
    where: {
      isActive: true,
      showInBanner: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      description: true,
      discountType: true,
      discountValue: true,
    },
  })

  return NextResponse.json(
    promos.map(p => ({
      id: p.id,
      code: p.code,
      description:
        p.description ??
        (p.discountType === "PERCENT"
          ? `Flat ${Number(p.discountValue)}% OFF`
          : `Get ₹${Number(p.discountValue)} OFF`),
    }))
  )
}
