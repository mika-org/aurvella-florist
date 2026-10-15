'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Phone,
  Edit,
  Trash2,
  X,
  ExternalLink,
  Crown,
  Receipt,
  Sparkles,
  Calendar,
  MapPin,
  Mail,
  FileText,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

export interface CustomerData {
  id: string;
  name: string;
  whatsapp: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string | null;
  createdAt: string;
}

interface Props {
  initialCustomers: CustomerData[];
}

export default function CustomerManagementClient({ initialCustomers }: Props) {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerData[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'orders' | 'spent' | 'recent' | 'name'>('orders');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    address: '',
    notes: '',
  });

  // Filter & Sort
  const filteredCustomers = customers
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.whatsapp.toLowerCase().includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'recent') {
        const da = a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0;
        const db = b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0;
        return db - da;
      }
      return a.name.localeCompare(b.name);
    });

  const totalOmsetAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpent = customers.length > 0 ? totalOmsetAll / customers.length : 0;

  const openCreateModal = () => {
    setEditingCustomer(null);
    setErrorMsg(null);
    setFormData({
      name: '',
      whatsapp: '',
      email: '',
      address: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: CustomerData) => {
    setEditingCustomer(c);
    setErrorMsg(null);
    setFormData({
      name: c.name,
      whatsapp: c.whatsapp,
      email: c.email || '',
      address: c.address || '',
      notes: c.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const url = editingCustomer
      ? `/api/admin/customers/${editingCustomer.id}`
      : '/api/admin/customers';
    const method = editingCustomer ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan pelanggan');
      }

      if (editingCustomer) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...data.customer } : c))
        );
      } else {
        setCustomers((prev) => [data.customer, ...prev]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus data pelanggan "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus');
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B83253] font-bold">
            <Users className="w-3.5 h-3.5 text-[#DFB758]" />
            Basis Data Pembeli
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527] mt-1">
            Data Pelanggan Standing Flower
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D72] mt-1">
            Pantau pelanggan loyal, peringkat pemesan terbanyak, dan riwayat transaksi pelanggan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#B83253] hover:bg-[#962340] text-white text-xs font-bold shadow-md shadow-[#B83253]/20 hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">Total Pelanggan Terdaftar</span>
          <span className="text-2xl font-bold text-[#2D2527] mt-1 block">
            {customers.length} Kontak
          </span>
          <span className="text-[11px] text-[#1E7E34] mt-0.5 block font-semibold">
            Tersimpan otomatis dari setiap transaksi
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">Total Pemasukan Pelanggan</span>
          <span className="text-2xl font-bold text-[#B83253] mt-1 block">
            {formatRupiah(totalOmsetAll)}
          </span>
          <span className="text-[11px] text-[#8E6D14] mt-0.5 block font-semibold">
            Akumulasi transaksi seluruh pembeli
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">Rata-rata Belanja / Pelanggan</span>
          <span className="text-2xl font-bold text-[#2D2527] mt-1 block">
            {formatRupiah(Math.round(avgSpent))}
          </span>
          <span className="text-[11px] text-[#7A6D72] mt-0.5 block">
            Nilai transaksi rata-rata per pembeli
          </span>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E7] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, nomor WhatsApp, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#7A6D72] font-medium shrink-0">Urutkan:</span>
          <button
            onClick={() => setSortBy('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              sortBy === 'orders'
                ? 'bg-[#B83253] text-white shadow-xs'
                : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
            }`}
          >
            🔥 Order Terbanyak
          </button>
          <button
            onClick={() => setSortBy('spent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              sortBy === 'spent'
                ? 'bg-[#B83253] text-white shadow-xs'
                : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
            }`}
          >
            💰 Belanja Terbesar
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              sortBy === 'recent'
                ? 'bg-[#B83253] text-white shadow-xs'
                : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
            }`}
          >
            📅 Terakhir Order
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              sortBy === 'name'
                ? 'bg-[#B83253] text-white shadow-xs'
                : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
            }`}
          >
            🔤 Nama A-Z
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#F0E4E7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F8] text-[#4A3E42] font-bold border-b border-[#F0E4E7] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Peringkat</th>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">No. WhatsApp</th>
                <th className="py-3.5 px-4 text-center">Total Order</th>
                <th className="py-3.5 px-4 text-right">Total Belanja</th>
                <th className="py-3.5 px-4">Order Terakhir</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA] text-[#2D2527]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8A7E82]">
                    Tidak ada pelanggan ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, index) => {
                  const cleanWa = c.whatsapp.replace(/[^0-9]/g, '');
                  const isTopVip = index === 0 && c.totalOrders > 0;
                  return (
                    <tr key={c.id} className="hover:bg-[#FFF9FB] transition-colors">
                      {/* Peringkat */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isTopVip ? (
                            <span className="w-6 h-6 rounded-full bg-[#DFB758] text-white flex items-center justify-center font-bold text-xs shadow-xs" title="Pelanggan Terbanyak Memesan">
                              👑
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-gray-100 text-[#4A3E42] flex items-center justify-center font-bold text-xs">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Nama Pelanggan */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-[#2D2527] block text-sm">
                            {c.name}
                          </span>
                          {c.address && (
                            <span className="text-[10px] text-[#7A6D72] flex items-center gap-1 mt-0.5 line-clamp-1">
                              <MapPin className="w-3 h-3 text-[#B83253] shrink-0" />
                              {c.address}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* WhatsApp */}
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(
                            c.name
                          )},%20terima%20kasih%20telah%20menjadi%20pelanggan%20setia%20Aurvella%20Florist!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1E7E34] hover:text-[#155d27] bg-[#E8F8EE] px-2.5 py-1 rounded-lg transition-colors"
                          title="Chat via WhatsApp"
                        >
                          <Phone className="w-3 h-3 text-[#25D366] fill-[#25D366]" />
                          <span>{c.whatsapp}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                        </a>
                      </td>

                      {/* Total Order */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FFF0F4] text-[#B83253]">
                          {c.totalOrders}x Order
                        </span>
                      </td>

                      {/* Total Belanja */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-extrabold text-sm text-[#2D2527]">
                          {formatRupiah(c.totalSpent)}
                        </span>
                      </td>

                      {/* Order Terakhir */}
                      <td className="py-3.5 px-4 text-[#7A6D72]">
                        {c.lastOrderAt ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>
                              {new Date(c.lastOrderAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">Belum ada</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#B83253] hover:bg-[#FFF0F4] transition-colors"
                            title="Edit Pelanggan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Pelanggan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F0E4E7] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E4E7]">
              <h3 className="font-serif text-lg font-bold text-[#2D2527]">
                {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Nama Pelanggan / Instansi <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Sarah Wijaya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Nomor WhatsApp / HP <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="Contoh: sarah@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Alamat Pengiriman / Kantor (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Jl. Riau No. 45, Bandung"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pelanggan korporat, suka warna bunga pastel..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8D9DC] text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#B83253] hover:bg-[#962340] text-white text-xs font-bold shadow-md shadow-[#B83253]/20 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
