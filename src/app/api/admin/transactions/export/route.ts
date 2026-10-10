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

  for (const t of transactions) {
    const formattedDate = new Date(t.transactionDate).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (const item of t.items) {
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
        String(Number(item.price)),
        String(item.quantity),
        String(Number(item.subtotal)),
        String(Number(t.totalAmount)),
        t.paymentMethod,
        t.paymentStatus,
        t.orderStatus,
        t.notes || '-',
      ]);
    }
  }

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
