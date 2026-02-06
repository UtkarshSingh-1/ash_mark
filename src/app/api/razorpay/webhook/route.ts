import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/db"

function verifySignature(body: string, signature: string | null, secret?: string) {
  if (!signature || !secret) return false
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")
  return expected === signature
}

export async function POST(request: NextRequest) {
  const bodyText = await request.text()
  const signature = request.headers.get("x-razorpay-signature")
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!verifySignature(bodyText, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload = JSON.parse(bodyText || "{}")
  const event = payload?.event as string | undefined
  console.info("[razorpay] webhook received", {
    event,
    id: payload?.payload?.payment?.entity?.id || payload?.payload?.order?.entity?.id,
  })

  try {
    if (!event) {
      return NextResponse.json({ success: true })
    }

    if (event === "payment.captured" || event === "payment.failed") {
      const payment = payload?.payload?.payment?.entity
      const razorpayOrderId = payment?.order_id
      if (!razorpayOrderId) return NextResponse.json({ success: true })

      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
      })
      if (!order) return NextResponse.json({ success: true })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayPaymentId: payment?.id || order.razorpayPaymentId,
          paymentMethod: "PREPAID",
          paymentStatus: event === "payment.captured" ? "PAID" : "FAILED",
          status:
            event === "payment.captured" && order.status === "PENDING"
              ? "CONFIRMED"
              : order.status,
          updatedAt: new Date(),
        },
      })

      if (event === "payment.captured" && order.promoCode) {
        const existingUsage = await prisma.promoCodeUsage.findUnique({
          where: { orderId: order.id },
        })

        if (!existingUsage) {
          await prisma.promoCodeUsage.create({
            data: {
              code: order.promoCode,
              userId: order.userId,
              orderId: order.id,
            },
          })
        }
      }
    }

    if (event === "order.paid") {
      const orderEntity = payload?.payload?.order?.entity
      const razorpayOrderId = orderEntity?.id
      if (!razorpayOrderId) return NextResponse.json({ success: true })

      const order = await prisma.order.findFirst({
        where: { razorpayOrderId },
      })
      if (!order) return NextResponse.json({ success: true })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: "PREPAID",
          paymentStatus: "PAID",
          status: order.status === "PENDING" ? "CONFIRMED" : order.status,
          updatedAt: new Date(),
        },
      })

      if (order.promoCode) {
        const existingUsage = await prisma.promoCodeUsage.findUnique({
          where: { orderId: order.id },
        })

        if (!existingUsage) {
          await prisma.promoCodeUsage.create({
            data: {
              code: order.promoCode,
              userId: order.userId,
              orderId: order.id,
            },
          })
        }
      }
    }

    if (event === "refund.created" || event === "refund.processed") {
      const refund = payload?.payload?.refund?.entity
      const paymentId = refund?.payment_id
      const orderId = refund?.order_id

      const order =
        (paymentId
          ? await prisma.order.findFirst({
              where: { razorpayPaymentId: paymentId },
            })
          : null) ||
        (orderId
          ? await prisma.order.findFirst({
              where: { razorpayOrderId: orderId },
            })
          : null)

      if (!order) return NextResponse.json({ success: true })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          refundMethod: "ORIGINAL_SOURCE",
          refundStatus: event === "refund.created" ? "INITIATED" : "COMPLETED",
          refundAmount: refund?.amount ? refund.amount / 100 : order.refundAmount,
          updatedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook failure" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Razorpay webhook is active" })
}
