"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRazorpay } from "react-razorpay"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { AddressForm } from "@/components/checkout/address-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { EligiblePromoList } from "@/components/checkout/eligible-promo-list"

import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

/* -------------------- TYPES -------------------- */

type PromoDisplay = {
  code: string
  description: string
  eligible: boolean
}

/* -------------------- PAGE -------------------- */

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { Razorpay, error } = useRazorpay()

  const { cartItems, clearCart } = useCart()

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)

  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online")

  /* Promo state */
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [applyingPromo, setApplyingPromo] = useState(false)

  const [allPromos, setAllPromos] = useState<PromoDisplay[]>([])
  const [isNewUser, setIsNewUser] = useState(false)

  /* -------------------- TOTALS -------------------- */

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ),
    [cartItems]
  )

  const shipping = subtotal > 1000 ? 0 : 100
  const total = Math.max(subtotal + shipping - discount, 0)

  /* -------------------- DATA -------------------- */

  const fetchAddresses = useCallback(async () => {
    const res = await fetch("/api/addresses")
    if (!res.ok) return
    const data = await res.json()
    setAddresses(data.addresses)
    const def = data.addresses.find((a: any) => a.isDefault)
    if (def) setSelectedAddress(def)
  }, [])

  const fetchPromoDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/promocodes/available", { cache: "no-store" })
      const data = await res.json()

      const promos: PromoDisplay[] = (data.promoCodes || []).map((p: any) => {
        const eligible =
          (!p.minOrderValue || subtotal >= Number(p.minOrderValue)) &&
          !(p.prepaidOnly && paymentMethod !== "online")

        return {
          code: p.code,
          description: p.description,
          eligible,
        }
      })

      setAllPromos(promos)

      const userRes = await fetch("/api/profile")
      const user = await userRes.json()
      setIsNewUser(user?.isNewUser || false)
    } catch {
      setAllPromos([])
    }
  }, [subtotal, paymentMethod])

  /* -------------------- PROMO -------------------- */

  const handleApplyPromoCode = async (codeOverride?: string) => {
    const codeToApply = (codeOverride ?? promoCode).trim()

    if (!codeToApply) {
      return toast({
        title: "Enter promo code",
        variant: "destructive",
      })
    }

    setApplyingPromo(true)

    try {
      const res = await fetch("/api/promocodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: codeToApply,
          subtotal,
          paymentMethod: paymentMethod === "online" ? "ONLINE" : "COD",
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setPromoCode(codeToApply)
      setAppliedPromoCode(data.code)
      setDiscount(Number(data.discount) || 0)

      toast({
        title: "Promo applied",
        description: `You saved ${formatPrice(data.discount)}`,
      })
    } catch (err: any) {
      toast({
        title: err.message || "Invalid promo",
        variant: "destructive",
      })
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromoCode = () => {
    setPromoCode("")
    setAppliedPromoCode(null)
    setDiscount(0)
  }

  /* -------------------- PAYMENT -------------------- */

  const handlePayment = async () => {
    if (!selectedAddress) {
      return toast({ title: "Select address", variant: "destructive" })
    }

    if (cartItems.length === 0) {
      return toast({ title: "Cart is empty", variant: "destructive" })
    }

    setProcessing(true)

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          addressId: selectedAddress.id,
          promoCode: appliedPromoCode ?? undefined,
          paymentMethod: paymentMethod.toUpperCase(),
        }),
      })

      const order = await res.json()
      if (!res.ok) throw new Error(order.error)

      if (paymentMethod === "cod") {
        clearCart()
        router.push(`/orders/${order.orderId}`)
        return
      }

      const rzp = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "ASHMARK",
        handler: async (response: any) => {
          await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderId: order.orderId }),
          })

          clearCart()
          router.push(`/orders/${order.orderId}`)
        },
      })

      rzp.open()
    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  /* -------------------- INIT -------------------- */

  useEffect(() => {
    if (!session) router.push("/login")
    fetchAddresses()
    fetchPromoDetails()
  }, [session, fetchAddresses, fetchPromoDetails])

  /* -------------------- UI -------------------- */

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
                onAddressSelectAction={setSelectedAddress}
                onAddressUpdateAction={fetchAddresses}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <EligiblePromoList
                  items={allPromos}
                  subtotal={subtotal}
                  isNewUser={isNewUser}
                  onApply={(code) => handleApplyPromoCode(code)}
                />

                {!appliedPromoCode ? (
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter promo code"
                    />
                    <Button
                      onClick={() => handleApplyPromoCode()}
                      disabled={applyingPromo}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between bg-black text-white p-2 rounded">
                    <span>{appliedPromoCode}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemovePromoCode}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <OrderSummary
                  items={cartItems}
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={discount}
                  promoCode={appliedPromoCode}
                  total={total}
                />

                <div className="pt-4 border-t space-y-4">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setPaymentMethod(v as "online" | "cod")
                    }
                  >
                    <div className="flex gap-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex gap-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>

                  <Button
                    className="w-full"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {paymentMethod === "cod"
                      ? "Place COD Order"
                      : `Pay ${formatPrice(total)}`}
                  </Button>

                  {error && (
                    <p className="text-sm text-red-600">
                      Payment gateway failed to load
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
