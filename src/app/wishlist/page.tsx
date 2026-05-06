"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

import {
  ArrowLeft,
  Heart,
  HeartOff,
  Loader2,
  Package,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  TrendingDown,
  Truck,
  X,
} from "lucide-react"

/* -------------------- TYPES -------------------- */

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice: number | null
    images: string[]
    stock: number
    category: {
      name: string
    }
  }
  createdAt: string
}

/* -------------------- PAGE -------------------- */

export default function WishlistPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    fetchWishlist()
  }, [session, router])

  /* -------------------- API -------------------- */

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(Array.isArray(data) ? data : [])
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      setWishlistItems([])
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    setRemovingId(itemId)
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setWishlistItems((items) => items.filter((item) => item.id !== itemId))
        setSelectedItems((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
        toast({ title: "Removed from wishlist" })
      } else {
        throw new Error("Failed")
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setRemovingId(null)
    }
  }

  const removeSelectedItems = async () => {
    const ids = Array.from(selectedItems)
    for (const id of ids) {
      await removeFromWishlist(id)
    }
    setSelectionMode(false)
    setSelectedItems(new Set())
  }

  const addToCart = async (productId: string, itemId: string) => {
    setAddingToCartId(itemId)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
      if (response.ok) {
        toast({
          title: "Added to cart! 🛒",
          description: "Item moved to your shopping cart",
        })
      } else {
        throw new Error("Failed")
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCartId(null)
    }
  }

  const addAllToCart = async () => {
    const inStockItems = wishlistItems.filter((i) => i.product.stock > 0)
    for (const item of inStockItems) {
      await addToCart(item.product.id, item.id)
    }
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "My ASHMARK Wishlist",
        text: "Check out my wishlist on ASHMARK",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied! 📋",
        description: "Wishlist link copied to clipboard",
      })
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  /* -------------------- COMPUTED -------------------- */

  const inStockCount = wishlistItems.filter((i) => i.product.stock > 0).length
  const outOfStockCount = wishlistItems.length - inStockCount
  const totalSavings = wishlistItems.reduce((sum, item) => {
    if (item.product.comparePrice) {
      return (
        sum +
        (Number(item.product.comparePrice) - Number(item.product.price))
      )
    }
    return sum
  }, 0)

  if (!session) return null

  /* -------------------- RENDER -------------------- */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
          {/* ===== HEADER ===== */}
          <div className="flex items-start justify-between gap-4 mb-4 md:mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden -ml-1"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                    My Wishlist
                  </h1>
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-red-500" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  {loading
                    ? "Loading your saved items..."
                    : `${wishlistItems.length} item${wishlistItems.length !== 1 ? "s" : ""} saved`}
                </p>
              </div>
            </div>

            {/* Desktop actions */}
            {!loading && wishlistItems.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectionMode(!selectionMode)
                    setSelectedItems(new Set())
                  }}
                >
                  {selectionMode ? "Cancel" : "Select"}
                </Button>
                <Button variant="outline" size="sm" onClick={shareWishlist}>
                  <Share2 className="w-4 h-4 mr-1.5" />
                  Share
                </Button>
                <Button size="sm" onClick={addAllToCart}>
                  <ShoppingCart className="w-4 h-4 mr-1.5" />
                  Add All to Cart
                </Button>
              </div>
            )}
          </div>

          {/* ===== STATS BAR ===== */}
          {!loading && wishlistItems.length > 0 && (
            <div className="flex gap-2 md:gap-3 mb-4 md:mb-6 overflow-x-auto pb-1 scrollbar-hide">
              <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 ring-1 ring-gray-200/80 shrink-0">
                <Package className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs md:text-sm font-medium">
                  {inStockCount} in stock
                </span>
              </div>
              {outOfStockCount > 0 && (
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 ring-1 ring-gray-200/80 shrink-0">
                  <HeartOff className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs md:text-sm font-medium">
                    {outOfStockCount} out of stock
                  </span>
                </div>
              )}
              {totalSavings > 0 && (
                <div className="flex items-center gap-1.5 bg-green-50 rounded-full px-3 py-1.5 md:px-4 md:py-2 ring-1 ring-green-200 shrink-0">
                  <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs md:text-sm font-medium text-green-700">
                    Save {formatPrice(totalSavings)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ===== MOBILE QUICK ACTIONS ===== */}
          {!loading && wishlistItems.length > 0 && (
            <div className="flex md:hidden gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-xs"
                onClick={shareWishlist}
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 text-xs"
                onClick={() => {
                  setSelectionMode(!selectionMode)
                  setSelectedItems(new Set())
                }}
              >
                {selectionMode ? (
                  <>
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </>
                ) : (
                  "Select Items"
                )}
              </Button>
              <Button
                size="sm"
                className="flex-1 h-9 text-xs"
                onClick={addAllToCart}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                Add All
              </Button>
            </div>
          )}

          {/* ===== SELECTION BAR ===== */}
          {selectionMode && selectedItems.size > 0 && (
            <div className="sticky top-0 z-30 bg-black text-white rounded-xl p-3 mb-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
              <span className="text-sm font-medium">
                {selectedItems.size} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0"
                  onClick={() =>
                    setSelectedItems(
                      new Set(wishlistItems.map((i) => i.id))
                    )
                  }
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs"
                  onClick={removeSelectedItems}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          )}

          {/* ===== LOADING STATE ===== */}
          {loading && (
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-0 ring-1 ring-gray-200/80 overflow-hidden"
                >
                  <Skeleton className="aspect-[3/4] w-full" />
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-3.5 w-4/5" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-9 w-full rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ===== EMPTY STATE ===== */}
          {!loading && wishlistItems.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-sm mx-auto px-4">
                <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-6">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-12 h-12 md:w-16 md:h-16 text-red-300" />
                  </div>
                  <Sparkles className="absolute top-2 right-2 w-5 h-5 text-yellow-400 animate-bounce" />
                  <Sparkles className="absolute bottom-4 left-1 w-4 h-4 text-yellow-300 animate-bounce delay-150" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
                  Start saving items you love by tapping the heart icon on any
                  product. They&apos;ll show up here for easy access.
                </p>

                <Button
                  asChild
                  size="lg"
                  className="rounded-xl shadow-md hover:shadow-lg transition-all h-12 px-8 text-base font-semibold"
                >
                  <Link href="/products">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Explore Products
                  </Link>
                </Button>

                <p className="text-[11px] text-muted-foreground mt-4">
                  <Truck className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                  Free delivery on first order
                </p>
              </div>
            </div>
          )}

          {/* ===== WISHLIST GRID ===== */}
          {!loading && wishlistItems.length > 0 && (
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {wishlistItems.map((item) => {
                const { product } = item
                const isRemoving = removingId === item.id
                const isAddingToCart = addingToCartId === item.id
                const isSelected = selectedItems.has(item.id)
                const isOutOfStock = product.stock === 0
                const isLowStock = product.stock > 0 && product.stock <= 5
                const discountPercentage = product.comparePrice
                  ? Math.round(
                      ((Number(product.comparePrice) -
                        Number(product.price)) /
                        Number(product.comparePrice)) *
                        100
                    )
                  : 0

                return (
                  <Card
                    key={item.id}
                    className={`
                      group border-0 ring-1 overflow-hidden transition-all duration-200
                      ${
                        isSelected
                          ? "ring-2 ring-black shadow-md scale-[0.98]"
                          : "ring-gray-200/80 hover:shadow-lg hover:ring-gray-300"
                      }
                      ${isRemoving ? "opacity-50 scale-95" : ""}
                      ${isOutOfStock ? "opacity-75" : ""}
                    `}
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      {selectionMode ? (
                        <button
                          className="absolute inset-0 z-10"
                          onClick={() => toggleItemSelection(item.id)}
                        >
                          <div
                            className={`
                              absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                              ${isSelected ? "bg-black border-black" : "bg-white/80 border-gray-300"}
                            `}
                          >
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      ) : (
                        <Link
                          href={`/products/${product.slug}`}
                          className="absolute inset-0 z-10"
                        />
                      )}

                      <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        fill
                        className={`
                          object-cover transition-transform duration-500
                          group-hover:scale-105
                          ${isOutOfStock ? "grayscale" : ""}
                        `}
                      />

                      {/* Overlay badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-none">
                        {discountPercentage > 0 && !isOutOfStock && (
                          <Badge className="bg-green-600 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 font-bold shadow-sm">
                            {discountPercentage}% OFF
                          </Badge>
                        )}
                        {isOutOfStock && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 font-bold"
                          >
                            Sold Out
                          </Badge>
                        )}
                        {isLowStock && (
                          <Badge className="bg-amber-500 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 font-bold shadow-sm">
                            Only {product.stock} left
                          </Badge>
                        )}
                      </div>

                      {/* Remove button */}
                      {!selectionMode && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeFromWishlist(item.id)
                          }}
                          disabled={isRemoving}
                          className={`
                            absolute top-2 right-2 z-20 w-8 h-8 md:w-9 md:h-9
                            flex items-center justify-center rounded-full
                            bg-white/90 backdrop-blur-sm shadow-sm
                            transition-all duration-200
                            md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0
                            hover:bg-red-50 hover:text-red-600
                            active:scale-90
                          `}
                        >
                          {isRemoving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          )}
                        </button>
                      )}

                      {/* Out of stock overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/10 z-[5]" />
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-2.5 md:p-3 space-y-1.5 md:space-y-2">
                      {/* Category */}
                      <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {product.category.name}
                      </span>

                      {/* Name */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block font-medium text-xs md:text-sm leading-tight line-clamp-2 hover:text-gray-600 transition-colors"
                      >
                        {product.name}
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-bold text-sm md:text-base">
                          {formatPrice(Number(product.price))}
                        </span>
                        {product.comparePrice && (
                          <span className="text-[11px] md:text-xs text-muted-foreground line-through">
                            {formatPrice(Number(product.comparePrice))}
                          </span>
                        )}
                      </div>

                      {/* Stock indicator */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock
                              ? "bg-red-500"
                              : isLowStock
                                ? "bg-amber-500 animate-pulse"
                                : "bg-green-500"
                          }`}
                        />
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          {isOutOfStock
                            ? "Out of stock"
                            : isLowStock
                              ? `Hurry! Only ${product.stock} left`
                              : "In Stock"}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => addToCart(product.id, item.id)}
                        disabled={isOutOfStock || isAddingToCart}
                        size="sm"
                        className={`
                          w-full rounded-lg text-xs md:text-sm font-semibold h-9 md:h-10
                          transition-all duration-200
                          ${
                            isOutOfStock
                              ? "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                              : "shadow-sm hover:shadow-md active:scale-[0.98]"
                          }
                        `}
                        variant={isOutOfStock ? "ghost" : "default"}
                      >
                        {isAddingToCart ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isOutOfStock ? (
                          "Notify Me"
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Bottom padding for mobile */}
          <div className="h-8 md:h-0" />
        </div>
      </main>

      <Footer />
    </>
  )
}
