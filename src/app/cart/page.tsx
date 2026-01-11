"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { CartItem } from "@/components/cart/cart-item"
import { EmptyCart } from "@/components/cart/empty-cart"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"

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

  const handleCheckout = () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with checkout",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-8">
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
        <main className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-8">
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
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />

                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-700 dark:text-green-400 font-semibold">Free</span>
                      ) : (
                        <span className="font-medium">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg text-foreground">
                    <span>Total</span>
                    <span className="text-crimson-700 dark:text-crimson-400">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-crimson-600 hover:bg-crimson-700"
                    onClick={handleCheckout}
                  >
                    {session ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>

                  {subtotal < 1000 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Add {formatPrice(1000 - subtotal)} more for free shipping
                    </p>
                  )}
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

function CartSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="w-20 h-20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
