import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PaymentForm } from "@/components/payment/payment-form"
import { PaymentSummary } from "@/components/payment/payment-summary"

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; retry?: string }>
}) {
  const params = await searchParams
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  let order = null
  if (params.orderId) {
    const rawOrder = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })

    if (!rawOrder) {
      redirect('/orders')
    }

    // Serialize Decimal fields to numbers for client components
    type OrderWithRelations = NonNullable<typeof rawOrder>

    order = {
      ...rawOrder,
      total: Number(rawOrder.total),
      subtotal: Number(rawOrder.subtotal),
      tax: Number(rawOrder.tax),
      shipping: Number(rawOrder.shipping),
      items: rawOrder.items.map((item: OrderWithRelations['items'][number]) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
          comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
        }
      })),
    }
  }

  

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PaymentForm 
                order={order as any}
                isRetry={params.retry === 'true'}
              />
            </div>
            <div>
              <PaymentSummary order={order as any} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
