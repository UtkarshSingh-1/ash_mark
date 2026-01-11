"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Eye, Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function AddProductPreview() {
  const [previewData, setPreviewData] = useState({
    name: "Product Name",
    price: 999,
    comparePrice: 1299,
    images: ["/placeholder-product.jpg"],
    featured: false,
    trending: false,
    sizes: ["S", "M", "L"],
    colors: ["Black", "White"],
    stock: 50,
  })

  // Mock product preview - in real implementation, this would sync with the form
  const discountPercentage = previewData.comparePrice
    ? Math.round(((previewData.comparePrice - previewData.price) / previewData.comparePrice) * 100)
    : 0

  return (
    <div className="space-y-6 sticky top-8">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Product Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Product Image */}
            <div className="aspect-square bg-muted overflow-hidden">
              <Image
                src={previewData.images[0]}
                alt="Product preview"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {previewData.name}
                </h3>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 border-0">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                {previewData.featured && (
                  <Badge className="bg-crimson-600 text-xs border-0">Featured</Badge>
                )}
                {previewData.trending && (
                  <Badge variant="secondary" className="text-xs border-0">Trending</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-green-600 text-xs border-0">{discountPercentage}% OFF</Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{formatPrice(previewData.price)}</span>
                {previewData.comparePrice && (
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

              {/* Variants */}
              {previewData.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Sizes:</span>
                  <div className="flex gap-2">
                    {previewData.sizes.map((size) => (
                      <Badge key={size} variant="outline" className="border-0 bg-muted/50">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {previewData.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-2">
                    {previewData.colors.map((color) => (
                      <Badge key={color} variant="outline" className="border-0 bg-muted/50">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 ${previewData.stock > 10 ? 'bg-green-500' : previewData.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-muted-foreground">
                  {previewData.stock > 10 ? 'In Stock' : previewData.stock > 0 ? `${previewData.stock} left` : 'Out of Stock'}
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

      {/* Preview Note */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Preview Notes:</p>
            <ul className="space-y-1 text-xs">
              <li>• This is how your product will appear to customers</li>
              <li>• Images and details will update as you fill the form</li>
              <li>• Product will be live after creation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
