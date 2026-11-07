'use client';

import Link from 'next/link';

export default function ProductDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-24 px-4 text-center bg-[#FAF8F8] min-h-[60vh]">
      <h1 className="font-heading text-2xl font-semibold text-[#2D2527]">
        Produk belum dapat dimuat
      </h1>
      <p className="mt-2 text-sm text-[#6B5E63]">
        Terjadi gangguan sesaat. Silakan coba lagi.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-[#B83253] text-white text-sm font-semibold"
        >
          Coba Lagi
        </button>
        <Link href="/produk" className="px-5 py-2.5 rounded-xl border border-[#E8D9DC] text-sm font-semibold text-[#4A3E42]">
          Katalog Produk
        </Link>
      </div>
    </div>
  );
}
