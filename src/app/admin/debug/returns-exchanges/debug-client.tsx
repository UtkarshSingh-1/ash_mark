"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

type Status =
  | "REQUESTED"
  | "APPROVED"
  | "PICKUP_SCHEDULED"
  | "PICKUP_COMPLETED"
  | "REFUND_INITIATED"
  | "REFUND_COMPLETED"
  | "EXCHANGE_PROCESSING"
  | "EXCHANGE_COMPLETED"
  | "REJECTED"

export default function ReturnsExchangesDebugClient() {
  const [orderId, setOrderId] = useState("")

  const call = async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error()
  }

  const setOrderDelivered = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERED" }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Order status set to DELIVERED" })
    } catch {
      toast({ title: "Failed", variant: "destructive" })
    }
  }

  const setReturnStatus = async (status: Status) => {
    try {
      await call(`/api/admin/orders/${orderId}/return-status`, { status })
      toast({ title: `Return status -> ${status}` })
    } catch {
      toast({ title: "Failed", variant: "destructive" })
    }
  }

  const setExchangeStatus = async (status: Status) => {
    try {
      await call(`/api/admin/orders/${orderId}/exchange-status`, { status })
      toast({ title: `Exchange status -> ${status}` })
    } catch {
      toast({ title: "Failed", variant: "destructive" })
    }
  }

  const setReturnEligibleWindow = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/return-window`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Return window set to 7 days" })
    } catch {
      toast({ title: "Failed", variant: "destructive" })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug Return / Exchange</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Order ID</div>
            <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={setOrderDelivered}>Set DELIVERED</Button>
            <Button variant="outline" onClick={setReturnEligibleWindow}>Set Return Window (7d)</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Return Status</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={() => setReturnStatus("REQUESTED")}>REQUESTED</Button>
          <Button onClick={() => setReturnStatus("APPROVED")}>APPROVED</Button>
          <Button onClick={() => setReturnStatus("PICKUP_SCHEDULED")}>PICKUP_SCHEDULED</Button>
          <Button onClick={() => setReturnStatus("PICKUP_COMPLETED")}>PICKUP_COMPLETED</Button>
          <Button onClick={() => setReturnStatus("REFUND_INITIATED")}>REFUND_INITIATED</Button>
          <Button onClick={() => setReturnStatus("REFUND_COMPLETED")}>REFUND_COMPLETED</Button>
          <Button variant="destructive" onClick={() => setReturnStatus("REJECTED")}>REJECTED</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Status</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button onClick={() => setExchangeStatus("REQUESTED")}>REQUESTED</Button>
          <Button onClick={() => setExchangeStatus("APPROVED")}>APPROVED</Button>
          <Button onClick={() => setExchangeStatus("PICKUP_SCHEDULED")}>PICKUP_SCHEDULED</Button>
          <Button onClick={() => setExchangeStatus("PICKUP_COMPLETED")}>PICKUP_COMPLETED</Button>
          <Button onClick={() => setExchangeStatus("EXCHANGE_PROCESSING")}>EXCHANGE_PROCESSING</Button>
          <Button onClick={() => setExchangeStatus("EXCHANGE_COMPLETED")}>EXCHANGE_COMPLETED</Button>
          <Button variant="destructive" onClick={() => setExchangeStatus("REJECTED")}>REJECTED</Button>
        </CardContent>
      </Card>
    </div>
  )
}
