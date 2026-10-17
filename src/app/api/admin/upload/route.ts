import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Hanya file gambar yang diperbolehkan' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file terlalu besar (maksimal 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const cleanBase = path.basename(originalName, ext).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const filename = `${cleanBase || 'upload'}-${uniqueSuffix}${ext}`;

    // Target upload directories:
    // 1. VPS storage folder if specified
    const vpsStorage = process.env.STORAGE_PATH || '/var/www/storage-aurvella-florist/uploads';
    // 2. Next.js public uploads folder
    const publicUploads = path.join(process.cwd(), 'public', 'uploads');

    // Ensure public/uploads exists
    if (!fs.existsSync(publicUploads)) {
      fs.mkdirSync(publicUploads, { recursive: true });
    }
    fs.writeFileSync(path.join(publicUploads, filename), buffer);

    // If VPS storage folder exists, also write there
    if (fs.existsSync(/*turbopackIgnore: true*/ vpsStorage)) {
      try {
        fs.writeFileSync(path.join(vpsStorage, filename), buffer);
      } catch (err) {
        console.warn('Could not write to VPS storage path, using public/uploads:', err);
      }
    }

    // URLs
    const relativeUrl = `/uploads/${filename}`;
    const fullUrl = `https://aurvella-florist.elevore.web.id/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filename,
      url: relativeUrl,
      fullUrl,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengunggah gambar' },
      { status: 500 }
    );
  }
}
