import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { productSchema } from '@/lib/validations';
import { generateUniqueSku } from '@/lib/sku';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { order: 'asc' } },
    },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = productSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validasi data gagal', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check slug uniqueness
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug produk sudah digunakan. Silakan gunakan slug lain.' },
        { status: 400 }
      );
    }

    // Get category for SKU generation
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: 'Kategori tidak valid' }, { status: 400 });
    }

    // Generate automatic unique SKU if not provided or override
    let sku = data.sku?.trim();
    if (!sku) {
      sku = await generateUniqueSku(category.slug);
    } else {
      // Validate unique SKU
      const existingSku = await prisma.product.findUnique({
        where: { sku },
      });
      if (existingSku) {
        return NextResponse.json(
          { error: 'SKU ini sudah digunakan produk lain. Gunakan SKU unik.' },
          { status: 400 }
        );
      }
    }

    const createdProduct = await prisma.product.create({
      data: {
        sku,
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        price: data.price,
        promoPrice: data.isPromo && data.promoPrice ? data.promoPrice : null,
        isPromo: data.isPromo,
        promoStart: data.promoStart ? new Date(data.promoStart) : null,
        promoEnd: data.promoEnd ? new Date(data.promoEnd) : null,
        isFeatured: data.isFeatured,
        showOnHero: data.showOnHero ?? false,
        isAvailable: data.isAvailable,
        isPublished: data.isPublished,
        description: data.description || null,
        specifications: data.specifications || null,
        order: data.order,
        totalSold: data.totalSold ?? 0,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        images: {
          create: (data.images && data.images.length > 0
            ? data.images
            : [{ url: '/images/categories/standing-acrylic.png', alt: data.name, isPrimary: true }]
          ).map((img, idx) => ({
            url: img.url,
            alt: img.alt || data.name,
            isPrimary: img.isPrimary ?? idx === 0,
            order: idx,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/produk');
    revalidatePath('/admin/produk');

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan produk' },
      { status: 500 }
    );
  }
}
