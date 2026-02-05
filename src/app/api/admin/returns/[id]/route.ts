import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

/* -------------------- PATCH (approve / reject) -------------------- */
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
  const { status } = body as { status: "APPROVED" | "REJECTED" }
  console.info("[returns] admin approve/reject", { id, status })

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const updatedReturn = await prisma.returnRequest.update({
    where: { id },
    data: { status },
    include: {
      order: {
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      },
      user: true,
    },
  })

  await prisma.order.update({
    where: { id: updatedReturn.orderId },
    data: { returnStatus: status },
  })

  return NextResponse.json({ success: true, return: updatedReturn })
}
