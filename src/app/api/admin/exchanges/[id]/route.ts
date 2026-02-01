import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { action } = await req.json()

  const statusMap: Record<string, string> = {
    approve: "APPROVED",
    reject: "REJECTED",
    pickup: "PICKUP_SCHEDULED",
  }

  if (!statusMap[action]) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const updated = await prisma.exchangeRequest.update({
    where: { id: params.id },
    data: { status: statusMap[action] as any },
  })

  return NextResponse.json(updated)
}
