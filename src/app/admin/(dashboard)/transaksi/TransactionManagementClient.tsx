'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  TrendingUp,
  Package,
  X,
  Loader2,
  Receipt,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToast } from '@/context/AdminToastContext';

export interface TransactionItemData {
  id: string;
  productId?: string | null;
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  subtotal: number;
  product?: {
    images?: { url: string }[];
  } | null;
}

export interface TransactionData {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  boardGreeting?: string | null;
  senderName?: string | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string | null;
  transactionDate: string;
  createdAt: string;
  items: TransactionItemData[];
}

interface Props {
  initialTransactions: TransactionData[];
}

interface ProductSearchResult {
  id: string;
  sku: string;
  name: string;
  price: number;
  promoPrice: number | null;
  isPromo: boolean;
  categoryName: string;
  imageUrl: string;
}

export default function TransactionManagementClient({
  initialTransactions,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<TransactionData[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State: Create Transaction
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionData | null>(null);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [boardGreeting, setBoardGreeting] = useState('');
  const [senderName, setSenderName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [orderStatus, setOrderStatus] = useState('COMPLETED');
  const [notes, setNotes] = useState('');
  const [customDate, setCustomDate] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );

  // Form Items State
  const [items, setItems] = useState<
    {
      productId: string;
      productSku: string;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
      imageUrl: string;
    }[]
  >([]);

  // SKU & Product Search in Modal
  const [skuInput, setSkuInput] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [skuSearchError, setSkuSearchError] = useState<string | null>(null);

  // Loading & Error states
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calculate Aggregates
  const totalOmset = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalCompleted = transactions.filter((t) => t.orderStatus === 'COMPLETED').length;
  const totalPcs = transactions.reduce(
    (acc, t) => acc + t.items.reduce((sum, it) => sum + it.quantity, 0),
    0
  );

  // Find Top Selling Product from transactions
  const productCountMap: Record<string, { name: string; qty: number }> = {};
  transactions.forEach((t) => {
    t.items.forEach((it) => {
      if (!productCountMap[it.productSku]) {
        productCountMap[it.productSku] = { name: it.productName, qty: 0 };
      }
      productCountMap[it.productSku].qty += it.quantity;
    });
  });
  const topProduct = Object.values(productCountMap).sort((a, b) => b.qty - a.qty)[0];

  // Search by SKU handler
  const handleGetBySku = async () => {
    if (!skuInput.trim()) return;
    setIsSearchingProduct(true);
    setSkuSearchError(null);

    try {
      const res = await fetch(`/api/admin/products/search?sku=${encodeURIComponent(skuInput.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.product) {
        setSkuSearchError(data.message || 'Produk dengan SKU tersebut tidak ditemukan.');
        return;
      }

      addProductToItems(data.product);
      setSkuInput('');
    } catch {
      setSkuSearchError('Gagal mencari produk.');
    } finally {
      setIsSearchingProduct(false);
    }
  };

  // Search by Name / Live Query
  const handleLiveSearch = async (val: string) => {
    setSearchProductQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearchingProduct(true);
    try {
      const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      setSearchResults(data.products || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearchingProduct(false);
    }
  };

  const addProductToItems = (p: ProductSearchResult) => {
    const finalPrice = p.isPromo && p.promoPrice ? p.promoPrice : p.price;
    const existingIndex = items.findIndex((it) => it.productSku === p.sku);

    if (existingIndex >= 0) {
      // Increase qty
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].price;
      setItems(updated);
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: p.id,
          productSku: p.sku,
          productName: p.name,
          price: finalPrice,
          quantity: 1,
          subtotal: finalPrice,
          imageUrl: p.imageUrl,
        },
      ]);
    }
    setSearchResults([]);
    setSearchProductQuery('');
  };

  const updateItemQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...items];
    updated[index].quantity = newQty;
    updated[index].subtotal = newQty * updated[index].price;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const formGrandTotal = items.reduce((acc, it) => acc + it.subtotal, 0);

  const openCreateModal = () => {
    setEditingTxId(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setBoardGreeting('');
    setSenderName('');
    setPaymentMethod('TRANSFER');
    setPaymentStatus('PAID');
    setOrderStatus('COMPLETED');
    setNotes('');
    setCustomDate(new Date().toISOString().slice(0, 16));
    setItems([]);
    setSkuInput('');
    setSearchProductQuery('');
    setSearchResults([]);
    setSkuSearchError(null);
    setErrorMsg(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (tx: TransactionData) => {
    setEditingTxId(tx.id);
    setCustomerName(tx.customerName);
    setCustomerPhone(tx.customerPhone);
    setCustomerAddress(tx.customerAddress || '');
    setBoardGreeting(tx.boardGreeting || '');
    setSenderName(tx.senderName || '');
    setPaymentMethod(tx.paymentMethod);
    setPaymentStatus(tx.paymentStatus);
    setOrderStatus(tx.orderStatus);
    setNotes(tx.notes || '');
    setCustomDate(
      tx.transactionDate
        ? new Date(tx.transactionDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16)
    );
    setItems(
      tx.items.map((it) => ({
        productId: it.productId || '',
        productSku: it.productSku,
        productName: it.productName,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.subtotal,
        imageUrl: it.product?.images?.[0]?.url || '/images/categories/standing-acrylic.png',
      }))
    );
    setSkuInput('');
    setSearchProductQuery('');
    setSearchResults([]);
    setSkuSearchError(null);
    setErrorMsg(null);
    setIsDetailModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTransaction = async (tx: TransactionData) => {
    if (
      !confirm(
        `Yakin ingin menghapus transaksi ${tx.invoiceNumber} (${tx.customerName})?\n\nJumlah total penjualan produk terkait akan disesuaikan otomatis.`
      )
    ) {
      return;
    }

    setIsDeletingId(tx.id);
    try {
      const res = await fetch(`/api/admin/transactions/${tx.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus transaksi');
      }

      setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
      if (selectedTx?.id === tx.id) {
        setIsDetailModalOpen(false);
        setSelectedTx(null);
      }
      showToast.success('Transaksi Dihapus', `Transaksi ${tx.invoiceNumber} (${tx.customerName}) telah dihapus.`);
      router.refresh();
    } catch (err: any) {
      showToast.error('Gagal Menghapus Transaksi', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Pilih atau masukkan minimal 1 produk pesanan.');
      showToast.warning('Pesanan Kosong', 'Pilih atau masukkan minimal 1 produk pesanan.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerAddress,
        boardGreeting,
        senderName,
        paymentMethod,
        paymentStatus,
        orderStatus,
        notes,
        customDate,
        items,
      };

      const url = editingTxId
        ? `/api/admin/transactions/${editingTxId}`
        : '/api/admin/transactions';
      const method = editingTxId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        let message = data.error || 'Gagal menyimpan transaksi';
        if (data.details && typeof data.details === 'object') {
          const detailMessages = Object.entries(data.details)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join(' | ');
          if (detailMessages) message = `${data.error || 'Validasi gagal'}: ${detailMessages}`;
        }
        throw new Error(message);
      }

      showToast.persistSuccess(
        editingTxId ? 'Transaksi Diperbarui' : 'Transaksi Baru Tercatat',
        `Transaksi untuk ${customerName} berhasil disimpan ke sistem.`
      );

      setIsCreateModalOpen(false);
      setEditingTxId(null);
      window.location.reload();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem.';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan Transaksi', msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Download Excel Rekap
  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    showToast.info('Mengunduh Rekap...', 'Sedang menyiapkan data transaksi CSV.');
    try {
      const res = await fetch('/api/admin/transactions/export');
      if (!res.ok) throw new Error('Gagal mengunduh rekap transaksi');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const todayStr = new Date().toISOString().slice(0, 10);
      a.download = `Rekap-Transaksi-AurvellaFlorist-${todayStr}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast.success('Unduhan Selesai', `File ${a.download} berhasil diunduh.`);
    } catch (err: any) {
      showToast.error('Gagal Mengunduh Rekap', err.message || 'Terjadi kesalahan saat download Excel/CSV');
    } finally {
      setIsDownloading(false);
    }
  };

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.customerPhone.includes(search) ||
      (t.boardGreeting && t.boardGreeting.toLowerCase().includes(search.toLowerCase())) ||
      (t.senderName && t.senderName.toLowerCase().includes(search.toLowerCase())) ||
      t.items.some((it) => it.productName.toLowerCase().includes(search.toLowerCase()) || it.productSku.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || t.orderStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Top CTA Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Modul Penjualan
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2527] mt-1">
            Data Transaksi &amp; Penjualan
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D72] mt-1">
            Kelola transaksi masuk, input order menggunakan SKU produk, dan unduh rekap Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Download Excel Button */}
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#1E7E34] bg-[#E8F8EE] border border-[#28A745]/30 hover:bg-[#D4EDDA] shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#1E7E34]" />
            ) : (
              <Download className="w-4 h-4 text-[#1E7E34]" />
            )}
            <span>Download Rekap Excel</span>
          </button>

          {/* Input Transaksi Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Sales Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A6D72]">Total Omset Penjualan</span>
            <div className="w-9 h-9 rounded-xl bg-[#E8F8EE] flex items-center justify-center text-[#28A745]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="font-serif text-2xl font-bold text-[#2D2527] block mt-2">
            {formatRupiah(totalOmset)}
          </span>
          <span className="text-[11px] text-[#28A745] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Dari {transactions.length} total transaksi tercatat
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A6D72]">Pesanan Selesai</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] flex items-center justify-center text-[#B83253]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-serif text-2xl font-bold text-[#B83253] block mt-2">
            {totalCompleted} Pesanan
          </span>
          <span className="text-[11px] text-[#7A6D72] mt-1 block">
            {transactions.length - totalCompleted} sedang diproses/berlangsung
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A6D72]">Total Bunga Terjual</span>
            <div className="w-9 h-9 rounded-xl bg-[#FFF9ED] flex items-center justify-center text-[#8E6D14]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="font-serif text-2xl font-bold text-[#8E6D14] block mt-2">
            {totalPcs} Rangkaian
          </span>
          <span className="text-[11px] text-[#7A6D72] mt-1 block">
            Standing Flower terkirim
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A6D72]">Produk Terlaris</span>
            <div className="w-9 h-9 rounded-xl bg-[#F0F5FF] flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <span className="font-bold text-sm text-[#2D2527] block mt-2 truncate" title={topProduct?.name || '-'}>
            {topProduct?.name || '-'}
          </span>
          <span className="text-[11px] text-[#2563EB] font-bold mt-1 block">
            🔥 Terjual {topProduct?.qty || 0} pcs
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFE4E7] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. Invoice, Nama Pembeli, WhatsApp, SKU, atau Ucapan Papan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs bg-white focus:outline-none focus:border-[#B83253]"
          >
            <option value="ALL">Semua Status Pesanan</option>
            <option value="COMPLETED">Selesai (Completed)</option>
            <option value="PROCESSING">Diproses (Processing)</option>
            <option value="DELIVERING">Sedang Dikirim (Delivering)</option>
            <option value="CANCELLED">Dibatalkan (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#EFE4E7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF6F8] border-b border-[#EFE4E7] text-[#6B5A60] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Invoice &amp; Tanggal</th>
                <th className="py-3.5 px-4">Pelanggan &amp; WhatsApp</th>
                <th className="py-3.5 px-4">Produk Standing Flower</th>
                <th className="py-3.5 px-4">Total Nilai</th>
                <th className="py-3.5 px-4">Status Pesanan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#8A7E82]">
                    Belum ada data transaksi yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FFF8FA] transition-colors">
                    {/* Invoice & Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#B83253] block">
                        {tx.invoiceNumber}
                      </span>
                      <span className="text-[11px] text-[#7A6D72] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#DFB758]" />
                        {new Date(tx.transactionDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Customer & Phone */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#2D2527] block">
                        {tx.customerName}
                      </span>
                      <a
                        href={`https://wa.me/${tx.customerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 fill-[#25D366]" />
                        {tx.customerPhone}
                      </a>
                    </td>

                    {/* Products */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {tx.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold bg-[#FAF3F5] text-[#B83253] border border-[#F5D5DE]">
                              {item.productSku}
                            </span>
                            <span className="font-medium text-[#2D2527] line-clamp-1">
                              {item.productName}
                            </span>
                            <span className="text-[10px] text-[#8E6D14] font-bold">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#2D2527] block">
                        {formatRupiah(tx.totalAmount)}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#7A6D72]">
                        {tx.paymentMethod} • {tx.paymentStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.orderStatus === 'COMPLETED'
                            ? 'bg-[#E8F8EE] text-[#1E7E34]'
                            : tx.orderStatus === 'PROCESSING'
                            ? 'bg-[#FFF9ED] text-[#8E6D14]'
                            : 'bg-[#FDEEEF] text-[#B83253]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.orderStatus === 'COMPLETED'
                              ? 'bg-[#1E7E34]'
                              : tx.orderStatus === 'PROCESSING'
                              ? 'bg-[#8E6D14]'
                              : 'bg-[#B83253]'
                          }`}
                        />
                        {tx.orderStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTx(tx);
                            setIsDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#B83253] bg-[#FAF3F5] hover:bg-[#FDE2E8] transition-colors"
                          title="Lihat Nota & Rincian Transaksi"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Nota</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(tx)}
                          className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253] transition-colors"
                          title="Edit Transaksi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTransaction(tx)}
                          disabled={isDeletingId === tx.id}
                          className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
                          title="Hapus Transaksi"
                        >
                          {isDeletingId === tx.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
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

      {/* MODAL 1: INPUT TRANSAKSI BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                  {editingTxId ? 'Edit Data Transaksi Penjualan' : 'Input Transaksi Penjualan Baru'}
                </h2>
                <span className="text-xs text-[#7A6D72]">
                  {editingTxId
                    ? 'Perbarui rincian pembeli, item produk, atau status pembayaran dan pesanan.'
                    : 'Pilih produk via pencarian atau masukkan SKU produk secara instan.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleSaveTransaction} className="space-y-6 text-xs">
              {/* SECTION: PRODUCT SELECTION VIA SKU OR SEARCH */}
              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F8E1E7] space-y-4">
                <span className="font-bold text-[#B83253] text-xs uppercase tracking-wider block">
                  1. Pilih Produk Standing Flower (Via SKU atau Pencarian)
                </span>

                {/* SKU Quick Lookup */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-8">
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Ketik SKU Produk
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: ACR-20261011-A8K2"
                      value={skuInput}
                      onChange={(e) => setSkuInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGetBySku();
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <button
                      type="button"
                      onClick={handleGetBySku}
                      disabled={isSearchingProduct || !skuInput.trim()}
                      className="w-full py-2 px-3 rounded-xl font-bold text-xs text-white bg-[#B83253] hover:bg-[#a02b48] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isSearchingProduct ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>Get Produk by SKU</span>
                    </button>
                  </div>
                </div>

                {skuSearchError && (
                  <p className="text-[11px] text-[#EF4444] font-medium">
                    {skuSearchError}
                  </p>
                )}

                {/* Or Search by Name */}
                <div className="relative">
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Atau Cari Nama Produk Standing Flower
                  </label>
                  <input
                    type="text"
                    placeholder="Ketik nama produk, misal: 'Blooming Pastel' atau 'Luxury Arch'..."
                    value={searchProductQuery}
                    onChange={(e) => handleLiveSearch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />

                  {/* Dropdown Search Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[#EFE4E7] max-h-52 overflow-y-auto z-20 divide-y divide-[#F5E6EA]">
                      {searchResults.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => addProductToItems(p)}
                          className="p-2.5 hover:bg-[#FFF8FA] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#FAF6F8] shrink-0 border border-[#F4E6EB]">
                              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-[#2D2527] block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#B83253]">
                                SKU: {p.sku} • {p.categoryName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <span className="font-bold text-[#B83253] text-xs block">
                              {formatRupiah(p.isPromo && p.promoPrice ? p.promoPrice : p.price)}
                            </span>
                            <span className="text-[10px] text-[#28A745] font-semibold">
                              + Tambah
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Items List in Form */}
                <div className="space-y-2 pt-2 border-t border-[#F5D5DE]">
                  <span className="font-semibold text-[#4A3E42] block">
                    Item Terpilih ({items.length} item):
                  </span>

                  {items.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white text-center text-[#8A7E82] border border-dashed border-[#E8D9DC]">
                      Belum ada produk yang ditambahkan. Gunakan pencarian SKU atau nama di atas.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((it, idx) => (
                        <div
                          key={it.productSku}
                          className="p-3 rounded-xl bg-white border border-[#E8D9DC] flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="min-w-0">
                              <span className="font-bold text-[#2D2527] block truncate">
                                {it.productName}
                              </span>
                              <span className="text-[10px] font-mono text-[#7A6D72]">
                                SKU: {it.productSku} • {formatRupiah(it.price)} / pcs
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center border border-[#E8D9DC] rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateItemQty(idx, it.quantity - 1)}
                                className="px-2 py-1 bg-[#FAF6F8] hover:bg-[#F5E6EA] text-xs font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-bold text-xs">
                                {it.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateItemQty(idx, it.quantity + 1)}
                                className="px-2 py-1 bg-[#FAF6F8] hover:bg-[#F5E6EA] text-xs font-bold"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-[#B83253] text-xs w-24 text-right">
                              {formatRupiah(it.subtotal)}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="p-1 rounded text-[#EF4444] hover:bg-[#FDEEEF]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#FFF0F4] font-bold text-xs text-[#B83253]">
                        <span>Grand Total Pesanan:</span>
                        <span className="text-sm font-extrabold">{formatRupiah(formGrandTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: CUSTOMER & ORDER DETAILS */}
              <div className="space-y-4">
                <span className="font-bold text-[#B83253] text-xs uppercase tracking-wider block">
                  2. Informasi Pembeli &amp; Kartu Ucapan Papan
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Nama Pembeli <span className="text-[#B83253]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ibu Sarah Wijaya"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Nomor WhatsApp / HP <span className="text-[#B83253]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Alamat Pengiriman (Bandung &amp; Sekitarnya)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Gedung Graha Manggala Siliwangi, Jl. Aceh No.66, Bandung"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Tulisan di Papan Bunga (Greeting)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: 'Selamat & Sukses atas Grand Opening Resto...'"
                      value={boardGreeting}
                      onChange={(e) => setBoardGreeting(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Nama Pengirim pada Papan Bunga
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: 'Direksi & Staff PT. Samudera Logistik Bandung'"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs bg-white focus:outline-none focus:border-[#B83253]"
                    >
                      <option value="TRANSFER">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="SHOPEE">Shopee Pay / App</option>
                      <option value="CASH">Tunai (Cash)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Status Pesanan
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs bg-white focus:outline-none focus:border-[#B83253]"
                    >
                      <option value="COMPLETED">Selesai (Completed)</option>
                      <option value="PROCESSING">Sedang Diproses</option>
                      <option value="DELIVERING">Sedang Dikirim</option>
                      <option value="CANCELLED">Dibatalkan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3E42] mb-1">
                      Tanggal &amp; Waktu Transaksi
                    </label>
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3E42] mb-1">
                    Catatan Khusus Florist (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kirim sebelum jam 09.00 pagi. Foto standing di lokasi."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#F5E6EA] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8D9DC] font-semibold text-[#6B5A60] hover:bg-[#FAF6F8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || items.length === 0}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingTxId ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL NOTA TRANSAKSI */}
      {isDetailModalOpen && selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-[#B83253]">
                  {selectedTx.invoiceNumber}
                </span>
                <h2 className="font-serif text-lg font-bold text-[#2D2527]">
                  Detail Nota Transaksi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-[#7A6D72] hover:bg-[#FAF3F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F8E1E7] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7A6D72]">Nama Pelanggan:</span>
                  <span className="font-bold text-[#2D2527]">{selectedTx.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6D72]">WhatsApp:</span>
                  <span className="font-mono text-[#25D366] font-semibold">{selectedTx.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6D72]">Tanggal:</span>
                  <span>{new Date(selectedTx.transactionDate).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6D72]">Metode &amp; Status:</span>
                  <span className="font-semibold text-[#8E6D14]">
                    {selectedTx.paymentMethod} • {selectedTx.orderStatus}
                  </span>
                </div>
              </div>

              {selectedTx.customerAddress && (
                <div>
                  <span className="font-semibold text-[#7A6D72] block">Alamat Kirim:</span>
                  <p className="text-[#2D2527] mt-0.5">{selectedTx.customerAddress}</p>
                </div>
              )}

              {selectedTx.boardGreeting && (
                <div className="p-3 rounded-xl bg-[#FAF6F8] border border-[#F2E4E8]">
                  <span className="font-bold text-[#B83253] text-[11px] block uppercase">
                    Ucapan di Papan Bunga:
                  </span>
                  <p className="italic text-[#2D2527] mt-1 font-serif">
                    &ldquo;{selectedTx.boardGreeting}&rdquo;
                  </p>
                  {selectedTx.senderName && (
                    <p className="text-[11px] text-[#7A6D72] mt-1.5 font-semibold">
                      Dari: {selectedTx.senderName}
                    </p>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="border-t border-[#F5E6EA] pt-3">
                <span className="font-bold text-[#4A3E42] block mb-2">Item Rangkaian:</span>
                <div className="space-y-2">
                  {selectedTx.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#2D2527] block">{item.productName}</span>
                        <span className="text-[10px] text-[#7A6D72] font-mono">
                          {item.productSku} • {formatRupiah(item.price)} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-[#B83253]">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#F5E6EA] pt-3 flex justify-between items-center font-bold text-sm text-[#2D2527]">
                <span>Total Tagihan:</span>
                <span className="text-[#B83253] text-base">{formatRupiah(selectedTx.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between items-center gap-2 pt-4 border-t border-[#F5E6EA]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(selectedTx)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#B83253]" />
                  <span>Edit Transaksi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTransaction(selectedTx)}
                  disabled={isDeletingId === selectedTx.id}
                  className="px-3.5 py-2 rounded-xl border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2] font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  {isDeletingId === selectedTx.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Hapus Transaksi</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#FAF3F5] text-[#B83253] font-bold text-xs hover:bg-[#FDE2E8]"
              >
                Tutup Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
