import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PROMO_CODES, isNewUser } from "@/lib/promo-codes"

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { createdAt: true }
    })

    const userIsNew = user ? isNewUser(user.createdAt) : false

    const result = Object.values(PROMO_CODES).map(promo => {
      const reasons: string[] = []

      if (promo.isNewUserOnly && !userIsNew) {
        reasons.push("Only for new users")
      }

      if (promo.minOrderAmount) {
        reasons.push(`Min order ₹${promo.minOrderAmount}`)
      }

      return {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        isNewUserOnly: promo.isNewUserOnly,
        minOrderAmount: promo.minOrderAmount || null,
        eligible: reasons.length === 0,
        reasons
      }
    })

    return NextResponse.json({ promoCodes: result })
  } catch (err) {
    console.error("Error fetching promo list:", err)
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 })
  }
}
