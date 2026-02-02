import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { promoCode, subtotal, paymentMethod } = await req.json()

  const promo = await prisma.promoCode.findFirst({
    where: {
      code: promoCode,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  })

  if (!promo) {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
  }

  if (promo.minOrderValue && subtotal < Number(promo.minOrderValue)) {
    return NextResponse.json(
      { error: `Minimum order ₹${promo.minOrderValue} required` },
      { status: 400 }
    )
  }

  // PREPAID ONLY RULE (PRE05)
  if (promo.code === "PRE05" && paymentMethod !== "ONLINE") {
    return NextResponse.json(
      { error: "This coupon is valid only for prepaid orders" },
      { status: 400 }
    )
  }

  let discount = 0

  if (promo.discountType === "PERCENT") {
    discount = (subtotal * Number(promo.discountValue)) / 100
  } else {
    discount = Number(promo.discountValue)
  }

  if (promo.maxDiscount) {
    discount = Math.min(discount, Number(promo.maxDiscount))
  }

  return NextResponse.json({
    code: promo.code,
    discount,
  })
}
