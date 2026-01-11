"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice, formatDate } from "@/lib/utils"
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Filter,
  Eye,
  Download
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  items: Array<{
    quantity: number
    product: {
      name: string
      images: string[]
      slug: string
    }
  }>
}

interface OrderHistoryProps {
  userId: string
}

export function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [userId])

  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'FAILED') return <XCircle className="h-4 w-4 text-red-500" />
    if (status === 'DELIVERED') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 'SHIPPED') return <Truck className="h-4 w-4 text-blue-500" />
    if (status === 'PROCESSING') return <Package className="h-4 w-4 text-yellow-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'FAILED') return 'bg-red-600'
    if (status === 'DELIVERED') return 'bg-green-600'
    if (status === 'SHIPPED') return 'bg-blue-600'
    if (status === 'PROCESSING') return 'bg-yellow-600'
    return 'bg-gray-600'
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted-foreground/20"></div>
                    <div className="h-3 w-24 bg-muted-foreground/20"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted-foreground/20"></div>
                </div>
                <div className="h-16 bg-muted-foreground/20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order History
        </CardTitle>
        <CardDescription>
          Track and manage your past orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-0"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-0">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="border-0">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Start shopping to see your orders here"
                }
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
                  <Link href="/products">
                    Start Shopping
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status, order.paymentStatus)}
                    <div>
                      <h4 className="font-semibold">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(new Date(order.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(Number(order.total))}</div>
                      <Badge className={`text-xs border-0 ${getStatusColor(order.status, order.paymentStatus)}`}>
                        {order.paymentStatus === 'FAILED' ? 'Payment Failed' : order.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="border-0">
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="border-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex gap-2 overflow-x-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-background p-2 min-w-fit">
                      <Image
                        src={item.product.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
