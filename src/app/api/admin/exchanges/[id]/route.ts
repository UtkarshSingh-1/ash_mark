import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status, adminNote } = await req.json()
  console.info("[exchanges] admin update", { id, status })

  const allowed = [
    "REQUESTED",
    "APPROVED",
    "PICKUP_SCHEDULED",
    "PICKUP_COMPLETED",
    "EXCHANGE_PROCESSING",
    "EXCHANGE_COMPLETED",
    "REJECTED",
  ]

  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updated = await prisma.exchangeRequest.update({
    where: { id },
    data: {
      status,
      adminNote,
    },
  })

  await prisma.order.update({
    where: { id: updated.orderId },
    data: { exchangeStatus: status },
  })

  return NextResponse.json(updated)
}
