import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, productIds, categoryId } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Tidak ada produk yang dipilih' }, { status: 400 });
    }

    switch (action) {
      case 'SET_HERO':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { showOnHero: true },
        });
        break;

      case 'UNSET_HERO':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { showOnHero: false },
        });
        break;

      case 'SET_FEATURED':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: true },
        });
        break;

      case 'UNSET_FEATURED':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isFeatured: false },
        });
        break;

      case 'SET_PUBLISHED':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isPublished: true },
        });
        break;

      case 'SET_DRAFT':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isPublished: false },
        });
        break;

      case 'SET_AVAILABLE':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isAvailable: true },
        });
        break;

      case 'SET_UNAVAILABLE':
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isAvailable: false },
        });
        break;

      case 'SET_CATEGORY':
        if (!categoryId) {
          return NextResponse.json({ error: 'Kategori tujuan harus dipilih' }, { status: 400 });
        }
        await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { categoryId },
        });
        break;

      case 'DELETE':
        await prisma.productImage.deleteMany({
          where: { productId: { in: productIds } },
        });
        await prisma.product.deleteMany({
          where: { id: { in: productIds } },
        });
        break;

      default:
        return NextResponse.json({ error: `Aksi massal "${action}" tidak dikenali` }, { status: 400 });
    }

    revalidatePath('/');
    revalidatePath('/produk');
    revalidatePath('/admin/produk');

    return NextResponse.json({
      success: true,
      count: productIds.length,
      action,
      message: `Berhasil memproses ${productIds.length} produk.`,
    });
  } catch (error: any) {
    console.error('Bulk product update error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses aksi massal produk' },
      { status: 500 }
    );
  }
}
