import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const body = await req.json()

  const request = await prisma.returnRequest.create({
    data: {
      orderId: params.orderId,
      userId: body.userId,
      reason: body.reason,
    },
  })

  return NextResponse.json(request)
}
