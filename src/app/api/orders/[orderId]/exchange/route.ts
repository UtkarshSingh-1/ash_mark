import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const body = await req.json()

  const exchange = await prisma.exchangeRequest.create({
    data: {
      orderId: params.orderId,
      userId: body.userId,
      reason: body.reason,
      oldSize: body.oldSize,
      newSize: body.newSize,
    },
  })

  return NextResponse.json(exchange)
}
