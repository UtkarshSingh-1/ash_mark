import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Package, MapPin } from "lucide-react";

interface OrderTrackingProps {
  order: any;
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const returnSteps = [
    "REQUESTED",
    "APPROVED",
    "PICKUP_SCHEDULED",
    "PICKUP_COMPLETED",
    "REFUND_INITIATED",
    "REFUND_COMPLETED",
    "REJECTED",
  ]

  const exchangeSteps = [
    "REQUESTED",
    "APPROVED",
    "PICKUP_SCHEDULED",
    "PICKUP_COMPLETED",
    "EXCHANGE_PROCESSING",
    "EXCHANGE_COMPLETED",
    "REJECTED",
  ]

  const steps = [
    {
      key: "CONFIRMED",
      title: "Order Confirmed",
      desc: "We have received your order",
      icon: CheckCircle
    },
    {
      key: "PROCESSING",
      title: "Processing",
      desc: "Your order is being packed",
      icon: Package
    },
    {
      key: "SHIPPED",
      title: "Shipped",
      desc: "On the way via courier",
      icon: Truck
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      desc: "Package delivered successfully",
      icon: MapPin
    },
  ];

  const completedIndex = steps.findIndex(s => s.key === order.status);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= completedIndex;

            return (
              <div key={step.key} className="flex gap-3 items-start">
                <Icon className={`w-5 h-5 ${isCompleted ? "text-green-600" : "text-gray-400"}`} />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {step.title}
                    {index === completedIndex && <Badge>Current</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {order.status === "SHIPPED" && (
          <div className="p-3 bg-blue-50 text-sm rounded border">
            Tracking ID: <b>{order.trackingId || "Updating"}</b>
          </div>
        )}

        {order.returnStatus === "REQUESTED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Return Requested - Pickup within <b>5-7 working days</b>
          </div>
        )}

        {order.returnStatus === "PICKUP_SCHEDULED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Return Pickup Scheduled
          </div>
        )}

        {order.returnStatus === "PICKUP_COMPLETED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Return Pickup Completed
          </div>
        )}

        {order.exchangeStatus === "REQUESTED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Exchange Requested - Pickup within <b>5-7 working days</b>
          </div>
        )}

        {order.exchangeStatus === "PICKUP_SCHEDULED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Exchange Pickup Scheduled
          </div>
        )}

        {order.exchangeStatus === "PICKUP_COMPLETED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Exchange Pickup Completed
          </div>
        )}

        {order.refundStatus === "COMPLETED" && (
          <div className="p-3 bg-green-50 border text-sm rounded">
            Refund Completed - Amount: INR {order.refundAmount}
          </div>
        )}

        {order.refundStatus === "INITIATED" && (
          <div className="p-3 bg-yellow-50 border text-sm rounded">
            Refund Initiated - Please wait 3-5 working days
          </div>
        )}

        {(order.returnStatus && order.returnStatus !== "NONE") ||
        (order.exchangeStatus && order.exchangeStatus !== "NONE") ? (
          <div className="p-3 bg-muted/30 border text-sm rounded space-y-1">
            {order.returnStatus && order.returnStatus !== "NONE" && (
              <div className="space-y-2">
                <div><strong>Return Status:</strong> {order.returnStatus}</div>
                <div className="flex gap-2 flex-wrap">
                  {returnSteps.map((s) => (
                    <Badge
                      key={`return-${s}`}
                      variant={s === order.returnStatus ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {s.replaceAll("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {order.exchangeStatus && order.exchangeStatus !== "NONE" && (
              <div className="space-y-2">
                <div><strong>Exchange Status:</strong> {order.exchangeStatus}</div>
                <div className="flex gap-2 flex-wrap">
                  {exchangeSteps.map((s) => (
                    <Badge
                      key={`exchange-${s}`}
                      variant={s === order.exchangeStatus ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {s.replaceAll("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
