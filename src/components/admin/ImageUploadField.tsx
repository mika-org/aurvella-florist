'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon, X } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  placeholder?: string;
}

export default function ImageUploadField({
  label = 'Gambar Produk / Kategori',
  value,
  onChange,
  hint,
  placeholder = 'https://aurvella-florist.elevore.web.id/uploads/nama-gambar.png',
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file terlalu besar (maksimal 5MB)');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah file gambar');
      }

      // Prioritize fullUrl or url
      const finalUrl = data.fullUrl || data.url;
      onChange(finalUrl);
      setSuccessMsg(`Berhasil diunggah ke ${finalUrl}`);
    } catch (err: any) {
      setUploadError(err.message || 'Terjadi kesalahan saat unggah');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-xs text-[#4A3E42]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#B83253] hover:underline inline-flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? 'Tutup Input Manual' : 'Input URL Manual'}</span>
        </button>
      </div>

      {/* Upload Zone & Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Preview box if value exists */}
        {value && (
          <div className="sm:col-span-1 relative aspect-square rounded-xl overflow-hidden border border-[#F0E4E7] bg-white shadow-xs group">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain p-1"
              sizes="120px"
              unoptimized={value.startsWith('http')}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              title="Hapus gambar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Upload Action Box */}
        <div className={value ? 'sm:col-span-3' : 'sm:col-span-4'}>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isUploading
                ? 'border-[#B83253] bg-[#FFF5F7]'
                : 'border-[#E8D9DC] hover:border-[#B83253] hover:bg-[#FFF9FB] bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B83253] py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunggah gambar ke server...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-[#FAF3F5] text-[#B83253] flex items-center justify-center mb-1.5 shadow-2xs">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#2D2527]">
                  Klik untuk Unggah Gambar Baru
                </span>
                <span className="text-[11px] text-[#8A7E82] mt-0.5">
                  Format PNG, JPG, atau WEBP (Maksimal 5MB)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Input (optional or toggleable) */}
      {showManualInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
          />
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#1E7E34] bg-[#EAF7ED] px-3 py-1.5 rounded-lg border border-[#C3E6CB]">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{successMsg}</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#B83253] bg-[#FDEEEF] px-3 py-1.5 rounded-lg border border-[#F8B4C4]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {hint && <p className="text-[10px] text-[#8A7E82]">{hint}</p>}
    </div>
  );
}
