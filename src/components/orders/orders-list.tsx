"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle 
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    size?: string
    color?: string
    product: {
      id: string
      name: string
      images: string[]
      slug: string
    }
  }>
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
  } | null
}

interface OrdersListProps {
  userId: string
  searchParams: {
    status?: string
    search?: string
    page?: string
  }
}

export function OrdersList({ userId, searchParams }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.status || "all")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || "1"))
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [userId, statusFilter, searchQuery, currentPage])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalPages(data.pagination.pages)
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

  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice-${orderId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted"></div>
                  <div className="h-4 w-24 bg-muted"></div>
                </div>
                <div className="h-6 w-20 bg-muted"></div>
              </div>
              <div className="h-20 bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or product..."
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "You haven't placed any orders yet"
              }
            </p>
            <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status, order.paymentStatus)}
                    <div>
                      <h3 className="font-semibold text-lg">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(new Date(order.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatPrice(Number(order.total))}</div>
                      <Badge className={`text-xs border-0 ${getStatusColor(order.status, order.paymentStatus)}`}>
                        {order.paymentStatus === 'FAILED' ? 'Payment Failed' : order.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="border-0">
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadInvoice(order.id)}
                        className="border-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-muted/30 p-2 min-w-fit">
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
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center bg-muted/30 p-2 min-w-16">
                        <span className="text-sm text-muted-foreground">
                          +{order.items.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium">Shipping to:</span> {order.shippingAddress ? `${order.shippingAddress.name}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}` : 'No address provided'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {currentPage > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border-0"
            >
              Previous
            </Button>
          )}
          
          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage < totalPages && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border-0"
            >
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
