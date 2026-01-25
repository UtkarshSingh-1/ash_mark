"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Edit, Truck, PackageCheck, CheckCircle2, RotateCcw, RefreshCcw,
  XCircle, BadgeCheck
} from "lucide-react"

interface AdminOrderActionsProps {
  order: {
    id: string
    status: string
    returnStatus?: string
    exchangeStatus?: string
    paymentStatus: string
  }
}

export function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showShipForm, setShowShipForm] = useState(false)
  const [courierName, setCourierName] = useState("")
  const [trackingId, setTrackingId] = useState("")

  const updateStatus = async (status: string, data: Record<string, any> = {}) => {
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

  /** Normal Shipment */
  const shipOrder = async () => {
    if (!courierName || !trackingId) {
      toast({ title: "Missing Info", description: "Courier + Tracking Required", variant: "destructive" })
      return
    }
    await updateStatus("SHIPPED", { courierName, trackingId })
  }

  /**
   * RETURN ACTIONS
   */
  const returnActions = () => {
    if (order.returnStatus === "RETURN_REQUESTED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-green-600" disabled={loading}
            onClick={() => updateStatus("RETURN_APPROVED")}>
            Approve Return
          </Button>
          <Button className="w-full bg-red-600" disabled={loading}
            onClick={() => updateStatus("RETURN_REJECTED")}>
            Reject Return
          </Button>
        </div>
      )
    }

    if (order.returnStatus === "RETURN_APPROVED") {
      return (
        <Button className="w-full bg-orange-600" disabled={loading}
          onClick={() => updateStatus("RETURNED")}>
          Mark as Returned
        </Button>
      )
    }

    return null
  }

  /**
   * EXCHANGE ACTIONS
   */
  const exchangeActions = () => {
    if (order.exchangeStatus === "EXCHANGE_REQUESTED") {
      return (
        <div className="space-y-2">
          <Button className="w-full bg-green-600" disabled={loading}
            onClick={() => updateStatus("EXCHANGE_APPROVED")}>
            Approve Exchange
          </Button>
          <Button className="w-full bg-red-600" disabled={loading}
            onClick={() => updateStatus("EXCHANGE_REJECTED")}>
            Reject Exchange
          </Button>
        </div>
      )
    }

    if (order.exchangeStatus === "EXCHANGE_APPROVED") {
      return (
        <Button className="w-full bg-blue-600" disabled={loading}
          onClick={() => updateStatus("EXCHANGED")}>
          Mark Exchanged Item Delivered
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
            onClick={() => updateStatus("CONFIRMED")}>
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
            onClick={() => updateStatus("DELIVERED")}>
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
