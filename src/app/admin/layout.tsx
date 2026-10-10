import React from 'react';
import type { Metadata } from 'next';
import { getCurrentAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Aurvella Florist - Admin Management',
  description: 'Panel Pengelolaan Aurvella Florist Bandung',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    // If not authenticated (e.g. login page), render child directly without sidebar
    return <div className="min-h-screen bg-[#FAF8F8]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F8] flex flex-col lg:flex-row">
      <AdminSidebar adminName={admin.name || 'Administrator'} />
      <main className="lg:pl-64 flex-1 p-4 sm:p-8 min-w-0">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
