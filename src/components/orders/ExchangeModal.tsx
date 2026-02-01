"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface ExchangeModalProps {
  open: boolean;
  onCloseAction: () => void;
  item: {
    id: string;
    orderId: string;
    productName: string;
    sizes: string[];
    colors: string[];
  };
}

export function ExchangeModal({ open, onCloseAction, item }: ExchangeModalProps) {
  const [reason, setReason] = useState("");
  const [newSize, setNewSize] = useState<string | null>(null);
  const [newColor, setNewColor] = useState<string | null>(null);

  const submit = async () => {
    if (!reason || !newSize || !newColor) {
      return toast({ title: "All fields required", variant: "destructive" });
    }

    const res = await fetch(`/api/orders/${item.orderId}/exchange`, {
      method: "POST",
      body: JSON.stringify({
        itemId: item.id,
        reason,
        newSize,
        newColor,
      }),
    });

    if (res.ok) {
      toast({ title: "Exchange request submitted" });
      onCloseAction();
      window.location.reload();
    } else {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Exchange {item.productName}</h2>

        <Select onValueChange={setNewSize}>
          <SelectTrigger><SelectValue placeholder="Select new size" /></SelectTrigger>
          <SelectContent>
            {item.sizes.map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setNewColor}>
          <SelectTrigger><SelectValue placeholder="Select new color" /></SelectTrigger>
          <SelectContent>
            {item.colors.map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Why do you want to exchange?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCloseAction}>Cancel</Button>
          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
