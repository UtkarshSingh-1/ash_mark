"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Edit, Truck, PackageCheck, RotateCcw, RefreshCcw } from "lucide-react"

interface AdminOrderActionsProps {
  order: {
    id: string
    status: string
    returnStatus?: string
    exchangeStatus?: string
    paymentStatus: string
    total?: number
    refundStatus?: string | null
    refundAmount?: number | null
  }
}

export function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showShipForm, setShowShipForm] = useState(false)
  const [courierName, setCourierName] = useState("")
  const [trackingId, setTrackingId] = useState("")

  const updateOrderStatus = async (status: string, data: Record<string, any> = {}) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...data }),
      })

      if (!response.ok) throw new Error()

      toast({ title: "Success", description: `Status changed to ${status}` })
      window.location.reload()
    } catch {
      toast({ title: "Error", description: "Unable to update", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const updateReturnStatus = async (status: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/return-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error()

      toast({ title: "Success", description: `Return status changed to ${status}` })
      window.location.reload()
    } catch {
      toast({ title: "Error", description: "Unable to update return status", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const updateExchangeStatus = async (status: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/exchange-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error()

      toast({ title: "Success", description: `Exchange status changed to ${status}` })
      window.location.reload()
    } catch {
      toast({ title: "Error", description: "Unable to update exchange status", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  /** Normal Shipment */
  const shipOrder = async () => {
    if (!courierName || !trackingId) {
      toast({ title: "Missing Info", description: "Courier + Tracking Required", variant: "destructive" })
      return
    }
    await updateOrderStatus("SHIPPED", { courierName, trackingId })
  }

  /**
   * RETURN ACTIONS
   */
  const returnActions = () => {
    if (order.returnStatus === "REQUESTED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-green-600" disabled={loading}
            onClick={() => updateReturnStatus("APPROVED")}>
            Approve Return
          </Button>
          <Button className="w-full bg-red-600" disabled={loading}
            onClick={() => updateReturnStatus("REJECTED")}>
            Reject Return
          </Button>
        </div>
      )
    }

    if (order.returnStatus === "APPROVED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-blue-600" disabled={loading}
            onClick={() => updateReturnStatus("PICKUP_SCHEDULED")}>
            Mark Pickup Scheduled
          </Button>
          <Button className="w-full bg-orange-600" disabled={loading}
            onClick={() => updateReturnStatus("PICKUP_COMPLETED")}>
            Mark Pickup Completed
          </Button>
        </div>
      )
    }

    if (order.returnStatus === "PICKUP_SCHEDULED") {
      return (
        <Button className="w-full bg-orange-600" disabled={loading}
          onClick={() => updateReturnStatus("PICKUP_COMPLETED")}>
          Mark Pickup Completed
        </Button>
      )
    }

    if (order.returnStatus === "PICKUP_COMPLETED") {
      return (
        <div className="space-y-2 text-sm text-muted-foreground">
          Refund will auto-initiate for prepaid orders after pickup is marked completed.
        </div>
      )
    }

    if (order.returnStatus === "REFUND_INITIATED") {
      return (
        <Button className="w-full bg-green-600" disabled={loading}
          onClick={() => updateReturnStatus("REFUND_COMPLETED")}>
          Mark Refund Completed
        </Button>
      )
    }

    return null
  }

  /**
   * EXCHANGE ACTIONS
   */
  const exchangeActions = () => {
    if (order.exchangeStatus === "REQUESTED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-green-600" disabled={loading}
            onClick={() => updateExchangeStatus("APPROVED")}>
            Approve Exchange
          </Button>
          <Button className="w-full bg-red-600" disabled={loading}
            onClick={() => updateExchangeStatus("REJECTED")}>
            Reject Exchange
          </Button>
        </div>
      )
    }

    if (order.exchangeStatus === "APPROVED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-blue-600" disabled={loading}
            onClick={() => updateExchangeStatus("PICKUP_SCHEDULED")}>
            Mark Pickup Scheduled
          </Button>
          <Button className="w-full bg-indigo-600" disabled={loading}
            onClick={() => updateExchangeStatus("PICKUP_COMPLETED")}>
            Mark Pickup Completed
          </Button>
        </div>
      )
    }

    if (order.exchangeStatus === "PICKUP_SCHEDULED") {
      return (
        <Button className="w-full bg-indigo-600" disabled={loading}
          onClick={() => updateExchangeStatus("PICKUP_COMPLETED")}>
          Mark Pickup Completed
        </Button>
      )
    }

    if (order.exchangeStatus === "PICKUP_COMPLETED") {
      return (
        <Button className="w-full bg-blue-700" disabled={loading}
          onClick={() => updateExchangeStatus("EXCHANGE_PROCESSING")}>
          Mark Exchange Processing
        </Button>
      )
    }

    if (order.exchangeStatus === "EXCHANGE_PROCESSING") {
      return (
        <Button className="w-full bg-green-700" disabled={loading}
          onClick={() => updateExchangeStatus("EXCHANGE_COMPLETED")}>
          Mark Exchange Completed
        </Button>
      )
    }

    return null
  }

  /**
   * NORMAL STATUS FLOW
   */
  const normalFlowButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <Button className="w-full" disabled={loading}
            onClick={() => updateOrderStatus("CONFIRMED")}>
            Confirm Order
          </Button>
        )

      case "CONFIRMED":
        return (
          <Button className="w-full" disabled={loading}
            onClick={() => setShowShipForm(true)}>
            <Truck className="w-4 h-4 mr-2" /> Mark as Shipped
          </Button>
        )

      case "SHIPPED":
        return (
          <Button className="w-full" disabled={loading}
            onClick={() => updateOrderStatus("DELIVERED")}>
            <PackageCheck className="w-4 h-4 mr-2" /> Mark as Delivered
          </Button>
        )

      case "DELIVERED":
        return (
          <Badge className="bg-green-600">Delivered</Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* ORDER STATUS SECTION */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" /> Order Status
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Badge className="bg-black text-white">{order.status}</Badge>
          {normalFlowButtons()}
        </CardContent>
      </Card>

      {/* RETURN ACTIONS SECTION */}
      {order.returnStatus && order.returnStatus !== "NONE" && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Return Actions
            </CardTitle>
          </CardHeader>
          <CardContent>{returnActions()}</CardContent>
        </Card>
      )}

      {/* EXCHANGE ACTIONS SECTION */}
      {order.exchangeStatus && order.exchangeStatus !== "NONE" && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5" /> Exchange Actions
            </CardTitle>
          </CardHeader>
          <CardContent>{exchangeActions()}</CardContent>
        </Card>
      )}

      {/* SHIPPING FORM */}
      {showShipForm && (
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Courier Name</Label>
            <Input value={courierName} onChange={(e) => setCourierName(e.target.value)} />

            <Label>Tracking ID</Label>
            <Input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />

            <Button className="w-full" disabled={loading} onClick={shipOrder}>
              Save & Ship
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowShipForm(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
