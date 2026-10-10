'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  Flower2,
  Tag,
  Eye,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  promoPrice: number | null;
  isPromo: boolean;
  promoEnd?: string | Date | null;
  totalSold?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  description: string | null;
  specifications: string | null;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; alt?: string | null }[];
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

const DEFAULT_ACRYLIC_SPEC = `• Papan akrilik berkualitas tebal 3 mm
• Bentuk papan persegi ukuran 70 × 120 cm
• Warna papan akrilik putih susu elegan
• Menggunakan bunga fresh dan artificial premium
• Standing kayu ukuran 150 cm finishing putih bersih
• Free kartu ucapan & pita eksklusif`;

export default function ProductManagementClient({
  initialProducts,
  categories,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: categories[0]?.id || '',
    price: 850000,
    promoPrice: '',
    isPromo: false,
    promoEnd: '',
    isFeatured: true,
    isAvailable: true,
    isPublished: true,
    description: '',
    specifications: '',
    imageUrl: '/images/categories/standing-acrylic.png',
  });

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setErrorMsg(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      categoryId: categories[0]?.id || '',
      price: 850000,
      promoPrice: '',
      isPromo: false,
      promoEnd: '',
      isFeatured: false,
      isAvailable: true,
      isPublished: true,
      description: '',
      specifications: '',
      imageUrl: '/images/categories/standing-acrylic.png',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setErrorMsg(null);
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      categoryId: p.categoryId,
      price: p.price,
      promoPrice: p.promoPrice ? String(p.promoPrice) : '',
      isPromo: p.isPromo,
      promoEnd: p.promoEnd ? new Date(p.promoEnd).toISOString().slice(0, 16) : '',
      isFeatured: p.isFeatured,
      isAvailable: p.isAvailable,
      isPublished: p.isPublished,
      description: p.description || '',
      specifications: p.specifications || '',
      imageUrl: p.images[0]?.url || '/images/categories/standing-acrylic.png',
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
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      sku: formData.sku || undefined,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      promoPrice: formData.isPromo && formData.promoPrice ? Number(formData.promoPrice) : null,
      isPromo: formData.isPromo,
      promoEnd: formData.isPromo && formData.promoEnd ? new Date(formData.promoEnd).toISOString() : null,
      isFeatured: formData.isFeatured,
      isAvailable: formData.isAvailable,
      isPublished: formData.isPublished,
      description: formData.description,
      specifications: formData.specifications,
      images: [{ url: formData.imageUrl, alt: formData.name, isPrimary: true }],
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan produk');
      }

      setIsModalOpen(false);
      router.refresh();
      // Reload page state
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      alert('Gagal menghapus produk');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
            Manajemen Produk
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola katalog standing flower, harga promo, spesifikasi material, dan SKU otomatis
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0E4E7] shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama produk, SKU, atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
          />
        </div>
        <span className="text-xs font-semibold text-[#8A7E82]">
          Menampilkan {filtered.length} dari {products.length} produk
        </span>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-[#F0E4E7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A3E42]">
            <thead className="bg-[#FAF3F5] text-[#2D2527] font-semibold border-b border-[#F0E4E7] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Normal</th>
                <th className="py-3.5 px-4">Harga Promo</th>
                <th className="py-3.5 px-4">Terjual</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA]">
              {filtered.map((p) => {
                const img = p.images[0]?.url || '/images/categories/standing-acrylic.png';
                return (
                  <tr key={p.id} className="hover:bg-[#FFF9FA] transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#FAF6F8] shrink-0 border border-[#F2E4E8]">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[#2D2527] block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#8A7E82] block truncate">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU with copy button */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleCopySku(p.sku)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold bg-[#FAF3F5] text-[#B83253] border border-[#F5D5DE] hover:bg-[#FDE2E8] transition-colors"
                        title="Klik untuk salin SKU"
                      >
                        {copiedSku === p.sku ? (
                          <Check className="w-3 h-3 text-[#25D366]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#B83253]" />
                        )}
                        <span>{p.sku}</span>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#FFF9ED] text-[#8E6D14] border border-[#DFB758]/30">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Normal Price */}
                    <td className="py-3 px-4 font-semibold text-[#2D2527] whitespace-nowrap">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Promo Price */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {p.isPromo && p.promoPrice ? (
                        <div>
                          <span className="font-bold text-[#B83253] block">
                            {formatRupiah(p.promoPrice)}
                          </span>
                          {p.promoEnd && (
                            <span className="text-[10px] text-[#8E6D14] font-mono block">
                              Exp: {new Date(p.promoEnd).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#8A7E82]">-</span>
                      )}
                    </td>

                    {/* Total Sold */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#B83253] bg-[#FFF0F4] px-2.5 py-1 rounded-full text-[11px] border border-[#F8B4C4]">
                        🔥 {p.totalSold || 0} pcs
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.isPublished ? 'bg-[#25D366]' : 'bg-[#EF4444]'
                          }`}
                        />
                        <span className="text-[11px]">
                          {p.isPublished ? 'Tayang' : 'Draft'}
                        </span>
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#DFB758] text-[#1E1719]">
                            Unggulan
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
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
                  Nama Produk <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Standing Acrylic Blooming Pastel"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Slug URL <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Kategori <span className="text-[#B83253]">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU notice */}
              <div className="p-3 rounded-xl bg-[#FFF9ED] border border-[#DFB758]/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#8E6D14] block">
                    {editingProduct ? `SKU Produk: ${formData.sku}` : 'SKU Otomatis'}
                  </span>
                  <span className="text-[11px] text-[#8E6D14]/80">
                    {editingProduct
                      ? 'Dapat diubah manual jika diperlukan (harus tetap unik)'
                      : 'SKU unik akan digenerate otomatis di server dengan format [PREFIX]-[TANGGAL]-[KODE]'}
                  </span>
                </div>
                {editingProduct && (
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-36 px-2 py-1 rounded border border-[#DFB758] font-mono text-xs"
                  />
                )}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Harga Normal (Rp) <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Harga Promo (Rp) (Harus &lt; Harga Normal)
                  </label>
                  <input
                    type="number"
                    disabled={!formData.isPromo}
                    placeholder="Contoh: 750000"
                    value={formData.promoPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, promoPrice: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253] disabled:bg-gray-100"
                  />
                </div>
              </div>

              {formData.isPromo && (
                <div className="p-3.5 rounded-xl bg-[#FFF5F7] border border-[#F8B4C4]">
                  <label className="block font-semibold text-[#B83253] mb-1">
                    Batas Waktu Promo (Countdown Live &amp; Auto-Hilang)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.promoEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, promoEnd: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#F8B4C4] text-xs focus:outline-none focus:border-[#B83253] bg-white font-mono"
                  />
                  <p className="text-[11px] text-[#8A4557] mt-1">
                    Timer countdown akan otomatis tampil di Hero Banner, Katalog, dan Halaman Produk. Saat batas waktu habis, promo akan otomatis hilang dan harga kembali ke normal.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPromo}
                    onChange={(e) =>
                      setFormData({ ...formData, isPromo: e.target.checked })
                    }
                    className="rounded text-[#B83253]"
                  />
                  <span>Aktifkan Status Promo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded text-[#B83253]"
                  />
                  <span>Tampilkan di Produk Unggulan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="rounded text-[#B83253]"
                  />
                  <span>Publikasikan ke Website</span>
                </label>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  URL Gambar Produk
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-[#4A3E42]">
                    Spesifikasi & Material
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        specifications: DEFAULT_ACRYLIC_SPEC,
                      })
                    }
                    className="text-[10px] text-[#B83253] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#DFB758]" />
                    Gunakan Template Akrilik Default
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData({ ...formData, specifications: e.target.value })
                  }
                  placeholder="Masukkan poin spesifikasi material..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

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
                  <span>{editingProduct ? 'Perbarui Produk' : 'Simpan Produk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
