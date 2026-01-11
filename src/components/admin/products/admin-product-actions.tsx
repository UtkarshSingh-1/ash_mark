"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Edit, 
  Eye, 
  Trash2, 
  Star, 
  TrendingUp, 
  AlertTriangle,
  Copy,
  Download,
  BarChart3
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface AdminProductActionsProps {
  product: {
    id: string
    slug: string
    featured: boolean
    trending: boolean
    stock: number
  }
}

export function AdminProductActions({ product }: AdminProductActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [featured, setFeatured] = useState(product.featured)
  const [trending, setTrending] = useState(product.trending)

  const toggleFeatured = async (value: boolean) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: value }),
      })

      if (response.ok) {
        setFeatured(value)
        toast({
          title: "Success",
          description: `Product ${value ? 'marked as featured' : 'removed from featured'}`,
        })
      } else {
        throw new Error('Failed to update featured status')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTrending = async (value: boolean) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/trending`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trending: value }),
      })

      if (response.ok) {
        setTrending(value)
        toast({
          title: "Success",
          description: `Product ${value ? 'marked as trending' : 'removed from trending'}`,
        })
      } else {
        throw new Error('Failed to update trending status')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update trending status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const duplicateProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}/duplicate`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: "Product duplicated successfully",
        })
        router.push(`/admin/products/${result.productId}/edit`)
      } else {
        throw new Error('Failed to duplicate product')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  const deleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        router.push('/admin/products')
      } else {
        throw new Error('Failed to delete product')
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6 sticky top-8">
      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full bg-crimson-600 hover:bg-crimson-700 border-0">
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full border-0 bg-muted/30">
            <Link href={`/products/${product.slug}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Live Product
            </Link>
          </Button>

          <Button 
            variant="outline" 
            onClick={duplicateProduct}
            disabled={loading}
            className="w-full border-0 bg-muted/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate Product
          </Button>

          <Button 
            variant="outline"
            className="w-full border-0 bg-muted/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </CardContent>
      </Card>
    
      {/* Product Flags */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Product Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={toggleFeatured}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <Label htmlFor="trending">Trending Product</Label>
            </div>
            <Switch
              id="trending"
              checked={trending}
              onCheckedChange={toggleTrending}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Stats */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Stock:</span>
              <span className="font-semibold">{product.stock} units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Sales:</span>
              <span className="font-semibold">156 units</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue:</span>
              <span className="font-semibold">₹1,24,800</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Rating:</span>
              <span className="font-semibold">4.8 ★</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-md border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">

          <Button 
            variant="destructive"
            onClick={deleteProduct}
            disabled={loading}
            className="w-full border-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Product
          </Button>
        </CardContent>
      </Card>

      {/* Low Stock Warning */}
      {product.stock <= 5 && (
        <Card className="border-0 shadow-md border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-600">Low Stock Warning</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Only {product.stock} units remaining. Consider restocking soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
