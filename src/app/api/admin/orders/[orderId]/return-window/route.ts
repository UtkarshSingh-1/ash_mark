import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params
  const { days } = await req.json()

  const windowDays = typeof days === "number" && days > 0 ? days : 7
  const returnEligibleTill = new Date(Date.now() + windowDays * 24 * 60 * 60 * 1000)

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { returnEligibleTill },
  })

  return NextResponse.json({ success: true, order: updated })
}
