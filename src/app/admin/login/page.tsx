'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFF0F4] via-[#FAF8F8] to-[#FFF5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#F4E2E7] p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 rounded-2xl bg-white p-1 border-2 border-[#F8B4C4]/70 shadow-lg mx-auto mb-3 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Aurvella Florist Logo"
              fill
              priority
              className="object-contain p-1"
              sizes="80px"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2D2527]">
            Admin Portal
          </h1>
          <p className="text-xs text-[#7A6D72] mt-1">
            Masuk untuk mengelola produk & website Aurvella Florist
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[#FDEEEF] border border-[#B83253]/30 text-[#B83253] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Username atau Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E82]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Masukkan username atau email"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D9DC] text-sm focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A3E42] mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7E82]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D9DC] text-sm focus:outline-none focus:border-[#B83253]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#B83253] to-[#E56A88] hover:opacity-95 shadow-md shadow-[#B83253]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
