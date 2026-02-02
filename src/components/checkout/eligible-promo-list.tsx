"use client"

import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PromoDisplay {
  code: string
  description: string
  eligible: boolean
}

interface EligiblePromoListProps {
  items: PromoDisplay[]
  subtotal: number
  isNewUser: boolean
  onApply?: (code: string) => void
}

export function EligiblePromoList({
  items,
  onApply,
}: EligiblePromoListProps) {
  const eligiblePromos = items.filter(p => p.eligible)

  if (eligiblePromos.length === 0) return null

  return (
    <div className="mb-3 border rounded p-3 bg-green-50 space-y-2">
      <p className="text-sm font-semibold text-green-700">
        Available Offers
      </p>

      {eligiblePromos.map(promo => (
        <div
          key={promo.code}
          className={cn(
            "p-2 border border-green-500 rounded flex justify-between items-center"
          )}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {promo.code}
            </span>
            <span className="text-xs text-green-700">
              {promo.description}
            </span>
          </div>

          <button
            onClick={() => onApply?.(promo.code)}
            className="flex items-center gap-1 text-xs font-semibold text-green-700"
          >
            <BadgeCheck className="w-4 h-4" />
            APPLY
          </button>
        </div>
      ))}
    </div>
  )
}
