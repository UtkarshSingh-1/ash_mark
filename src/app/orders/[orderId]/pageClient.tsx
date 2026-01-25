"use client";

import { OrderDetails } from "@/components/orders/order-details";
import { OrderActions } from "@/components/orders/order-actions";
import { OrderTracking } from "@/components/orders/order-tracking";

export default function OrderPageClient({ order }: { order: any }) {
  return (
    <main className="min-h-screen bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <OrderDetails order={order} />
            <OrderTracking order={order} />
          </div>
          <div>
            <OrderActions order={order} />
          </div>
        </div>
      </div>
    </main>
  );
}
