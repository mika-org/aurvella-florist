'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  FileDown,
  X,
  Loader2,
  Trash2,
  Edit2,
  Banknote,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useToast } from '@/context/AdminToastContext';
import {
  FINANCE_TYPE_LABEL,
  balanceStatus,
  computeSummary,
  entryValue,
  expenseStatus,
  netProfitStatus,
  omsetStatus,
  type FinanceEntryData,
  type FinanceType,
  type StatusLevel,
} from '@/lib/finance';

interface Props {
  initialEntries: FinanceEntryData[];
}

const STATUS_STYLE: Record<StatusLevel, string> = {
  SANGAT_BAIK: 'bg-[#B9F36B] border-[#7BC62A] text-[#1F4D0A]',
  BAIK: 'bg-[#CFF0C4] border-[#8FCB7E] text-[#1E5B12]',
  AMAN: 'bg-[#BFE3FA] border-[#6BB4E0] text-[#0B3F63]',
  KURANG_BAIK: 'bg-[#FFE7A8] border-[#E8C25A] text-[#7A5600]',
  OVER: 'bg-[#FF8A8A] border-[#E04848] text-[#5E0B0B]',
};

const TYPE_BADGE: Record<FinanceType, string> = {
  SALES_INCOME: 'bg-[#E8F8EE] text-[#1E7E34] border-[#C3E6CB]',
  OTHER_INCOME: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  EXPENSE: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

const todayInput = () => new Date().toISOString().slice(0, 10);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function FinanceManagementClient({ initialEntries }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [entries, setEntries] = useState<FinanceEntryData[]>(initialEntries);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | FinanceType>('ALL');

  // Modal / form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<FinanceType>('SALES_INCOME');
  const [revenue, setRevenue] = useState('');
  const [cost, setCost] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState(todayInput());
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const summary = useMemo(() => computeSummary(entries), [entries]);

  const statuses = useMemo(
    () => [
      { key: 'omset', title: 'OMSET', result: omsetStatus(summary.totalOmset) },
      { key: 'net', title: 'NETT PROFIT', result: netProfitStatus(summary.netProfit) },
      { key: 'saldo', title: 'SALDO', result: balanceStatus(summary.balance) },
      { key: 'out', title: 'PENGELUARAN', result: expenseStatus(summary.totalExpense) },
    ],
    [summary]
  );

  const filtered = entries.filter((e) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      e.description.toLowerCase().includes(q) ||
      FINANCE_TYPE_LABEL[e.type].toLowerCase().includes(q);
    const matchType = typeFilter === 'ALL' || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const resetForm = () => {
    setFormType('SALES_INCOME');
    setRevenue('');
    setCost('');
    setAmount('');
    setDescription('');
    setEntryDate(todayInput());
    setErrorMsg(null);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: FinanceEntryData) => {
    setEditingId(e.id);
    setFormType(e.type);
    setRevenue(e.type === 'SALES_INCOME' ? String(e.revenue) : '');
    setCost(e.type === 'SALES_INCOME' ? String(e.cost) : '');
    setAmount(e.type !== 'SALES_INCOME' ? String(e.amount) : '');
    setDescription(e.description);
    setEntryDate(e.entryDate.slice(0, 10));
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const payload =
      formType === 'SALES_INCOME'
        ? { type: formType, revenue: Number(revenue), cost: Number(cost || 0), description, entryDate }
        : { type: formType, amount: Number(amount), description, entryDate };

    try {
      const res = await fetch(editingId ? `/api/admin/finance/${editingId}` : '/api/admin/finance', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan transaksi keuangan');

      const saved: FinanceEntryData = data.entry;
      setEntries((prev) => {
        const next = editingId
          ? prev.map((x) => (x.id === editingId ? saved : x))
          : [saved, ...prev];
        return next.sort((a, b) => b.entryDate.localeCompare(a.entryDate));
      });
      showToast.success(
        editingId ? 'Data Keuangan Diperbarui' : 'Transaksi Keuangan Tercatat',
        'Data keuangan berhasil disimpan.'
      );
      setIsModalOpen(false);
      setEditingId(null);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem.';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e: FinanceEntryData) => {
    if (!confirm(`Yakin ingin menghapus data "${e.description}"?`)) return;
    setDeletingId(e.id);
    try {
      const res = await fetch(`/api/admin/finance/${e.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus data keuangan');
      setEntries((prev) => prev.filter((x) => x.id !== e.id));
      showToast.success('Data Dihapus', 'Data keuangan telah dihapus.');
      router.refresh();
    } catch (err: any) {
      showToast.error('Gagal Menghapus', err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setDeletingId(null);
    }
  };

  // "Unduh Sebagai PDF": buka laporan siap cetak, lalu pilih "Simpan sebagai PDF".
  const handleDownloadPdf = () => {
    const rows = filtered
      .map(
        (e) => `<tr>
          <td>${FINANCE_TYPE_LABEL[e.type]}</td>
          <td>${formatDate(e.entryDate)}</td>
          <td>${escapeHtml(e.description)}</td>
          <td class="r">${formatRupiah(entryValue(e))}</td>
        </tr>`
      )
      .join('');

    const summaryRows: [string, number][] = [
      ['Total Omset Penjualan', summary.totalOmset],
      ['Total HPP & BOP', summary.totalCost],
      ['Pemasukan Lainnya', summary.totalOtherIncome],
      ['Total Nett Profit', summary.netProfit],
      ['Total Pengeluaran', summary.totalExpense],
      ['Total Saldo di Rekening Bisnis', summary.balance],
    ];

    const html = `<!doctype html><html><head><meta charset="utf-8" />
      <title>Laporan Keuangan Aurvella Florist</title>
      <style>
        body{font-family:Arial,sans-serif;color:#2D2527;padding:32px;font-size:12px}
        h1{font-size:20px;margin:0 0 4px} p{margin:0 0 16px;color:#7A6D72}
        table{width:100%;border-collapse:collapse;margin-bottom:24px}
        th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
        th{background:#f4eef0} .r{text-align:right}
        .sum td:first-child{width:60%}
      </style></head><body>
      <h1>Laporan Keuangan - Aurvella Florist</h1>
      <p>Dicetak ${formatDate(new Date().toISOString())}</p>
      <table class="sum">${summaryRows
        .map(([l, v]) => `<tr><td>${l}</td><td class="r"><b>${formatRupiah(v)}</b></td></tr>`)
        .join('')}</table>
      <table><thead><tr><th>Status</th><th>Waktu Transaksi</th><th>Keterangan</th><th class="r">Total Nilai</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4">Belum ada data.</td></tr>'}</tbody></table>
      <script>window.onload=function(){window.print()}</script>
      </body></html>`;

    const w = window.open('', '_blank');
    if (!w) {
      showToast.error('Gagal Membuka Laporan', 'Izinkan pop-up pada browser untuk mengunduh PDF.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const summaryCards = [
    { label: 'Total Omset Penjualan', value: summary.totalOmset, icon: TrendingUp, tone: 'text-[#28A745] bg-[#E8F8EE]' },
    { label: 'Total HPP & BOP', value: summary.totalCost, icon: Wallet, tone: 'text-[#8E6D14] bg-[#FFF9ED]' },
    { label: 'Total Nett Profit', value: summary.netProfit, icon: Banknote, tone: 'text-[#2563EB] bg-[#F0F5FF]' },
    { label: 'Total Pemasukan Lainnya', value: summary.totalOtherIncome, icon: ArrowUpRight, tone: 'text-[#1D4ED8] bg-[#EFF6FF]' },
    { label: 'Total Saldo di Rekening Bisnis', value: summary.balance, icon: Wallet, tone: 'text-[#B83253] bg-[#FFF0F4]' },
    { label: 'Total Pengeluaran', value: summary.totalExpense, icon: ArrowDownRight, tone: 'text-[#DC2626] bg-[#FEF2F2]' },
  ];

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]';

  const nominalField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    required = true
  ) => (
    <div>
      <label className="block font-semibold text-[#4A3E42] mb-1">
        {label} {required && <span className="text-[#B83253]">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6D72]">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          required={required}
          value={value ? Number(value).toLocaleString('id-ID') : ''}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          placeholder="0"
          className={`${inputCls} pl-10 font-bold`}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">Catatan Keuangan</span>
          <h1 className="font-serif text-3xl font-bold text-[#2D2527] mt-1 uppercase">
            Data Transaksi Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D72] mt-1">
            Kelola transaksi keuangan masuk &amp; keluar
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-[#1E7E34] bg-[#E8F8EE] border border-[#28A745]/40 hover:bg-[#D4EDDA] shadow-sm transition-all hover:scale-[1.02]"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Sebagai PDF</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Input Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="p-5 rounded-2xl bg-white border border-[#EFE4E7] shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-[#7A6D72]">{c.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <span
                className={`font-serif text-xl font-bold block mt-3 ${
                  c.value < 0 ? 'text-[#DC2626]' : 'text-[#2D2527]'
                }`}
              >
                {formatRupiah(c.value)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Table column */}
        <div className="space-y-4 min-w-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EFE4E7] flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Berdasarkan Kategori Keuangan"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputCls} pl-10`}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'ALL' | FinanceType)}
              className="px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs bg-white focus:outline-none focus:border-[#B83253]"
            >
              <option value="ALL">Semua Status Keuangan</option>
              <option value="SALES_INCOME">Omset Masuk</option>
              <option value="OTHER_INCOME">Uang Masuk</option>
              <option value="EXPENSE">Uang Keluar</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#EFE4E7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F8] border-b border-[#EFE4E7] text-[#6B5A60] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Waktu Transaksi</th>
                    <th className="py-3.5 px-4">Keterangan Transaksi</th>
                    <th className="py-3.5 px-4 text-right">Total Nilai</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5E6EA]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[#8A7E82]">
                        Belum ada data keuangan yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((e) => (
                      <tr key={e.id} className="hover:bg-[#FFF8FA] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${TYPE_BADGE[e.type]}`}
                          >
                            {e.type === 'EXPENSE' ? (
                              <ArrowDownRight className="w-3 h-3" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3" />
                            )}
                            {FINANCE_TYPE_LABEL[e.type]}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#4A3E42]">{formatDate(e.entryDate)}</td>
                        <td className="py-3 px-4 text-[#2D2527]">
                          {e.description}
                          {e.type === 'SALES_INCOME' && (
                            <span className="block text-[10px] text-[#7A6D72]">
                              HPP &amp; BOP: {formatRupiah(e.cost)}
                            </span>
                          )}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                            e.type === 'EXPENSE' ? 'text-[#DC2626]' : 'text-[#1E7E34]'
                          }`}
                        >
                          {e.type === 'EXPENSE' ? '-' : ''}
                          {formatRupiah(entryValue(e))}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(e)}
                              className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FFF5F7] hover:text-[#B83253] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(e)}
                              disabled={deletingId === e.id}
                              className="p-1.5 rounded-lg border border-[#E8D9DC] text-[#EF4444] hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
                              title="Hapus"
                            >
                              {deletingId === e.id ? (
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
        </div>

        {/* Status Keuangan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EFE4E7]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#2D2527]" />
            <h2 className="font-serif font-bold text-[#2D2527]">Status Keuangan</h2>
          </div>
          <div className="space-y-3">
            {statuses.map((s) => (
              <div
                key={s.key}
                className={`px-3 py-2 rounded-xl border-2 text-center text-[11px] font-extrabold tracking-wide shadow-sm ${STATUS_STYLE[s.result.level]}`}
              >
                {s.title} : {s.result.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Input */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0E4E7] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5E6EA] mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2D2527]">
                  {editingId ? 'Edit Transaksi Keuangan' : 'Input Transaksi Keuangan'}
                </h2>
                <span className="text-xs text-[#7A6D72]">Pilih jenis transaksi lalu isi nominalnya.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#7A6D72] hover:bg-[#FAF3F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#FDEEEF] text-[#B83253] text-xs font-medium">{errorMsg}</div>
            )}

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['SALES_INCOME', 'Pemasukan Penjualan'],
                    ['OTHER_INCOME', 'Pemasukan Lainnya'],
                    ['EXPENSE', 'Pengeluaran'],
                  ] as [FinanceType, string][]
                ).map(([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    disabled={!!editingId && formType !== t}
                    onClick={() => setFormType(t)}
                    className={`px-2 py-2.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-40 ${
                      formType === t
                        ? 'bg-[#B83253] text-white shadow-sm'
                        : 'bg-white border border-[#E8D9DC] text-[#4A3E42] hover:bg-[#FAF3F5]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {formType === 'SALES_INCOME' ? (
                <>
                  {nominalField('Nominal Omset', revenue, setRevenue)}
                  {nominalField('Nominal HPP & BOP', cost, setCost, false)}
                </>
              ) : (
                nominalField(
                  formType === 'OTHER_INCOME' ? 'Nominal Pemasukan' : 'Nominal Pengeluaran',
                  amount,
                  setAmount
                )
              )}

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">
                  Keterangan <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    formType === 'EXPENSE' ? 'Contoh: Beli kertas & pita' : 'Contoh: Orderan bunga'
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3E42] mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="pt-4 border-t border-[#F5E6EA] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8D9DC] font-semibold text-[#6B5A60] hover:bg-[#FAF6F8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#B83253] to-[#DF4D73] hover:opacity-95 shadow-md shadow-[#B83253]/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? 'Simpan Perubahan' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
