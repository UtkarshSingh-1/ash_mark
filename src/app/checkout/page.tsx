"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRazorpay } from "react-razorpay"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressForm } from "@/components/checkout/address-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { error, isLoading, Razorpay } = useRazorpay()
  const { cartItems, clearCart } = useCart()
  
  type Address = {
    id: string
    name: string
    phone: string
    street: string
    city: string
    state: string
    pincode: string
    country: string
    isDefault: boolean
  }
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [orderTotal, setOrderTotal] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online")

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data: { addresses: Address[] } = await response.json()
        setAddresses(data.addresses)
        const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }, [])

  const calculateOrderTotal = useCallback(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )
    const shipping = subtotal > 1000 ? 0 : 100
    setOrderTotal(subtotal + shipping - discount)
  }, [cartItems, discount])

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Promo Code Required",
        description: "Please enter a promo code",
        variant: "destructive",
      })
      return
    }

    setApplyingPromo(true)
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: promoCode.trim(), subtotal }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Invalid Promo Code",
          description: data.error || "This promo code cannot be applied",
          variant: "destructive",
        })
        return
      }

      setAppliedPromoCode(data.code)
      setDiscount(data.discount || 0)
      calculateOrderTotal()
      toast({
        title: "Promo Code Applied",
        description: `Discount of ${formatPrice(data.discount || 0)} applied!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply promo code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null)
    setDiscount(0)
    setPromoCode("")
    calculateOrderTotal()
  }

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    if (cartItems.length === 0) {
      router.push('/cart')
      return
    }

    fetchAddresses()
    calculateOrderTotal()
  }, [session, router, fetchAddresses, calculateOrderTotal, cartItems])

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive",
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart looks empty. Please add products again.",
        variant: "destructive",
      })
      router.push("/cart")
      return
    }

    setProcessing(true)

    try {
      if (paymentMethod === "cod") {
        const codResponse = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: orderTotal,
            addressId: selectedAddress.id,
            promoCode: appliedPromoCode || undefined,
            paymentMethod: 'COD',
          }),
        })

        if (!codResponse.ok) {
          const { error: message } = await codResponse.json()
          throw new Error(message || 'Failed to place COD order')
        }

        const codData = await codResponse.json()
        clearCart()
        toast({
          title: "Order Placed",
          description: "Your cash on delivery order has been confirmed.",
        })
        router.push(`/orders/${codData.orderId}`)
        return
      }

      // Create online payment order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: orderTotal,
          addressId: selectedAddress.id,
          promoCode: appliedPromoCode || undefined,
          paymentMethod: 'ONLINE',
        }),
      })

      if (!orderResponse.ok) {
        const { error: message } = await orderResponse.json()
        throw new Error(message || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      type RazorpayResponse = {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ASHMARK",
        description: "Purchase from ASHMARK",
        order_id: orderData.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            })

            if (verifyResponse.ok) {
              clearCart()
              toast({
                title: "Payment Successful",
                description: "Your order has been placed successfully!",
              })
              router.push(`/orders/${orderData.orderId}`)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: selectedAddress?.phone || '',
        },
        theme: {
          color: "#dc2626",
        },
      }

      const razorpayInstance = new Razorpay(options as any)
      razorpayInstance.open()
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AddressForm
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                onAddressUpdate={fetchAddresses}
              />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  
                  {/* Promo Code Section */}
                  <div className="mb-4 space-y-2">
                    {appliedPromoCode ? (
                      <div className="flex items-center justify-between p-2 bg-black text-white border border-black rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{appliedPromoCode}</span>
                          <span className="text-xs font-bold text-green-400">-{formatPrice(discount)}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-white opacity-80 hover:opacity-100"
                          onClick={handleRemovePromoCode}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleApplyPromoCode()
                          }}
                          className="flex-1 border-2 border-black text-black placeholder:text-gray-500"
                        />
                        <Button
                          onClick={handleApplyPromoCode}
                          disabled={applyingPromo || !promoCode.trim()}
                          variant="outline"
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <OrderSummary promoCode={appliedPromoCode} discount={discount} />

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between font-semibold text-lg mb-4">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
                    </div>

                    <div className="mb-4 space-y-3">
                      <Label className="text-sm font-medium text-foreground">Payment Method</Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => setPaymentMethod(value as "online" | "cod")}
                        className="space-y-2"
                      >
                        <div className="flex items-start gap-3 p-3 border border-muted rounded-md">
                          <RadioGroupItem value="online" id="online-payment" className="mt-1" />
                          <Label htmlFor="online-payment" className="flex-1 cursor-pointer">
                            <span className="block font-semibold">Online Payment</span>
                            <span className="text-sm text-muted-foreground">
                              Pay securely via Razorpay using UPI, cards, or net banking.
                            </span>
                          </Label>
                        </div>
                        <div className="flex items-start gap-3 p-3 border border-muted rounded-md">
                          <RadioGroupItem value="cod" id="cod-payment" className="mt-1" />
                          <Label htmlFor="cod-payment" className="flex-1 cursor-pointer">
                            <span className="block font-semibold">Cash on Delivery</span>
                            <span className="text-sm text-muted-foreground">
                              Pay with cash when the order arrives. No online payment required.
                            </span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      className="w-full bg-crimson-600 hover:bg-crimson-700"
                      onClick={handlePayment}
                      disabled={
                        processing ||
                        !selectedAddress ||
                        (paymentMethod === "online" && isLoading)
                      }
                    >
                      {processing
                        ? paymentMethod === "cod"
                          ? "Placing Order..."
                          : "Processing..."
                        : paymentMethod === "cod"
                          ? "Place COD Order"
                          : `Pay ${formatPrice(orderTotal)}`}
                    </Button>
                    
                    {error && paymentMethod === "online" && (
                      <p className="text-sm text-destructive mt-2">
                        Error loading payment gateway. Please refresh the page.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
