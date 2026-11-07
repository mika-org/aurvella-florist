import { headers } from 'next/headers';

const FALLBACK_SITE_URL = 'https://aurvella-florist.elevore.web.id';

/**
 * Resolve the public origin of the site for building absolute links
 * (e.g. product links sent via WhatsApp). Priority: env var, then the
 * actual request host (so the link always matches the domain the customer
 * is browsing), then the production domain.
 */
export async function getSiteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto =
        h.get('x-forwarded-proto')?.split(',')[0].trim() ||
        (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch {
    // headers() unavailable (e.g. static context)
  }
  return FALLBACK_SITE_URL;
}
