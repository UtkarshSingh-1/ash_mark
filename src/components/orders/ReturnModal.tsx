"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface ReturnModalProps {
  open: boolean
  onCloseAction: () => void
  item: {
    id: string
    orderId: string
    productName: string
  }
}

export function ReturnModal({ open, onCloseAction, item }: ReturnModalProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const submitReturn = async () => {
    if (!reason.trim()) {
      toast({ title: "Reason required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${item.orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })

      if (!res.ok) throw new Error()

      toast({ title: "Request Submitted", description: "Return request sent to admin" })
      onCloseAction()
    } catch {
      toast({ title: "Error", description: "Failed to submit return request", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Product</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-2">
          Product: <strong>{item.productName}</strong>
        </p>

        <Textarea
          placeholder="Describe the issue..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="ghost" onClick={onCloseAction}>Cancel</Button>
          <Button onClick={submitReturn} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
