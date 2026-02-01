import { prisma } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminExchangesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = searchParams.status

  const exchanges = await prisma.exchangeRequest.findMany({
    where: status ? { status } : {},
    include: {
      user: true,
      order: {
        include: {
          items: { include: { product: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <Header />

      {exchanges.length === 0 && (
        <EmptyState text="No exchange requests found" />
      )}

      {exchanges.map(e => (
        <div key={e.id} className="border rounded-lg p-5 space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">
                Order #{e.orderId.slice(-6)}
              </p>
              <p className="text-sm text-muted-foreground">
                {e.user.email}
              </p>
            </div>
            <Badge>{e.status}</Badge>
          </div>

          <div className="text-sm">
            <p>
              <b>Exchange:</b> {e.oldSize} → {e.newSize}
            </p>
          </div>

          <div className="text-sm">
            <p className="font-medium">Items</p>
            {e.order.items.map(item => (
              <p key={item.id}>
                {item.product.name} × {item.quantity}
              </p>
            ))}
          </div>

          {e.status === "REQUESTED" && (
            <div className="flex gap-2">
              <form action={`/api/admin/exchanges/${e.id}?action=pickup`} method="post">
                <Button size="sm">Schedule Pickup</Button>
              </form>
              <form action={`/api/admin/exchanges/${e.id}?action=approve`} method="post">
                <Button size="sm" variant="outline">Approve Exchange</Button>
              </form>
              <form action={`/api/admin/exchanges/${e.id}?action=reject`} method="post">
                <Button size="sm" variant="destructive">Reject</Button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Header() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Filter label="All" />
        <Filter label="REQUESTED" />
        <Filter label="APPROVED" />
        <Filter label="REJECTED" />
      </div>
      <a href="/api/admin/exchanges/export">
        <Button variant="outline" size="sm">Export CSV</Button>
      </a>
    </div>
  )
}

function Filter({ label }: { label: string }) {
  return (
    <a href={`/admin/exchanges${label === "All" ? "" : `?status=${label}`}`}>
      <Button size="sm" variant="outline">{label}</Button>
    </a>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border rounded-lg p-12 text-center text-muted-foreground">
      {text}
    </div>
  )
}
