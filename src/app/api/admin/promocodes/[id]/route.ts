import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const promo = await prisma.promoCode.update({
    where: { id: params.id },
    data: {
      code: body.code,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minOrderValue: body.minOrderValue || null,
      firstOrderOnly: !!body.firstOrderOnly,
      showInBanner: !!body.showInBanner,
      isActive: body.isActive ?? true,
    },
  })

  return NextResponse.json(promo)
}
