"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoMarquee() {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if marquee was dismissed in this session only
    // Using sessionStorage instead of localStorage so it resets on each browser session
    const dismissed = sessionStorage.getItem('promo-marquee-dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    } else {
      setIsDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    // Use sessionStorage so it only persists for the current browser session
    sessionStorage.setItem('promo-marquee-dismissed', 'true')
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="relative bg-[#8B0000] text-white py-2 overflow-hidden">
      <div className="flex items-center justify-between">
        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex whitespace-nowrap" style={{
            animation: 'marquee 30s linear infinite',
          }}>
            <div className="flex items-center gap-8 px-8">
              <span className="font-semibold">Use Code: <strong>"FLATS"</strong> Flat 5% off on Pre-Paid Order</span>
              <span className="mx-4">•</span>
              <span className="font-semibold">Use Code: <strong>"SAMV20"</strong> Shop more than 1200 Get 200 off</span>
              <span className="mx-4">•</span>
              <span className="font-semibold">Use Code: <strong>"SAMV30"</strong> Shop more than 1600 get 300 off</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex items-center gap-8 px-8">
              <span className="font-semibold">Use Code: <strong>"FLATS"</strong> Flat 5% off on Pre-Paid Order</span>
              <span className="mx-4">•</span>
              <span className="font-semibold">Use Code: <strong>"SAMV20"</strong> Shop more than 1200 Get 200 off</span>
              <span className="mx-4">•</span>
              <span className="font-semibold">Use Code: <strong>"SAMV30"</strong> Shop more than 1600 get 300 off</span>
            </div>
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

