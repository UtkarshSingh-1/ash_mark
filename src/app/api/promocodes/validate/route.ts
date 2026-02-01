import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const { promoCode, subtotal } = await req.json()
  const session = await auth()

  const promo = await prisma.promoCode.findFirst({
    where: {
      code: promoCode.toUpperCase(),
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
  })

  if (!promo) {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
  }

  if (promo.minOrderValue && subtotal < Number(promo.minOrderValue)) {
    return NextResponse.json(
      { error: `Minimum order value ₹${promo.minOrderValue}` },
      { status: 400 }
    )
  }

  if (promo.firstOrderOnly && session?.user?.id) {
    const orders = await prisma.order.count({
      where: { userId: session.user.id },
    })
    if (orders > 0) {
      return NextResponse.json(
        { error: "Only valid for first order" },
        { status: 400 }
      )
    }
  }

  const discount =
    promo.discountType === "PERCENT"
      ? (subtotal * Number(promo.discountValue)) / 100
      : Number(promo.discountValue)

  return NextResponse.json({
    code: promo.code,
    discount: Math.min(discount, subtotal),
  })
}
