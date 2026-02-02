import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { format } from "date-fns"

type Filter = "REQUESTED" | "APPROVED" | "REJECTED"

export default async function AdminExchangesPage(props: any) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  /* ---------------------------------------------
     SAFELY NORMALIZE searchParams (Next 15 FIX)
  --------------------------------------------- */
  const rawParams =
    typeof props?.searchParams?.then === "function"
      ? await props.searchParams
      : props?.searchParams ?? {}

  const status = rawParams.status as Filter | undefined

  /* ---------------------------------------------
     DATA
  --------------------------------------------- */
  const exchanges = await prisma.exchangeRequest.findMany({
    where: status ? { status } : undefined,
    include: {
      order: {
        include: {
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Exchange Requests</h1>

          <div className="flex gap-2">
            <Link href="/admin/exchanges">
              <Button variant={!status ? "default" : "outline"}>All</Button>
            </Link>
            <Link href="/admin/exchanges?status=REQUESTED">
              <Button variant={status === "REQUESTED" ? "default" : "outline"}>
                Pending
              </Button>
            </Link>
            <Link href="/admin/exchanges?status=APPROVED">
              <Button variant={status === "APPROVED" ? "default" : "outline"}>
                Approved
              </Button>
            </Link>
            <Link href="/admin/exchanges?status=REJECTED">
              <Button variant={status === "REJECTED" ? "default" : "outline"}>
                Rejected
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {exchanges.map((ex) => (
            <div
              key={ex.id}
              className="border rounded-lg p-4 bg-background"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">
                    Order #{ex.orderId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(ex.createdAt, "dd MMM yyyy")}
                  </p>
                </div>

                <Badge
                  variant={
                    ex.status === "REQUESTED"
                      ? "secondary"
                      : ex.status === "APPROVED"
                      ? "default"
                      : "destructive"
                  }
                >
                  {ex.status}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                Customer: {ex.user.email}
              </div>

              {/* Address (safe optional chaining) */}
              {ex.order.address && (
                <div className="text-sm mb-3">
                  <p className="font-medium">Pickup Address</p>
                  <p>
                    {ex.order.address.street},{" "}
                    {ex.order.address.city},{" "}
                    {ex.order.address.state} -{" "}
                    {ex.order.address.pincode}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-1 text-sm">
                {ex.order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>₹{Number(item.product.price)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/admin/exchanges/${ex.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}

          {exchanges.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No exchange requests found.
            </p>
          )}
        </div>
      </main>
    </>
  )
}
