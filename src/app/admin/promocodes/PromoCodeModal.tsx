"use client";

import { useEffect, useState } from "react";
import { PromoCode } from "@/types/promocode";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  promo?: PromoCode | null;
};

export default function PromoCodeModal({
  open,
  onClose,
  onSuccess,
  promo,
}: Props) {
  const [form, setForm] = useState<PromoCode>({
    code: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderValue: null,
    showInBanner: false,
  });

  useEffect(() => {
    if (promo) {
      setForm({
        ...promo,
        discountValue: Number(promo.discountValue),
      });
    }
  }, [promo]);

  if (!open) return null;

  const submit = async () => {
    const method = promo?.id ? "PATCH" : "POST";
    const url = promo?.id
      ? `/api/admin/promocodes/${promo.id}`
      : `/api/admin/promocodes`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {promo ? "Edit Promo Code" : "Create Promo Code"}
        </h2>

        <div className="space-y-3">
          <input
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            placeholder="PROMO10"
            className="w-full border p-2 rounded"
          />

          <select
            value={form.discountType}
            onChange={(e) =>
              setForm({
                ...form,
                discountType: e.target.value as "PERCENT" | "FLAT",
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="PERCENT">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>

          <input
            type="number"
            value={form.discountValue}
            onChange={(e) =>
              setForm({ ...form, discountValue: Number(e.target.value) })
            }
            placeholder="Discount value"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            value={form.minOrderValue ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                minOrderValue: e.target.value
                  ? Number(e.target.value)
                  : null,
              })
            }
            placeholder="Min order value (optional)"
            className="w-full border p-2 rounded"
          />

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={form.showInBanner}
              onChange={(e) =>
                setForm({ ...form, showInBanner: e.target.checked })
              }
            />
            Show in banner
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {promo ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
