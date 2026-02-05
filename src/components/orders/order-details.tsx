import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, MapPin, User, Truck, RotateCcw, Repeat2, XCircle } from "lucide-react"
import Image from "next/image"
import { Decimal } from "@prisma/client/runtime/library"

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED";

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

    // Tracking Info
    courierName?: string | null;
    trackingId?: string | null;
    trackingUrl?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    cancelledAt?: string | null;

    // Return / Exchange
    returnStatus?: string | null;
    exchangeStatus?: string | null;

    items: Array<{
      id: string;
      quantity: number;
      price: Decimal;
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
  const formatNum = (v: any) => Number(v?.toString?.() || v || 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-600";
      case "COMPLETED": return "bg-orange-600";
      case "SHIPPED": return "bg-purple-600";
      case "PROCESSING": return "bg-yellow-600";
      case "CONFIRMED": return "bg-blue-600";
      case "CANCELLED": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order #{order.id.slice(-8).toUpperCase()}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Placed on {formatDate(new Date(order.createdAt))}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-2">{formatPrice(formatNum(order.total))}</div>
              <Badge className={`border-0 ${getStatusColor(order.status)}`}>
                {order.paymentStatus === "FAILED" ? "Payment Failed" : order.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* TRACKING */}
      {(order.trackingId || order.courierName || order.deliveredAt || order.cancelledAt) && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Shipping & Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">

            {order.courierName && <div><strong>Courier:</strong> {order.courierName}</div>}
            {order.trackingId && <div><strong>Tracking ID:</strong> {order.trackingId}</div>}
            {order.trackingUrl && (
              <div>
                <strong>Track:</strong> 
                <a href={order.trackingUrl} target="_blank" className="text-blue-600 underline ml-1">
                  View Package
                </a>
              </div>
            )}
            {order.shippedAt && <div><strong>Shipped:</strong> {formatDate(new Date(order.shippedAt))}</div>}
            {order.deliveredAt && <div><strong>Delivered:</strong> {formatDate(new Date(order.deliveredAt))}</div>}

            {order.cancelledAt && (
              <div className="text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Cancelled at {formatDate(new Date(order.cancelledAt))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RETURN / EXCHANGE */}
      {(order.returnStatus || order.exchangeStatus) && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Return / Exchange</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">

            {order.returnStatus && (
              <div className="flex items-center gap-2 text-orange-600">
                <RotateCcw className="w-4 h-4" /> Return: {order.returnStatus}
              </div>
            )}

            {order.exchangeStatus && (
              <div className="flex items-center gap-2 text-blue-600">
                <Repeat2 className="w-4 h-4" /> Exchange: {order.exchangeStatus}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ITEMS */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle><Package className="w-5 h-5 inline mr-2" /> Order Items ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-md mb-3">
              <Image
                src={item.product.images[0] || "/placeholder-product.jpg"}
                alt={item.product.name}
                width={80} height={80}
                className="object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.product.category.name}
                </p>
                <p className="text-sm mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right font-semibold">
                {formatPrice(formatNum(item.price) * item.quantity)}
              </div>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span> <span>{formatPrice(formatNum(order.subtotal))}</span></div>
            <div className="flex justify-between"><span>Shipping</span> <span>{formatNum(order.shipping) === 0 ? "Free" : formatPrice(formatNum(order.shipping))}</span></div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span> <span>{formatPrice(formatNum(order.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CUSTOMER / SHIPPING */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle><User className="w-5 h-5 inline mr-2" /> Customer Info</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><strong>Name:</strong> {order.user.name || "N/A"}</div>
            <div><strong>Email:</strong> {order.user.email}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle><MapPin className="w-5 h-5 inline mr-2" /> Shipping Address</CardTitle></CardHeader>
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
              <p className="text-muted-foreground">No shipping address available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
