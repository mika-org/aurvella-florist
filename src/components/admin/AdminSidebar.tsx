'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Flower2,
  FolderTree,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Star,
  ChevronRight,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Users,
} from 'lucide-react';

interface AdminSidebarProps {
  adminName: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

export default function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // If on login page, don't show sidebar
  if (pathname === '/admin/login') {
    return null;
  }

  const menuCategories: NavCategory[] = [
    {
      category: 'Menu Utama',
      items: [
        { label: 'Dashboard Ringkasan', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      category: 'Penjualan & Transaksi',
      items: [
        { label: 'Transaksi Penjualan', href: '/admin/transaksi', icon: Receipt },
        { label: 'Data Pelanggan', href: '/admin/pelanggan', icon: Users },
      ],
    },
    {
      category: 'Katalog & Inventaris',
      items: [
        { label: 'Manajemen Produk', href: '/admin/produk', icon: Flower2 },
        { label: 'Manajemen Kategori', href: '/admin/kategori', icon: FolderTree },
      ],
    },
    {
      category: 'Interaksi & Pelanggan',
      items: [
        { label: 'Pesan Masuk Form', href: '/admin/pesan', icon: MessageSquare },
        { label: 'Testimoni Pelanggan', href: '/admin/testimoni', icon: Star },
        { label: 'Tanya Jawab (FAQ)', href: '/admin/faq', icon: HelpCircle },
      ],
    },
    {
      category: 'Sistem & Tampilan',
      items: [
        { label: 'Manajemen Bio Link', href: '/admin/link', icon: Sparkles },
        { label: 'Pengaturan Website', href: '/admin/pengaturan', icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-white border-b border-[#F0E4E7] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white shadow-xs border border-[#F8B4C4]/60 shrink-0 p-0.5">
            <Image src="/logo.png" alt="Aurvella Logo" fill className="object-contain" sizes="36px" />
          </div>
          <div>
            <span className="font-serif font-bold text-base text-[#2D2527] block leading-none">
              Aurvella Admin
            </span>
            <span className="text-[10px] text-[#8E6D14] font-medium">Florist Management</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-[#2D2527] hover:bg-[#FAF3F5] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1416] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 border-r border-white/5 shadow-2xl overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-md shadow-[#B83253]/20 border border-[#F8B4C4]/60 shrink-0">
                <Image src="/logo.png" alt="Aurvella Admin Logo" fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-white tracking-wide block leading-tight">
                  Aurvella Florist
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#DFB758] font-bold">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Capsule */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.03] flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DFB758] to-[#F5DE9C] text-[#1E1719] font-extrabold text-xs flex items-center justify-center shadow-sm">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#1A1416]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate block">
                {adminName}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#DFB758]">
                <ShieldCheck className="w-3 h-3 text-[#DFB758]" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          {/* Categorized Navigation */}
          <nav className="p-3.5 space-y-4 text-xs font-medium">
            {menuCategories.map((group, groupIdx) => (
              <div key={group.category} className="space-y-1">
                {/* Category Header */}
                <div className="px-3 pt-1 pb-1.5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                    {group.category}
                  </span>
                  <span className="w-8 h-[1px] bg-white/10" />
                </div>

                {/* Category Menu Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#B83253] to-[#CE4467] text-white shadow-md shadow-[#B83253]/25 font-semibold'
                            : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                              isActive
                                ? 'text-white scale-110'
                                : 'text-white/50 group-hover:text-[#F8B4C4] group-hover:scale-105'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-white/10 space-y-1.5 bg-black/20">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-white/75 hover:bg-white/10 hover:text-white transition-all group"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#DFB758] group-hover:scale-110 transition-transform" />
              <span>Lihat Website Publik</span>
            </span>
            <span className="text-[10px] text-white/40 font-mono">Live</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[#F87171] hover:bg-[#F87171]/15 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
