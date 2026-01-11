import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { 
  Package, 
  Tag, 
  Palette, 
  Image as ImageIcon, 
  BarChart3
} from "lucide-react"
import Image from "next/image"

interface AdminProductDetailsProps {
  product: {
    id: string
    name: string
    description: string | null
    price: number
    comparePrice: number | null
    images: string[]
    sizes: string[]
    colors: string[]
    stock: number
    sku: string | null
    weight: number | null
    dimensions: string | null
    tags: string[]
    createdAt: string
    updatedAt: string
    category: {
      name: string
    }
  }
}

export function AdminProductDetails({ product }: AdminProductDetailsProps) {
  const dimensions = product.dimensions ? JSON.parse(product.dimensions) : null

  return (
    <div className="space-y-6">
      {/* Product Information */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product Name</label>
              <div className="font-semibold">{product.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">SKU</label>
              <div className="font-mono text-sm">{product.sku || 'N/A'}</div>
            </div>
          </div>

          {product.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <div className="mt-1 text-sm leading-relaxed">{product.description}</div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <div className="font-semibold">{product.category.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="text-sm">{formatDate(new Date(product.createdAt))}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <div className="text-sm">{formatDate(new Date(product.updatedAt))}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Price</label>
              <div className="text-2xl font-bold">{formatPrice(Number(product.price))}</div>
            </div>
            {product.comparePrice && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Compare Price</label>
                <div className="text-xl text-muted-foreground line-through">
                  {formatPrice(Number(product.comparePrice))}
                </div>
                <div className="text-sm text-green-600">
                  {Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)}% discount
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Product Images ({product.images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-muted overflow-hidden group">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-crimson-600 text-xs border-0">
                    Main
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variants & Inventory */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Variants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.sizes.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Available Sizes</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline" className="border-0 bg-muted/50">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Available Colors</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline" className="border-0 bg-muted/50">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Inventory & Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Stock Quantity</label>
              <div className="text-xl font-semibold flex items-center gap-2">
                <div className={`w-3 h-3 ${
                  product.stock > 10 ? 'bg-green-500' : 
                  product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                {product.stock} units
              </div>
            </div>

            {product.weight && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Weight</label>
                <div className="font-semibold">{product.weight} kg</div>
              </div>
            )}

            {dimensions && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dimensions (L × W × H)</label>
                <div className="font-semibold">
                  {dimensions.length} × {dimensions.width} × {dimensions.height} cm
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
