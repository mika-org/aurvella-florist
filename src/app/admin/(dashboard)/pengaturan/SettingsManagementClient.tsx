'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/context/AdminToastContext';

interface Props {
  initialSettings: Record<string, string>;
}

export default function SettingsManagementClient({ initialSettings }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengaturan');

      setSuccessMsg('Pengaturan website berhasil disimpan dan diperbarui!');
      showToast.success('Pengaturan Disimpan', 'Pengaturan website dan profil bisnis berhasil diperbarui!');
      router.refresh();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan Pengaturan', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527]">
          Pengaturan Informasi Bisnis
        </h1>
        <p className="text-xs text-[#7A6D72] mt-1">
          Sesuaikan profil toko florist, nomor WhatsApp resmi, alamat workshop, Google Maps, dan tautan marketplace
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#E8F8EE] border border-[#25D366]/40 text-[#1F5133] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FDEEEF] border border-[#B83253]/30 text-[#B83253] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#B83253] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E7] shadow-sm space-y-6 text-xs">
        {/* Identitas Bisnis */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2D2527] border-b border-[#F5E6EA] pb-2">
            Identitas Utama Bisnis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Nama Bisnis
              </label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Tagline Utama
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Kontak */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2D2527] border-b border-[#F5E6EA] pb-2">
            Kontak WhatsApp & Layanan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Nomor WhatsApp Lokal (Tampil)
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="085770187018"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] font-mono focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Nomor WhatsApp Format Internasional (Untuk Link)
              </label>
              <input
                type="text"
                value={settings.whatsapp_international || ''}
                onChange={(e) => handleChange('whatsapp_international', e.target.value)}
                placeholder="6285770187018"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] font-mono focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#4A3E42] mb-1">
              Informasi Jam Operasional / Layanan 24/7
            </label>
            <input
              type="text"
              value={settings.service_hours || ''}
              onChange={(e) => handleChange('service_hours', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
            />
          </div>
        </div>

        {/* Informasi Free Ongkir & Pengiriman */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2D2527] border-b border-[#F5E6EA] pb-2">
            Kebijakan Ongkir & Delivery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Informasi Free Ongkir
              </label>
              <input
                type="text"
                value={settings.free_ongkir_info || ''}
                onChange={(e) => handleChange('free_ongkir_info', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Ketentuan Same Day Delivery
              </label>
              <input
                type="text"
                value={settings.sameday_info || ''}
                onChange={(e) => handleChange('sameday_info', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>
        </div>

        {/* Lokasi & Google Maps */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2D2527] border-b border-[#F5E6EA] pb-2">
            Lokasi Workshop & Google Maps
          </h3>
          <div>
            <label className="block font-semibold text-[#4A3E42] mb-1">
              Alamat Lengkap Workshop
            </label>
            <textarea
              rows={2}
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                URL Google Maps Embed (Iframe Src)
              </label>
              <input
                type="text"
                value={settings.maps_embed_url || ''}
                onChange={(e) => handleChange('maps_embed_url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] font-mono text-[11px] focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                URL Petunjuk Arah / Navigasi
              </label>
              <input
                type="text"
                value={settings.maps_direction_url || ''}
                onChange={(e) => handleChange('maps_direction_url', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] font-mono text-[11px] focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>
        </div>

        {/* Media Sosial & Marketplace */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#2D2527] border-b border-[#F5E6EA] pb-2">
            Media Sosial & Marketplace
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/aurvellaflorist"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                Shopee Store URL
              </label>
              <input
                type="text"
                value={settings.shopee_url || ''}
                onChange={(e) => handleChange('shopee_url', e.target.value)}
                placeholder="https://shopee.co.id/aurvellaflorist"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3E42] mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                value={settings.tiktok_url || ''}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                placeholder="https://tiktok.com/@aurvellaflorist"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8D9DC] focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F5E6EA] flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#B83253] text-white font-bold hover:bg-[#a02845] transition-all flex items-center gap-2 shadow-md disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Seluruh Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
