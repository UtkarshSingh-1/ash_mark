import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const promos = await prisma.promoCode.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    promoCodes: promos.map(p => ({
      code: p.code,
      description:
        p.discountType === "PERCENT"
          ? `Flat ${Number(p.discountValue)}% off`
          : `Get ₹${Number(p.discountValue)} off`,
      minOrderValue: p.minOrderValue
        ? Number(p.minOrderValue)
        : null,
      firstOrderOnly: p.firstOrderOnly,
    })),
  })
}
