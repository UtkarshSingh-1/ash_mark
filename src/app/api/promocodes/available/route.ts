import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ promoCodes: [] })

  const promos = await prisma.promoCode.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    promoCodes: promos.map(p => ({
      code: p.code,
      description: p.description,
      minOrderValue: p.minOrderValue,
      prepaidOnly: p.code === "PRE05",
    })),
  })
}
