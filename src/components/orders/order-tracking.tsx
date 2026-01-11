import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Package, Truck, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface OrderTrackingProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    createdAt: string
  }
}

export function OrderTracking({ order }: OrderTrackingProps) {
  // Mock tracking data - in real app, fetch from logistics API
  const trackingSteps = [
    {
      status: 'CONFIRMED',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      timestamp: order.createdAt,
      completed: true,
      icon: CheckCircle,
    },
    {
      status: 'PROCESSING',
      title: 'Processing',
      description: 'Your order is being packed and prepared for shipment',
      timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 day
      completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status),
      icon: Package,
    },
    {
      status: 'SHIPPED',
      title: 'Shipped',
      description: 'Your order has been shipped and is on its way',
      timestamp: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // +2 days
      completed: ['SHIPPED', 'DELIVERED'].includes(order.status),
      icon: Truck,
    },
    {
      status: 'DELIVERED',
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(), // +5 days
      completed: order.status === 'DELIVERED',
      icon: MapPin,
    },
  ]

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Order Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon
            const isCurrentStep = step.status === order.status
            const isCompleted = step.completed

            return (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 ${isCompleted ? 'bg-green-600' : isCurrentStep ? 'bg-yellow-600' : 'bg-muted'} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${isCompleted ? 'bg-green-600' : 'bg-muted'}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    {isCurrentStep && (
                      <Badge className="bg-yellow-600 text-xs border-0">Current</Badge>
                    )}
                    {isCompleted && !isCurrentStep && (
                      <Badge className="bg-green-600 text-xs border-0">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {isCompleted && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(step.timestamp))}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Tracking Info */}
        {order.status === 'SHIPPED' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400">
            <div className="flex items-start gap-2">
              <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Package in Transit
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your package is on its way! Track it with tracking ID: ASH{order.id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {order.paymentStatus === 'FAILED' && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
            <div className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Payment Failed
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Your payment could not be processed. Please retry payment or contact support.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
