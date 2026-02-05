"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, RefreshCcw, RotateCcw } from "lucide-react"
import { ReturnModal } from "./ReturnModal"
import { ExchangeModal } from "./ExchangeModal"
import { toast } from "@/components/ui/use-toast"

export function OrderActions({ order }: { order: any }) {
  const [returnOpen, setReturnOpen] = useState(false)
  const [exchangeOpen, setExchangeOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const eligible = order.status === "DELIVERED"
  const returnBlocked = order.returnStatus && order.returnStatus !== "NONE"
  const exchangeBlocked = order.exchangeStatus && order.exchangeStatus !== "NONE"
  const canCancel = ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status)

  const openReturn = (item: any) => {
    setSelectedItem(item)
    setReturnOpen(true)
  }

  const openExchange = (item: any) => {
    setSelectedItem(item)
    setExchangeOpen(true)
  }

  const cancelOrder = async () => {
    if (!confirm("Cancel this order?")) return
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
      })
      if (!res.ok) throw new Error()
      toast({ title: "Order cancelled" })
      window.location.reload()
    } catch {
      toast({ title: "Cancel failed", variant: "destructive" })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Order Actions</CardTitle>
        </CardHeader>

        <CardContent>
          <Button className="w-full bg-muted/30">
            <Download className="w-4 h-4 mr-2" /> Download Invoice
          </Button>

          <Separator className="my-4" />

          {canCancel && (
            <Button
              className="w-full mb-4"
              variant="destructive"
              onClick={cancelOrder}
            >
              Cancel Order
            </Button>
          )}

          {eligible &&
            order.items.map((item: any) => (
              <div key={item.id} className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openReturn(item)}
                  disabled={returnBlocked}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Return
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openExchange(item)}
                  disabled={exchangeBlocked}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Exchange
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>

      {selectedItem && (
        <ReturnModal
          open={returnOpen}
          onCloseAction={() => setReturnOpen(false)}
          item={{
            id: selectedItem.id,
            orderId: order.id,
            productName: selectedItem.product.name,
          }}
        />
      )}

      {selectedItem && (
        <ExchangeModal
          open={exchangeOpen}
          onCloseAction={() => setExchangeOpen(false)}
          item={{
            id: selectedItem.id, // ✅ REQUIRED
            orderId: order.id,
            productName: selectedItem.product.name,
            sizes: selectedItem.product.sizes ?? [], // ✅ REQUIRED
            colors: selectedItem.product.colors ?? [], // ✅ REQUIRED
          }}
        />
      )}
    </>
  )
}
