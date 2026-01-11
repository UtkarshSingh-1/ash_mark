"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, TrendingUp, AlertCircle, Clock, Download } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export function AdminOrdersHeader() {
  const [stats, setStats] = useState<{ pending: number; processing: number; issues: number; todaysRevenue: number } | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/orders/stats')
        if (res.ok) {
          setStats(await res.json())
        }
      } catch {}
    }
    load()
  }, [])
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-crimson-600" />
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all customer orders
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-0 bg-muted/30">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pending ?? 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.processing ?? 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-red-600">{stats?.issues ?? 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats?.todaysRevenue || 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
