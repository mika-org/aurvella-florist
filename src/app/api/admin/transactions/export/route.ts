import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { transactionDate: 'desc' },
    include: {
      items: true,
    },
  });

  // Build CSV format with UTF-8 BOM so Microsoft Excel renders Indonesian characters & Rupiah cleanly
  const BOM = '\uFEFF';
  const headers = [
    'No. Invoice',
    'Tanggal Transaksi',
    'Nama Pelanggan',
    'No. WhatsApp / HP',
    'Alamat Kirim',
    'Ucapan Papan Bunga',
    'Pengirim (Papan)',
    'SKU Produk',
    'Nama Produk',
    'Harga Satuan (Rp)',
    'Qty',
    'Subtotal Item (Rp)',
    'Total Transaksi (Rp)',
    'Metode Pembayaran',
    'Status Pembayaran',
    'Status Pesanan',
    'Catatan Khusus',
  ];

  const rows: string[][] = [];
  let totalGrossIncome = 0;
  let totalPaidIncome = 0;
  let totalItemsQuantity = 0;
  let totalItemsSubtotal = 0;

  for (const t of transactions) {
    const formattedDate = new Date(t.transactionDate).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const txAmount = Number(t.totalAmount) || 0;
    totalGrossIncome += txAmount;
    if (t.paymentStatus === 'PAID') {
      totalPaidIncome += txAmount;
    }

    for (const item of t.items) {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 1;
      const itemSub = Number(item.subtotal) || itemPrice * itemQty;

      totalItemsQuantity += itemQty;
      totalItemsSubtotal += itemSub;

      rows.push([
        t.invoiceNumber,
        formattedDate,
        t.customerName,
        t.customerPhone,
        t.customerAddress || '-',
        t.boardGreeting || '-',
        t.senderName || '-',
        item.productSku,
        item.productName,
        String(itemPrice),
        String(itemQty),
        String(itemSub),
        String(txAmount),
        t.paymentMethod,
        t.paymentStatus,
        t.orderStatus,
        t.notes || '-',
      ]);
    }
  }

  // Add Separator Row
  rows.push(new Array(headers.length).fill(''));

  // Add SUM Pemasukan & Total Row directly aligned with columns
  rows.push([
    'TOTAL KESELURUHAN (SUM)',
    `${transactions.length} Transaksi`,
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    String(totalItemsQuantity),
    String(totalItemsSubtotal),
    String(totalGrossIncome),
    '-',
    `Lunas: Rp ${totalPaidIncome.toLocaleString('id-ID')}`,
    '-',
    `TOTAL PEMASUKAN: Rp ${totalGrossIncome.toLocaleString('id-ID')}`,
  ]);

  // Add Additional Summary Block
  rows.push(new Array(headers.length).fill(''));
  rows.push(['=== RINGKASAN REKAP KEUANGAN AURVELLA FLORIST ===', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  rows.push(['Total Transaksi', `${transactions.length} pesanan`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  rows.push(['Total Standing Flower Terjual', `${totalItemsQuantity} pcs`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  rows.push(['Total Omset / Pemasukan Kotor (Rp)', String(totalGrossIncome), `(Rp ${totalGrossIncome.toLocaleString('id-ID')})`, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  rows.push(['Total Pembayaran Lunas (PAID) (Rp)', String(totalPaidIncome), `(Rp ${totalPaidIncome.toLocaleString('id-ID')})`, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  rows.push(['Total Belum Lunas / Pending (Rp)', String(totalGrossIncome - totalPaidIncome), `(Rp ${(totalGrossIncome - totalPaidIncome).toLocaleString('id-ID')})`, '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

  const escapeCsv = (val: string) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent =
    BOM +
    headers.map(escapeCsv).join(',') +
    '\r\n' +
    rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n');

  const nowStr = new Date().toISOString().slice(0, 10);
  const filename = `Rekap-Transaksi-AurvellaFlorist-${nowStr}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
