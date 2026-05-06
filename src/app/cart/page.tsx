"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { CartItem } from "@/components/cart/cart-item"
import { EmptyCart } from "@/components/cart/empty-cart"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"
import { ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw, Tag } from "lucide-react"
import Link from "next/link"

interface CartItemType {
  id: string
  quantity: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
  }
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems, updateQuantity, removeItem, loading } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const handleCheckout = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    router.push("/checkout")
  }

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      toast({
        title: "Promo code applied",
        description: "Your discount has been applied.",
      })
      setPromoApplied(true)
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )
  const shipping = 0
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <CartSkeleton />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <EmptyCart />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Continue Shopping
            </Link>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shopping Cart</h1>
              <Badge variant="secondary" className="rounded-full px-2.5 text-sm font-semibold">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">

            {/* Cart Items — takes 3/5 on large screens */}
            <div className="lg:col-span-3 space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-background rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </div>
              ))}

              {/* Trust badges — visible below items on mobile, hidden on lg (shown in summary) */}
              <div className="lg:hidden mt-4">
                <TrustBadges />
              </div>
            </div>

            {/* Order Summary — takes 2/5 on large screens */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
              <Card className="rounded-xl shadow-sm border overflow-hidden">
                <CardHeader className="pb-3 bg-muted/40 border-b px-5 py-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 py-4 space-y-4">

                  {/* Line items */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                      <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold text-xs bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Promo discount (10%)
                        </span>
                        <span className="font-medium">−{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-crimson-700 dark:text-crimson-400">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* Promo code */}
                  {!promoApplied && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        placeholder="Promo code"
                        className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-crimson-500/40 placeholder:text-muted-foreground/60 transition"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyPromo}
                        className="shrink-0 text-sm font-medium"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    className="w-full bg-crimson-600 hover:bg-crimson-700 active:scale-[0.98] transition-all text-white font-semibold py-5 rounded-lg shadow-sm text-base"
                    onClick={handleCheckout}
                  >
                    {session ? "Proceed to Checkout" : "Login to Checkout"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Taxes calculated at checkout
                  </p>
                </CardContent>
              </Card>

              {/* Trust badges — visible in summary on desktop */}
              <div className="hidden lg:block">
                <TrustBadges />
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        { icon: Truck, label: "Free Shipping", sub: "On all orders" },
        { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
        { icon: Shield, label: "Secure Pay", sub: "256-bit SSL" },
      ].map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border shadow-sm text-xs"
        >
          <Icon className="w-4 h-4 text-crimson-600" />
          <span className="font-semibold text-foreground leading-tight">{label}</span>
          <span className="text-muted-foreground leading-tight">{sub}</span>
        </div>
      ))}
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-52" />
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-background border rounded-xl">
              <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-24 mt-2" />
              </div>
              <Skeleton className="h-5 w-16 self-start" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="bg-background border rounded-xl p-5 space-y-4">
            <Skeleton className="h-5 w-36" />
            <Separator />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
