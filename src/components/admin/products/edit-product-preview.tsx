"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Eye, Heart, ShoppingCart, Star, TrendingUp, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  comparePrice: number | null
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  trending: boolean
  category: {
    name: string
  }
}

interface EditProductPreviewProps {
  product: Product
}

export function EditProductPreview({ product }: EditProductPreviewProps) {
  const [previewData, setPreviewData] = useState({
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    images: product.images,
    featured: product.featured,
    trending: product.trending,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    category: product.category.name,
  })

  // In a real implementation, this would listen to form changes
  useEffect(() => {
    setPreviewData({
      name: product.name,
      description: product.description || "",
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      images: product.images,
      featured: product.featured,
      trending: product.trending,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      category: product.category.name,
    })
  }, [product])

  const discountPercentage = previewData.comparePrice && previewData.comparePrice > previewData.price
    ? Math.round(((previewData.comparePrice - previewData.price) / previewData.comparePrice) * 100)
    : 0

  // status removed (not in schema)

  return (
    <div className="space-y-6 sticky top-8">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Product Image */}
            <div className="aspect-square bg-muted overflow-hidden relative">
              <Image
                src={previewData.images[0] || '/placeholder-product.jpg'}
                alt="Product preview"
                fill
                className="object-cover"
              />
              
              {/* Status overlay removed */}
            </div>

            {/* Image Gallery Indicator */}
            {previewData.images.length > 1 && (
              <div className="flex gap-1 justify-center">
                {previewData.images.slice(0, 5).map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 ${index === 0 ? 'bg-crimson-600' : 'bg-muted'}`}
                  ></div>
                ))}
                {previewData.images.length > 5 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{previewData.images.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {previewData.name || 'Product Name'}
                </h3>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 border-0">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Category */}
              <div className="text-sm text-muted-foreground">
                {previewData.category}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {previewData.featured && (
                  <Badge className="bg-crimson-600 text-xs border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {previewData.trending && (
                  <Badge variant="secondary" className="text-xs border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-green-600 text-xs border-0">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  {formatPrice(previewData.price)}
                </span>
                {previewData.comparePrice && previewData.comparePrice > previewData.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(previewData.comparePrice)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
              </div>

              {/* Description */}
              {previewData.description && (
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {previewData.description}
                </div>
              )}

              {/* Variants */}
              {previewData.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Sizes:</span>
                  <div className="flex gap-2 flex-wrap">
                    {previewData.sizes.slice(0, 4).map((size) => (
                      <Badge key={size} variant="outline" className="border-0 bg-muted/50 text-xs">
                        {size}
                      </Badge>
                    ))}
                    {previewData.sizes.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{previewData.sizes.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {previewData.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-2 flex-wrap">
                    {previewData.colors.slice(0, 4).map((color) => (
                      <Badge key={color} variant="outline" className="border-0 bg-muted/50 text-xs">
                        {color}
                      </Badge>
                    ))}
                    {previewData.colors.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{previewData.colors.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 ${
                  previewData.stock > 10 ? 'bg-green-500' : 
                  previewData.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-muted-foreground">
                  {previewData.stock > 10 ? 'In Stock' : 
                   previewData.stock > 0 ? `${previewData.stock} left` : 'Out of Stock'
                  }
                </span>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-crimson-600 hover:bg-crimson-700 border-0"
                disabled={previewData.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {previewData.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Meta */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-sm">Preview Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Images:</span>
            <span>{previewData.images.length} uploaded</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Variants:</span>
            <span>{previewData.sizes.length + previewData.colors.length} total</span>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Preview Notes:</strong></p>
            <ul className="space-y-1 ml-2">
              <li>• Changes update in real-time</li>
              <li>• First image becomes main image</li>
              <li>• Stock level affects availability</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {(previewData.stock <= 5 || previewData.images.length === 0) && (
        <Card className="border-0 shadow-md border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-600">Warnings</h4>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {previewData.stock <= 5 && (
                    <p>• Low stock warning ({previewData.stock} left)</p>
                  )}
                  {previewData.images.length === 0 && (
                    <p>• No product images uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
