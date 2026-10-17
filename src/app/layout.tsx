import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurvellaflorist.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aurvella Florist by. Maharani Florist - Spesialis Standing Flower No. 1 Bandung',
    template: '%s | Aurvella Florist Bandung',
  },
  description:
    'Spesialis Standing Flower No. 1 di Bandung & cabang resmi Maharani Florist. Koleksi mewah standing akrilik, cermin wedding, papan PVC, fresh flowers, & bunga papan duka cita. Free ongkir & same day delivery kilat 2-4 jam ke seluruh Bandung.',
  keywords: [
    'standing flower bandung',
    'spesialis standing flower bandung',
    'toko bunga bandung',
    'florist bandung',
    'aurvella florist',
    'maharani florist',
    'aurvella florist by maharani florist',
    'standing acrylic bandung',
    'standing cermin wedding bandung',
    'standing flower duka cita bandung',
    'bunga papan duka cita bandung',
    'bunga grand opening bandung',
    'standing flower pernikahan bandung',
    'florist bandung 24 jam',
    'kirim bunga bandung same day',
    'toko bunga arcamanik bandung',
  ],
  authors: [{ name: 'Aurvella Florist by. Maharani Florist', url: siteUrl }],
  creator: 'Aurvella Florist',
  publisher: 'Aurvella Florist by. Maharani Florist Bandung',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Aurvella Florist - Spesialis Standing Flower No. 1 di Bandung',
    description:
      'Pesan standing flower akrilik modern, cermin wedding, foam PVC, fresh flower, dan bunga papan duka cita di Bandung. Gratis ongkir & garansi bunga segar.',
    url: siteUrl,
    siteName: 'Aurvella Florist by. Maharani Florist',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/images/hero-banner-2.png',
        width: 1200,
        height: 630,
        alt: 'Aurvella Florist Bandung - Spesialis Standing Flower Mewah & Elegan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurvella Florist - Spesialis Standing Flower No. 1 di Bandung',
    description:
      'Standing flower akrilik, cermin wedding, papan PVC, dan bunga segar Bandung. Free ongkir & same day delivery 2-4 jam.',
    images: ['/images/hero-banner-2.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  other: {
    'geo.region': 'ID-JB',
    'geo.placename': 'Bandung',
    'geo.position': '-6.914744;107.679810',
    ICBM: '-6.914744, 107.679810',
  },
};

const jsonLdFlorist = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  '@id': `${siteUrl}/#florist`,
  name: 'Aurvella Florist by. Maharani Florist',
  alternateName: [
    'Aurvella Florist',
    'Maharani Florist Bandung',
    'Spesialis Standing Flower Bandung',
  ],
  description:
    'Spesialis Standing Flower No. 1 di Bandung: Standing Akrilik modern, Cermin Wedding, Papan PVC, Bunga Segar Asli, & Bunga Papan Duka Cita resmi. Layanan pemesanan ramah 24 jam dengan jaminan bunga segar sampai di lokasi tepat waktu.',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/images/hero-banner-2.png`,
  telephone: '+6285770187018',
  priceRange: 'Rp 350.000 - Rp 5.000.000',
  currenciesAccepted: 'IDR',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer, QRIS',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik',
    addressLocality: 'Kota Bandung',
    addressRegion: 'Jawa Barat',
    postalCode: '40293',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.914744,
    longitude: 107.67981,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Kota Bandung' },
    { '@type': 'City', name: 'Cimahi' },
    { '@type': 'AdministrativeArea', name: 'Kabupaten Bandung' },
    { '@type': 'AdministrativeArea', name: 'Bandung Barat' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Katalog Standing Flower & Karangan Bunga Bandung',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Standing Flower Akrilik Bandung' },
      { '@type': 'OfferCatalog', name: 'Standing Flower Cermin Wedding Bandung' },
      { '@type': 'OfferCatalog', name: 'Standing Flower Foam PVC Elegan' },
      { '@type': 'OfferCatalog', name: 'Standing Flower Bunga Segar (Fresh Flower)' },
      { '@type': 'OfferCatalog', name: 'Bunga Papan Duka Cita Resmi Bandung' },
    ],
  },
  sameAs: [
    'https://instagram.com/aurvellaflorist',
    'https://shopee.co.id/aurvellaflorist',
    'https://tiktok.com/@aurvellaflorist',
  ],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Aurvella Florist Bandung',
  description: 'Toko Bunga & Spesialis Standing Flower No. 1 di Bandung',
  publisher: {
    '@id': `${siteUrl}/#florist`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/produk?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${playfair.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Google Structured Data / Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFlorist) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans antialiased text-[#2D2527] bg-[#FAF8F8]"
      >
        {children}
      </body>
    </html>
  );
}
