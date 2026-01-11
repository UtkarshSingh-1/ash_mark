"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ExternalLink, TrendingUp, Package, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TopProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  salesCount: number
  revenue: number
  category: {
    name: string
  }
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('/api/admin/analytics/top-products?limit=5')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching top products:', error)
      // Mock data for demo
      setProducts([
        {
          id: '1',
          name: 'Classic Black T-Shirt',
          slug: 'classic-black-tshirt',
          price: 999,
          images: ['/placeholder-product.jpg'],
          salesCount: 124,
          revenue: 123876,
          category: { name: 'T-Shirts' }
        },
        {
          id: '2',
          name: 'Crimson Red Premium Tee',
          slug: 'crimson-red-premium-tee',
          price: 1299,
          images: ['/placeholder-product.jpg'],
          salesCount: 98,
          revenue: 127302,
          category: { name: 'Premium' }
        },
        {
          id: '3',
          name: 'Vintage Grey Cotton Shirt',
          slug: 'vintage-grey-cotton-shirt',
          price: 1499,
          images: ['/placeholder-product.jpg'],
          salesCount: 76,
          revenue: 113924,
          category: { name: 'Vintage' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted animate-pulse">
                <div className="w-12 h-12 bg-muted-foreground/20"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted-foreground/20"></div>
                  <div className="h-3 w-24 bg-muted-foreground/20"></div>
                </div>
                <div className="h-6 w-16 bg-muted-foreground/20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-crimson-600" />
            Top Products
          </CardTitle>
          <CardDescription>Best performing products by sales</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="border-0">
          <Link href="/admin/products">
            View All
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              No product data available
            </div>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute -top-1 -left-1 w-5 h-5 bg-crimson-600 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/products/${product.slug}`}
                    className="font-medium text-sm hover:text-crimson-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{product.category.name}</span>
                    <span>•</span>
                    <span>{formatPrice(Number(product.price))}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {product.salesCount} sold
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Star className="h-3 w-3" />
                      {formatPrice(product.revenue)} revenue
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    {formatPrice(product.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.salesCount} units
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
