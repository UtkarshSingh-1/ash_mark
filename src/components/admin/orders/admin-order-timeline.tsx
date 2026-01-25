"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, Truck, CheckCircle, MapPin, RotateCcw, RefreshCcw, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface AdminOrderTimelineProps {
  order: {
    id: string
    status: string
    paymentStatus: string
    createdAt: string
    updatedAt: string

    // optional event timestamps
    shippedAt?: string | null
    outForDeliveryAt?: string | null
    deliveredAt?: string | null
    cancelledAt?: string | null
    completedAt?: string | null
    returnStatus?: string
    exchangeStatus?: string
  }
}

export function AdminOrderTimeline({ order }: AdminOrderTimelineProps) {
  const baseTimeline = [
    {
      status: "PENDING",
      title: "Order Placed",
      description: "Order has been placed by customer",
      timestamp: order.createdAt,
      icon: Package,
    },
    {
      status: "CONFIRMED",
      title: "Order Confirmed",
      description: "Order has been confirmed",
      icon: CheckCircle,
    },
    {
      status: "PROCESSING",
      title: "Processing",
      description: "Order is being prepared",
      icon: Package,
    },
    {
      status: "SHIPPED",
      title: "Shipped",
      description: "Order left warehouse",
      timestamp: order.shippedAt || null,
      icon: Truck,
    },
    {
      status: "DELIVERED",
      title: "Delivered",
      description: "Order delivered to customer",
      timestamp: order.deliveredAt || null,
      icon: MapPin,
    },
  ]

  const returnTimeline = [
    {
      status: "RETURN_REQUESTED",
      title: "Return Requested",
      description: "Customer requested a return",
      icon: RotateCcw,
    },
    {
      status: "RETURN_APPROVED",
      title: "Return Approved",
      description: "Return request has been approved",
      icon: CheckCircle,
    },
    {
      status: "RETURNED",
      title: "Returned",
      description: "Item returned successfully",
      icon: RotateCcw,
    },
  ]

  const exchangeTimeline = [
    {
      status: "EXCHANGE_REQUESTED",
      title: "Exchange Requested",
      description: "Customer requested an exchange",
      icon: RefreshCcw,
    },
    {
      status: "EXCHANGE_APPROVED",
      title: "Exchange Approved",
      description: "Exchange approved and processing",
      icon: CheckCircle,
    },
    {
      status: "EXCHANGED",
      title: "Exchanged",
      description: "Item exchanged successfully",
      icon: RefreshCcw,
    },
  ]

  let finalTimeline: any[] = [...baseTimeline]

  // Merge return / exchange states after DELIVERED
  if (order.status.includes("RETURN")) {
    finalTimeline = [...finalTimeline, ...returnTimeline]
  }

  if (order.status.includes("EXCHANGE")) {
    finalTimeline = [...finalTimeline, ...exchangeTimeline]
  }

  // Cancelled case overrides everything
  const isCancelled = order.status === "CANCELLED"
  if (isCancelled) {
    finalTimeline = [
      baseTimeline[0], // Order Placed
      {
        status: "CANCELLED",
        title: "Order Cancelled",
        description: "The order was cancelled",
        timestamp: order.cancelledAt || order.updatedAt,
        icon: XCircle,
      },
    ]
  }

  // Mark completed states
  const completedStatuses = new Set([
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "RETURN_REQUESTED",
    "RETURN_APPROVED",
    "RETURNED",
    "EXCHANGE_REQUESTED",
    "EXCHANGE_APPROVED",
    "EXCHANGED",
  ])

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
          {finalTimeline.map((event, index) => {
            const Icon = event.icon
            const isCurrent = event.status === order.status
            const isCompleted = completedStatuses.has(event.status) || index < finalTimeline.findIndex(e => e.status === order.status)

            return (
              <div key={event.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`p-3 rounded-full text-white ${
                      isCompleted
                        ? "bg-green-600"
                        : isCurrent
                          ? "bg-yellow-600"
                          : "bg-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {index < finalTimeline.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <h4 className="font-semibold flex items-center gap-2">
                    {event.title}
                    {isCurrent && <Badge className="bg-yellow-500 border-0">Current</Badge>}
                    {isCompleted && !isCurrent && <Badge className="bg-green-600 border-0 text-white">Completed</Badge>}
                  </h4>

                  <p className="text-sm text-muted-foreground">{event.description}</p>

                  {(event.timestamp || isCompleted || isCurrent) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.timestamp
                        ? formatDate(new Date(event.timestamp))
                        : formatDate(new Date(order.updatedAt))}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Meta Info */}
        <div className="mt-6 p-4 bg-muted/30 rounded-md text-sm space-y-1">
          <div><strong>Order Created:</strong> {formatDate(new Date(order.createdAt))}</div>
          <div><strong>Last Updated:</strong> {formatDate(new Date(order.updatedAt))}</div>
          <div><strong>Status:</strong> {order.status}</div>
          <div><strong>Payment:</strong> {order.paymentStatus}</div>
        </div>
      </CardContent>
    </Card>
  )
}
