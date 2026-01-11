import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Package, Truck, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface AdminOrderTimelineProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    createdAt: string
    updatedAt: string
  }
}

export function AdminOrderTimeline({ order }: AdminOrderTimelineProps) {
  // In real app, fetch actual timeline events from database
  const timelineEvents = [
    {
      status: 'PENDING',
      title: 'Order Placed',
      description: 'Customer placed the order and payment is being processed',
      timestamp: order.createdAt,
      completed: true,
      icon: CheckCircle,
    },
    {
      status: 'CONFIRMED',
      title: 'Order Confirmed',
      description: 'Payment confirmed and order is ready for processing',
      timestamp: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // +30 min
      completed: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status),
      icon: CheckCircle,
    },
    {
      status: 'PROCESSING',
      title: 'Processing',
      description: 'Order is being packed and prepared for shipment',
      timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 day
      completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status),
      icon: Package,
    },
    {
      status: 'SHIPPED',
      title: 'Shipped',
      description: 'Order has been shipped and is on its way to customer',
      timestamp: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // +2 days
      completed: ['SHIPPED', 'DELIVERED'].includes(order.status),
      icon: Truck,
    },
    {
      status: 'DELIVERED',
      title: 'Delivered',
      description: 'Order has been successfully delivered to customer',
      timestamp: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(), // +5 days
      completed: order.status === 'DELIVERED',
      icon: MapPin,
    },
  ]

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon
            const isCurrentStep = event.status === order.status
            const isCompleted = event.completed

            return (
              <div key={event.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-3 ${
                    isCompleted 
                      ? 'bg-green-600' 
                      : isCurrentStep 
                        ? 'bg-yellow-600' 
                        : 'bg-muted'
                  } text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-muted'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    {isCurrentStep && (
                      <Badge className="bg-yellow-600 text-xs border-0">Current</Badge>
                    )}
                    {isCompleted && !isCurrentStep && (
                      <Badge className="bg-green-600 text-xs border-0">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  {(isCompleted || isCurrentStep) && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(event.timestamp))} at{' '}
                      {new Date(event.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Timeline Info */}
        <div className="mt-6 p-4 bg-muted/30">
          <h4 className="font-semibold mb-2">Timeline Information</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Order Created: {formatDate(new Date(order.createdAt))}</div>
            <div>Last Updated: {formatDate(new Date(order.updatedAt))}</div>
            <div>Payment Status: {order.paymentStatus}</div>
          </div>
        </div>

        {order.status === 'CANCELLED' && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400">
            <div className="flex items-start gap-2">
              <Circle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Order Cancelled
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  This order was cancelled on {formatDate(new Date(order.updatedAt))}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
