"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

type BannerPromo = {
  id: string
  code: string
  discountType: "PERCENT" | "FLAT"
  discountValue: number
}

export function PromoMarquee() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [promos, setPromos] = useState<BannerPromo[]>([])

  useEffect(() => {
    // Dismiss state (session-only)
    const dismissed = sessionStorage.getItem("promo-marquee-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
    }

    // 🔥 Fetch banner promos from DB
    fetch("/api/promocodes/banner", { cache: "no-store" })
      .then(res => res.json())
      .then(setPromos)
      .catch(() => setPromos([]))
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem("promo-marquee-dismissed", "true")
  }

  // Nothing to show
  if (isDismissed || promos.length === 0) {
    return null
  }

  const renderPromoText = (p: BannerPromo) => {
    if (p.discountType === "PERCENT") {
      return `Use Code: "${p.code}" Flat ${p.discountValue}% off`
    }
    return `Use Code: "${p.code}" Get ₹${p.discountValue} off`
  }

  return (
    <div className="relative bg-[#8B0000] text-white py-2 overflow-hidden">
      <div className="flex items-center justify-between">
        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee 30s linear infinite" }}
          >
            {[...promos, ...promos].map((promo, index) => (
              <div
                key={`${promo.id}-${index}`}
                className="flex items-center gap-8 px-8"
              >
                <span className="font-semibold">
                  {renderPromoText(promo)}
                </span>
                <span className="mx-4">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-auto py-1 px-2 mr-4 flex-shrink-0 z-10"
          onClick={handleDismiss}
          aria-label="Dismiss promo banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
