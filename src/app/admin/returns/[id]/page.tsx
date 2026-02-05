import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ApproveReturnButton from "./approve-button"
import RejectReturnButton from "./reject-button"

export default async function AdminReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const { id } = await params
  const ret = await prisma.returnRequest.findUnique({
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

  if (!ret) notFound()

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Return Request</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/returns">Back to Returns</Link>
          </Button>
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-background">
          <div><strong>ID:</strong> {ret.id}</div>
          <div><strong>Order:</strong> {ret.orderId}</div>
          <div><strong>Customer:</strong> {ret.user.email}</div>
          <div><strong>Status:</strong> {ret.status}</div>
          <div><strong>Reason:</strong> {ret.reason}</div>

          {ret.order.address && (
            <div>
              <strong>Pickup Address:</strong>{" "}
              {ret.order.address.street}, {ret.order.address.city},{" "}
              {ret.order.address.state} - {ret.order.address.pincode}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-background">
          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <div className="space-y-2 text-sm">
            {ret.order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{Number(item.product.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <ApproveReturnButton id={ret.id} />
          <RejectReturnButton id={ret.id} />
        </div>
      </main>
    </>
  )
}
