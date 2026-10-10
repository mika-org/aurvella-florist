import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

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
    <section className="py-16 bg-[#FAF8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#F3E2E6]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Address & Info Details */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
                  Lokasi Workshop
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#2D2527] mt-2 mb-4">
                  Kunjungi Workshop Kami
                </h3>
                <div className="w-12 h-1 bg-[#DFB758] rounded-full mb-6" />

                <div className="space-y-4 text-sm text-[#5C4D52]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#B83253] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2D2527] text-base mb-1">
                        Aurvella Florist Workshop Bandung
                      </strong>
                      <p className="leading-relaxed">{address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F5E2E7] flex flex-col sm:flex-row gap-3">
                <a
                  href={mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[#B83253] hover:bg-[#a02845] transition-all shadow-md shadow-[#B83253]/20"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Petunjuk Arah</span>
                </a>
                <a
                  href={mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-[#4A3E42] bg-[#FFF5F7] border border-[#F5D5DE] hover:bg-[#FDE2E8] transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-[#DFB758]" />
                  <span>Buka di Google Maps</span>
                </a>
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
        </div>
      </div>
    </section>
  );
}
