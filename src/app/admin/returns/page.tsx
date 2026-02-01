import { prisma } from "@/lib/db"
import { ReturnStatus } from "@prisma/client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: { status?: ReturnStatus }
}) {
  const returns = await prisma.returnRequest.findMany({
    where: searchParams.status
      ? { status: searchParams.status }
      : undefined,
    include: {
      user: true,
      order: {
        include: {
          items: {
            include: { product: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Return Requests</h1>

      {returns.length === 0 && (
        <p className="text-muted-foreground">No return requests found.</p>
      )}

      {returns.map((r) => (
        <div key={r.id} className="border rounded-lg p-5 space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">
                Order #{r.orderId.slice(-6)}
              </p>
              <p className="text-sm text-muted-foreground">
                {r.user.email}
              </p>
            </div>
            <Badge>{r.status}</Badge>
          </div>

          <div className="text-sm">
            <p className="font-medium">Items</p>
            {r.order.items.map((item) => (
              <p key={item.id}>
                {item.product.name} × {item.quantity}
              </p>
            ))}
          </div>

          <p className="text-sm">
            <b>Total:</b> {formatPrice(Number(r.order.total))}
          </p>

          <div className="flex gap-2">
            <Link href={`/api/admin/returns/${r.id}?action=approve`}>
              <Button size="sm">Approve</Button>
            </Link>
            <Link href={`/api/admin/returns/${r.id}?action=reject`}>
              <Button size="sm" variant="destructive">Reject</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
