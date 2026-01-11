"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRazorpay } from "react-razorpay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { CreditCard, Wallet, Shield, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PaymentFormProps {
  order?: {
    id: string
    total: number
    razorpayOrderId?: string | null
    paymentStatus: string
    items: Array<{
      product: {
        name: string
      }
    }>
  } | null
  isRetry?: boolean
}

export function PaymentForm({ order, isRetry = false }: PaymentFormProps) {
  const router = useRouter()
  const { error, isLoading, Razorpay } = useRazorpay()
  const [processing, setProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card')

  useEffect(() => {
    if (error) {
      toast({
        title: "Payment Gateway Error",
        description: "Failed to load payment options. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [error])

  if (!order) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No order found</h3>
          <p className="text-muted-foreground mb-6">
            Please create an order first before proceeding to payment.
          </p>
          <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
            <a href="/cart">Go to Cart</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handlePayment = async () => {
    if (isLoading || !Razorpay) {
      toast({
        title: "Please wait",
        description: "Payment gateway is loading...",
      })
      return
    }

    setProcessing(true)

    try {
      // Prevent duplicate clicks
      if (processing) return
      let razorpayOrderId = order.razorpayOrderId

      // Create new Razorpay order if needed
      if (!razorpayOrderId || isRetry) {
        // Idempotent create: use order.id as an idempotency key on server side
        const orderResponse = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            amount: order.total,
            idempotencyKey: order.id,
          }),
        })

        if (!orderResponse.ok) {
          throw new Error('Failed to create payment order')
        }

        const orderData = await orderResponse.json()
        razorpayOrderId = orderData.razorpayOrderId
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Math.round(order.total * 100),
        currency: 'INR' as any,
        name: 'ASHMARK',
        description: `Payment for Order #${order.id.slice(-8).toUpperCase()}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              }),
            })

            if (verifyResponse.ok) {
              toast({
                title: "Payment Successful!",
                description: "Your order has been confirmed.",
              })
              router.push(`/api/orders/${order.id}/invoice`)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            })
            router.push(`/orders/${order.id}?payment=failed`)
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
            })
          },
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#dc2626', // Crimson red
        },
        method: {
          card: selectedMethod === 'card',
          upi: selectedMethod === 'upi',
          netbanking: selectedMethod === 'netbanking',
          wallet: selectedMethod === 'wallet',
        },
      }

      // Reuse the same instance per click
      const razorpayInstance = new Razorpay(options as any)
      razorpayInstance.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isRetry ? 'Retry Payment' : 'Complete Payment'}
            </CardTitle>
            {isRetry && (
              <Badge className="bg-yellow-600 border-0">Retry</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{order.items.length} items</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-crimson-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { id: 'card', icon: CreditCard, label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
              { id: 'upi', icon: Wallet, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
              { id: 'netbanking', icon: Shield, label: 'Net Banking', desc: 'All major banks' },
              { id: 'wallet', icon: Wallet, label: 'Wallets', desc: 'Paytm, Mobikwik, etc.' },
            ].map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className={`p-4 border-2 cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-crimson-600 bg-crimson-50 dark:bg-crimson-900/20'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedMethod(method.id as any)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-muted-foreground">{method.desc}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-600 mb-1">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We use industry-standard
                security measures to protect your financial data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <Button
            onClick={handlePayment}
            disabled={processing || isLoading || !!error}
            className="w-full bg-crimson-600 hover:bg-crimson-700 border-0"
            size="lg"
          >
            {processing ? (
              "Processing Payment..."
            ) : (
              `Pay ${formatPrice(order.total)}`
            )}
          </Button>
          
          {error && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Payment gateway error. Please refresh the page and try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
