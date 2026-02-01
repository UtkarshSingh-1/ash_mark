"use client";

import { useEffect, useState } from "react";

type Promo = {
  id: string;
  code: string;
  title?: string | null;
  discountType: "PERCENT" | "FLAT";
  discountValue: string;
};

export default function CouponBanner() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [hidden, setHidden] = useState(false);

  // Hide banner for this session if user closed it
  useEffect(() => {
    const dismissed = sessionStorage.getItem("coupon-banner-hidden");
    if (dismissed) setHidden(true);
  }, []);

  useEffect(() => {
    if (hidden) return;

    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promocodes/banner");
        if (!res.ok) return;
        const data = await res.json();
        setPromos(data);
      } catch (err) {
        console.error("Failed to load promo banner");
      }
    };

    fetchPromos();

    // Auto refresh every 30 seconds
    const interval = setInterval(fetchPromos, 30000);
    return () => clearInterval(interval);
  }, [hidden]);

  if (hidden || promos.length === 0) return null;

  const handleClose = () => {
    sessionStorage.setItem("coupon-banner-hidden", "1");
    setHidden(true);
  };

  return (
    <div className="relative w-full overflow-hidden bg-red-700 text-white">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-bold opacity-80 hover:opacity-100"
        aria-label="Close"
      >
        ×
      </button>

      {/* Marquee */}
      <div className="whitespace-nowrap py-2 animate-marquee flex gap-12 px-6">
        {promos.map((promo) => (
          <span key={promo.id} className="font-medium">
            Use Code{" "}
            <span className="font-bold">"{promo.code}"</span>{" "}
            {promo.title ??
              (promo.discountType === "PERCENT"
                ? `Get ${promo.discountValue}% off`
                : `Get ₹${promo.discountValue} off`)}
          </span>
        ))}
      </div>
    </div>
  );
}
