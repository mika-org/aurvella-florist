'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, X, Loader2 } from 'lucide-react';
import { useToast } from '@/context/AdminToastContext';

interface Testimonial {
  id: string;
  customerName: string;
  avatarUrl: string | null;
  content: string;
  rating: number;
  isApproved: boolean;
  date: Date | string;
}

interface Props {
  initialTestimonials: Testimonial[];
}

export default function TestimonialManagementClient({ initialTestimonials }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    content: '',
    rating: 5,
    isApproved: true,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setErrorMsg(null);
    setFormData({
      customerName: '',
      content: '',
      rating: 5,
      isApproved: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setErrorMsg(null);
    setFormData({
      customerName: t.customerName,
      content: t.content,
      rating: t.rating,
      isApproved: t.isApproved,
    });
    setIsModalOpen(true);
  };

  const toggleApproval = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: t.customerName,
          content: t.content,
          rating: t.rating,
          isApproved: !t.isApproved,
        }),
      });

      if (!res.ok) throw new Error('Gagal update status');
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, isApproved: !item.isApproved } : item
        )
      );
      showToast.success(
        'Status Testimoni Diperbarui',
        `Testimoni dari "${t.customerName}" kini ${!t.isApproved ? 'Disetujui & Tampil' : 'Disembunyikan'}.`
      );
      router.refresh();
    } catch {
      showToast.error('Gagal Mengubah Status', 'Gagal mengubah status publikasi testimoni');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const url = editingItem
        ? `/api/admin/testimonials/${editingItem.id}`
        : '/api/admin/testimonials';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan testimoni');

      showToast.persistSuccess(
        editingItem ? 'Testimoni Diperbarui' : 'Testimoni Ditambahkan',
        `Testimoni dari "${formData.customerName}" berhasil disimpan.`
      );

      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan Testimoni', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus testimoni dari "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast.success('Testimoni Dihapus', `Testimoni dari "${name}" berhasil dihapus.`);
      router.refresh();
    } catch {
      showToast.error('Gagal Menghapus Testimoni', 'Gagal menghapus data testimoni');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
            Manajemen Testimoni
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola ulasan pelanggan standing flower. Hanya ulasan yang disetujui yang akan tayang di homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
              t.isApproved ? 'border-[#F0E4E7]' : 'border-dashed border-gray-300 bg-gray-50/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FFF0F4] text-[#B83253] font-bold text-xs flex items-center justify-center">
                    {t.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D2527]">
                      {t.customerName}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < t.rating ? 'text-[#DFB758] fill-[#DFB758]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleApproval(t)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    t.isApproved
                      ? 'bg-[#E8F8EE] text-[#1F5133] hover:bg-[#D4F4DF]'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t.isApproved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Disetujui (Tayang)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-gray-500" />
                      <span>Draft / Disembunyikan</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#5C4D52] leading-relaxed italic bg-[#FAF8F8] p-3 rounded-xl border border-[#F5E8EB]">
                &ldquo;{t.content}&rdquo;
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F5E6EA] flex items-center justify-between">
              <span className="text-[10px] text-[#8A7E82]">
                {new Date(t.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(t)}
                  className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253]"
                  title="Edit Testimoni"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id, t.customerName)}
                  className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2]"
                  title="Hapus Testimoni"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F0E4E7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5E6EA] mb-4">
              <h2 className="font-serif text-lg font-bold text-[#2D2527]">
                {editingItem ? 'Edit Testimoni' : 'Tambah Testimoni'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-[#FDEEEF] text-[#B83253] text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Nama Pelanggan <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Contoh: Ibu Jessica Tan"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Rating Bintang (1 - 5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253] bg-white"
                >
                  <option value={5}>★★★★★ (5 Bintang - Sempurna)</option>
                  <option value={4}>★★★★☆ (4 Bintang - Sangat Baik)</option>
                  <option value={3}>★★★☆☆ (3 Bintang - Cukup)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Isi Ulasan / Testimoni <span className="text-[#B83253]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Tulis ulasan pelanggan di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isApproved}
                  onChange={(e) =>
                    setFormData({ ...formData, isApproved: e.target.checked })
                  }
                  className="rounded text-[#B83253]"
                />
                <span>Setujui dan tampilkan langsung di homepage</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F5E6EA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8D9DC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#B83253] text-white font-bold hover:bg-[#a02845] flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
