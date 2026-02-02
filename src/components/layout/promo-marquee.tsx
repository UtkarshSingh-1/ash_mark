"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

type BannerPromo = {
  id: string
  code: string
  description: string
}

export function PromoMarquee() {
  const [dismissed, setDismissed] = useState(false)
  const [promos, setPromos] = useState<BannerPromo[]>([])

  useEffect(() => {
    if (sessionStorage.getItem("promo-marquee-dismissed") === "true") {
      setDismissed(true)
      return
    }

    fetch("/api/promocodes/banner", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setPromos(Array.isArray(data) ? data : []))
      .catch(() => setPromos([]))
  }, [])

  if (dismissed || promos.length === 0) return null

  return (
    <div className="relative bg-[#8B0000] text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap will-change-transform"
            style={{ animation: "marquee 18s linear infinite" }} // 🔥 smoother on mobile
          >
            {[...promos, ...promos].map((promo, index) => (
              <div
                key={`${promo.id}-${index}`}
                className="flex items-center gap-2 px-8 font-medium"
              >
                <span className="underline">{promo.code}</span>
                <span>– {promo.description}</span>
                <span className="mx-4">•</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mr-4"
          onClick={() => {
            setDismissed(true)
            sessionStorage.setItem("promo-marquee-dismissed", "true")
          }}
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
