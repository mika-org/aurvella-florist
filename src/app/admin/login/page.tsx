'use client';

import React, { useState } from 'react';
import SkeletonImage from '@/components/ui/SkeletonImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal. Periksa kembali akun Anda.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat login.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden relative flex flex-col justify-between items-center py-3 sm:py-5 px-4 bg-gradient-to-br from-[#FFF5F7] via-[#FDE8ED]/80 to-[#FAF6F0] select-none">
      {/* Ambient background soft glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 15, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-[#F7A8BB]/45 via-[#FBD0DA]/40 to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tl from-[#F1D78B]/40 via-[#F7A8BB]/30 to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-gradient-to-r from-[#FDE8ED]/50 via-[#FAF6F0]/40 to-[#FBD0DA]/30 blur-2xl"
      />

      {/* Cute Floating Botanical & Butterfly Ornaments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Butterfly top left */}
        <motion.div
          animate={{
            x: [0, 18, -6, 0],
            y: [0, -14, -4, 0],
            rotate: [0, 10, -6, 0],
            scaleX: [1, 0.88, 1, 0.92, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-[10%] sm:left-[18%] w-8 h-8 opacity-70 drop-shadow-sm"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#EE7796]">
            <path
              d="M25 25 C15 10, 5 15, 5 25 C5 35, 18 38, 25 28 C32 38, 45 35, 45 25 C45 15, 35 10, 25 25 Z"
              fill="currentColor"
              fillOpacity="0.75"
            />
            <circle cx="25" cy="25" r="2.5" fill="#D4AF37" />
          </svg>
        </motion.div>

        {/* Floating Cute Petal top right */}
        <motion.div
          animate={{
            y: [-12, 14, -12],
            rotate: [-10, 15, -10],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-[12%] sm:right-[20%] w-7 h-7 opacity-60"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#F7A8BB]">
            <path d="M25 0 C40 15 40 35 25 50 C10 35 10 15 25 0 Z" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Floating Sparkle bottom left */}
        <motion.div
          animate={{
            scale: [0.8, 1.25, 0.8],
            rotate: [0, 90, 180],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 left-[12%] sm:left-[22%] w-5 h-5 text-[#F1D78B]"
        >
          <Sparkles className="w-full h-full fill-[#F1D78B]" />
        </motion.div>

        {/* Floating cute flower bottom right */}
        <motion.div
          animate={{
            y: [12, -10, 12],
            rotate: [12, -8, 12],
          }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-[10%] sm:right-[18%] w-8 h-8 opacity-65"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-full h-full text-[#FBD0DA]">
            <circle cx="25" cy="15" r="8" fill="#F7A8BB" />
            <circle cx="15" cy="25" r="8" fill="#F7A8BB" />
            <circle cx="35" cy="25" r="8" fill="#F7A8BB" />
            <circle cx="25" cy="35" r="8" fill="#F7A8BB" />
            <circle cx="25" cy="25" r="5" fill="#F1D78B" />
          </svg>
        </motion.div>
      </div>

      {/* Top Bar Navigation (Back Link) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-md relative z-20 flex items-center justify-start shrink-0"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#6B5E63] bg-white/80 hover:bg-white hover:text-[#C93059] backdrop-blur-md shadow-xs border border-[#FBD0DA] transition-all hover:scale-103"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#DF4D73]" />
          <span>Kembali ke Website</span>
        </Link>
      </motion.div>

      {/* Main Glassmorphic Card (Centrally Balanced, Fits Viewport with Zero Scroll) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 24 }}
        className="w-full max-w-sm sm:max-w-md relative z-20 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(238,119,150,0.22)] border border-white/80 p-6 sm:p-7 my-auto"
      >
        {/* Header Brand */}
        <div className="text-center mb-5">
          {/* Logo with Cute Glowing Halo */}
          <motion.div
            whileHover={{ scale: 1.06, rotate: 2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-[#F7A8BB] via-[#F1D78B] to-[#EE7796] p-1 shadow-md mx-auto mb-3 flex items-center justify-center cursor-pointer"
          >
            <div className="relative w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
              <SkeletonImage
                src="/logo.png"
                alt="Aurvella Florist Logo"
                fill
                priority
                className="object-contain p-1.5"
                sizes="72px"
              />
            </div>
            {/* Cute mini heart badge */}
            <div className="absolute -bottom-1 -right-1 bg-[#EE7796] text-white p-1 rounded-full shadow-md border-2 border-white">
              <Heart className="w-2.5 h-2.5 fill-white" />
            </div>
          </motion.div>

          {/* Cute Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F7] border border-[#FBD0DA] text-[10px] font-bold uppercase tracking-widest text-[#C93059] mb-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Aurvella Admin Portal</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-[26px] font-bold text-[#2D2527] tracking-tight leading-snug">
            Selamat Datang Kembali
          </h1>
          <p className="text-[11px] sm:text-xs text-[#6B5E63] mt-0.5 leading-relaxed">
            Masuk untuk mengelola katalog, pesanan, dan standing flower.
          </p>
        </div>

        {/* Animated Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-3 rounded-2xl bg-[#FFF0F2] border border-[#C93059]/30 text-[#C93059] text-xs flex items-start gap-2 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C93059]" />
              <span className="font-medium leading-relaxed">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
          {/* Username or Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#2D2527] mb-1">
              Username atau Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#EE7796] group-focus-within:text-[#C93059] transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Masukkan username atau email"
                autoComplete="off"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#FBD0DA] text-xs sm:text-sm text-[#2D2527] bg-[#FFF5F7]/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#EE7796] focus:ring-3 focus:ring-[#EE7796]/20 transition-all placeholder:text-[#A89A9E]"
              />
            </div>
          </div>

          {/* Password with Visibility Toggle */}
          <div>
            <label className="block text-[11px] font-bold text-[#2D2527] mb-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#EE7796] group-focus-within:text-[#C93059] transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun"
                autoComplete="new-password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#FBD0DA] text-xs sm:text-sm text-[#2D2527] bg-[#FFF5F7]/70 hover:bg-white focus:bg-white focus:outline-none focus:border-[#EE7796] focus:ring-3 focus:ring-[#EE7796]/20 transition-all placeholder:text-[#A89A9E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#EE7796] hover:text-[#C93059] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(223, 77, 115, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#DF4D73] via-[#EE7796] to-[#C93059] shadow-md shadow-[#DF4D73]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Bottom Footer (Compact & Non-obtrusive) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-[11px] text-[#6B5E63]/80 relative z-20 shrink-0"
      >
        © {new Date().getFullYear()} Aurvella Florist by. Maharani Florist Bandung
      </motion.p>
    </div>
  );
}
