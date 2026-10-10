import React from 'react';
import { Truck, Clock, Headphones, Sparkles, ShieldCheck } from 'lucide-react';

interface ServiceInfoProps {
  freeOngkirInfo?: string;
  samedayInfo?: string;
  serviceHours?: string;
}

export default function ServiceInfo({
  freeOngkirInfo = 'Gratis ongkir untuk area Bandung Kota & sekitarnya sesuai area layanan aktif.',
  samedayInfo = 'Pesan hari ini, kirim hari ini (order sebelum 14:00 WIB & konfirmasi admin).',
  serviceHours = 'Admin WhatsApp siap melayani 24/7. Waktu produksi & kirim: 08:00 - 20:00 WIB.',
}: ServiceInfoProps) {
  const services = [
    {
      icon: Truck,
      title: 'Free Ongkir Bandung',
      description: freeOngkirInfo,
      highlight: 'S&K Berlaku',
    },
    {
      icon: Clock,
      title: 'Same Day Delivery',
      description: samedayInfo,
      highlight: 'Cepat & Aman',
    },
    {
      icon: Headphones,
      title: 'Pelayanan 24/7',
      description: serviceHours,
      highlight: 'Fast Response',
    },
    {
      icon: Sparkles,
      title: 'Fresh & Artificial Flower',
      description: 'Pilihan bunga segar wangi alami dan premium artificial impor tahan lama.',
      highlight: 'Pilihan Lengkap',
    },
    {
      icon: ShieldCheck,
      title: 'Produk Berkualitas',
      description: 'Papan akrilik 3mm, standing kayu halus 150cm, dan finishing floral premium.',
      highlight: 'Jaminan Rapi',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#F3E5E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Keunggulan Layanan Kami
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2D2527] mt-2">
            Mengapa Memilih Aurvella Florist?
          </h2>
          <p className="text-[#6B5E63] text-sm mt-2">
            Standar pelayanan florist profesional dengan dedikasi penuh terhadap kualitas dan kepuasan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFF9FA] rounded-2xl p-6 border border-[#F8E1E7] hover:border-[#DFB758] transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#F5D5DE] flex items-center justify-center text-[#B83253] group-hover:scale-110 group-hover:bg-[#B83253] group-hover:text-white transition-all shadow-sm mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#2D2527] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B5E63] leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F5E2E7]">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDE2E8] text-[#B83253]">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
