import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { productSchema } from '@/lib/validations';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = productSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validasi data gagal', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check slug uniqueness excluding self
    const existingSlug = await prisma.product.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug sudah dipakai oleh produk lain.' },
        { status: 400 }
      );
    }

    // Check SKU if provided manual change
    if (data.sku) {
      const existingSku = await prisma.product.findFirst({
        where: { sku: data.sku, id: { not: id } },
      });
      if (existingSku) {
        return NextResponse.json(
          { error: 'SKU sudah dipakai oleh produk lain.' },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        price: data.price,
        promoPrice: data.isPromo && data.promoPrice ? data.promoPrice : null,
        isPromo: data.isPromo,
        promoStart: data.promoStart ? new Date(data.promoStart) : null,
        promoEnd: data.promoEnd ? new Date(data.promoEnd) : null,
        isFeatured: data.isFeatured,
        isAvailable: data.isAvailable,
        isPublished: data.isPublished,
        description: data.description || null,
        specifications: data.specifications || null,
        order: data.order,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        ...(data.sku ? { sku: data.sku } : {}),
      },
    });

    // Update images if provided
    if (data.images && data.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: data.images.map((img, idx) => ({
          productId: id,
          url: img.url,
          alt: img.alt || data.name,
          isPrimary: img.isPrimary ?? idx === 0,
          order: idx,
        })),
      });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}
