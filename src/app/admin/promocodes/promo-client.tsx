"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DiscountType } from "@prisma/client"

type Promo = {
  id: string
  code: string
  discountType: DiscountType
  discountValue: number
  minOrderValue: number | null
  isActive: boolean
  showInBanner: boolean
}

export default function PromoClient({ promos }: { promos: Promo[] }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Promo Codes</h1>

      <div className="space-y-4">
        {promos.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  )
}

function PromoCard({ promo }: { promo: Promo }) {
  const [loading, setLoading] = useState(false)

  const toggleActive = async () => {
    setLoading(true)
    await fetch(`/api/admin/promocodes/${promo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !promo.isActive }),
    })
    window.location.reload()
  }

  return (
    <div className="border rounded-lg p-4 bg-background space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{promo.code}</h2>
        <Button size="sm" onClick={toggleActive} disabled={loading}>
          {promo.isActive ? "Disable" : "Enable"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={promo.discountValue}
          readOnly
        />

        <Input
          type="number"
          value={promo.minOrderValue ?? ""}
          placeholder="No minimum"
          readOnly
        />
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span>
          Type:{" "}
          <strong>
            {promo.discountType === DiscountType.PERCENT
              ? "Percentage"
              : "Flat"}
          </strong>
        </span>

        <span>
          Banner:{" "}
          <strong>{promo.showInBanner ? "Yes" : "No"}</strong>
        </span>
      </div>
    </div>
  )
}
