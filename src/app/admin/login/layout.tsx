import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Staff & Administrator - Aurvella Florist Bandung',
  description: 'Portal Masuk Resmi Pengelolaan Aurvella Florist',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 w-screen h-screen h-[100dvh] overflow-hidden m-0 p-0">
      {children}
    </div>
  );
}
