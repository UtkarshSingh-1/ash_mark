import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ApproveExchangeButton from "./approve-button"
import RejectExchangeButton from "./reject-button"

export default async function AdminExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const { id } = await params
  const ex = await prisma.exchangeRequest.findUnique({
    where: { id },
    include: {
      user: true,
      order: {
        include: {
          items: { include: { product: true } },
          address: true,
        },
      },
    },
  })

  if (!ex) notFound()

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exchange Request</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/exchanges">Back to Exchanges</Link>
          </Button>
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-background">
          <div><strong>ID:</strong> {ex.id}</div>
          <div><strong>Order:</strong> {ex.orderId}</div>
          <div><strong>Customer:</strong> {ex.user.email}</div>
          <div><strong>Status:</strong> {ex.status}</div>
          <div><strong>Reason:</strong> {ex.reason}</div>
          <div><strong>New Size:</strong> {ex.newSize ?? "N/A"}</div>
          <div><strong>New Color:</strong> {ex.newColor ?? "N/A"}</div>

          {ex.order.address && (
            <div>
              <strong>Pickup Address:</strong>{" "}
              {ex.order.address.street}, {ex.order.address.city},{" "}
              {ex.order.address.state} - {ex.order.address.pincode}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-background">
          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <div className="space-y-2 text-sm">
            {ex.order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{Number(item.product.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <ApproveExchangeButton id={ex.id} />
          <RejectExchangeButton id={ex.id} />
        </div>
      </main>
    </>
  )
}
