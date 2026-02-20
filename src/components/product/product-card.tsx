'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number | null
    images: string[]
    featured: boolean
    trending: boolean
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession()
  const { addToCart: addToCartContext } = useCart()
  const discountPercentage = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0

  const [isPending] = useTransition()
  const [adding, setAdding] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const images = product.images.length > 0 ? product.images : ['/placeholder-product.jpg']
  const hasMultipleImages = images.length > 1

  const addToCart = async () => {
    setAdding(true)
    try {
      await addToCartContext(product.id, 1)
      toast({ title: 'Added to Cart', description: `${product.name} added to your cart.` })
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to add to cart', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const addToWishlist = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    setAddingToWishlist(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to Wishlist",
          description: "Product has been added to your wishlist",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 && errorData.error === 'Item already in wishlist') {
          toast({
            title: "Already in Wishlist",
            description: "This product is already in your wishlist",
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to add to wishlist");
        }
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to add product to wishlist",
        variant: "destructive",
      });
    } finally {
      setAddingToWishlist(false);
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift">
      <div
        className="relative aspect-square overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`}>
          <Image
            src={images[currentImageIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Image Navigation Buttons */}
        {hasMultipleImages && isHovered && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  currentImageIndex === index
                    ? "bg-white w-4"
                    : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-crimson-600">Featured</Badge>
          )}
          {product.trending && (
            <Badge variant="secondary">Trending</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-green-600">{discountPercentage}% OFF</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToWishlist()
          }}
          disabled={addingToWishlist}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        >
          <Heart className={cn("h-4 w-4", addingToWishlist && "animate-pulse")} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">
          {product.category.name}
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-crimson-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(Number(product.price))}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(Number(product.comparePrice))}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-crimson-600 hover:bg-crimson-700" onClick={addToCart} disabled={adding || isPending || addingToWishlist}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {adding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}