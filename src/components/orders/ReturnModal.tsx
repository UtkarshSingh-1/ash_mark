"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export interface ReturnItemData {
  id: string;        // orderItemId
  orderId: string;
  productName: string;
}

interface ReturnModalProps {
  open: boolean;
  onCloseAction: () => void;
  item: ReturnItemData | null;
}

export function ReturnModal({ open, onCloseAction, item }: ReturnModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const submit = async () => {
    if (!reason.trim()) {
      toast({ title: "Required", description: "Please provide a reason", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${item.orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          reason,
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Return Requested", description: "Your return request was submitted." });
      onCloseAction();
    } catch {
      toast({ title: "Error", description: "Unable to submit return request", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Item</DialogTitle>
        </DialogHeader>

        <div className="mb-4 font-semibold">{item.productName}</div>

        <Textarea
          placeholder="Reason for return..."
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
