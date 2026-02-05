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
      scope: "order",
    },
    {
      status: "CONFIRMED",
      title: "Order Confirmed",
      description: "Order has been confirmed",
      icon: CheckCircle,
      scope: "order",
    },
    {
      status: "PROCESSING",
      title: "Processing",
      description: "Order is being prepared",
      icon: Package,
      scope: "order",
    },
    {
      status: "SHIPPED",
      title: "Shipped",
      description: "Order left warehouse",
      timestamp: order.shippedAt || null,
      icon: Truck,
      scope: "order",
    },
    {
      status: "DELIVERED",
      title: "Delivered",
      description: "Order delivered to customer",
      timestamp: order.deliveredAt || null,
      icon: MapPin,
      scope: "order",
    },
  ]

  const returnTimeline = [
    {
      status: "REQUESTED",
      title: "Return Requested",
      description: "Customer requested a return",
      icon: RotateCcw,
      scope: "return",
    },
    {
      status: "APPROVED",
      title: "Return Approved",
      description: "Return request has been approved",
      icon: CheckCircle,
      scope: "return",
    },
    {
      status: "PICKUP_SCHEDULED",
      title: "Pickup Scheduled",
      description: "Pickup scheduled for return",
      icon: RotateCcw,
      scope: "return",
    },
    {
      status: "PICKUP_COMPLETED",
      title: "Pickup Completed",
      description: "Returned item picked up",
      icon: RotateCcw,
      scope: "return",
    },
    {
      status: "REFUND_INITIATED",
      title: "Refund Initiated",
      description: "Refund initiated to customer",
      icon: CheckCircle,
      scope: "return",
    },
    {
      status: "REFUND_COMPLETED",
      title: "Refund Completed",
      description: "Refund completed successfully",
      icon: RotateCcw,
      scope: "return",
    },
  ]

  const exchangeTimeline = [
    {
      status: "REQUESTED",
      title: "Exchange Requested",
      description: "Customer requested an exchange",
      icon: RefreshCcw,
      scope: "exchange",
    },
    {
      status: "APPROVED",
      title: "Exchange Approved",
      description: "Exchange approved and processing",
      icon: CheckCircle,
      scope: "exchange",
    },
    {
      status: "PICKUP_SCHEDULED",
      title: "Pickup Scheduled",
      description: "Pickup scheduled for exchange",
      icon: RefreshCcw,
      scope: "exchange",
    },
    {
      status: "PICKUP_COMPLETED",
      title: "Pickup Completed",
      description: "Exchange item picked up",
      icon: RefreshCcw,
      scope: "exchange",
    },
    {
      status: "EXCHANGE_PROCESSING",
      title: "Exchange Processing",
      description: "Replacement item in processing",
      icon: CheckCircle,
      scope: "exchange",
    },
    {
      status: "EXCHANGE_COMPLETED",
      title: "Exchange Completed",
      description: "Exchange completed successfully",
      icon: RefreshCcw,
      scope: "exchange",
    },
  ]

  let finalTimeline: any[] = [...baseTimeline]

  // Merge return / exchange states after DELIVERED
  if (order.returnStatus && order.returnStatus !== "NONE") {
    finalTimeline = [...finalTimeline, ...returnTimeline]
  }

  if (order.exchangeStatus && order.exchangeStatus !== "NONE") {
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
  const orderIndex = baseTimeline.findIndex(e => e.status === order.status)
  const returnIndex = returnTimeline.findIndex(e => e.status === order.returnStatus)
  const exchangeIndex = exchangeTimeline.findIndex(e => e.status === order.exchangeStatus)

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
            const isCurrent =
              (event.scope === "order" && event.status === order.status) ||
              (event.scope === "return" && event.status === order.returnStatus) ||
              (event.scope === "exchange" && event.status === order.exchangeStatus)

            const isCompleted =
              (event.scope === "order" && orderIndex >= 0 && baseTimeline.findIndex(e => e.status === event.status) <= orderIndex) ||
              (event.scope === "return" && returnIndex >= 0 && returnTimeline.findIndex(e => e.status === event.status) <= returnIndex) ||
              (event.scope === "exchange" && exchangeIndex >= 0 && exchangeTimeline.findIndex(e => e.status === event.status) <= exchangeIndex)

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
          {order.returnStatus && order.returnStatus !== "NONE" && (
            <div><strong>Return:</strong> {order.returnStatus}</div>
          )}
          {order.exchangeStatus && order.exchangeStatus !== "NONE" && (
            <div><strong>Exchange:</strong> {order.exchangeStatus}</div>
          )}
          <div><strong>Payment:</strong> {order.paymentStatus}</div>
        </div>
      </CardContent>
    </Card>
  )
}
