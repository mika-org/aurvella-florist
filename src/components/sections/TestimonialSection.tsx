'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface TestimonialData {
  id: string;
  customerName: string;
  avatarUrl?: string | null;
  content: string;
  rating: number;
  date: Date | string;
}

interface TestimonialSectionProps {
  testimonials: TestimonialData[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimoni" className="py-16 sm:py-24 bg-[#FFF9FA] border-b border-[#F4E2E7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B83253] font-bold">
            Ulasan Pelanggan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2527] mt-2">
            Apa Kata Klien Kami?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#F8B4C4] to-[#DFB758] mx-auto rounded-full mt-3" />
        </div>

        {/* Testimonial Card Display */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#F5E2E7] max-w-3xl mx-auto">
          <Quote className="absolute top-6 right-6 w-12 h-12 text-[#FDE2E8]" />

          <div className="flex flex-col items-center text-center">
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (current.rating || 5)
                      ? 'text-[#DFB758] fill-[#DFB758]'
                      : 'text-[#E0D5D8]'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Content */}
            <p className="font-serif text-lg sm:text-xl text-[#3D3135] leading-relaxed italic mb-6">
              &ldquo;{current.content}&rdquo;
            </p>

            {/* Customer Name & Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F8B4C4] to-[#DFB758] flex items-center justify-center text-[#2D2527] font-bold text-lg shadow-sm">
                {current.customerName.charAt(0)}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#2D2527] text-base">
                  {current.customerName}
                </h3>
                <span className="text-xs text-[#8E7E84]">
                  {new Date(current.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F8E8EC]">
              <button
                type="button"
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-[#EED9DF] hover:bg-[#FFF5F7] hover:border-[#B83253] text-[#4A3E42] transition-colors"
                aria-label="Testimoni Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-6 bg-[#B83253]'
                        : 'bg-[#E5D2D7] hover:bg-[#B83253]/50'
                    }`}
                    aria-label={`Lihat ulasan ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-[#EED9DF] hover:bg-[#FFF5F7] hover:border-[#B83253] text-[#4A3E42] transition-colors"
                aria-label="Testimoni Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
