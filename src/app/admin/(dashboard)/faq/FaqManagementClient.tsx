'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/context/AdminToastContext';

export interface FaqData {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialFaqs: FaqData[];
}

export default function FaqManagementClient({ initialFaqs }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<FaqData[]>(initialFaqs);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingFaq(null);
    setErrorMsg(null);
    setFormData({
      question: '',
      answer: '',
      order: faqs.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (f: FaqData) => {
    setEditingFaq(f);
    setErrorMsg(null);
    setFormData({
      question: f.question,
      answer: f.answer,
      order: f.order,
      isActive: f.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs';
      const method = editingFaq ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan FAQ');
      }

      showToast.persistSuccess(
        editingFaq ? 'FAQ Diperbarui' : 'FAQ Ditambahkan',
        'Pertanyaan dan jawaban FAQ berhasil disimpan.'
      );

      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan FAQ', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (faq: FaqData) => {
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });

      if (!res.ok) throw new Error('Gagal update status');

      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, isActive: !f.isActive } : f))
      );
      showToast.success(
        'Status FAQ Diperbarui',
        `FAQ kini ${!faq.isActive ? 'Aktif & Ditampilkan' : 'Dinonaktifkan'}.`
      );
      router.refresh();
    } catch {
      showToast.error('Gagal Mengubah Status', 'Gagal mengubah status aktif FAQ');
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Hapus pertanyaan FAQ "${question}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');

      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast.success('FAQ Dihapus', `Pertanyaan FAQ "${question}" berhasil dihapus.`);
      router.refresh();
    } catch {
      showToast.error('Gagal Menghapus FAQ', 'Terjadi kesalahan saat menghapus FAQ.');
    }
  };

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = faqs.filter((f) => f.isActive).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Konten Informasi
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2527] mt-1">
            Manajemen Tanya Jawab (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D72] mt-1">
            Kelola daftar pertanyaan umum pelanggan yang ditampilkan di halaman utama website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah FAQ Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <span className="text-xs font-semibold text-[#7A6D72]">Total Pertanyaan FAQ</span>
          <span className="font-serif text-2xl font-bold text-[#2D2527] block mt-1">
            {faqs.length} Pertanyaan
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <span className="text-xs font-semibold text-[#7A6D72]">FAQ Tayang di Website</span>
          <span className="font-serif text-2xl font-bold text-[#28A745] block mt-1">
            {activeCount} Aktif
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <span className="text-xs font-semibold text-[#7A6D72]">FAQ Disembunyikan (Draft)</span>
          <span className="font-serif text-2xl font-bold text-[#8A7E82] block mt-1">
            {faqs.length - activeCount} Nonaktif
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFE4E7] flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan atau jawaban FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
          />
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EFE4E7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF6F8] border-b border-[#EFE4E7] text-[#6B5A60] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-16 text-center">Urutan</th>
                <th className="py-3.5 px-4">Pertanyaan &amp; Jawaban</th>
                <th className="py-3.5 px-4 w-28 text-center">Status Tayang</th>
                <th className="py-3.5 px-4 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-[#8A7E82]">
                    Belum ada data FAQ yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((faq) => (
                  <tr key={faq.id} className="hover:bg-[#FFF8FA] transition-colors">
                    {/* Order */}
                    <td className="py-4 px-4 text-center font-bold font-mono text-[#B83253]">
                      #{faq.order}
                    </td>

                    {/* Question & Answer */}
                    <td className="py-4 px-4">
                      <span className="font-serif font-bold text-sm text-[#2D2527] block mb-1">
                        {faq.question}
                      </span>
                      <p className="text-xs text-[#5C4D52] line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(faq)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          faq.isActive
                            ? 'bg-[#E8F8EE] text-[#1E7E34] hover:bg-[#D4EDDA]'
                            : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                        }`}
                        title="Klik untuk ubah status tayang"
                      >
                        {faq.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E7E34]" />
                            <span>Tayang</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(faq)}
                          className="p-1.5 rounded-lg text-[#B83253] hover:bg-[#FAF3F5] transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(faq.id, faq.question)}
                          className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#FDEEEF] transition-colors"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                {editingFaq ? 'Edit Pertanyaan FAQ' : 'Tambah FAQ Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#7A6D72] hover:bg-[#FAF3F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#FDEEEF] text-[#B83253] text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Pertanyaan FAQ <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="Contoh: Berapa lama proses pembuatan standing flower?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Jawaban Lengkap <span className="text-[#B83253]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="Jelaskan secara ramah, detail, dan meyakinkan pelanggan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Nomor Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
                  />
                  <span className="text-[10px] text-[#7A6D72] mt-0.5 block">
                    Semakin kecil angka urutan, semakin atas posisinya.
                  </span>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#B83253]"
                    />
                    <span className="font-semibold text-[#2D2527]">
                      Tayangkan di Website Utama
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#F5E6EA] flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8D9DC] font-semibold text-[#6B5A60] hover:bg-[#FAF6F8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingFaq ? 'Simpan Perubahan' : 'Tambahkan FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
