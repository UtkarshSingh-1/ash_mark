"use client"

import { useEffect, useState } from "react"
import { BadgeCheck, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PromoDisplay {
  code: string
  description: string
  eligible: boolean
  reasons: string[]
}

export function EligiblePromoList() {
  const [promos, setPromos] = useState<PromoDisplay[]>([])

  useEffect(() => {
    fetch("/api/promo-codes/list")
      .then(res => res.json())
      .then(data => {
        if (data.promoCodes) setPromos(data.promoCodes)
      })
      .catch(() => {})
  }, [])

  if (promos.length === 0) return null

  return (
    <div className="mb-3 border rounded p-3 bg-muted/20 space-y-2">
      <p className="text-sm font-semibold">Available Offers</p>

      {promos.map(promo => (
        <div
          key={promo.code}
          className={cn(
            "p-2 border rounded flex justify-between items-start",
            promo.eligible ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
          )}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{promo.code}</span>
            <span className="text-xs">{promo.description}</span>
            {!promo.eligible && (
              <span className="text-[10px] text-red-600 mt-1">
                {promo.reasons.join(", ")}
              </span>
            )}
          </div>
          {promo.eligible ? (
            <BadgeCheck className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
      ))}
    </div>
  )
}
