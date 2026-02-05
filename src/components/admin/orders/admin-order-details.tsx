import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, MapPin, User, Clock, Truck, RefreshCcw, RotateCcw, XCircle } from "lucide-react"
import Image from "next/image"

interface AdminOrderDetailsProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    refundMethod?: string | null
    refundStatus?: string | null
    refundAmount?: number | null
    total: number
    subtotal: number
    tax: number
    shipping: number
    discount?: number | null
    promoCode?: string | null

    createdAt: string
    updatedAt: string
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null

    shippedAt?: string | null
    deliveredAt?: string | null
    cancelledAt?: string | null

    trackingId?: string | null
    courierName?: string | null
    trackingUrl?: string | null

    returnStatus?: string
    exchangeStatus?: string

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
        category: {
          name: string
        }
      }
    }>

    shippingAddress: {
      name: string
      phone: string
      street: string
      city: string
      state: string
      pincode: string
      country: string
    } | null

    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }
}

export function AdminOrderDetails({ order }: AdminOrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-600"
      case "SHIPPED": return "bg-purple-600"
      case "PROCESSING": return "bg-yellow-600"
      case "CONFIRMED": return "bg-blue-600"
      case "PENDING": return "bg-gray-600"
      case "CANCELLED": return "bg-red-600"
      case "COMPLETED": return "bg-orange-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">

      {/* ORDER HEADER */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="w-6 h-6" />
                Order #{order.id.slice(-8).toUpperCase()}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Placed: {formatDate(new Date(order.createdAt))}
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Updated: {formatDate(new Date(order.updatedAt))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold mb-2">{formatPrice(Number(order.total))}</div>
              <div className="flex gap-2 justify-end">
                <Badge className={`border-0 ${getStatusColor(order.status)}`}>{order.status}</Badge>
                <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"} className="border-0">
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* TRACKING & LOGISTICS */}
      {(order.trackingId || order.courierName || order.deliveredAt || order.cancelledAt) && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Shipping & Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">

            {order.courierName && (
              <div><strong>Courier:</strong> {order.courierName}</div>
            )}

            {order.trackingId && (
              <div><strong>Tracking ID:</strong> {order.trackingId}</div>
            )}

            {order.trackingUrl && (
              <div>
                <strong>Tracking URL:</strong>
                <a href={order.trackingUrl} target="_blank" className="text-blue-600 underline ml-1">
                  Track Package
                </a>
              </div>
            )}

            {order.shippedAt && (
              <div><strong>Shipped At:</strong> {formatDate(new Date(order.shippedAt))}</div>
            )}

            {order.deliveredAt && (
              <div><strong>Delivered At:</strong> {formatDate(new Date(order.deliveredAt))}</div>
            )}

            {order.cancelledAt && (
              <div className="text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                <span><strong>Cancelled At:</strong> {formatDate(new Date(order.cancelledAt))}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RETURN / EXCHANGE */}
      {(order.returnStatus !== "NONE" || order.exchangeStatus !== "NONE") && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Return / Exchange</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">

            {order.returnStatus !== "NONE" && (
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> <strong>Return:</strong> {order.returnStatus}
              </div>
            )}

            {order.exchangeStatus !== "NONE" && (
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> <strong>Exchange:</strong> {order.exchangeStatus}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ORDER ITEMS */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Order Items ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-md">
              <Image
                src={item.product.images[0] || "/placeholder-product.jpg"}
                alt={item.product.name}
                width={80}
                height={80}
                className="object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Category: {item.product.category.name}
                </p>
                <p className="text-sm mt-1">Qty: {item.quantity}</p>
                <p className="text-sm">{formatPrice(Number(item.price))} each</p>
              </div>
              <div className="text-right font-semibold">
                {formatPrice(Number(item.price) * item.quantity)}
              </div>
            </div>
          ))}

          <Separator />

          {/* SUMMARY */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span> <span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span> <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
            {order.discount && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span> <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span> <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CUSTOMER & SHIPPING */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CUSTOMER */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div><strong>Name:</strong> {order.user.name ?? "N/A"}</div>
            <div><strong>Email:</strong> {order.user.email}</div>
            {order.razorpayPaymentId && (
              <div><strong>Payment ID:</strong> {order.razorpayPaymentId}</div>
            )}
            {order.refundMethod && (
              <div><strong>Refund Method:</strong> {order.refundMethod}</div>
            )}
            {order.refundStatus && (
              <div><strong>Refund Status:</strong> {order.refundStatus}</div>
            )}
            {order.refundAmount != null && (
              <div>
                <strong>
                  {order.refundMethod === "WALLET" ? "Wallet Credit" : "Refund Amount"}:
                </strong>{" "}
                {formatPrice(order.refundAmount)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SHIPPING ADDRESS */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {order.shippingAddress ? (
              <>
                <div>{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country}</div>
                <div><strong>Phone:</strong> {order.shippingAddress.phone}</div>
              </>
            ) : (
              <div className="text-muted-foreground">No shipping address found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
