import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, MapPin, User, Clock, Truck } from "lucide-react"
import Image from "next/image"

interface AdminOrderDetailsProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    total: number
    subtotal: number
    tax: number
    shipping: number
    createdAt: string
    updatedAt: string
    razorpayOrderId?: string | null
    razorpayPaymentId?: string | null
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

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="w-6 h-6" />
                Order #{order.id.slice(-8).toUpperCase()}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Placed: {formatDate(new Date(order.createdAt))}
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Updated: {formatDate(new Date(order.updatedAt))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-2">{formatPrice(Number(order.total))}</div>
              <div className="flex gap-2">
                <Badge className={`border-0 ${getStatusColor(order.status, order.paymentStatus)}`}>
                  {order.status}
                </Badge>
                <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="border-0">
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Items */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items ({order.items.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-muted/30">
                <Image
                  src={item.product.images[0] || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Category: {item.product.category.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Quantity: {item.quantity}</span>
                    {item.size && <Badge variant="outline" className="border-0 bg-background">Size: {item.size}</Badge>}
                    {item.color && <Badge variant="outline" className="border-0 bg-background">Color: {item.color}</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Product ID: {item.product.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(Number(item.price))} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{Number(order.shipping) === 0 ? 'Free' : formatPrice(Number(order.shipping))}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer & Shipping Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src={order.user.image || '/default-avatar.png'}
                alt={order.user.name || 'Customer'}
                width={40}
                height={40}
                className="object-cover"
              />
              <div>
                <div className="font-medium">{order.user.name || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">{order.user.email}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Customer ID:</span> {order.user.id}
              </div>
              {order.razorpayPaymentId && (
                <div>
                  <span className="font-medium">Payment ID:</span> {order.razorpayPaymentId}
                </div>
              )}
              {order.razorpayOrderId && (
                <div>
                  <span className="font-medium">Razorpay Order ID:</span> {order.razorpayOrderId}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shippingAddress ? (
              <div className="space-y-1 text-sm">
                <div className="font-medium text-base">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country}</div>
                <Separator className="my-2" />
                <div><span className="font-medium">Phone:</span> {order.shippingAddress.phone}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No shipping address provided
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
