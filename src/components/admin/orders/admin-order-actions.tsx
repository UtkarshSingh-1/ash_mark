"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Edit, 
  Download, 
  MessageCircle, 
  RefreshCw,
  AlertTriangle,
  Phone,
  Mail,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AdminOrderActionsProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    total: number
    user: {
      id: string
      name: string | null
      email: string
    }
  }
}

export function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [newStatus, setNewStatus] = useState(order.status)

  const updateOrderStatus = async (status: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
        window.location.reload()
      } else {
        throw new Error('Failed to update order status')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendNotification = async (type: 'email' | 'sms') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: `Order #${order.id.slice(-8)} status update` }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type === 'email' ? 'Email' : 'SMS'} sent successfully`,
        })
      } else {
        throw new Error(`Failed to send ${type}`)
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to send ${type === 'email' ? 'email' : 'SMS'}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/invoice`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice-${order.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Success",
          description: "Invoice downloaded successfully",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refundOrder = async () => {
    if (!confirm('Are you sure you want to initiate a refund for this order?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: order.total }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Refund initiated successfully",
        })
        window.location.reload()
      } else {
        throw new Error('Failed to initiate refund')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to initiate refund",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-gray-600' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-600' },
    { value: 'PROCESSING', label: 'Processing', color: 'bg-yellow-600' },
    { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-600' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-600' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-600' },
    { value: 'RETURNED', label: 'Returned', color: 'bg-orange-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Order Status Management */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge className={`border-0 ${statusOptions.find(s => s.value === order.status)?.color}`}>
              {order.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Update Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-0">
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${status.color}`}></div>
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => updateOrderStatus(newStatus)}
            disabled={loading || newStatus === order.status}
            className="w-full bg-crimson-600 hover:bg-crimson-700 border-0"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
            onClick={downloadInvoice}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
            onClick={() => sendNotification('email')}
            disabled={loading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email Update
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
            onClick={() => sendNotification('sms')}
            disabled={loading}
          >
            <Phone className="w-4 h-4 mr-2" />
            Send SMS Update
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Customer
          </Button>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      {order.paymentStatus === 'PAID' && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-orange-600">Payment Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-0 bg-orange-50 dark:bg-orange-900/20 text-orange-600 hover:text-orange-700"
              onClick={refundOrder}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Initiate Refund
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Order Information */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="font-mono">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Customer:</span>
              <span>{order.user.name || order.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>
              <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="border-0">
                {order.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {(order.status === 'CANCELLED' || order.paymentStatus === 'FAILED') && (
        <Card className="border-0 shadow-md border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-600">
                  {order.status === 'CANCELLED' ? 'Order Cancelled' : 'Payment Failed'}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {order.status === 'CANCELLED' 
                    ? 'This order has been cancelled and may require special handling.'
                    : 'Payment for this order failed. Customer may need assistance.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
