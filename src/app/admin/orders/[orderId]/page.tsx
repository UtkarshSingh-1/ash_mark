import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { AdminOrderDetails } from "@/components/admin/orders/admin-order-details"
import { AdminOrderActions } from "@/components/admin/orders/admin-order-actions"
import { AdminOrderTimeline } from "@/components/admin/orders/admin-order-timeline"

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
      shippingAddress: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })

  if (!order) notFound()

  // ✅ Serialize Decimal + Date fields safely
  const serializedOrder = {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    discount: order.discount ? Number(order.discount) : null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),

    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(), // ✅ exists
      // ❌ REMOVED updatedAt (does not exist)

      product: {
        ...item.product,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice
          ? Number(item.product.comparePrice)
          : null,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
        category: {
          ...item.product.category,
          createdAt: item.product.category.createdAt.toISOString(),
          updatedAt: item.product.category.updatedAt.toISOString(),
        },
      },
    })),

    shippingAddress: order.shippingAddress
      ? {
          ...order.shippingAddress,
          createdAt: order.shippingAddress.createdAt.toISOString(),
          updatedAt: order.shippingAddress.updatedAt.toISOString(),
        }
      : null,
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <AdminOrderDetails order={serializedOrder as any} />
              <AdminOrderTimeline order={serializedOrder as any} />
            </div>
            <div>
              <AdminOrderActions order={serializedOrder as any} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
