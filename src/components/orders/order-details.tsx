import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, MapPin, User } from "lucide-react"
import Image from "next/image"
import { Decimal } from "@prisma/client/runtime/library"

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "RETURN_REQUESTED";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

interface OrderDetailsProps {
  order: {
    id: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: Decimal;       
    subtotal: Decimal;    
    tax: Decimal;         
    shipping: Decimal;    
    createdAt: Date | string; 
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    items: Array<{
      id: string;
      quantity: number;
      price: Decimal; // ← number (from Decimal -> number)
      size?: string;
      color?: string;
      product: {
        id: string;
        name: string;
        images: string[];
        slug: string;
        category: {
          name: string;
        };
      };
    }>;
    shippingAddress: {
      name: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    } | null;
    user: {
      name: string | null;
      email: string;
    };
  };
}


export function OrderDetails({ order }: OrderDetailsProps) {
  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'FAILED') return 'bg-red-600'
    if (status === 'DELIVERED') return 'bg-green-600'
    if (status === 'SHIPPED') return 'bg-blue-600'
    if (status === 'PROCESSING') return 'bg-yellow-600'
    return 'bg-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
              <p className="text-muted-foreground mt-1">
                Placed on {formatDate(new Date(order.createdAt))}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-2">{formatPrice(Number(order.total.toString()))}</div>
              <Badge className={`border-0 ${getStatusColor(order.status, order.paymentStatus)}`}>
                {order.paymentStatus === 'FAILED' ? 'Payment Failed' : order.status}
              </Badge>
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
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(Number(item.price.toString()) * item.quantity)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(Number(item.price.toString()))} each
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
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {order.user.name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {order.user.email}
            </div>
            {order.razorpayPaymentId && (
              <div>
                <span className="font-medium">Payment ID:</span> {order.razorpayPaymentId}
              </div>
            )}
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
                <div className="font-medium">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country}</div>
                <div className="pt-2">Phone: {order.shippingAddress.phone}</div>
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
