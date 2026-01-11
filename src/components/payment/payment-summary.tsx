import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Package, Truck, Shield } from "lucide-react"
import Image from "next/image"

interface PaymentSummaryProps {
  order?: {
    id: string
    total: number
    subtotal: number
    tax: number
    shipping: number
    items: Array<{
      quantity: number
      price: number
      product: {
        name: string
        images: string[]
      }
    }>
  } | null
}

export function PaymentSummary({ order }: PaymentSummaryProps) {
  if (!order) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No order details available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <Image
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-medium text-sm">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Pricing Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {Number(order.shipping) === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(Number(order.shipping))
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-crimson-600">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm">Free Shipping</div>
                <div className="text-xs text-muted-foreground">
                  On orders above ₹1000
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm">Secure Payment</div>
                <div className="text-xs text-muted-foreground">
                  256-bit SSL encrypted
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-muted-foreground">
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
