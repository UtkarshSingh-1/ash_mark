"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
import { EligiblePromoList } from "@/components/checkout/eligible-promo-list"

type PromoDisplay = {
  code: string
  description: string
  eligible: boolean
  reasons: string[]
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { error, Razorpay } = useRazorpay()
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
  const [processing, setProcessing] = useState(false)

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [applyingPromo, setApplyingPromo] = useState(false)

  const [allPromos, setAllPromos] = useState<PromoDisplay[]>([])
  const [isNewUser, setIsNewUser] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online")

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [cartItems]
  )

  const shipping = subtotal > 1000 ? 0 : 100
  const orderTotal = subtotal + shipping - discount

  const fetchAddresses = useCallback(async () => {
    const response = await fetch("/api/addresses")
    if (response.ok) {
      const data: { addresses: Address[] } = await response.json()
      setAddresses(data.addresses)
      const defaultAddress = data.addresses.find(a => a.isDefault)
      if (defaultAddress) setSelectedAddress(defaultAddress)
    }
  }, [])

  const fetchPromoDetails = useCallback(async () => {
    try {
      const promoRes = await fetch("/api/promo-codes/list")
      const promoData = await promoRes.json()

      const formatted: PromoDisplay[] = (promoData.promoCodes || []).map((p: any) => ({
        code: p.code,
        description: p.description,
        eligible: p.eligible,
        reasons: p.reasons ?? [],
      }))

      setAllPromos(formatted)

      const userRes = await fetch("/api/profile")
      const user = await userRes.json()
      setIsNewUser(user?.isNewUser || false)
    } catch (err) {
      console.error("Promo fetch error:", err)
    }
  }, [])

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      return toast({
        title: "Promo Code Required",
        description: "Enter a promo code first",
        variant: "destructive",
      })
    }

    setApplyingPromo(true)

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoCode.trim(), subtotal }),
      })

      const data = await response.json()

      if (!response.ok) {
        return toast({ title: "Invalid Promo Code", description: data.error, variant: "destructive" })
      }

      setAppliedPromoCode(data.code)
      setDiscount(data.discount || 0)

      toast({
        title: "Promo Applied",
        description: `You saved ${formatPrice(data.discount)}`,
      })
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null)
    setPromoCode("")
    setDiscount(0)
  }

  const handlePayment = async () => {
    if (!selectedAddress) {
      return toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive",
      })
    }

    if (cartItems.length === 0) {
      return toast({
        title: "Cart Empty",
        description: "Your cart is empty",
        variant: "destructive",
      })
    }

    setProcessing(true)

    try {
      // COD Flow
      if (paymentMethod === "cod") {
        const codRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: orderTotal,
            addressId: selectedAddress.id,
            promoCode: appliedPromoCode || undefined,
            paymentMethod: "COD",
          }),
        })

        const codData = await codRes.json()
        if (!codRes.ok) throw new Error(codData.error)

        clearCart()
        toast({ title: "Order Placed", description: "COD order confirmed!" })

        return router.push(`/orders/${codData.orderId}`)
      }

      // Online Payment Flow
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          addressId: selectedAddress.id,
          promoCode: appliedPromoCode || undefined,
          paymentMethod: "ONLINE",
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: "ASHMARK",
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId: orderData.orderId }),
            })

            if (!verifyRes.ok) {
              toast({ title: "Verification Failed", variant: "destructive" })
              return
            }

            clearCart()
            toast({ title: "Payment Successful", description: "Order placed successfully!" })
            router.push(`/orders/${orderData.orderId}`)

          } catch {
            toast({ title: "Payment Verification Failed", variant: "destructive" })
          }
        },
        theme: { color: "#dc2626" },
      })

      rzp.on("payment.failed", () => {
        toast({
          title: "Payment Failed",
          description: "Your transaction was not completed.",
          variant: "destructive",
        })
      })

      rzp.open()

    } catch (err: any) {
      toast({ title: "Payment Error", description: err?.message || "Something went wrong", variant: "destructive" })
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    if (!session) return router.push("/login")

    // ⛔ DO NOT redirect to cart on `cartItems.length === 0` after checkout
    if (cartItems.length === 0) return

    fetchAddresses()
    fetchPromoDetails()
  }, [session])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AddressForm
                selectedAddress={selectedAddress}
                onAddressSelectAction={(addr) => setSelectedAddress(addr)}
                onAddressUpdateAction={fetchAddresses}
              />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <EligiblePromoList
                    items={allPromos}
                    subtotal={subtotal}
                    isNewUser={isNewUser}
                    onApply={(code) => {
                      setPromoCode(code)
                      handleApplyPromoCode()
                    }}
                  />

                  {!appliedPromoCode ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      />
                      <Button onClick={handleApplyPromoCode} disabled={applyingPromo}>
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-black text-white rounded-md">
                      <span>{appliedPromoCode} - {formatPrice(discount)}</span>
                      <Button size="sm" variant="ghost" onClick={handleRemovePromoCode}>
                        Remove
                      </Button>
                    </div>
                  )}

                  <OrderSummary promoCode={appliedPromoCode} discount={discount} />

                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(v) => setPaymentMethod(v as "online" | "cod")}>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Online Payment</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod">Cash on Delivery</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button className="w-full" onClick={handlePayment} disabled={processing}>
                      {processing ? "Processing..." : paymentMethod === "cod"
                        ? "Place COD Order"
                        : `Pay ${formatPrice(orderTotal)}`}
                    </Button>

                    {error && paymentMethod === "online" && (
                      <p className="text-sm text-red-600">Payment gateway failed to load.</p>
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
