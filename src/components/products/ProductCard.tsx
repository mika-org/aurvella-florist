'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Eye, Tag } from 'lucide-react';
import { formatRupiah, buildWhatsAppLink } from '@/lib/utils';
import PromoCountdown from '@/components/ui/PromoCountdown';

export interface ProductCardData {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number | any;
  promoPrice?: number | any | null;
  isPromo: boolean;
  promoEnd?: Date | string | null;
  totalSold?: number;
  category?: {
    name: string;
    slug: string;
  };
  images?: {
    url: string;
    alt?: string | null;
  }[];
}

interface ProductCardProps {
  product: ProductCardData;
  whatsappNumber?: string;
}

export default function ProductCard({
  product,
  whatsappNumber = '6285770187018',
}: ProductCardProps) {
  const [isPromoExpired, setIsPromoExpired] = useState(() => {
    if (!product.promoEnd) return false;
    return new Date(product.promoEnd).getTime() <= Date.now();
  });

  const normalPrice = Number(product.price);
  const promoPrice = product.promoPrice ? Number(product.promoPrice) : null;
  const hasValidPromo =
    product.isPromo &&
    promoPrice !== null &&
    promoPrice < normalPrice &&
    !isPromoExpired;

  const imageUrl =
    product.images?.[0]?.url || '/images/categories/standing-acrylic.png';

  const productUrl = `/produk/${product.slug}`;
  const waUrl = buildWhatsAppLink(whatsappNumber, product.name, product.sku);

  return (
    <div className="group rounded-2xl bg-white border border-[#EFE5E8] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Thumbnail Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#FAF6F8]">
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {hasValidPromo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#B83253] text-white shadow-md">
                <Tag className="w-3 h-3" />
                PROMO
              </span>
            )}
            {product.totalSold !== undefined && product.totalSold >= 2 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DFB758] text-[#1E1719] shadow-md">
                ★ TERLARIS
              </span>
            )}
          </div>

          {/* SKU Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-white/90 backdrop-blur-sm text-[#4A3E42] border border-white/40 shadow-sm">
              {product.sku}
            </span>
          </div>

          {/* Floating Countdown Pill on Thumbnail */}
          {hasValidPromo && product.promoEnd && (
            <div className="absolute bottom-2.5 right-2.5 z-10">
              <PromoCountdown
                targetDate={product.promoEnd}
                variant="card"
                onExpire={() => setIsPromoExpired(true)}
              />
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-3.5 sm:p-5">
          {product.category && (
            <Link
              href={`/kategori/${product.category.slug}`}
              className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#B89223] font-semibold hover:underline block truncate"
            >
              {product.category.name}
            </Link>
          )}

          <h3 className="font-serif font-bold text-base sm:text-lg text-[#2D2527] group-hover:text-[#B83253] transition-colors mt-1 line-clamp-1">
            <Link href={productUrl}>{product.name}</Link>
          </h3>

          {/* Pricing & Sales Count */}
          <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between gap-1.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {hasValidPromo && promoPrice ? (
                <>
                  <span className="text-base sm:text-xl font-extrabold text-[#B83253]">
                    {formatRupiah(promoPrice)}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#8A7E82] line-through">
                    {formatRupiah(normalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-xl font-bold text-[#2D2527]">
                  {formatRupiah(normalPrice)}
                </span>
              )}
            </div>

            <span
              className={`text-[9px] sm:text-[10px] font-semibold whitespace-nowrap px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                (product.totalSold || 0) > 0
                  ? 'bg-[#FFF0F4] text-[#B83253] border border-[#F8B4C4]/60 font-bold shadow-xs'
                  : 'bg-[#FAF3F5] text-[#7A6D72]'
              }`}
            >
              Terjual {product.totalSold || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 pt-0 grid grid-cols-2 gap-1.5 sm:gap-2">
        <Link
          href={productUrl}
          className="inline-flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-semibold text-[#4A3E42] bg-[#FAF3F5] hover:bg-[#F5E6EB] transition-colors cursor-pointer text-center"
        >
          <Eye className="w-3.5 h-3.5 text-[#B83253] shrink-0" />
          <span className="truncate">Detail</span>
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-xs transition-all cursor-pointer text-center"
        >
          <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
          <span className="truncate">Pesan WA</span>
        </a>
      </div>
    </div>
  );
}
