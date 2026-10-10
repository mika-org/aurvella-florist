import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurvella Florist - Spesialis Standing Flower Bandung | Fresh & Artificial',
  description:
    'Pusat standing flower nomor satu di Bandung untuk grand opening, wedding, anniversary, dan duka cita. Tersedia akrilik, cermin, VPC, dan bunga segar. Free ongkir Bandung & Same Day Delivery.',
  keywords: [
    'standing flower bandung',
    'florist bandung',
    'standing acrylic bandung',
    'standing cermin wedding',
    'bunga papan bandung',
    'bunga grand opening bandung',
    'aurvella florist',
  ],
  authors: [{ name: 'Aurvella Florist' }],
  openGraph: {
    title: 'Aurvella Florist Bandung - Standing Flower Elegan & Mewah',
    description: 'Spesialis standing flower akrilik, cermin, VPC & fresh flower di Bandung. Free Ongkir & Same Day Delivery.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Aurvella Florist Bandung',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#2D2527] bg-[#FAF8F8]">
        {children}
      </body>
    </html>
  );
}
