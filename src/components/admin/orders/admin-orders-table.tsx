"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice, formatDate } from "@/lib/utils"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Truck, 
  CheckCircle, 
  X,
  Download,
  RefreshCw,
  Calendar
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface AdminOrder {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  items: Array<{
    quantity: number
    product: {
      name: string
      images: string[]
    }
  }>
  shippingAddress: {
    city: string
    state: string
    pincode: string
  } | null
}

interface AdminOrdersTableProps {
  searchParams: {
    status?: string
    search?: string
    page?: string
    sort?: string
    dateRange?: string
    paymentStatus?: string
  }
}

export function AdminOrdersTable({ searchParams }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.status || "all")
  const [paymentFilter, setPaymentFilter] = useState(searchParams.paymentStatus || "all")
  const [sortBy, setSortBy] = useState(searchParams.sort || "createdAt")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || "1"))
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, paymentFilter, searchQuery, sortBy, currentPage])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        sort: sortBy,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ))
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'FAILED') return <X className="h-4 w-4 text-red-500" />
    if (status === 'DELIVERED') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 'SHIPPED') return <Truck className="h-4 w-4 text-blue-500" />
    return <RefreshCw className="h-4 w-4 text-yellow-500" />
  }

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'FAILED') return 'bg-red-600'
    if (status === 'DELIVERED') return 'bg-green-600'
    if (status === 'SHIPPED') return 'bg-purple-600'
    if (status === 'PROCESSING') return 'bg-yellow-600'
    if (status === 'CONFIRMED') return 'bg-blue-600'
    if (status === 'CANCELLED') return 'bg-red-600'
    if (status === 'RETURNED') return 'bg-orange-600'
    return 'bg-gray-600'
  }

  const exportOrders = async () => {
    try {
      const params = new URLSearchParams({
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(paymentFilter !== "all" && { paymentStatus: paymentFilter }),
        ...(searchQuery && { search: searchQuery }),
        export: 'csv'
      })

      const response = await fetch(`/api/admin/orders/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `orders-${new Date().toISOString().split('T')}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Success",
          description: "Orders exported successfully",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to export orders",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 mb-6">
              <div className="h-10 bg-muted flex-1 animate-pulse"></div>
              <div className="h-10 bg-muted w-48 animate-pulse"></div>
              <div className="h-10 bg-muted w-32 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Orders Management ({orders.length} orders)
          </CardTitle>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportOrders}
              className="border-0 bg-muted/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={fetchOrders}
              variant="outline"
              className="border-0 bg-muted/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-0"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-0">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent className="border-0">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="RETURNED">Returned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-48 border-0">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent className="border-0">
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 border-0">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="border-0">
              <SelectItem value="createdAt">Date (Newest)</SelectItem>
              <SelectItem value="total">Amount (Highest)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="user.name">Customer Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden border-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="border-b border-border hover:bg-muted/30">
                    
                    <TableCell>
                      <div>
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="font-medium hover:text-crimson-600 transition-colors"
                        >
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {order.shippingAddress ? (
                            `${order.shippingAddress.city}, ${order.shippingAddress.state}`
                          ) : (
                            'No address'
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={order.user.image || '/default-avatar.png'}
                          alt={order.user.name || 'Customer'}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                        <div>
                          <div className="font-medium">{order.user.name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{order.user.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <Image
                            key={index}
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold">{formatPrice(Number(order.total))}</div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status, order.paymentStatus)}
                        <Badge className={`text-xs border-0 ${getStatusColor(order.status, order.paymentStatus)}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                        className="text-xs border-0"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(new Date(order.createdAt))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 border-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-0">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                            disabled={!['PENDING', 'CONFIRMED'].includes(order.status)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                            disabled={order.status !== 'PROCESSING'}
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                            disabled={order.status !== 'SHIPPED'}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
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

      </CardContent>
    </Card>
  )
}
