"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Package, 
  Star,
  TrendingUp,
  Copy,
  ExternalLink
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface AdminProductHeaderProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice: number | null
    images: string[]
    featured: boolean
    trending: boolean
    stock: number
    createdAt: string | Date
    category: {
      name: string
    }
  }
}

export function AdminProductHeader({ product }: AdminProductHeaderProps) {
  const [copying, setCopying] = useState(false)

  const copyProductUrl = async () => {
    setCopying(true)
    try {
      const url = `${window.location.origin}/products/${product.slug}`
      await navigator.clipboard.writeText(url)
      toast({
        title: "Success",
        description: "Product URL copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      })
    } finally {
      setCopying(false)
    }
  }

  // status removed (not in schema)

  const discountPercentage = product.comparePrice
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0

  return (
    <Card className="border-0 shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild className="border-0 bg-muted/30">
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6 text-crimson-600" />
              {product.name}
            </h1>
            <p className="text-muted-foreground">
              Product ID: {product.id} • Created {formatDate(new Date(product.createdAt))}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild className="border-0 bg-muted/30">
              <Link href={`/products/${product.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Live
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="border-0 bg-muted/30">
              <Link href={`/admin/products/${product.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-0 bg-muted/30">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-0">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyProductUrl} disabled={copying}>
                  <Copy className="mr-2 h-4 w-4" />
                  {copying ? "Copying..." : "Copy Product URL"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Package className="mr-2 h-4 w-4" />
                  Duplicate Product
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Package className="mr-2 h-4 w-4" />
                  Archive Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Product Image */}
          <div className="aspect-square bg-muted overflow-hidden">
            <Image
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-0 bg-muted/50">
                  {product.category.name}
                </Badge>
                {product.featured && (
                  <Badge className="bg-crimson-600 border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.trending && (
                  <Badge variant="secondary" className="border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{formatPrice(Number(product.price))}</span>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(Number(product.comparePrice))}
                    </span>
                    <Badge className="bg-green-600 text-xs border-0">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Stock:</span>
                <div className="font-semibold flex items-center gap-2">
                  <div className={`w-2 h-2 ${
                    product.stock > 10 ? 'bg-green-500' : 
                    product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  {product.stock > 10 ? 'In Stock' : 
                   product.stock > 0 ? `${product.stock} left` : 'Out of Stock'
                  } ({product.stock} units)
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Category:</span>
                <div className="font-semibold">{product.category.name}</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="bg-muted/30 p-3 text-center">
                <div className="text-xl font-bold text-crimson-600">156</div>
                <div className="text-xs text-muted-foreground">Total Sales</div>
              </div>
              <div className="bg-muted/30 p-3 text-center">
                <div className="text-xl font-bold text-blue-600">4.8</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="bg-muted/30 p-3 text-center">
                <div className="text-xl font-bold text-green-600">89</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
