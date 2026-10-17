import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNotificationListener from '@/components/admin/AdminNotificationListener';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D2527] flex flex-col lg:flex-row relative">
      <AdminNotificationListener />
      <AdminSidebar adminName={admin.name || 'Administrator'} />
      <main className="lg:pl-64 flex-1 p-4 sm:p-8 min-w-0">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
