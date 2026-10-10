'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Loader2, FolderTree } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  _count?: { products: number };
}

interface Props {
  initialCategories: Category[];
}

export default function CategoryManagementClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/categories/standing-acrylic.png',
    order: 0,
    isActive: true,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setErrorMsg(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '/images/categories/standing-acrylic.png',
      order: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setErrorMsg(null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '/images/categories/standing-acrylic.png',
      order: cat.order,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      image: formData.image,
      order: Number(formData.order),
      isActive: formData.isActive,
    };

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan kategori');
      }

      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Gagal menghapus kategori');
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch {
      alert('Gagal menghapus kategori');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
            Manajemen Kategori
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola kelompok produk standing flower, thumbnail PNG, deskripsi, dan urutan tampil
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl p-5 border border-[#F0E4E7] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#FAF6F8] mb-4 border border-[#F5E6EA]">
                <Image
                  src={cat.image || '/images/categories/standing-acrylic.png'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 backdrop-blur-sm text-[#4A3E42]">
                  Urutan: {cat.order}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <h3 className="font-serif font-bold text-lg text-[#2D2527]">
                  {cat.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF9ED] text-[#8E6D14]">
                  {cat._count?.products || 0} Produk
                </span>
              </div>

              <p className="font-mono text-[11px] text-[#B83253] mt-0.5">
                /{cat.slug}
              </p>
              <p className="text-xs text-[#6B5E63] mt-2 line-clamp-2 leading-relaxed">
                {cat.description || 'Tidak ada deskripsi'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F5E6EA] flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                  cat.isActive ? 'text-[#25D366]' : 'text-[#8A7E82]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    cat.isActive ? 'bg-[#25D366]' : 'bg-[#8A7E82]'
                  }`}
                />
                {cat.isActive ? 'Aktif di Navigasi' : 'Nonaktif'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253]"
                  title="Edit Kategori"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2]"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
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
                  Nama Kategori <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Standing Acrylic"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Slug Kategori <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] font-mono focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Foto / Thumbnail Kategori"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                hint="Gambar kategori otomatis diunggah ke /uploads."
              />

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi singkat yang tampil di kartu kategori..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
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
                <span>Aktifkan Kategori ini di Website</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F5E6EA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FAF3F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-[#B83253] text-white font-bold hover:bg-[#a02845] flex items-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? 'Perbarui' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
