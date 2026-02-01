"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Power } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type DiscountType = "PERCENTAGE" | "FLAT"

interface PromoCode {
  id: string
  code: string
  description: string
  discountType: DiscountType
  discountValue: number
  minOrderValue: number | null
  isActive: boolean
  showInBanner: boolean
}

/* ------------------------------------------------------------ */

export default function AdminPromoCodesPage() {
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PromoCode | null>(null)

  /* ---------------- FETCH ---------------- */

  const loadPromos = async () => {
    const res = await fetch("/api/admin/promocodes")
    const data = await res.json()

    // 🔴 IMPORTANT: convert Decimal → number
    const safe: PromoCode[] = data.map((p: any) => ({
      ...p,
      discountValue: Number(p.discountValue),
      minOrderValue: p.minOrderValue ? Number(p.minOrderValue) : null,
    }))

    setPromos(safe)
    setLoading(false)
  }

  useEffect(() => {
    loadPromos()
  }, [])

  /* ---------------- ACTIONS ---------------- */

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/promocodes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    loadPromos()
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Promo Codes</h1>
        <Button onClick={() => { setEditing(null); setOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> New Promo
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && promos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No promo codes created
                </td>
              </tr>
            )}

            {promos.map(promo => (
              <tr key={promo.id} className="border-t">
                <td className="p-3 font-semibold">{promo.code}</td>
                <td>{promo.description}</td>
                <td>
                  {promo.discountType === "PERCENTAGE"
                    ? `${promo.discountValue}%`
                    : `₹${promo.discountValue}`}
                </td>
                <td>
                  <span className={promo.isActive ? "text-green-600" : "text-red-600"}>
                    {promo.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => { setEditing(promo); setOpen(true) }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => toggleActive(promo.id, promo.isActive)}
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PromoModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSaved={loadPromos}
      />
    </div>
  )
}

/* ------------------------------------------------------------ */
/* ----------------------- MODAL ------------------------------- */
/* ------------------------------------------------------------ */

function PromoModal({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  initial: PromoCode | null
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: 0,
    minOrderValue: 0,
    showInBanner: false,
  })

  useEffect(() => {
    if (initial) {
      setForm({
        code: initial.code,
        description: initial.description,
        discountType: initial.discountType,
        discountValue: initial.discountValue,
        minOrderValue: initial.minOrderValue ?? 0,
        showInBanner: initial.showInBanner,
      })
    }
  }, [initial])

  const submit = async () => {
    const url = initial
      ? `/api/admin/promocodes/${initial.id}`
      : "/api/admin/promocodes"

    const method = initial ? "PATCH" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    onSaved()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Promo Code" : "Create Promo Code"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Code</Label>
            <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Discount Type</Label>
              <select
                className="w-full border rounded px-2 py-2"
                value={form.discountType}
                onChange={e => setForm({ ...form, discountType: e.target.value as DiscountType })}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat</option>
              </select>
            </div>

            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={form.discountValue}
                onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <Label>Minimum Order Value</Label>
            <Input
              type="number"
              value={form.minOrderValue}
              onChange={e => setForm({ ...form, minOrderValue: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show in Banner</Label>
            <Switch
              checked={form.showInBanner}
              onCheckedChange={v => setForm({ ...form, showInBanner: v })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>
            {initial ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
