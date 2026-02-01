export type PromoCode = {
    id?: string;
    code: string;
    discountType: "PERCENT" | "FLAT";
    discountValue: number;
    minOrderValue?: number | null;
    isActive?: boolean;
    showInBanner: boolean;
  };
  