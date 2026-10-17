'use client';

import React from 'react';
import { MapPin, Navigation, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface GoogleMapsSectionProps {
  address?: string;
  mapsEmbedUrl?: string;
  mapsDirectionUrl?: string;
}

export default function GoogleMapsSection({
  address = 'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40293',
  mapsEmbedUrl = 'https://maps.google.com/maps?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293&t=&z=15&ie=UTF8&iwloc=&output=embed',
  mapsDirectionUrl = 'https://maps.google.com/?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293',
}: GoogleMapsSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#F3E2E6]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Address & Info Details */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-[11px] font-bold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3 h-3 text-[#B83253]" />
                  <span>Lokasi Workshop</span>
                </div>
                <h3 className="font-heading text-3xl font-semibold text-[#2D2527] mt-1 mb-3 tracking-wide">
                  Kunjungi Workshop Kami
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-[#DFB758] to-[#B83253] rounded-full mb-6" />

                <div className="space-y-4 text-sm text-[#5C4D52]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] border border-[#F8B4C4]/50 flex items-center justify-center text-[#B83253] shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-[#2D2527] text-base mb-1">
                        Aurvella Florist Workshop Bandung
                      </strong>
                      <p className="leading-relaxed text-xs sm:text-sm text-[#6B5E63]">{address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F5E2E7] flex flex-col sm:flex-row gap-3">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Petunjuk Arah</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-[#4A3E42] bg-[#FFF5F7] border border-[#F5D5DE] hover:bg-[#FDE2E8] transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-[#DFB758]" />
                  <span>Buka di Google Maps</span>
                </motion.a>
              </div>
            </div>

            {/* Embedded Responsive Google Map */}
            <div className="lg:col-span-7 min-h-[360px] relative bg-[#EDE8EA]">
              <iframe
                title="Peta Lokasi Aurvella Florist Bandung"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

