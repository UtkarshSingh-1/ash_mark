"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, RefreshCcw } from "lucide-react";
import { ReturnModal } from "./ReturnModal";
import { ExchangeModal } from "./ExchangeModal";

interface OrderActionsProps {
  order: {
    id: string;
    status: string;
    items: Array<{
      id: string;
      quantity: number;
      size?: string;
      product: { name: string; sizes?: string[] };
    }>;
  };
}

export function OrderActions({ order }: OrderActionsProps) {
  const [returnItem, setReturnItem] = useState<any>(null);
  const [exchangeItem, setExchangeItem] = useState<any>(null);

  const canReturn = order.status === "DELIVERED";

  return (
    <>
      <Card>
        <CardHeader><CardTitle>Order Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {canReturn &&
            order.items.map((item) => (
              <div key={item.id} className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setReturnItem({
                      id: item.id,
                      orderId: order.id,
                      productName: item.product.name,
                    })
                  }
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Return
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setExchangeItem({
                      id: item.id,
                      orderId: order.id,
                      productName: item.product.name,
                      availableSizes: item.product.sizes ?? [],
                    })
                  }
                >
                  <RefreshCcw className="w-4 h-4 mr-2" /> Exchange
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <ReturnModal open={!!returnItem} item={returnItem} onCloseAction={() => setReturnItem(null)} />
      <ExchangeModal open={!!exchangeItem} item={exchangeItem} onCloseAction={() => setExchangeItem(null)} />
    </>
  );
}
