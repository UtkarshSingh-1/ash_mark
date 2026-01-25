"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export interface ExchangeItemData {
  id: string;         // orderItemId
  orderId: string;
  productName: string;
  availableSizes: string[];
}

interface ExchangeModalProps {
  open: boolean;
  onCloseAction: () => void;
  item: ExchangeItemData | null;
}

export function ExchangeModal({ open, onCloseAction, item }: ExchangeModalProps) {
  const [reason, setReason] = useState("");
  const [newSize, setNewSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const submit = async () => {
    if (!newSize) {
      toast({ title: "Required", description: "Please select a new size", variant: "destructive" });
      return;
    }

    if (!reason.trim()) {
      toast({ title: "Required", description: "Please provide a reason", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${item.orderId}/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          newSize,
          reason,
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Exchange Requested", description: "Your exchange request was submitted." });
      onCloseAction();
    } catch {
      toast({ title: "Error", description: "Unable to submit exchange request", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exchange Item</DialogTitle>
        </DialogHeader>

        <div className="font-semibold">{item.productName}</div>

        <div className="mt-3">
          <label className="text-sm font-medium">Select New Size:</label>
          <Select onValueChange={setNewSize}>
            <SelectTrigger className="mt-1">
              {newSize ?? "Select Size"}
            </SelectTrigger>
            <SelectContent>
              {item.availableSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          className="mt-3"
          placeholder="Reason for exchange..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <Button className="w-full" disabled={loading} onClick={submit}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onCloseAction}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
