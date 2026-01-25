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
    const { itemId, newSize, reason } = await request.json();

    if (!itemId || !newSize || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id, status: "DELIVERED" },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not eligible for exchange" }, { status: 400 });
    }

    const item = order.items.find(i => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.exchangeRequest.create({
      data: {
        orderId,
        userId: session.user.id,
        reason,
        oldSize: item.size,
        newSize,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        exchangeStatus: "REQUESTED",
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exchange Error:", error);
    return NextResponse.json({ error: "Failed to submit exchange request" }, { status: 500 });
  }
}
