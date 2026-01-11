"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { 
  TrendingUp, 
  ShoppingCart, 
  Heart,
  Calendar,
  BarChart3
} from "lucide-react"

interface ProductAnalytics {
  totalSales: number
  totalRevenue: number
  wishlistCount: number
  orderCount: number
}

interface AdminProductAnalyticsProps {
  product: {
    id: string
  }
}

export function AdminProductAnalytics({ product }: AdminProductAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    try {
      // Since we don't have analytics in the schema, we'll calculate from existing data
      const response = await fetch(`/api/admin/products/${product.id}/stats`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching product stats:', error)
    } finally {
      setLoading(false)
    }
  }, [product.id])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-muted"></div>
                  <div className="h-8 w-16 bg-muted"></div>
                  <div className="h-3 w-24 bg-muted"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statsConfig = [
    {
      title: "Total Sales",
      value: analytics?.totalSales?.toLocaleString() || "0",
      description: "Units sold",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: formatPrice(analytics?.totalRevenue || 0),
      description: "Total earnings",
      icon: TrendingUp,
    },
    {
      title: "Orders",
      value: analytics?.orderCount?.toLocaleString() || "0",
      description: "Total orders",
      icon: Calendar,
    },
    {
      title: "Wishlist",
      value: analytics?.wishlistCount?.toLocaleString() || "0",
      description: "Users saved",
      icon: Heart,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Product Stats Header */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Product Statistics
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 text-crimson-600" />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>


    </div>
  )
}
