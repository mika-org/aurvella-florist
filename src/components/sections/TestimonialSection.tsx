'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

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
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play testimonial carousel every 6s (pauses on hover)
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials, isPaused]);

  if (!testimonials || testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const current = testimonials[currentIndex];

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 32 : -32,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -32 : 32,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section id="testimoni" className="py-16 sm:py-24 bg-gradient-to-b from-[#FFF9FA] via-white to-[#FFF9FA] border-b border-[#F4E2E7] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-[#F8B4C4]/20 via-[#DFB758]/15 to-[#F8B4C4]/20 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0F4] border border-[#F8B4C4] text-[#B83253] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B83253]" />
            <span>Ulasan Pelanggan</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#2D2527] mt-1 tracking-wide">
            Apa Kata Klien Kami?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#B83253] via-[#DFB758] to-[#B83253] mx-auto rounded-full my-3" />
          <p className="text-[#6B5E63] text-xs sm:text-sm max-w-xl mx-auto">
            Testimoni jujur dari pelanggan setia kami atas kecepatan pengiriman, kerapian rangkaian, dan pelayanan terbaik di Bandung.
          </p>
        </motion.div>

        {/* Testimonial Card Display with Framer Motion AnimatePresence Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, type: 'spring', damping: 22 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-[#F5E2E7] max-w-3xl mx-auto overflow-hidden"
        >
          {/* Floating decorative quote icon */}
          <motion.div
            animate={{
              y: [-3, 3, -3],
              rotate: [-2, 2, -2],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 right-6 pointer-events-none opacity-60"
          >
            <Quote className="w-12 h-12 text-[#F8B4C4]" />
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id || currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              {/* Rating Stars with golden glow */}
              <div className="flex items-center gap-1.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < (current.rating || 5)
                          ? 'text-[#DFB758] fill-[#DFB758] drop-shadow-xs'
                          : 'text-[#E0D5D8]'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="font-heading text-xl sm:text-2xl text-[#3D3135] leading-relaxed italic mb-8 max-w-2xl font-normal">
                &ldquo;{current.content}&rdquo;
              </p>

              {/* Customer Name & Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B83253] via-[#DF4D73] to-[#DFB758] p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#B83253] font-extrabold text-base">
                    {current.customerName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-[#2D2527] text-base leading-tight">
                    {current.customerName}
                  </h3>
                  <span className="text-xs text-[#8E7E84]">
                    {new Date(current.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F8E8EC]">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={prevTestimonial}
                className="p-2.5 rounded-full border border-[#EED9DF] hover:bg-[#FFF5F7] hover:border-[#B83253] text-[#4A3E42] transition-colors cursor-pointer shadow-xs"
                aria-label="Testimoni Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center gap-1">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    className="p-2 cursor-pointer focus:outline-none"
                    aria-label={`Lihat ulasan ${idx + 1}`}
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-7 bg-[#B83253]'
                          : 'w-2.5 bg-[#E5D2D7] hover:bg-[#B83253]/50'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={nextTestimonial}
                className="p-2.5 rounded-full border border-[#EED9DF] hover:bg-[#FFF5F7] hover:border-[#B83253] text-[#4A3E42] transition-colors cursor-pointer shadow-xs"
                aria-label="Testimoni Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
