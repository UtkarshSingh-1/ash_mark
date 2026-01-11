import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OrderDetails } from "@/components/orders/order-details";
import { OrderTracking } from "@/components/orders/order-tracking";
import { OrderActions } from "@/components/orders/order-actions";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
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
          name: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Serialize dates and Decimal fields to strings/numbers for client components
  type OrderWithRelations = NonNullable<typeof order>

  const serializedOrder = {
    ...order,
    total: Number(order.total),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shipping: Number(order.shipping),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item: OrderWithRelations['items'][number]) => ({
      ...item,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
      product: {
        ...item.product,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
        category: {
          ...item.product.category,
          createdAt: item.product.category.createdAt.toISOString(),
          updatedAt: item.product.category.updatedAt.toISOString(),
        },
      },
    })),
    shippingAddress: order.shippingAddress ? {
      ...order.shippingAddress,
      createdAt: order.shippingAddress.createdAt.toISOString(),
      updatedAt: order.shippingAddress.updatedAt.toISOString(),
    } : null
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <OrderDetails order={serializedOrder as any} />
              <OrderTracking order={serializedOrder as any} />
            </div>
            <div>
              <OrderActions order={serializedOrder as any} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
