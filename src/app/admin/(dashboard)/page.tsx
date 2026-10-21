import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { formatRupiah } from '@/lib/utils';
import {
  Flower2,
  FolderTree,
  Tag,
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Receipt,
  Package,
  CheckCircle2,
  Calendar,
  Users,
  Phone,
  Crown,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const [
    totalProducts,
    totalCategories,
    activePromoProducts,
    approvedTestimonials,
    unreadMessages,
    activeLinks,
    recentMessages,
    transactions,
    topSellingProducts,
    recentTransactions,
    topCustomers,
    totalCustomers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isPromo: true, isPublished: true } }),
    prisma.testimonial.count({ where: { isApproved: true } }),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.socialLink.count({ where: { isActive: true } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.transaction.findMany({
      select: { totalAmount: true, orderStatus: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { totalSold: 'desc' },
      take: 5,
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    }),
    prisma.transaction.findMany({
      orderBy: { transactionDate: 'desc' },
      take: 5,
      include: {
        items: true,
      },
    }),
    prisma.customer.findMany({
      orderBy: [{ totalOrders: 'desc' }, { totalSpent: 'desc' }],
      take: 5,
    }),
    prisma.customer.count(),
  ]);

  // Aggregate Sales KPIs
  const totalOmset = transactions.reduce((acc, t) => acc + Number(t.totalAmount), 0);
  const totalCompletedTransactions = transactions.filter((t) => t.orderStatus === 'COMPLETED').length;
  const totalPcsSold = topSellingProducts.reduce((sum, p) => sum + p.totalSold, 0);

  const metrics = [
    {
      title: 'Total Omset Penjualan',
      value: formatRupiah(totalOmset),
      subtext: `${transactions.length} transaksi tercatat`,
      href: '/admin/transaksi',
      icon: DollarSign,
      color: 'bg-[#E8F8EE] text-[#1E7E34]',
      isCurrency: true,
    },
    {
      title: 'Pesanan Selesai',
      value: `${totalCompletedTransactions} Pesanan`,
      subtext: 'Transaksi sukses lunas',
      href: '/admin/transaksi',
      icon: Receipt,
      color: 'bg-[#FFF0F4] text-[#B83253]',
    },
    {
      title: 'Katalog Produk',
      value: totalProducts,
      subtext: `${activePromoProducts} produk aktif promo`,
      href: '/admin/produk',
      icon: Flower2,
      color: 'bg-[#FFF9ED] text-[#8E6D14]',
    },
    {
      title: 'Pesan Masuk Baru',
      value: unreadMessages,
      subtext: 'Form inquiry website',
      href: '/admin/pesan',
      icon: MessageSquare,
      color: unreadMessages > 0 ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#F3F4F6] text-[#4B5563]',
    },
    {
      title: 'Testimoni Disetujui',
      value: approvedTestimonials,
      subtext: 'Ulasan tampil di homepage',
      href: '/admin/testimoni',
      icon: Star,
      color: 'bg-[#FFFDF0] text-[#D4AF37]',
    },
    {
      title: 'Kategori Produk',
      value: totalCategories,
      subtext: 'Standing Flower Bandung',
      href: '/admin/kategori',
      icon: FolderTree,
      color: 'bg-[#FAF5FF] text-[#9333EA]',
    },
    {
      title: 'Total Pelanggan',
      value: `${totalCustomers} Kontak`,
      subtext: 'Basis data pemesan',
      href: '/admin/pelanggan',
      icon: Users,
      color: 'bg-[#F0FDF4] text-[#15803D]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#B83253] via-[#CE4467] to-[#E56A88] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FDE2E8] font-bold">
            Executive Florist Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            Selamat Datang, {admin.name}!
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-xl">
            Pantau hasil penjualan, data transaksi pelanggan, dan performa standing flower terlaris di Bandung secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/transaksi"
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold text-xs transition-all border border-white/30 shrink-0"
          >
            + Input Transaksi
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white text-[#B83253] font-bold text-xs hover:bg-[#FFF5F7] transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Preview Web</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              href={m.href}
              className="bg-white rounded-2xl p-6 border border-[#F0E4E7] hover:border-[#B83253] hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#8A7E82] uppercase tracking-wider block">
                    {m.title}
                  </span>
                  <span
                    className={`font-extrabold text-[#2D2527] mt-1 block ${
                      m.isCurrency ? 'text-2xl font-serif text-[#1E7E34]' : 'text-3xl'
                    }`}
                  >
                    {m.value}
                  </span>
                </div>
                <div className={`p-3 rounded-xl ${m.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="pt-4 mt-2 border-t border-[#F8E8EC] flex items-center justify-between text-xs text-[#6B5E63]">
                <span>{m.subtext}</span>
                <span className="text-[#B83253] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Kelola &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Section: Top Selling Products & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top Selling Products (Produk Penjualan Terbanyak) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E4E7] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF9ED] text-[#8E6D14] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#DFB758]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-[#2D2527]">
                    Produk Penjualan Terbanyak
                  </h2>
                  <span className="text-[11px] text-[#7A6D72]">Peringkat standing flower terlaris</span>
                </div>
              </div>
              <Link
                href="/admin/produk"
                className="text-xs font-bold text-[#B83253] hover:underline"
              >
                Semua Produk &rarr;
              </Link>
            </div>

            {topSellingProducts.length === 0 ? (
              <p className="text-xs text-[#8A7E82] py-8 text-center bg-[#FAF8F8] rounded-2xl">
                Belum ada transaksi produk tercatat.
              </p>
            ) : (
              <div className="space-y-3">
                {topSellingProducts.map((p, rank) => {
                  const imgUrl = p.images[0]?.url || '/images/categories/standing-acrylic.png';
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-[#FFF8FA] border border-[#F8E1E7] flex items-center justify-between gap-3 hover:bg-[#FFF0F4] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            rank === 0
                              ? 'bg-[#DFB758] text-[#1E1719]'
                              : rank === 1
                              ? 'bg-[#D1D5DB] text-[#1E1719]'
                              : rank === 2
                              ? 'bg-[#FDBA74] text-[#1E1719]'
                              : 'bg-white text-[#7A6D72] border border-[#E8D9DC]'
                          }`}
                        >
                          {rank + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white shrink-0 border border-[#F5E2E7]">
                          <Image src={imgUrl} alt={p.name} fill sizes="44px" className="object-cover" />
                        </div>

                        {/* Details */}
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[#2D2527] block truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#8E6D14]">
                            {p.sku} • {p.category.name}
                          </span>
                        </div>
                      </div>

                      {/* Sales Count */}
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm text-[#B83253] block">
                          🔥 {p.totalSold} pcs
                        </span>
                        <span className="text-[10px] font-semibold text-[#7A6D72]">
                          {formatRupiah(p.isPromo && p.promoPrice ? Number(p.promoPrice) : Number(p.price))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F5E6EA] text-center">
            <span className="text-[11px] text-[#8E6D14] font-medium">
              Data penjualan dihitung otomatis setiap transaksi baru disimpan.
            </span>
          </div>
        </div>

        {/* Right: Recent Transactions List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#F0E4E7] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F8EE] text-[#1E7E34] flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-[#1E7E34]" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-[#2D2527]">
                    Transaksi Penjualan Terbaru
                  </h2>
                  <span className="text-[11px] text-[#7A6D72]">
                    5 transaksi pesanan bunga paling akhir
                  </span>
                </div>
              </div>
              <Link
                href="/admin/transaksi"
                className="text-xs font-bold text-[#B83253] hover:underline"
              >
                Semua Transaksi &rarr;
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-xs text-[#8A7E82] py-8 text-center bg-[#FAF8F8] rounded-2xl">
                Belum ada transaksi penjualan tercatat.
              </p>
            ) : (
              <div className="divide-y divide-[#F5E6EA]">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#B83253]">
                          {tx.invoiceNumber}
                        </span>
                        <span className="font-bold text-xs text-[#2D2527] truncate">
                          {tx.customerName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6D72] truncate mt-0.5">
                        {tx.items.map((it) => `${it.productName} (×${it.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-[#2D2527] block">
                        {formatRupiah(Number(tx.totalAmount))}
                      </span>
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          tx.orderStatus === 'COMPLETED'
                            ? 'bg-[#E8F8EE] text-[#1E7E34]'
                            : 'bg-[#FFF9ED] text-[#8E6D14]'
                        }`}
                      >
                        {tx.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F5E6EA] flex items-center justify-between text-xs">
            <span className="text-[#7A6D72]">Rekap dapat diunduh ke Excel (.csv)</span>
            <Link
              href="/admin/transaksi"
              className="font-bold text-[#B83253] hover:underline"
            >
              Lihat Detail Transaksi &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Pelanggan Terbanyak Memesan (Top Loyal Customers) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E7] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF9ED] text-[#8E6D14] flex items-center justify-center border border-[#DFB758]/30">
              <Crown className="w-5 h-5 text-[#DFB758]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2D2527]">
                Pelanggan Terbanyak Memesan (Top Customers)
              </h2>
              <p className="text-xs text-[#7A6D72]">
                Peringkat pelanggan loyal dengan frekuensi order dan total belanja tertinggi
              </p>
            </div>
          </div>
          <Link
            href="/admin/pelanggan"
            className="text-xs font-bold text-[#B83253] hover:underline self-start sm:self-auto"
          >
            Kelola Semua Pelanggan ({totalCustomers}) &rarr;
          </Link>
        </div>

        {topCustomers.length === 0 ? (
          <p className="text-xs text-[#8A7E82] py-8 text-center bg-[#FAF8F8] rounded-2xl">
            Belum ada data pelanggan tercatat.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCustomers.map((c, index) => {
              const cleanWa = c.whatsapp.replace(/[^0-9]/g, '');
              const isFirst = index === 0;
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isFirst
                      ? 'bg-gradient-to-br from-[#FFFBF2] to-white border-[#DFB758] shadow-sm ring-1 ring-[#DFB758]/30'
                      : 'bg-white border-[#F0E4E7] hover:border-[#B83253]/30 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isFirst
                              ? 'bg-[#DFB758] text-[#1E1719]'
                              : index === 1
                              ? 'bg-gray-200 text-gray-800'
                              : index === 2
                              ? 'bg-[#FDBA74] text-[#1E1719]'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {isFirst ? '👑' : index + 1}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8E6D14]">
                          {isFirst ? 'Top #1 VIP' : `Peringkat #${index + 1}`}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF0F4] text-[#B83253]">
                        {c.totalOrders}x Order
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#2D2527] line-clamp-1">{c.name}</h3>

                    <div className="mt-2 flex items-baseline justify-between text-xs">
                      <span className="text-gray-500 text-[11px]">Total Belanja:</span>
                      <span className="font-extrabold text-[#B83253]">
                        {formatRupiah(Number(c.totalSpent))}
                      </span>
                    </div>

                    {c.address && (
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                        📍 {c.address}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#F5E6EA] flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {c.lastOrderAt
                        ? `Order: ${new Date(c.lastOrderAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}`
                        : 'Belum ada'}
                    </span>

                    <a
                      href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(
                        c.name
                      )},%20terima%20kasih%20telah%20menjadi%20pelanggan%20setia%20Aurvella%20Florist!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E7E34] hover:text-[#155d27] bg-[#E8F8EE] px-2.5 py-1 rounded-lg transition-colors"
                      title="Kirim pesan WhatsApp"
                    >
                      <Phone className="w-3 h-3 fill-[#25D366] text-[#25D366]" />
                      <span>Chat WA</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E7] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#2D2527]">
              Pesan Masuk Terbaru
            </h2>
            <p className="text-xs text-[#7A6D72]">
              Pesan yang dikirim pelanggan melalui formulir website
            </p>
          </div>
          <Link
            href="/admin/pesan"
            className="text-xs font-bold text-[#B83253] hover:underline"
          >
            Lihat Semua Pesan &rarr;
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-xs text-[#8A7E82] py-8 text-center bg-[#FAF8F8] rounded-2xl">
            Belum ada pesan masuk dari formulir website.
          </p>
        ) : (
          <div className="divide-y divide-[#F5E6EA]">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#2D2527]">
                      {msg.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#8E6D14]">
                      ({msg.whatsapp})
                    </span>
                    {msg.status === 'NEW' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EF4444] text-white">
                        BARU
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B5E63] truncate mt-0.5">
                    <strong>{msg.subject}</strong> — {msg.message}
                  </p>
                </div>
                <span className="text-[10px] text-[#8A7E82] whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
