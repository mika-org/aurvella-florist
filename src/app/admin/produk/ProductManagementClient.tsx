'use client';

import React, { useState, useMemo } from 'react';
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
  EyeOff,
  X,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Tv,
  CheckSquare,
  Square,
  MinusSquare,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import ImageUploadField from '@/components/admin/ImageUploadField';

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
  showOnHero?: boolean;
  description: string | null;
  specifications: string | null;
  category: { id: string; name: string; slug: string };
  images: { id: string; url: string; alt?: string | null }[];
  order?: number;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductManagementClient({
  initialProducts,
  categories,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Filters State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [featuredFilter, setFeaturedFilter] = useState('ALL'); // ALL, FEATURED, NON_FEATURED
  const [heroFilter, setHeroFilter] = useState('ALL'); // ALL, HERO, NON_HERO
  const [promoFilter, setPromoFilter] = useState('ALL'); // ALL, PROMO, REGULAR
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PUBLISHED, DRAFT
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // ALL, AVAILABLE, OUT_OF_STOCK
  const [sortBy, setSortBy] = useState('order_asc'); // order_asc, created_desc, price_asc, price_desc, name_asc, sold_desc

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [quickLoadingId, setQuickLoadingId] = useState<string | null>(null);

  // Copy SKU state
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
    isFeatured: false,
    isAvailable: true,
    isPublished: true,
    showOnHero: false,
    totalSold: 0,
    description: '',
    specifications: '',
    imageUrl: '/images/categories/standing-acrylic.png',
  });

  // Calculate counts for quick chips
  const totalOnHero = useMemo(() => products.filter((p) => p.showOnHero).length, [products]);
  const totalFeatured = useMemo(() => products.filter((p) => p.isFeatured).length, [products]);
  const totalPromo = useMemo(() => products.filter((p) => p.isPromo).length, [products]);
  const totalDraft = useMemo(() => products.filter((p) => !p.isPublished).length, [products]);

  // Filter and Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCat = p.category.name.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchCat && !matchSlug) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) {
        return false;
      }

      // 3. Featured Filter
      if (featuredFilter === 'FEATURED' && !p.isFeatured) return false;
      if (featuredFilter === 'NON_FEATURED' && p.isFeatured) return false;

      // 4. Hero Filter
      if (heroFilter === 'HERO' && !p.showOnHero) return false;
      if (heroFilter === 'NON_HERO' && p.showOnHero) return false;

      // 5. Promo Filter
      if (promoFilter === 'PROMO' && !p.isPromo) return false;
      if (promoFilter === 'REGULAR' && p.isPromo) return false;

      // 6. Status Filter
      if (statusFilter === 'PUBLISHED' && !p.isPublished) return false;
      if (statusFilter === 'DRAFT' && p.isPublished) return false;

      // 7. Availability Filter
      if (availabilityFilter === 'AVAILABLE' && !p.isAvailable) return false;
      if (availabilityFilter === 'OUT_OF_STOCK' && p.isAvailable) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return Number(a.price) - Number(b.price);
        case 'price_desc':
          return Number(b.price) - Number(a.price);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'sold_desc':
          return (b.totalSold || 0) - (a.totalSold || 0);
        case 'created_desc':
          return new Date(b.slug).getTime() - new Date(a.slug).getTime(); // fallback or stable
        case 'order_asc':
        default:
          return (a.order || 0) - (b.order || 0);
      }
    });

    return result;
  }, [
    products,
    search,
    categoryFilter,
    featuredFilter,
    heroFilter,
    promoFilter,
    statusFilter,
    availabilityFilter,
    sortBy,
  ]);

  // Pagination calculation
  const totalItems = filteredAndSorted.length;
  const effectivePageSize = pageSize === 0 ? totalItems || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));

  // Ensure current page is valid when filter changes
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProducts = useMemo(() => {
    if (pageSize === 0) return filteredAndSorted;
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return filteredAndSorted.slice(startIdx, startIdx + pageSize);
  }, [filteredAndSorted, safeCurrentPage, pageSize]);

  // Checkbox helpers
  const currentPageIds = useMemo(() => paginatedProducts.map((p) => p.id), [paginatedProducts]);
  const isAllCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));
  const isSomeCurrentPageSelected =
    currentPageIds.some((id) => selectedIds.has(id)) && !isAllCurrentPageSelected;

  const toggleSelectAllCurrentPage = () => {
    const next = new Set(selectedIds);
    if (isAllCurrentPageSelected) {
      currentPageIds.forEach((id) => next.delete(id));
    } else {
      currentPageIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  const selectAllFiltered = () => {
    const next = new Set<string>();
    filteredAndSorted.forEach((p) => next.add(p.id));
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleRowSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const resetAllFilters = () => {
    setSearch('');
    setCategoryFilter('ALL');
    setFeaturedFilter('ALL');
    setHeroFilter('ALL');
    setPromoFilter('ALL');
    setStatusFilter('ALL');
    setAvailabilityFilter('ALL');
    setSortBy('order_asc');
    setCurrentPage(1);
  };

  const isAnyFilterActive =
    search !== '' ||
    categoryFilter !== 'ALL' ||
    featuredFilter !== 'ALL' ||
    heroFilter !== 'ALL' ||
    promoFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    availabilityFilter !== 'ALL' ||
    sortBy !== 'order_asc';

  // Quick Inline Toggle for Hero Banner / Featured / Published
  const handleQuickToggle = async (
    product: Product,
    field: 'showOnHero' | 'isFeatured' | 'isPublished' | 'isAvailable'
  ) => {
    const newValue = !product[field];
    setQuickLoadingId(`${product.id}-${field}`);

    // Optimistic local update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, [field]: newValue } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui data');
      }
    } catch (e: any) {
      alert(e.message || 'Gagal menyimpan perubahan');
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, [field]: product[field] } : p))
      );
    } finally {
      setQuickLoadingId(null);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: string, extraData?: any) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    const actionLabels: Record<string, string> = {
      SET_HERO: `tampilkan ${ids.length} produk terpilih di Hero Banner Slider`,
      UNSET_HERO: `sembunyikan ${ids.length} produk terpilih dari Hero Banner Slider`,
      SET_FEATURED: `jadikan ${ids.length} produk terpilih sebagai Produk Unggulan`,
      UNSET_FEATURED: `hapus status Unggulan pada ${ids.length} produk terpilih`,
      SET_PUBLISHED: `publikasikan ${ids.length} produk terpilih`,
      SET_DRAFT: `jadikan draft / sembunyikan ${ids.length} produk terpilih`,
      DELETE: `HAPUS PERMANEN ${ids.length} produk terpilih? Tindakan ini tidak dapat dibatalkan!`,
    };

    const confirmMsg = actionLabels[action] || `proses aksi massal pada ${ids.length} produk`;
    if (!confirm(`Konfirmasi: Apakah Anda yakin ingin ${confirmMsg}?`)) {
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productIds: ids,
          ...extraData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses aksi massal');
      }

      // Local state update
      if (action === 'DELETE') {
        setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      } else {
        setProducts((prev) =>
          prev.map((p) => {
            if (!selectedIds.has(p.id)) return p;
            if (action === 'SET_HERO') return { ...p, showOnHero: true };
            if (action === 'UNSET_HERO') return { ...p, showOnHero: false };
            if (action === 'SET_FEATURED') return { ...p, isFeatured: true };
            if (action === 'UNSET_FEATURED') return { ...p, isFeatured: false };
            if (action === 'SET_PUBLISHED') return { ...p, isPublished: true };
            if (action === 'SET_DRAFT') return { ...p, isPublished: false };
            return p;
          })
        );
      }

      clearSelection();
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem saat memproses aksi massal.');
    } finally {
      setBulkLoading(false);
    }
  };

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
      showOnHero: false,
      totalSold: 0,
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
      showOnHero: Boolean(p.showOnHero),
      totalSold: p.totalSold || 0,
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
      showOnHero: formData.showOnHero,
      totalSold: Math.max(0, parseInt(String(formData.totalSold), 10) || 0),
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

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
              Manajemen Produk
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF3F5] text-[#B83253] border border-[#F5D5DE]">
              {products.length} Produk
            </span>
          </div>
          <p className="text-xs text-[#7A6D72] mt-1">
            Kelola katalog standing flower, seleksi unggulan, hero banner slider, harga promo, dan SKU otomatis
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B83253] to-[#CE4467] hover:opacity-95 transition-all shadow-md shadow-[#B83253]/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* 2. Quick Stat Chips (Interactive Filter Shortcuts) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Hero Banner Chip */}
        <button
          type="button"
          onClick={() => {
            setHeroFilter((prev) => (prev === 'HERO' ? 'ALL' : 'HERO'));
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            heroFilter === 'HERO'
              ? 'bg-[#FFF0F4] border-[#B83253] ring-2 ring-[#B83253]/20 shadow-sm'
              : 'bg-white border-[#F0E4E7] hover:border-[#B83253]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B5E63] flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-[#B83253]" />
              Hero Banner Slider
            </span>
            <span className="text-xs font-mono font-bold text-[#B83253]">
              {totalOnHero}
            </span>
          </div>
          <span className="text-[10px] text-[#8E6D14] mt-1 block">
            {heroFilter === 'HERO' ? '✓ Filter Aktif' : 'Klik untuk filter'}
          </span>
        </button>

        {/* Featured Chip */}
        <button
          type="button"
          onClick={() => {
            setFeaturedFilter((prev) => (prev === 'FEATURED' ? 'ALL' : 'FEATURED'));
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            featuredFilter === 'FEATURED'
              ? 'bg-[#FFF9ED] border-[#DFB758] ring-2 ring-[#DFB758]/20 shadow-sm'
              : 'bg-white border-[#F0E4E7] hover:border-[#DFB758]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B5E63] flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#DFB758] fill-[#DFB758]" />
              Produk Unggulan
            </span>
            <span className="text-xs font-mono font-bold text-[#8E6D14]">
              {totalFeatured}
            </span>
          </div>
          <span className="text-[10px] text-[#8E6D14] mt-1 block">
            {featuredFilter === 'FEATURED' ? '✓ Filter Aktif' : 'Tampil di Homepage'}
          </span>
        </button>

        {/* Promo Chip */}
        <button
          type="button"
          onClick={() => {
            setPromoFilter((prev) => (prev === 'PROMO' ? 'ALL' : 'PROMO'));
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            promoFilter === 'PROMO'
              ? 'bg-[#F0FDF4] border-[#22C55E] ring-2 ring-[#22C55E]/20 shadow-sm'
              : 'bg-white border-[#F0E4E7] hover:border-[#22C55E]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B5E63] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#16A34A]" />
              Sedang Promo
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A]">
              {totalPromo}
            </span>
          </div>
          <span className="text-[10px] text-[#6B5E63] mt-1 block">
            {promoFilter === 'PROMO' ? '✓ Filter Aktif' : 'Harga Diskon Aktif'}
          </span>
        </button>

        {/* Draft Chip */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter((prev) => (prev === 'DRAFT' ? 'ALL' : 'DRAFT'));
            setCurrentPage(1);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            statusFilter === 'DRAFT'
              ? 'bg-[#FEF2F2] border-[#EF4444] ring-2 ring-[#EF4444]/20 shadow-sm'
              : 'bg-white border-[#F0E4E7] hover:border-[#EF4444]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B5E63] flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-[#EF4444]" />
              Draft / Sembunyi
            </span>
            <span className="text-xs font-mono font-bold text-[#EF4444]">
              {totalDraft}
            </span>
          </div>
          <span className="text-[10px] text-[#6B5E63] mt-1 block">
            {statusFilter === 'DRAFT' ? '✓ Filter Aktif' : 'Tidak tampil ke publik'}
          </span>
        </button>
      </div>

      {/* 3. Comprehensive Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#F0E4E7] shadow-sm space-y-4">
        {/* Row 1: Search + Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama bunga, kode SKU, kata kunci..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253] focus:ring-1 focus:ring-[#B83253]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs font-semibold text-[#6B5E63] whitespace-nowrap">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#E8D9DC] text-xs bg-white text-[#2D2527] focus:outline-none focus:border-[#B83253]"
            >
              <option value="order_asc">Urutan Default Katalog</option>
              <option value="price_asc">Harga: Termurah &rarr; Termahal</option>
              <option value="price_desc">Harga: Termahal &rarr; Termurah</option>
              <option value="name_asc">Nama Produk: A &rarr; Z</option>
              <option value="sold_desc">Terlaris (Total Sold)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Tabs / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-[#8E6D14] uppercase tracking-wider whitespace-nowrap mr-1">
            Kategori:
          </span>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('ALL');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-[#B83253] text-white shadow-sm'
                : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
            }`}
          >
            Semua ({products.length})
          </button>
          {categories.map((c) => {
            const countInCat = products.filter((p) => p.categoryId === c.id).length;
            const isSelected = categoryFilter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(c.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#B83253] text-white shadow-sm'
                    : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
                }`}
              >
                {c.name} ({countInCat})
              </button>
            );
          })}
        </div>

        {/* Row 3: Secondary Filter Dropdowns & Reset */}
        <div className="pt-2 border-t border-[#F5E6EA] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Featured filter */}
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#E8D9DC] text-xs bg-white text-[#4A3E42] focus:outline-none focus:border-[#B83253]"
            >
              <option value="ALL">Semua Unggulan</option>
              <option value="FEATURED">⭐ Unggulan Saja</option>
              <option value="NON_FEATURED">Bukan Unggulan</option>
            </select>

            {/* Hero filter */}
            <select
              value={heroFilter}
              onChange={(e) => {
                setHeroFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#E8D9DC] text-xs bg-white text-[#4A3E42] focus:outline-none focus:border-[#B83253]"
            >
              <option value="ALL">Semua Hero Banner</option>
              <option value="HERO">🚀 Tampil di Hero</option>
              <option value="NON_HERO">Tidak di Hero</option>
            </select>

            {/* Promo filter */}
            <select
              value={promoFilter}
              onChange={(e) => {
                setPromoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#E8D9DC] text-xs bg-white text-[#4A3E42] focus:outline-none focus:border-[#B83253]"
            >
              <option value="ALL">Semua Tipe Harga</option>
              <option value="PROMO">🏷️ Sedang Promo</option>
              <option value="REGULAR">Harga Normal</option>
            </select>

            {/* Published filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#E8D9DC] text-xs bg-white text-[#4A3E42] focus:outline-none focus:border-[#B83253]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">🟢 Tayang (Published)</option>
              <option value="DRAFT">🔴 Draft (Disembunyikan)</option>
            </select>

            {/* Reset Button */}
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B83253] bg-[#FFF0F4] hover:bg-[#FDE2E8] border border-[#F5D5DE] transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-[#8A7E82]">
            Ditemukan <span className="text-[#B83253] font-bold">{totalItems}</span> dari {products.length} produk
          </div>
        </div>
      </div>

      {/* 4. Sticky Bulk Actions Toolbar (Appears when >= 1 item is selected) */}
      {selectedIds.size > 0 && (
        <div className="sticky top-20 z-30 bg-[#1A1416] text-white rounded-2xl p-4 shadow-2xl border border-[#DFB758]/40 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#B83253] text-white shadow-sm flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{selectedIds.size} Produk Dipilih</span>
            </span>

            {selectedIds.size < totalItems && (
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-xs text-[#DFB758] hover:underline font-semibold"
              >
                Pilih seluruh {totalItems} hasil filter
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {bulkLoading ? (
              <div className="flex items-center gap-2 text-xs text-white/80 py-1 px-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#DFB758]" />
                <span>Memproses {selectedIds.size} produk...</span>
              </div>
            ) : (
              <>
                {/* Hero Banner bulk actions */}
                <button
                  type="button"
                  onClick={() => handleBulkAction('SET_HERO')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B83253] to-[#CE4467] text-white text-xs font-bold hover:opacity-95 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Tampilkan semua produk terpilih di slider hero banner"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>+ Tampil di Hero</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkAction('UNSET_HERO')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 flex items-center gap-1.5 transition-all"
                  title="Hapus dari slider hero banner"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>- Hapus dari Hero</span>
                </button>

                {/* Featured bulk actions */}
                <button
                  type="button"
                  onClick={() => handleBulkAction('SET_FEATURED')}
                  className="px-3 py-1.5 rounded-xl bg-[#DFB758] text-[#1A1416] text-xs font-extrabold hover:bg-[#c9a144] flex items-center gap-1.5 transition-all shadow-sm"
                  title="Jadikan produk unggulan di homepage"
                >
                  <Star className="w-3.5 h-3.5 fill-[#1A1416]" />
                  <span>+ Unggulan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkAction('UNSET_FEATURED')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 flex items-center gap-1.5 transition-all"
                  title="Hapus status unggulan"
                >
                  <span>- Unggulan</span>
                </button>

                {/* Publish / Draft */}
                <button
                  type="button"
                  onClick={() => handleBulkAction('SET_PUBLISHED')}
                  className="px-3 py-1.5 rounded-xl bg-[#22C55E] text-white text-xs font-bold hover:bg-[#16A34A] flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Publikasikan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkAction('SET_DRAFT')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 flex items-center gap-1 transition-all"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Draft</span>
                </button>

                {/* Bulk Delete */}
                <button
                  type="button"
                  onClick={() => handleBulkAction('DELETE')}
                  className="px-3 py-1.5 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>

                {/* Clear selection */}
                <button
                  type="button"
                  onClick={clearSelection}
                  className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-1"
                  title="Batal Pilih"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. Product Table */}
      <div className="bg-white rounded-3xl border border-[#F0E4E7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A3E42]">
            <thead className="bg-[#FAF3F5] text-[#2D2527] font-semibold border-b border-[#F0E4E7] uppercase tracking-wider text-[11px]">
              <tr>
                {/* Select All Checkbox */}
                <th className="py-3.5 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAllCurrentPage}
                    className="p-1 rounded hover:bg-white text-[#B83253] transition-colors"
                    title={isAllCurrentPageSelected ? 'Batal pilih halaman ini' : 'Pilih semua di halaman ini'}
                  >
                    {isAllCurrentPageSelected ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : isSomeCurrentPageSelected ? (
                      <MinusSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Normal</th>
                <th className="py-3.5 px-4">Harga Promo</th>
                <th className="py-3.5 px-4 text-center">Terjual</th>
                <th className="py-3.5 px-4 text-center">Hero Slider</th>
                <th className="py-3.5 px-4 text-center">Unggulan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA]">
              {paginatedProducts.map((p) => {
                const img = p.images[0]?.url || '/images/categories/standing-acrylic.png';
                const isSelected = selectedIds.has(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-[#FFF5F7]' : 'hover:bg-[#FFF9FA]'
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleRowSelect(p.id)}
                        className="p-1 rounded hover:bg-white text-[#B83253] transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    </td>

                    {/* Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF6F8] shrink-0 border border-[#F2E4E8] shadow-xs">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-[#2D2527] block truncate" title={p.name}>
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#8A7E82] block truncate font-mono">
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
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold bg-[#FAF3F5] text-[#B83253] border border-[#F5D5DE] hover:bg-[#FDE2E8] transition-colors"
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
                    <td className="py-3 px-4 font-bold text-[#2D2527] whitespace-nowrap">
                      {formatRupiah(p.price)}
                    </td>

                    {/* Promo Price */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {p.isPromo && p.promoPrice ? (
                        <div>
                          <span className="font-extrabold text-[#B83253] block">
                            {formatRupiah(p.promoPrice)}
                          </span>
                          {p.promoEnd && (
                            <span className="text-[9px] text-[#8E6D14] font-mono block">
                              s/d {new Date(p.promoEnd).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#A59A9E]">-</span>
                      )}
                    </td>

                    {/* Total Sold */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          (p.totalSold || 0) > 0
                            ? 'bg-[#FFF0F4] text-[#B83253] border border-[#F8B4C4]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                        title={`Total terjual dari orderan: ${p.totalSold || 0} pcs`}
                      >
                        {(p.totalSold || 0) > 0 ? `🔥 ${p.totalSold} pcs` : '0 pcs'}
                      </span>
                    </td>

                    {/* Quick Toggle: Hero Slider */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(p, 'showOnHero')}
                        disabled={quickLoadingId === `${p.id}-showOnHero`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          p.showOnHero
                            ? 'bg-[#B83253] text-white shadow-xs hover:bg-[#a02845]'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Klik untuk ubah status tampil di Hero Banner"
                      >
                        {quickLoadingId === `${p.id}-showOnHero` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Tv className="w-3 h-3" />
                        )}
                        <span>{p.showOnHero ? 'Tampil' : 'Off'}</span>
                      </button>
                    </td>

                    {/* Quick Toggle: Featured */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(p, 'isFeatured')}
                        disabled={quickLoadingId === `${p.id}-isFeatured`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          p.isFeatured
                            ? 'bg-[#FFF2D6] text-[#8E6D14] border border-[#DFB758] shadow-xs hover:bg-[#FCE6B7]'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Klik untuk ubah status Produk Unggulan di Homepage"
                      >
                        {quickLoadingId === `${p.id}-isFeatured` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Star className={`w-3 h-3 ${p.isFeatured ? 'fill-[#DFB758]' : ''}`} />
                        )}
                        <span>{p.isFeatured ? 'Unggulan' : 'Biasa'}</span>
                      </button>
                    </td>

                    {/* Quick Toggle: Publish Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(p, 'isPublished')}
                        disabled={quickLoadingId === `${p.id}-isPublished`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          p.isPublished
                            ? 'bg-[#E8F8EE] text-[#1E7E34] hover:bg-[#d4f2de]'
                            : 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#fcd2d2]'
                        }`}
                        title="Klik untuk toggle Publikasi/Draft"
                      >
                        {quickLoadingId === `${p.id}-isPublished` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isPublished ? 'bg-[#1E7E34]' : 'bg-[#DC2626]'
                            }`}
                          />
                        )}
                        <span>{p.isPublished ? 'Tayang' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253] transition-colors"
                          title="Edit Produk Lengkap"
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

              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-[#8A7E82]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Flower2 className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="font-semibold text-sm text-[#2D2527]">
                        Tidak ada produk yang cocok dengan filter.
                      </p>
                      <p className="text-xs text-[#8A7E82]">
                        Coba ubah kata kunci pencarian atau reset filter.
                      </p>
                      {isAnyFilterActive && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          className="mt-2 px-4 py-1.5 rounded-xl bg-[#B83253] text-white text-xs font-bold"
                        >
                          Reset Semua Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer Controls */}
        <div className="p-4 border-t border-[#F0E4E7] bg-[#FAF8F8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B5E63]">
          {/* Left: Info & Rows per page selector */}
          <div className="flex items-center gap-3">
            <span>
              Menampilkan{' '}
              <strong className="text-[#2D2527]">
                {totalItems === 0
                  ? 0
                  : `${(safeCurrentPage - 1) * pageSize + 1} - ${Math.min(
                      safeCurrentPage * pageSize,
                      totalItems
                    )}`}
              </strong>{' '}
              dari <strong className="text-[#2D2527]">{totalItems}</strong> produk
            </span>

            <div className="flex items-center gap-1.5 border-l border-gray-300 pl-3">
              <span>Baris per halaman:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-[#B83253]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>Semua ({totalItems})</option>
              </select>
            </div>
          </div>

          {/* Right: Page Buttons */}
          {totalPages > 1 && pageSize > 0 && (
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Pertama"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page Number Chips */}
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show current page, edges, and nearby pages
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safeCurrentPage) <= 2
                    );
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const hasGap = prevP && p - prevP > 1;

                    return (
                      <React.Fragment key={p}>
                        {hasGap && <span className="px-1 text-gray-400">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                            p === safeCurrentPage
                              ? 'bg-[#B83253] text-white shadow-xs'
                              : 'bg-white hover:bg-gray-100 border border-gray-200 text-[#4A3E42]'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Halaman Terakhir"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7. Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8A7E82] hover:bg-[#FAF3F5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#FDEEEF] border border-[#B83253]/30 text-[#B83253] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              {/* Image Upload */}
              <ImageUploadField
                label="Foto Produk Utama"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
              />

              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Nama Produk <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Standing Acrylic Sweet Rose"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    URL Slug <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
                  />
                </div>
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Kode SKU (Kosongkan untuk auto-generate)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto: ACR-20261017-0001"
                    value={formData.sku}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs font-mono uppercase focus:outline-none focus:border-[#B83253]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Kategori <span className="text-[#B83253]">*</span>
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs bg-white focus:outline-none focus:border-[#B83253]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Promo & Sold Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Harga Normal (Rp) <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Harga Promo (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    placeholder="Opsional jika ada diskon"
                    value={formData.promoPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, promoPrice: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Berlaku Promo Hingga
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.promoEnd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, promoEnd: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                    Jumlah Terjual (Pcs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.totalSold}
                    onChange={(e) => setFormData((prev) => ({ ...prev, totalSold: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-[#8A7E82] mt-0.5 block truncate">
                    Sinkron otomatis dari pesanan
                  </span>
                </div>
              </div>

              {/* Flags: Promo, Featured, Available, Published, ShowOnHero */}
              <div className="p-4 rounded-2xl bg-[#FAF8F8] border border-[#F0E4E7] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2D2527]">
                  <input
                    type="checkbox"
                    checked={formData.isPromo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPromo: e.target.checked }))}
                    className="w-4 h-4 text-[#B83253] rounded"
                  />
                  <span>Aktifkan Label Promo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2D2527]">
                  <input
                    type="checkbox"
                    checked={formData.showOnHero}
                    onChange={(e) => setFormData((prev) => ({ ...prev, showOnHero: e.target.checked }))}
                    className="w-4 h-4 text-[#B83253] rounded"
                  />
                  <span>Tampilkan di Hero Banner Slider</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2D2527]">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-[#B83253] rounded"
                  />
                  <span>Produk Unggulan (Homepage)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2D2527]">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-[#B83253] rounded"
                  />
                  <span>Tayang ke Publik (Published)</span>
                </label>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                  Spesifikasi Material Produk
                </label>
                <textarea
                  rows={4}
                  value={formData.specifications}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specifications: e.target.value }))}
                  placeholder="Gunakan tanda bullet • untuk poin spesifikasi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs font-mono leading-relaxed focus:outline-none focus:border-[#B83253]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi puitis dan daya tarik produk standing flower..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs leading-relaxed focus:outline-none focus:border-[#B83253]"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F5E6EA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs font-semibold text-[#6B5E63] hover:bg-[#FAF8F8] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#B83253] hover:bg-[#a02845] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#B83253]/20"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
