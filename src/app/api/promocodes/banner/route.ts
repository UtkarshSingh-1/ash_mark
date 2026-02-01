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
  })

  return NextResponse.json(
    promos.map(p => ({
      code: p.code,
      text:
        p.discountType === "PERCENT"
          ? `Use Code "${p.code}" – Flat ${Number(p.discountValue)}% OFF`
          : `Use Code "${p.code}" – Get ₹${Number(p.discountValue)} OFF`,
    }))
  )
}
