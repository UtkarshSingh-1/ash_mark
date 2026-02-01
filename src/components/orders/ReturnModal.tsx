"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface ReturnModalProps {
  open: boolean;
  onCloseAction: () => void;
  item: {
    id: string;
    orderId: string;
    productName: string;
  };
}

export function ReturnModal({ open, onCloseAction, item }: ReturnModalProps) {
  const [reason, setReason] = useState("");

  const submit = async () => {
    if (!reason.trim()) {
      return toast({ title: "Reason required", variant: "destructive" });
    }

    const res = await fetch(`/api/orders/${item.orderId}/return`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      toast({ title: "Return request submitted" });
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
        <h2 className="text-lg font-semibold">Return {item.productName}</h2>

        <Textarea
          placeholder="Why do you want to return?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button onClick={submit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
