import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

/* ------------------------------- GET ------------------------------- */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const promo = await prisma.promoCode.findUnique({
    where: { id },
  })

  if (!promo) {
    return NextResponse.json({ error: "Promo code not found" }, { status: 404 })
  }

  return NextResponse.json(promo)
}

/* ------------------------------ PATCH ------------------------------ */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.promoCode.update({
    where: { id },
    data: {
      code: body.code,
      description: body.description,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minOrderValue: body.minOrderValue,
      maxDiscount: body.maxDiscount,
      firstOrderOnly: body.firstOrderOnly,
      showInBanner: body.showInBanner, // ✅ CRITICAL FIX
      isActive: body.isActive,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    },
  })

  return NextResponse.json({ success: true, promo: updated })
}

/* ----------------------------- DELETE ------------------------------ */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.promoCode.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
