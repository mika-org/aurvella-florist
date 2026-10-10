import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number | string | any): string {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function buildWhatsAppLink(
  phoneNumber: string,
  productName?: string,
  sku?: string,
  productUrl?: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  let message = 'Halo Aurvella Florist, saya ingin memesan standing flower.';

  if (productName) {
    message = `Halo Aurvella Florist, saya tertarik dan ingin memesan:
*${productName}*
${sku ? `(SKU: ${sku})` : ''}
${productUrl ? `Link: ${productUrl}` : ''}

Mohon info ketersediaan slot pengiriman dan panduan pemesanannya. Terima kasih!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
