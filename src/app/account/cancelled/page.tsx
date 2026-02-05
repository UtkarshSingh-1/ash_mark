"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function UserCancelledOrdersPage() {
  const { data, error } = useSWR(
    "/api/orders?status=CANCELLED&limit=100",
    fetcher
  )

  if (error) return <div>Error loading cancelled orders</div>
  if (!data) return <div>Loading...</div>

  const orders = Array.isArray(data?.orders) ? data.orders : []

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Cancelled Orders</h1>
      {orders.length === 0 && <p>No cancelled orders yet</p>}

      {orders.map((order: any) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between">
            <div>
              <p>
                <b>Order:</b> {order.id}
              </p>
              <p>
                <b>Items:</b> {order.items?.length || 0}
              </p>
              <p>
                <b>Total:</b> {formatPrice(Number(order.total))}
              </p>
            </div>
            <div className="text-right">
              <p>
                <b>Status:</b> {order.status}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(order.cancelledAt || order.updatedAt))}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
