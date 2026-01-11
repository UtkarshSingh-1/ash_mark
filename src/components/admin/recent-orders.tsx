"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  ExternalLink,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  items: {
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders?limit=5");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, paymentStatus: string) => {
    if (paymentStatus === "FAILED")
      return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === "DELIVERED")
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "SHIPPED")
      return <Package className="h-4 w-4 text-blue-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === "FAILED") return "bg-red-600";
    if (status === "DELIVERED") return "bg-green-600";
    if (status === "SHIPPED") return "bg-blue-600";
    if (status === "PROCESSING") return "bg-yellow-600";
    return "bg-gray-600";
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted-foreground/20"></div>
                  <div className="h-3 w-24 bg-muted-foreground/20"></div>
                </div>
                <div className="h-6 w-16 bg-muted-foreground/20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild className="border-0">
          <Link href="/admin/orders">
            View All
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent orders found
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status, order.paymentStatus)}
                  <div>
                    <div className="font-medium text-sm">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.user.name || order.user.email} •{" "}
                      {order.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}{" "}
                      items • {formatDate(new Date(order.createdAt))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.items[0]?.product.name}
                      {order.items.length > 1 &&
                        ` +${order.items.length - 1} more`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {formatPrice(Number(order.total))}
                  </div>
                  <Badge
                    className={`text-xs border-0 ${getStatusColor(
                      order.status,
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus === "FAILED" ? "Failed" : order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
