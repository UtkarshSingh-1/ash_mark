import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const { itemId, reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "DELIVERED"
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not eligible for return" }, { status: 400 });
    }

    if (order.returnEligibleTill && order.returnEligibleTill < new Date()) {
      return NextResponse.json({ error: "Return window expired" }, { status: 400 });
    }

    const existing = await prisma.returnRequest.findFirst({
      where: {
        orderId,
        userId: session.user.id,
        status: { in: ["REQUESTED", "APPROVED", "PICKUP_SCHEDULED", "PICKUP_COMPLETED", "REFUND_INITIATED"] },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Return already requested" }, { status: 400 });
    }

    await prisma.returnRequest.create({
      data: {
        orderId,
        userId: session.user.id,
        reason,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        returnStatus: "REQUESTED"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Return Error:", error);
    return NextResponse.json({ error: "Failed to submit return request" }, { status: 500 });
  }
}
