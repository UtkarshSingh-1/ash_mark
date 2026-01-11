"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    size?: string;
    color?: string;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
      slug: string;
    };
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, size, color } = item;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/products/${product.slug}`} className="flex-shrink-0">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="font-medium hover:text-crimson-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            <div className="flex gap-2 mt-1">
              {size && <Badge variant="outline">Size: {size}</Badge>}
              {color && <Badge variant="outline">Color: {color}</Badge>}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-8 text-center font-medium">{quantity}</span>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  {formatPrice(Number(product.price) * quantity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(Number(product.price))} each
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
