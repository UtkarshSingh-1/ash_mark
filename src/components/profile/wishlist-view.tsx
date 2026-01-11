"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"

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

interface WishlistViewProps {
  userId: string
}

export function WishlistView({ userId }: WishlistViewProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [userId])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        // API returns wishlist items directly as an array, not wrapped in wishlistItems
        setWishlistItems(Array.isArray(data) ? data : [])
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.id !== itemId))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })
      } else {
        throw new Error('Failed to remove from wishlist')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted"></div>
                  <div className="h-6 bg-muted w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-crimson-600" />
          My Wishlist
        </CardTitle>
        <CardDescription>
          Items you&apos;ve saved for later ({wishlistItems?.length || 0} items)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crimson-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading wishlist...</p>
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Save items you love to your wishlist for easy access later
            </p>
            <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems?.map((item) => {
              const { product } = item
              const discountPercentage = product.comparePrice
                ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
                : 0

              return (
                <div key={item.id} className="group bg-muted/30 hover:bg-muted/50 transition-colors p-4">
                  <div className="relative aspect-square mb-3 overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs border-0 bg-background/80">
                        {product.category.name}
                      </Badge>
                      {discountPercentage > 0 && (
                        <Badge className="bg-green-600 text-xs border-0">
                          {discountPercentage}% OFF
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background text-red-600 border-0"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="font-medium text-sm hover:text-crimson-600 transition-colors line-clamp-2"
                    >
                      {product.name}
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatPrice(Number(product.price))}</span>
                      {product.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(Number(product.comparePrice))}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-muted-foreground">
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-crimson-600 hover:bg-crimson-700 border-0"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      <Button variant="outline" size="sm" className="border-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
