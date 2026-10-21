'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  FileText,
  Phone,
  Instagram,
  ShoppingBag,
  Send,
  Globe,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/context/AdminToastContext';

interface SocialLink {
  id: string;
  title: string;
  url: string;
  type: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
}

interface Props {
  initialLinks: SocialLink[];
}

export default function LinkManagementClient({ initialLinks }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'GOOGLE_DRIVE' as any,
    description: '',
    order: 0,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setErrorMsg(null);
    setFormData({
      title: '',
      url: '',
      type: 'GOOGLE_DRIVE',
      description: '',
      order: links.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (link: SocialLink) => {
    setEditingItem(link);
    setErrorMsg(null);
    setFormData({
      title: link.title,
      url: link.url,
      type: link.type,
      description: link.description || '',
      order: link.order,
      isActive: link.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const url = editingItem
        ? `/api/admin/links/${editingItem.id}`
        : '/api/admin/links';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: Number(formData.order),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan link');

      showToast.persistSuccess(
        editingItem ? 'Tautan Diperbarui' : 'Tautan Ditambahkan',
        `Tautan "${formData.title}" berhasil disimpan.`
      );

      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan Tautan', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus link "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setLinks((prev) => prev.filter((l) => l.id !== id));
      showToast.success('Tautan Dihapus', `Tautan "${title}" berhasil dihapus.`);
      router.refresh();
    } catch {
      showToast.error('Gagal Menghapus Tautan', 'Terjadi kesalahan saat menghapus tautan');
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return 'bg-[#E8F8EE] text-[#1F5133]';
      case 'GOOGLE_DRIVE':
        return 'bg-[#FFF9ED] text-[#8E6D14]';
      case 'INSTAGRAM':
        return 'bg-[#FFF0F4] text-[#B83253]';
      case 'SHOPEE':
        return 'bg-[#FFF4F0] text-[#EE4D2D]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
            Manajemen Link Tree
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola tombol tautan pada halaman <code className="bg-gray-100 px-1 py-0.5 rounded">/link</code>, termasuk berbagai tautan Google Drive pricelist/portofolio
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tautan Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4E7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A3E42]">
            <thead className="bg-[#FAF3F5] text-[#2D2527] font-semibold border-b border-[#F0E4E7] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Urutan</th>
                <th className="py-3.5 px-4">Tipe Link</th>
                <th className="py-3.5 px-4">Judul Tautan</th>
                <th className="py-3.5 px-4">URL Tujuan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA]">
              {links.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFF9FA] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#8E6D14]">
                    #{item.order}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadgeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#2D2527] block">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-[10px] text-[#7A6D72] block">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B83253] hover:underline flex items-center gap-1"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isActive
                          ? 'bg-[#E8F8EE] text-[#1F5133]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253]"
                        title="Edit Tautan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2]"
                        title="Hapus Tautan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5E6EA] mb-4">
              <h2 className="font-serif text-lg font-bold text-[#2D2527]">
                {editingItem ? 'Edit Tautan Link Tree' : 'Tambah Tautan Link Tree'}
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
                  Judul Tautan <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Pricelist Standing Flower 2026 (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  URL Tujuan <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Jenis Tautan
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] bg-white focus:outline-none focus:border-[#B83253]"
                  >
                    <option value="GOOGLE_DRIVE">📁 Google Drive (Pricelist/Katalog)</option>
                    <option value="WHATSAPP">💬 WhatsApp Chat</option>
                    <option value="INSTAGRAM">📸 Instagram</option>
                    <option value="SHOPEE">🛍️ Shopee Store</option>
                    <option value="TIKTOK">🎵 TikTok</option>
                    <option value="WEBSITE">🌐 Website</option>
                    <option value="MAPS">📍 Google Maps</option>
                    <option value="OTHER">🔗 Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Contoh: Unduh file katalog standing flower lengkap"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded text-[#B83253]"
                />
                <span>Tampilkan di halaman Link Tree publik</span>
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
