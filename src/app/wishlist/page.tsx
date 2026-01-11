"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function WishlistPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!session) {
            router.push('/login')
            return
        }
        fetchWishlist()
    }, [session, router])

    const fetchWishlist = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/wishlist')
            if (response.ok) {
                const data = await response.json()
                setWishlistItems(Array.isArray(data) ? data : [])
            } else {
                setWishlistItems([])
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error)
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

    const shareWishlist = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My ASHMARK Wishlist',
                text: 'Check out my wishlist on ASHMARK',
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast({
                title: "Link copied",
                description: "Wishlist link copied to clipboard",
            })
        }
    }

    if (!session) {
        return null
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
                            <p className="text-muted-foreground">
                                {loading ? 'Loading...' : `${wishlistItems.length} items saved`}
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <Button variant="outline" onClick={shareWishlist}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Wishlist
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <Skeleton className="aspect-square mb-3" />
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-6 w-1/2 mb-2" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Heart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                                <p className="text-muted-foreground mb-6 text-center max-w-sm">
                                    Save items you love to your wishlist for easy access later
                                </p>
                                <Button asChild className="bg-crimson-600 hover:bg-crimson-700">
                                    <Link href="/products">
                                        Start Shopping
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item) => {
                                const { product } = item
                                const discountPercentage = product.comparePrice
                                    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
                                    : 0

                                return (
                                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                                                <Link href={`/products/${product.slug}`}>
                                                    <Image
                                                        src={product.images[0] || '/placeholder-product.jpg'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105"
                                                    />
                                                </Link>
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    <Badge variant="outline" className="text-xs bg-background/80">
                                                        {product.category.name}
                                                    </Badge>
                                                    {discountPercentage > 0 && (
                                                        <Badge className="bg-green-600 text-xs">
                                                            {discountPercentage}% OFF
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background text-red-600"
                                                    onClick={() => removeFromWishlist(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className="font-medium text-sm hover:text-crimson-600 transition-colors line-clamp-2 block"
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
                                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                    <span className="text-muted-foreground">
                                                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                                                    </span>
                                                </div>

                                                <Button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={product.stock === 0}
                                                    className="w-full bg-crimson-600 hover:bg-crimson-700"
                                                    size="sm"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}