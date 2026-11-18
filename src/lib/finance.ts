export type FinanceType = 'SALES_INCOME' | 'OTHER_INCOME' | 'EXPENSE';

export interface FinanceEntryData {
  id: string;
  type: FinanceType;
  revenue: number; // omset (SALES_INCOME)
  cost: number; // HPP & BOP (SALES_INCOME)
  amount: number; // pemasukan lainnya / pengeluaran
  description: string;
  entryDate: string; // ISO
}

export interface FinanceSummary {
  totalOmset: number;
  totalCost: number;
  totalOtherIncome: number;
  netProfit: number;
  totalExpense: number;
  balance: number;
}

export function computeSummary(
  entries: Pick<FinanceEntryData, 'type' | 'revenue' | 'cost' | 'amount'>[]
): FinanceSummary {
  let totalOmset = 0;
  let totalCost = 0;
  let totalOtherIncome = 0;
  let totalExpense = 0;

  for (const e of entries) {
    if (e.type === 'SALES_INCOME') {
      totalOmset += e.revenue;
      totalCost += e.cost;
    } else if (e.type === 'OTHER_INCOME') {
      totalOtherIncome += e.amount;
    } else if (e.type === 'EXPENSE') {
      totalExpense += e.amount;
    }
  }

  // Nett profit hanya dari penjualan; pemasukan lainnya langsung menambah saldo.
  const netProfit = totalOmset - totalCost;
  return {
    totalOmset,
    totalCost,
    totalOtherIncome,
    netProfit,
    totalExpense,
    balance: netProfit + totalOtherIncome - totalExpense,
  };
}

/** Nilai yang ditampilkan di kolom "Total Nilai" pada tabel. */
export function entryValue(e: Pick<FinanceEntryData, 'type' | 'revenue' | 'amount'>): number {
  return e.type === 'SALES_INCOME' ? e.revenue : e.amount;
}

export const FINANCE_TYPE_LABEL: Record<FinanceType, string> = {
  SALES_INCOME: 'Omset Masuk',
  OTHER_INCOME: 'Uang Masuk',
  EXPENSE: 'Uang Keluar',
};

const JUTA = 1_000_000;

export type StatusLevel = 'SANGAT_BAIK' | 'BAIK' | 'KURANG_BAIK' | 'AMAN' | 'OVER';

export interface StatusResult {
  level: StatusLevel;
  label: string;
}

/** Omset: >=100jt sangat baik, >=50jt baik, selebihnya kurang baik. */
export function omsetStatus(v: number): StatusResult {
  if (v >= 100 * JUTA) return { level: 'SANGAT_BAIK', label: 'SANGAT BAIK' };
  if (v >= 50 * JUTA) return { level: 'BAIK', label: 'BAIK' };
  return { level: 'KURANG_BAIK', label: 'KURANG BAIK' };
}

/** Nett profit: >=25jt sangat baik, >=15jt baik, selebihnya (<15jt) kurang baik. */
export function netProfitStatus(v: number): StatusResult {
  if (v >= 25 * JUTA) return { level: 'SANGAT_BAIK', label: 'SANGAT BAIK' };
  if (v >= 15 * JUTA) return { level: 'BAIK', label: 'BAIK' };
  return { level: 'KURANG_BAIK', label: 'KURANG BAIK' };
}

/** Saldo: >50jt aman, >=20jt baik, selebihnya kurang baik. */
export function balanceStatus(v: number): StatusResult {
  if (v > 50 * JUTA) return { level: 'AMAN', label: 'AMAN' };
  if (v >= 20 * JUTA) return { level: 'BAIK', label: 'BAIK' };
  return { level: 'KURANG_BAIK', label: 'KURANG BAIK' };
}

/** Pengeluaran: <10jt sangat baik, 10-50jt kurang baik, >50jt over. */
export function expenseStatus(v: number): StatusResult {
  if (v > 50 * JUTA) return { level: 'OVER', label: 'OVER' };
  if (v >= 10 * JUTA) return { level: 'KURANG_BAIK', label: 'KURANG BAIK' };
  return { level: 'SANGAT_BAIK', label: 'SANGAT BAIK' };
}

export function parseFinanceBody(body: any):
  | { ok: true; data: { type: FinanceType; revenue: number; cost: number; amount: number; description: string; entryDate: Date } }
  | { ok: false; error: string } {
  const type = body?.type as FinanceType;
  if (!['SALES_INCOME', 'OTHER_INCOME', 'EXPENSE'].includes(type)) {
    return { ok: false, error: 'Jenis transaksi tidak valid' };
  }

  const num = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  const description = String(body?.description ?? '').trim();
  if (!description) return { ok: false, error: 'Keterangan wajib diisi' };

  let revenue = 0;
  let cost = 0;
  let amount = 0;

  if (type === 'SALES_INCOME') {
    revenue = num(body.revenue);
    cost = num(body.cost ?? 0);
    if (!(revenue > 0)) return { ok: false, error: 'Nominal omset harus lebih dari 0' };
    if (!(cost >= 0)) return { ok: false, error: 'Nominal HPP & BOP tidak valid' };
  } else {
    amount = num(body.amount);
    if (!(amount > 0)) return { ok: false, error: 'Nominal harus lebih dari 0' };
  }

  const entryDate = body?.entryDate ? new Date(body.entryDate) : new Date();
  if (isNaN(entryDate.getTime())) return { ok: false, error: 'Tanggal tidak valid' };

  return { ok: true, data: { type, revenue, cost, amount, description, entryDate } };
}

export function serializeEntry(e: {
  id: string;
  type: string;
  revenue: unknown;
  cost: unknown;
  amount: unknown;
  description: string;
  entryDate: Date;
}): FinanceEntryData {
  return {
    id: e.id,
    type: e.type as FinanceType,
    revenue: Number(e.revenue),
    cost: Number(e.cost),
    amount: Number(e.amount),
    description: e.description,
    entryDate: e.entryDate.toISOString(),
  };
}
