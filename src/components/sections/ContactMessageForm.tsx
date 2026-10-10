'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMessageSchema } from '@/lib/validations';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type FormData = z.infer<typeof contactMessageSchema>;

export default function ContactMessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      email: '',
      subject: '',
      message: '',
      hpField: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Gagal mengirim pesan. Silakan coba lagi.');
      }

      setSuccessMessage('Pesan Anda berhasil dikirim! Tim Aurvella Florist akan segera menghubungi nomor WhatsApp Anda.');
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem. Silakan hubungi langsung via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#F4E2E7]">
      <h3 className="font-serif text-2xl font-bold text-[#2D2527] mb-2">
        Kirim Pesan atau Pertanyaan
      </h3>
      <p className="text-xs sm:text-sm text-[#6B5E63] mb-6">
        Isi formulir berikut, kami akan segera merespons melalui WhatsApp atau email Anda.
      </p>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#E8F8EE] border border-[#25D366]/40 text-[#1F5133] text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-[#FDEEEF] border border-[#B83253]/30 text-[#B83253] text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#B83253] shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Anti-spam honeypot (hidden from real users) */}
        <input
          type="text"
          {...register('hpField')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Nama Lengkap <span className="text-[#B83253]">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Rian Anggara"
              {...register('name')}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                errors.name
                  ? 'border-[#B83253] focus:ring-1 focus:ring-[#B83253]'
                  : 'border-[#E8D9DC] focus:border-[#B83253]'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-[#B83253] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Nomor WhatsApp <span className="text-[#B83253]">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              {...register('whatsapp')}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                errors.whatsapp
                  ? 'border-[#B83253] focus:ring-1 focus:ring-[#B83253]'
                  : 'border-[#E8D9DC] focus:border-[#B83253]'
              }`}
            />
            {errors.whatsapp && (
              <p className="text-[11px] text-[#B83253] mt-1">{errors.whatsapp.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Email (Opsional)
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              {...register('email')}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-[#B83253] focus:ring-1 focus:ring-[#B83253]'
                  : 'border-[#E8D9DC] focus:border-[#B83253]'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-[#B83253] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Subjek Pesan <span className="text-[#B83253]">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Tanya Custom Standing Flower"
              {...register('subject')}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                errors.subject
                  ? 'border-[#B83253] focus:ring-1 focus:ring-[#B83253]'
                  : 'border-[#E8D9DC] focus:border-[#B83253]'
              }`}
            />
            {errors.subject && (
              <p className="text-[11px] text-[#B83253] mt-1">{errors.subject.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
            Isi Pesan / Kebutuhan Acara <span className="text-[#B83253]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tuliskan tanggal acara, jenis bunga yang diminati, atau pertanyaan lainnya..."
            {...register('message')}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.message
                ? 'border-[#B83253] focus:ring-1 focus:ring-[#B83253]'
                : 'border-[#E8D9DC] focus:border-[#B83253]'
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-[#B83253] mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-[#B83253] to-[#E56A88] hover:opacity-95 shadow-lg shadow-[#B83253]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mengirim Pesan...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirim Pesan Sekarang</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
