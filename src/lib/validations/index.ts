import { z } from 'zod';

export const adminLoginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Username atau email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(100),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Format slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter').max(150),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Format slug tidak valid'),
  sku: z.string().optional(), // If provided manually or regenerated
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  price: z.coerce.number().positive('Harga normal harus lebih dari 0'),
  promoPrice: z.coerce.number().positive('Harga promo harus lebih dari 0').optional().nullable(),
  isPromo: z.boolean().default(false),
  promoStart: z.string().optional().nullable(),
  promoEnd: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  showOnHero: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  isPublished: z.boolean().default(true),
  description: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  totalSold: z.coerce.number().int().min(0).default(0).optional(),
  seoTitle: z.string().max(100).optional().nullable(),
  seoDescription: z.string().max(250).optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'URL gambar wajib ada'),
        alt: z.string().optional().nullable(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
}).refine(
  (data) => {
    if (data.isPromo && data.promoPrice !== undefined && data.promoPrice !== null) {
      return data.promoPrice < data.price;
    }
    return true;
  },
  {
    message: 'Harga promo harus lebih kecil daripada harga normal',
    path: ['promoPrice'],
  }
);

export const testimonialSchema = z.object({
  customerName: z.string().min(2, 'Nama pelanggan minimal 2 karakter'),
  avatarUrl: z.string().optional().nullable(),
  content: z.string().min(5, 'Isi testimoni minimal 5 karakter'),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isApproved: z.boolean().default(false),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  whatsapp: z
    .string()
    .min(9, 'Nomor WhatsApp minimal 9 digit')
    .regex(/^[0-9+-\s]+$/, 'Format nomor WhatsApp tidak valid'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subjek pesan minimal 3 karakter'),
  message: z.string().min(5, 'Isi pesan minimal 5 karakter'),
  // Honeypot anti-spam field
  hpField: z.string().max(0, 'Spam terdeteksi').optional(),
});

export const socialLinkSchema = z.object({
  title: z.string().min(2, 'Judul tautan minimal 2 karakter'),
  url: z.string().url('URL tautan tidak valid'),
  type: z.enum([
    'INSTAGRAM',
    'SHOPEE',
    'TIKTOK',
    'GOOGLE_DRIVE',
    'WEBSITE',
    'WHATSAPP',
    'MAPS',
    'OTHER',
  ]),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const siteSettingSchema = z.record(z.string(), z.string());
