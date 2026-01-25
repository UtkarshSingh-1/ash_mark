"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface ExchangeModalProps {
  open: boolean
  onCloseAction: () => void
  item: {
    orderId: string
    itemId: string
    productName: string
    oldSize?: string | null
    oldColor?: string | null
  }
}

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"]
const COLOR_OPTIONS = ["BLACK", "WHITE", "GRAY", "RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK"]

export function ExchangeModal({ open, onCloseAction, item }: ExchangeModalProps) {
  const [reason, setReason] = useState("")
  const [newSize, setNewSize] = useState<string | undefined>(item.oldSize ?? undefined)
  const [newColor, setNewColor] = useState<string | undefined>(item.oldColor ?? undefined)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!reason.trim()) {
      toast({ title: "Reason required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${item.orderId}/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.itemId,
          reason,
          newSize,
          newColor,
        }),
      })

      if (!res.ok) throw new Error()

      toast({ title: "Exchange Requested", description: "Admin will review your request" })
      onCloseAction()
    } catch {
      toast({ title: "Error", description: "Failed to submit exchange", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exchange Product</DialogTitle>
        </DialogHeader>

        <p className="text-sm mb-2 text-muted-foreground">
          Product: <strong>{item.productName}</strong>
        </p>

        <Textarea
          placeholder="Why do you want to exchange?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-3 mt-3">
          <Select value={newSize} onValueChange={setNewSize}>
            <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={newColor} onValueChange={setNewColor}>
            <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
            <SelectContent>
              {COLOR_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="ghost" onClick={onCloseAction}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
