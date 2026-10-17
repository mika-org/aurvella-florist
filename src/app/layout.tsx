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
  title: 'Aurvella Florist by. Maharani Florist - Spesialis Standing Flower No. 1 Bandung',
  description:
    'Aurvella Florist by. Maharani Florist: Spesialis standing flower no. 1 di Bandung & katalog karangan bunga lengkap. Standing akrilik, cermin, PVC, bunga segar, & bunga papan duka cita. Free ongkir & same day delivery.',
  keywords: [
    'aurvella florist',
    'maharani florist',
    'aurvella florist by maharani florist',
    'standing flower bandung',
    'florist bandung',
    'standing acrylic bandung',
    'standing cermin wedding',
    'bunga papan duka cita bandung',
    'bunga grand opening bandung',
  ],
  authors: [{ name: 'Aurvella Florist by. Maharani Florist' }],
  openGraph: {
    title: 'Aurvella Florist by. Maharani Florist - Spesialis Standing Flower Bandung',
    description: 'Spesialis standing flower akrilik, cermin, PVC, fresh flower & bunga papan di Bandung. Free Ongkir & Same Day Delivery.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Aurvella Florist by. Maharani Florist',
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
    <html lang="id" className={`${jakarta.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
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
