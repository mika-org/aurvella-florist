'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCog,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ShieldCheck,
  Crown,
  UserCheck,
  Mail,
  AtSign,
  Calendar,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/context/AdminToastContext';

export interface UserData {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialUsers: UserData[];
  currentUserId: string;
}

const ROLE_OPTIONS = [
  {
    value: 'SUPER_ADMIN',
    label: 'Super Admin',
    desc: 'Akses penuh ke seluruh fitur sistem & manajemen user',
    badgeClass: 'bg-[#FFF9ED] text-[#8E6D14] border border-[#DFB758]/40',
  },
  {
    value: 'ADMIN',
    label: 'Administrator',
    desc: 'Mengelola katalog, transaksi, keuangan, dan pengaturan toko',
    badgeClass: 'bg-[#FFF0F4] text-[#B83253] border border-[#F8B4C4]/50',
  },
  {
    value: 'STAFF',
    label: 'Staff Operasional',
    desc: 'Mengelola pesanan harian, pelanggan, dan pesan masuk',
    badgeClass: 'bg-[#E8F8EE] text-[#1E7E34] border border-[#25D366]/30',
  },
] as const;

export function getRoleMeta(role: string) {
  return (
    ROLE_OPTIONS.find((r) => r.value === role) || {
      value: role,
      label: role,
      desc: 'Pengelola dashboard',
      badgeClass: 'bg-gray-100 text-gray-700 border border-gray-200',
    }
  );
}

export default function UserManagementClient({
  initialUsers,
  currentUserId,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal Create / Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete Confirmation Modal State
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'ADMIN',
    password: '',
    confirmPassword: '',
  });

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(
    (u) => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
  ).length;
  const staffCount = users.filter((u) => u.role === 'STAFF').length;

  const openCreateModal = () => {
    setEditingUser(null);
    setErrorMsg(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      name: '',
      username: '',
      email: '',
      role: 'ADMIN',
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserData) => {
    setEditingUser(u);
    setErrorMsg(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role || 'ADMIN',
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!editingUser && formData.password.length < 6) {
      setErrorMsg('Password wajib diisi minimal 6 karakter untuk user baru.');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setErrorMsg('Password baru minimal harus 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    setLoading(true);

    const url = editingUser
      ? `/api/admin/users/${editingUser.id}`
      : '/api/admin/users';
    const method = editingUser ? 'PUT' : 'POST';

    const payload: Record<string, any> = {
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
    };

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan data user');
      }

      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data.user : u))
        );
      } else {
        setUsers((prev) => [...prev, data.user]);
      }

      showToast.success(
        editingUser ? 'Data User Diperbarui' : 'User Baru Ditambahkan',
        `Akun ${data.user.name} (@${data.user.username}) berhasil disimpan.`
      );

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat menyimpan user';
      setErrorMsg(msg);
      showToast.error('Gagal Menyimpan User', msg);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showToast.success(
        'User Dihapus',
        `Akun "${deletingUser.name}" (@${deletingUser.username}) telah dihapus.`
      );
      setDeletingUser(null);
      router.refresh();
    } catch (err: any) {
      showToast.error(
        'Gagal Menghapus User',
        err.message || 'Terjadi kesalahan sistem'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderRoleIcon = (role: string) => {
    if (role === 'SUPER_ADMIN') {
      return <Crown className="w-3.5 h-3.5 text-[#DFB758]" />;
    }
    if (role === 'STAFF') {
      return <UserCheck className="w-3.5 h-3.5 text-[#1E7E34]" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-[#B83253]" />;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B83253] font-bold">
            <UserCog className="w-3.5 h-3.5 text-[#DFB758]" />
            Kontrol Akses &amp; Keamanan
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2527] mt-1">
            Manajemen User Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6D72] mt-1">
            Kelola akun administrator, staff operasional, hak akses role, dan pembaruan kata sandi.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#B83253] hover:bg-[#962340] text-white text-xs font-bold shadow-md shadow-[#B83253]/20 hover:scale-102 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah User Baru</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">
            Total User Terdaftar
          </span>
          <span className="text-2xl font-bold text-[#2D2527] mt-1 block">
            {users.length} Akun
          </span>
          <span className="text-[11px] text-[#1E7E34] mt-0.5 block font-semibold">
            Pengelola aktif dashboard Aurvella
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">
            Super Admin &amp; Administrator
          </span>
          <span className="text-2xl font-bold text-[#B83253] mt-1 block">
            {adminCount} Admin
          </span>
          <span className="text-[11px] text-[#8E6D14] mt-0.5 block font-semibold">
            Akses penuh pengelolaan sistem
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0E4E7] shadow-xs">
          <span className="text-xs text-[#7A6D72] font-medium block">
            Staff Operasional
          </span>
          <span className="text-2xl font-bold text-[#2D2527] mt-1 block">
            {staffCount} Staff
          </span>
          <span className="text-[11px] text-[#7A6D72] mt-0.5 block">
            Tim operasional pesanan &amp; layanan
          </span>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E7] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A7E82] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, username, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#7A6D72] font-medium shrink-0">
            Filter Role:
          </span>
          {[
            { value: 'ALL', label: 'Semua Role' },
            { value: 'SUPER_ADMIN', label: '👑 Super Admin' },
            { value: 'ADMIN', label: '🛡️ Administrator' },
            { value: 'STAFF', label: '👤 Staff' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setRoleFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === tab.value
                  ? 'bg-[#B83253] text-white shadow-xs'
                  : 'bg-[#FAF3F5] text-[#4A3E42] hover:bg-[#F5E6EB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#F0E4E7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F8] text-[#4A3E42] font-bold border-b border-[#F0E4E7] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Nama Pengguna</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role / Hak Akses</th>
                <th className="py-3.5 px-4">Tanggal Dibuat</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5E6EA] text-[#2D2527]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#8A7E82]">
                    Tidak ada data user yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentUser = u.id === currentUserId;
                  const roleMeta = getRoleMeta(u.role);

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#FFF9FB] transition-colors ${
                        isCurrentUser ? 'bg-[#FFFBFD]' : ''
                      }`}
                    >
                      {/* Nama Pengguna */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B83253] to-[#E56A88] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2D2527] text-sm">
                                {u.name}
                              </span>
                              {isCurrentUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F8EE] text-[#1E7E34] border border-[#25D366]/30">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Sedang Login
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#7A6D72] block mt-0.5">
                              Diperbarui{' '}
                              {new Date(u.updatedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#4A3E42] bg-[#FAF3F5] px-2.5 py-1 rounded-lg border border-[#F0E4E7]">
                          <AtSign className="w-3 h-3 text-[#B83253]" />
                          {u.username}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#5C4D52]">
                          <Mail className="w-3.5 h-3.5 text-[#8A7E82]" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${roleMeta.badgeClass}`}
                        >
                          {renderRoleIcon(u.role)}
                          <span>{roleMeta.label}</span>
                        </span>
                      </td>

                      {/* CreatedAt */}
                      <td className="py-3.5 px-4 text-[#7A6D72]">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(u.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#B83253] hover:bg-[#FFF0F4] transition-colors"
                            title="Edit Profil & Password User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            disabled={isCurrentUser || users.length <= 1}
                            onClick={() => setDeletingUser(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-35 disabled:pointer-events-none"
                            title={
                              isCurrentUser
                                ? 'Tidak dapat menghapus akun yang sedang digunakan login'
                                : 'Hapus User'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#F0E4E7] my-auto">
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#F0E4E7]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D2527]">
                  {editingUser ? 'Edit Akun User' : 'Tambah User Baru'}
                </h3>
                <p className="text-[11px] text-[#7A6D72] mt-0.5">
                  {editingUser
                    ? `Perbarui profil atau ganti password untuk @${editingUser.username}`
                    : 'Buat akun baru untuk mengakses dashboard Aurvella Florist'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-[#FAF3F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#4A3E42] mb-1">
                  Nama Lengkap <span className="text-[#B83253]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maharani Putri"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#4A3E42] mb-1">
                    Username Login <span className="text-[#B83253]">*</span>
                  </label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 text-[#8A7E82] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="maharani"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, ''),
                        })
                      }
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs font-mono focus:outline-none focus:border-[#B83253]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4A3E42] mb-1">
                    Alamat Email <span className="text-[#B83253]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maharani@aurvellaflorist.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                  />
                </div>
              </div>

              {/* Pilihan Role */}
              <div>
                <label className="block font-bold text-[#4A3E42] mb-1.5">
                  Role / Hak Akses <span className="text-[#B83253]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ROLE_OPTIONS.map((r) => {
                    const selected = formData.role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, role: r.value })
                        }
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          selected
                            ? 'border-[#B83253] bg-[#FFF5F7] ring-1 ring-[#B83253]/30'
                            : 'border-[#E8D9DC] hover:border-[#B83253]/40 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#2D2527]">
                            {r.label}
                          </span>
                          {renderRoleIcon(r.value)}
                        </div>
                        <span className="text-[10px] text-[#7A6D72] leading-snug">
                          {r.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-2 border-t border-[#F5E6EA]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#4A3E42] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#B83253]" />
                    {editingUser ? 'Ubah Password (Opsional)' : 'Password Akun'}
                    {!editingUser && <span className="text-[#B83253]">*</span>}
                  </span>
                  {editingUser && (
                    <span className="text-[10px] text-[#8E6D14] font-medium">
                      Kosongkan jika tidak ingin mengubah password
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B5E63] mb-1">
                      {editingUser ? 'Password Baru' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={!editingUser}
                        minLength={6}
                        placeholder="Minimal 6 karakter"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#6B5E63] mb-1">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required={!editingUser || formData.password.length > 0}
                        placeholder="Ulangi password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-[#E8D9DC] text-xs focus:outline-none focus:border-[#B83253]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#F0E4E7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8D9DC] text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#B83253] hover:bg-[#962340] text-white text-xs font-bold shadow-md shadow-[#B83253]/20 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {loading
                      ? 'Menyimpan...'
                      : editingUser
                      ? 'Simpan Perubahan'
                      : 'Tambah User'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus User */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F0E4E7]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D2527]">
                  Hapus Akun User?
                </h3>
                <p className="text-xs text-[#7A6D72]">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-xs text-[#4A3E42] leading-relaxed bg-[#FAF6F8] p-3.5 rounded-xl border border-[#F0E4E7] mb-5">
              Apakah Anda yakin ingin menghapus akun{' '}
              <strong>{deletingUser.name}</strong> (
              <span className="font-mono">@{deletingUser.username}</span>)? User
              ini tidak akan bisa login lagi ke dashboard admin.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-[#E8D9DC] text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleteLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{deleteLoading ? 'Menghapus...' : 'Ya, Hapus User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
