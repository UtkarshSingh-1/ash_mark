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
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [promos, setPromos] = useState<BannerPromo[]>([])

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined" && sessionStorage.getItem("promo-marquee-dismissed") === "true") {
      setDismissed(true)
      return
    }

    fetch("/api/promocodes/banner", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setPromos(Array.isArray(data) ? data : []))
      .catch(() => setPromos([]))
  }, [])

  if (!mounted || dismissed || promos.length === 0) return null

  return (
    <div className="promo-marquee bg-[#8B0000] text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex h-full overflow-hidden gap-6">
            {/* Track 1 */}
            <div className="flex animate-marquee1 whitespace-nowrap gap-6">
              {promos.map(promo => (
                <div
                  key={promo.id}
                  className="flex items-center gap-2 px-4 pr-6 text-base font-medium shrink-0 min-w-fit"
                >
                  <span className="font-bold underline whitespace-nowrap">
                    {promo.code}
                  </span>
                  <span className="opacity-90 whitespace-nowrap">
                    {promo.description}
                  </span>
                  <span className="mx-2 opacity-50">•</span>
                </div>
              ))}

              {/* 🔹 TRAILING BUFFER — critical fix */}
              <div className="w-[120px] shrink-0" />
            </div>

            {/* Track 2 (duplicate) */}
            <div className="flex animate-marquee2 whitespace-nowrap gap-6">
              {promos.map(promo => (
                <div
                  key={`${promo.id}-dup`}
                  className="flex items-center gap-2 px-4 pr-6 text-base font-medium shrink-0 min-w-fit"
                >
                  <span className="font-bold underline whitespace-nowrap">
                    {promo.code}
                  </span>
                  <span className="opacity-90 whitespace-nowrap">
                    {promo.description}
                  </span>
                  <span className="mx-2 opacity-50">•</span>
                </div>
              ))}

              {/* 🔹 TRAILING BUFFER */}
              <div className="w-[120px] shrink-0" />
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mr-3 shrink-0"
          onClick={() => {
            setDismissed(true)
            sessionStorage.setItem("promo-marquee-dismissed", "true")
          }}
          aria-label="Dismiss promo banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <style jsx global>{`
        .promo-marquee {
          --speed: 30s;
        }

        .animate-marquee1 {
          animation: marquee1 var(--speed) linear infinite;
        }

        .animate-marquee2 {
          animation: marquee2 var(--speed) linear infinite;
        }

        @keyframes marquee1 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-52%);
          }
        }

        @keyframes marquee2 {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-52%);
          }
        }

        .promo-marquee:hover .animate-marquee1,
        .promo-marquee:hover .animate-marquee2 {
          animation-play-state: paused;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .promo-marquee {
            --speed: 24s;
          }

          .promo-marquee [class*="animate-marquee"] > div {
            font-size: 0.875rem;
            padding-inline: 0.5rem;
          }
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 1024px) {
          .promo-marquee {
            --speed: 26s;
          }
        }

        /* Desktop */
        @media (min-width: 1200px) {
          .promo-marquee {
            --speed: 32s;
          }
        }

        .animate-marquee1,
        .animate-marquee2 {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
