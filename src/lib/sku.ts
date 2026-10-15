import { prisma } from './prisma';

const CATEGORY_PREFIX_MAP: Record<string, string> = {
  'standing-acrylic': 'ACR',
  'standing-cermin': 'CRM',
  'standing-pvc': 'PVC',
  'standing-vpc': 'PVC',
  'standing-fresh': 'FRE',
  'standing-duka-cita': 'DUK',
};

function generateRandomSuffix(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatSkuDate(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function getCategoryPrefix(categorySlugOrName?: string): string {
  if (!categorySlugOrName) return 'SF';
  const clean = categorySlugOrName.toLowerCase().trim();
  if (CATEGORY_PREFIX_MAP[clean]) {
    return CATEGORY_PREFIX_MAP[clean];
  }
  // Fallback prefix from slug or letters
  const parts = clean.replace(/[^a-z0-9]/g, '').slice(0, 3).toUpperCase();
  return parts || 'SF';
}

/**
 * Generates a unique SKU with retry mechanism against database unique constraint
 */
export async function generateUniqueSku(
  categorySlug?: string,
  maxRetries: number = 5
): Promise<string> {
  const prefix = getCategoryPrefix(categorySlug);
  const dateStr = formatSkuDate();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const suffix = generateRandomSuffix(4);
    const candidateSku = `${prefix}-${dateStr}-${suffix}`;

    const existing = await prisma.product.findUnique({
      where: { sku: candidateSku },
      select: { id: true },
    });

    if (!existing) {
      return candidateSku;
    }
  }

  // Fallback with higher entropy
  const timestampSuffix = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${dateStr}-${timestampSuffix}`;
}
