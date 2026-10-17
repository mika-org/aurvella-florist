import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aurvella Florist - Admin Management',
  description: 'Panel Pengelolaan Aurvella Florist Bandung',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
