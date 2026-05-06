"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useRazorpay } from "react-razorpay"
import {
  ArrowLeft,
  BadgePercent,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  Wallet,
  X,
} from "lucide-react"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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

/* -------------------- STEP INDICATOR -------------------- */

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number
  onStepClick: (step: number) => void
}) {
  const steps = [
    { label: "Address", icon: MapPin },
    { label: "Payment", icon: CreditCard },
    { label: "Review", icon: ShoppingBag },
  ]

  return (
    <div className="flex items-center justify-center w-full mb-6 md:mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index + 1 === currentStep
        const isCompleted = index + 1 < currentStep

        return (
          <div key={step.label} className="flex items-center">
            <button
              onClick={() => {
                if (isCompleted) onStepClick(index + 1)
              }}
              disabled={!isCompleted && !isActive}
              className={`
                flex flex-col items-center gap-1 transition-all duration-200
                ${isCompleted ? "cursor-pointer" : "cursor-default"}
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full
                  border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-black bg-black text-white scale-110 shadow-lg"
                      : isCompleted
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-gray-200 bg-gray-50 text-gray-400"
                  }
                `}
              >
                {isCompleted ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </div>
              <span
                className={`
                  text-[10px] md:text-xs font-medium
                  ${isActive ? "text-black" : isCompleted ? "text-green-600" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 md:w-20 lg:w-28 h-[2px] mx-2 md:mx-3 mt-[-18px]
                  transition-colors duration-300
                  ${index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
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

  /* Mobile stepper */
  const [mobileStep, setMobileStep] = useState(1)
  const [showPromoSection, setShowPromoSection] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  /* -------------------- TOTALS -------------------- */

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      ),
    [cartItems]
  )

  const shipping = 0
  const total = Math.max(subtotal + shipping - discount, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
      const res = await fetch("/api/promocodes/available", {
        cache: "no-store",
      })
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
        title: "🎉 Promo applied!",
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
      return toast({ title: "Please select a delivery address", variant: "destructive" })
    }

    if (cartItems.length === 0) {
      return toast({ title: "Your cart is empty", variant: "destructive" })
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

  /* -------------------- MOBILE NAVIGATION -------------------- */

  const canProceedFromStep1 = !!selectedAddress
  const canProceedFromStep2 = !!paymentMethod

  const handleNextStep = () => {
    if (mobileStep === 1 && !selectedAddress) {
      return toast({
        title: "Please select a delivery address",
        variant: "destructive",
      })
    }
    setMobileStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setMobileStep((prev) => Math.max(prev - 1, 1))
  }

  /* -------------------- UI -------------------- */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                Checkout
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""} •{" "}
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>

          {/* Step Indicator - Mobile */}
          <div className="md:hidden">
            <StepIndicator
              currentStep={mobileStep}
              onStepClick={setMobileStep}
            />
          </div>

          {/* ===== DESKTOP LAYOUT ===== */}
          <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-3 lg:col-span-2 space-y-6">
              {/* Address Section */}
              <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                      1
                    </div>
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressForm
                    selectedAddress={selectedAddress}
                    onAddressSelectAction={setSelectedAddress}
                    onAddressUpdateAction={fetchAddresses}
                  />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                      2
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setPaymentMethod(v as "online" | "cod")
                    }
                    className="space-y-3"
                  >
                    <label
                      htmlFor="online-desktop"
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer
                        transition-all duration-200
                        ${
                          paymentMethod === "online"
                            ? "border-black bg-gray-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <RadioGroupItem
                        value="online"
                        id="online-desktop"
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`
                            p-2 rounded-lg
                            ${paymentMethod === "online" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}
                          `}
                        >
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Pay Online
                          </p>
                          <p className="text-xs text-muted-foreground">
                            UPI, Cards, Net Banking & more
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "online" && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 text-[10px]"
                        >
                          Recommended
                        </Badge>
                      )}
                    </label>

                    <label
                      htmlFor="cod-desktop"
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer
                        transition-all duration-200
                        ${
                          paymentMethod === "cod"
                            ? "border-black bg-gray-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <RadioGroupItem
                        value="cod"
                        id="cod-desktop"
                        className="shrink-0"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`
                            p-2 rounded-lg
                            ${paymentMethod === "cod" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}
                          `}
                        >
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column — Order Summary */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="w-5 h-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Promo Section */}
                    <div className="space-y-3">
                      <EligiblePromoList
                        items={allPromos}
                        subtotal={subtotal}
                        isNewUser={isNewUser}
                        onApply={(code) => handleApplyPromoCode(code)}
                      />

                      {!appliedPromoCode ? (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              value={promoCode}
                              onChange={(e) =>
                                setPromoCode(e.target.value.toUpperCase())
                              }
                              placeholder="Enter promo code"
                              className="pl-9 h-10"
                            />
                          </div>
                          <Button
                            onClick={() => handleApplyPromoCode()}
                            disabled={applyingPromo}
                            variant="outline"
                            className="shrink-0 h-10 px-4 font-semibold border-black text-black hover:bg-black hover:text-white"
                          >
                            {applyingPromo ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <BadgePercent className="w-4 h-4" />
                            <span className="font-semibold text-sm">
                              {appliedPromoCode}
                            </span>
                            <span className="text-xs text-green-600">
                              -{formatPrice(discount)}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-green-100"
                            onClick={handleRemovePromoCode}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <OrderSummary
                      items={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      discount={discount}
                      promoCode={appliedPromoCode}
                      total={total}
                    />

                    <Separator />

                    <Button
                      className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={handlePayment}
                      disabled={processing}
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </div>
                      ) : paymentMethod === "cod" ? (
                        `Place Order • ${formatPrice(total)}`
                      ) : (
                        `Pay ${formatPrice(total)}`
                      )}
                    </Button>

                    {error && (
                      <p className="text-xs text-red-600 text-center">
                        Payment gateway failed to load. Please refresh.
                      </p>
                    )}

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Secure Payment
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Truck className="w-3.5 h-3.5" />
                        Fast Delivery
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* ===== MOBILE LAYOUT ===== */}
          <div className="md:hidden">
            {/* Step 1: Address */}
            {mobileStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="w-5 h-5" />
                      Select Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressForm
                      selectedAddress={selectedAddress}
                      onAddressSelectAction={setSelectedAddress}
                      onAddressUpdateAction={fetchAddresses}
                    />
                  </CardContent>
                </Card>

                {/* Mini Summary */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <button
                    className="w-full"
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                  >
                    <CardContent className="flex items-center justify-between py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {formatPrice(total)}
                        </span>
                        {showOrderDetails ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </button>
                  {showOrderDetails && (
                    <CardContent className="pt-0 pb-4 px-4 border-t animate-in fade-in slide-in-from-top-2 duration-200">
                      <OrderSummary
                        items={cartItems}
                        subtotal={subtotal}
                        shipping={shipping}
                        discount={discount}
                        promoCode={appliedPromoCode}
                        total={total}
                      />
                    </CardContent>
                  )}
                </Card>
              </div>
            )}

            {/* Step 2: Payment Method + Promo */}
            {mobileStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Selected Address Summary */}
                {selectedAddress && (
                  <Card className="shadow-sm border-0 ring-1 ring-green-200 bg-green-50/50">
                    <CardContent className="flex items-start gap-3 py-3 px-4">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-green-800">
                          Delivering to
                        </p>
                        <p className="text-sm text-green-700 truncate">
                          {selectedAddress.street}, {selectedAddress.city}{" "}
                          - {selectedAddress.zipCode}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-green-700 hover:text-green-900"
                        onClick={() => setMobileStep(1)}
                      >
                        Change
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Method */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(v) =>
                        setPaymentMethod(v as "online" | "cod")
                      }
                      className="space-y-3"
                    >
                      <label
                        htmlFor="online-mobile"
                        className={`
                          flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer
                          transition-all duration-200
                          ${
                            paymentMethod === "online"
                              ? "border-black bg-gray-50 shadow-sm"
                              : "border-gray-200"
                          }
                        `}
                      >
                        <RadioGroupItem
                          value="online"
                          id="online-mobile"
                          className="shrink-0"
                        />
                        <div
                          className={`
                            p-2 rounded-lg
                            ${paymentMethod === "online" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}
                          `}
                        >
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Pay Online</p>
                          <p className="text-[11px] text-muted-foreground">
                            UPI, Cards, Net Banking
                          </p>
                        </div>
                        {paymentMethod === "online" && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-[9px] px-1.5"
                          >
                            Best
                          </Badge>
                        )}
                      </label>

                      <label
                        htmlFor="cod-mobile"
                        className={`
                          flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer
                          transition-all duration-200
                          ${
                            paymentMethod === "cod"
                              ? "border-black bg-gray-50 shadow-sm"
                              : "border-gray-200"
                          }
                        `}
                      >
                        <RadioGroupItem
                          value="cod"
                          id="cod-mobile"
                          className="shrink-0"
                        />
                        <div
                          className={`
                            p-2 rounded-lg
                            ${paymentMethod === "cod" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}
                          `}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Cash on Delivery
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Pay when delivered
                          </p>
                        </div>
                      </label>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Promo Section */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <button
                    className="w-full"
                    onClick={() => setShowPromoSection(!showPromoSection)}
                  >
                    <CardContent className="flex items-center justify-between py-3 px-4">
                      <div className="flex items-center gap-2">
                        <BadgePercent className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {appliedPromoCode
                            ? `Code: ${appliedPromoCode}`
                            : "Apply Promo Code"}
                        </span>
                        {appliedPromoCode && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-[10px]"
                          >
                            -{formatPrice(discount)}
                          </Badge>
                        )}
                      </div>
                      {showPromoSection ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </CardContent>
                  </button>

                  {showPromoSection && (
                    <CardContent className="pt-0 pb-4 px-4 border-t space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <EligiblePromoList
                        items={allPromos}
                        subtotal={subtotal}
                        isNewUser={isNewUser}
                        onApply={(code) => handleApplyPromoCode(code)}
                      />

                      {!appliedPromoCode ? (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                              value={promoCode}
                              onChange={(e) =>
                                setPromoCode(e.target.value.toUpperCase())
                              }
                              placeholder="Promo code"
                              className="pl-8 h-9 text-sm"
                            />
                          </div>
                          <Button
                            onClick={() => handleApplyPromoCode()}
                            disabled={applyingPromo}
                            size="sm"
                            className="shrink-0 h-9 px-4 font-semibold"
                          >
                            {applyingPromo ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <BadgePercent className="w-4 h-4" />
                            <span className="font-semibold text-sm">
                              {appliedPromoCode}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:bg-green-100"
                            onClick={handleRemovePromoCode}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </div>
            )}

            {/* Step 3: Review & Pay */}
            {mobileStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Address Summary */}
                {selectedAddress && (
                  <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                    <CardContent className="flex items-start gap-3 py-3 px-4">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          Delivery Address
                        </p>
                        <p className="text-sm mt-0.5">
                          {selectedAddress.street}, {selectedAddress.city}{" "}
                          - {selectedAddress.zipCode}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Summary */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <CardContent className="flex items-center gap-3 py-3 px-4">
                    {paymentMethod === "online" ? (
                      <Wallet className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        Payment
                      </p>
                      <p className="text-sm font-medium">
                        {paymentMethod === "online"
                          ? "Online Payment"
                          : "Cash on Delivery"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card className="shadow-sm border-0 ring-1 ring-gray-200/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ShoppingBag className="w-5 h-5" />
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <OrderSummary
                      items={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      discount={discount}
                      promoCode={appliedPromoCode}
                      total={total}
                    />
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="w-4 h-4" />
                    Easy Returns
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-3 z-50 safe-area-bottom">
              <div className="max-w-lg mx-auto">
                {/* Price Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Total
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold">
                        {formatPrice(total)}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          Save {formatPrice(discount)}
                        </span>
                      )}
                    </div>
                  </div>

                  {mobileStep < 3 ? (
                    <Button
                      onClick={handleNextStep}
                      className="h-12 px-8 text-base font-semibold rounded-xl shadow-md"
                      disabled={
                        (mobileStep === 1 && !canProceedFromStep1) ||
                        (mobileStep === 2 && !canProceedFromStep2)
                      }
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePayment}
                      disabled={processing}
                      className="h-12 px-6 text-base font-semibold rounded-xl shadow-md"
                    >
                      {processing ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Wait...
                        </div>
                      ) : paymentMethod === "cod" ? (
                        "Place Order"
                      ) : (
                        `Pay ${formatPrice(total)}`
                      )}
                    </Button>
                  )}
                </div>

                {/* Step navigation */}
                {mobileStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="w-full text-center text-xs text-muted-foreground py-1 hover:text-foreground transition-colors"
                  >
                    ← Go back
                  </button>
                )}

                {error && (
                  <p className="text-[10px] text-red-600 text-center mt-1">
                    Payment gateway failed to load
                  </p>
                )}
              </div>
            </div>

            {/* Bottom spacing for fixed bar */}
            <div className="h-32" />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
