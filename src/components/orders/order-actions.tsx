"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, MessageCircle, RotateCcw, X, CreditCard, HelpCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface OrderActionsProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    total: number
  }
}

export function OrderActions({ order }: OrderActionsProps) {
  const [loading, setLoading] = useState(false)

  const downloadInvoice = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/invoice`)
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
      } else {
        throw new Error('Failed to download invoice')
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

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order cancelled successfully",
        })
        window.location.reload()
      } else {
        throw new Error('Failed to cancel order')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const retryPayment = () => {
    // Redirect to payment page with order ID
    window.location.href = `/payment?orderId=${order.id}&retry=true`
  }

  const requestReturn = async () => {
    if (!confirm('Do you want to request a return for this order?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/return-request`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Return request submitted successfully",
        })
      } else {
        throw new Error('Failed to submit return request')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit return request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const canCancel = ['CONFIRMED', 'PROCESSING'].includes(order.status)
  const canReturn = order.status === 'DELIVERED'
  const needsPayment = order.paymentStatus === 'FAILED'

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Actions */}
        <div className="space-y-2">
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
            onClick={downloadInvoice}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        <Separator />

        {/* Order Management Actions */}
        <div className="space-y-2">
          {needsPayment && (
            <Button 
              className="w-full bg-crimson-600 hover:bg-crimson-700 border-0"
              onClick={retryPayment}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
          )}

          {canCancel && (
            <Button 
              variant="outline" 
              className="w-full justify-start border-0 bg-muted/30 text-red-600 hover:text-red-700"
              onClick={cancelOrder}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Order
            </Button>
          )}

          {canReturn && (
            <Button 
              variant="outline" 
              className="w-full justify-start border-0 bg-muted/30"
              onClick={requestReturn}
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Request Return
            </Button>
          )}
        </div>

        <Separator />

        {/* Support Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-0 bg-muted/30"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Need Help?
          </Button>
        </div>

        {/* Order Info */}
        <div className="mt-6 p-4 bg-muted/30 text-sm">
          <div className="space-y-1">
            <div><strong>Order ID:</strong> {order.id}</div>
            <div><strong>Status:</strong> {order.status}</div>
            <div><strong>Payment:</strong> {order.paymentStatus}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
