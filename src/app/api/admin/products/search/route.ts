import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const sku = searchParams.get('sku') || '';

  if (sku) {
    // Exact or prefix SKU lookup
    const product = await prisma.product.findFirst({
      where: {
        sku: { equals: sku, mode: 'insensitive' },
      },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
    });

    if (!product) {
      return NextResponse.json({ product: null, message: 'Produk dengan SKU tersebut tidak ditemukan' });
    }

    return NextResponse.json({
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: Number(product.price),
        promoPrice: product.isPromo && product.promoPrice ? Number(product.promoPrice) : null,
        isPromo: product.isPromo,
        categoryName: product.category.name,
        imageUrl: product.images[0]?.url || '/images/categories/standing-acrylic.png',
      },
    });
  }

  // General search by name or SKU
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 10,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    price: Number(p.price),
    promoPrice: p.isPromo && p.promoPrice ? Number(p.promoPrice) : null,
    isPromo: p.isPromo,
    categoryName: p.category.name,
    imageUrl: p.images[0]?.url || '/images/categories/standing-acrylic.png',
  }));

  return NextResponse.json({ products: serialized });
}
