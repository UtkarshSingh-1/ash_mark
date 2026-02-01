import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { action } = await req.json()

  if (!["approve", "reject", "refund"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const statusMap: Record<string, string> = {
    approve: "APPROVED",
    reject: "REJECTED",
    refund: "REFUND_INITIATED",
  }

  const updated = await prisma.returnRequest.update({
    where: { id: params.id },
    data: { status: statusMap[action] as any },
  })

  return NextResponse.json(updated)
}
