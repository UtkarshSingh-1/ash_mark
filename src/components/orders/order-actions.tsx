"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, RefreshCcw, RotateCcw } from "lucide-react"
import { ReturnModal } from "./ReturnModal"
import { ExchangeModal } from "./ExchangeModal"

export function OrderActions({ order }: { order: any }) {
  const [returnOpen, setReturnOpen] = useState(false)
  const [exchangeOpen, setExchangeOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const eligible = order.status === "DELIVERED"

  const openReturn = (item: any) => {
    setSelectedItem(item)
    setReturnOpen(true)
  }

  const openExchange = (item: any) => {
    setSelectedItem(item)
    setExchangeOpen(true)
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

          {eligible && order.items.map((item: any) => (
            <div key={item.id} className="flex gap-2 mb-2">
              <Button variant="outline" className="flex-1" onClick={() => openReturn(item)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Return
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => openExchange(item)}>
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
            orderId: order.id,
            itemId: selectedItem.id,
            productName: selectedItem.product.name,
            oldSize: selectedItem.size,
            oldColor: selectedItem.color,
          }}
        />
      )}
    </>
  )
}
