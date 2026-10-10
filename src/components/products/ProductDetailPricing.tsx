'use client';

import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import PromoCountdown from '@/components/ui/PromoCountdown';

interface ProductDetailPricingProps {
  normalPrice: number;
  promoPrice?: number | null;
  isPromo: boolean;
  promoEnd?: string | null;
}

export default function ProductDetailPricing({
  normalPrice,
  promoPrice,
  isPromo,
  promoEnd,
}: ProductDetailPricingProps) {
  const [isPromoExpired, setIsPromoExpired] = useState(() => {
    if (!promoEnd) return false;
    return new Date(promoEnd).getTime() <= Date.now();
  });

  const hasValidPromo =
    isPromo &&
    promoPrice !== null &&
    promoPrice !== undefined &&
    promoPrice < normalPrice &&
    !isPromoExpired;

  return (
    <div className="space-y-3">
      {/* Pricing Display */}
      <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F8E1E7] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          {hasValidPromo && promoPrice ? (
            <>
              <span className="text-3xl font-extrabold text-[#B83253]">
                {formatRupiah(promoPrice)}
              </span>
              <span className="text-base text-[#8A7E82] line-through font-medium">
                {formatRupiah(normalPrice)}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#B83253]/10 text-[#B83253] font-bold">
                Hemat {formatRupiah(normalPrice - promoPrice)}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-[#2D2527]">
              {formatRupiah(normalPrice)}
            </span>
          )}
        </div>

        {/* Live Promo Countdown Badge */}
        {hasValidPromo && promoEnd && (
          <PromoCountdown
            targetDate={promoEnd}
            variant="badge"
            onExpire={() => setIsPromoExpired(true)}
          />
        )}
      </div>

      {hasValidPromo && (
        <div className="flex items-center gap-1.5 text-xs text-[#B83253] font-medium px-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Promo spesial terbatas, pesan sekarang sebelum periode promo berakhir!</span>
        </div>
      )}
    </div>
  );
}
