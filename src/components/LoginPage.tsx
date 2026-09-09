import React, { useState } from 'react';
import { UserSession } from '../types';
import { DEFAULT_USERS } from '../data/initialData';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  UserCheck,
  ArrowRight,
  BookOpen,
  Landmark,
  Eye,
  EyeOff,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
  usersList?: UserSession[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, usersList = DEFAULT_USERS }) => {
  const [email, setEmail] = useState('admin@masqami.id');
  const [password, setPassword] = useState('bismillah123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Harap masukkan alamat email pengguna.');
      return;
    }
    if (!password.trim()) {
      setError('Harap masukkan kata sandi.');
      return;
    }

    // Match with registered accounts list or allow custom
    const activeList = usersList.length > 0 ? usersList : DEFAULT_USERS;
    const found = activeList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.password && found.password !== password) {
        setError('Kata sandi yang Anda masukkan salah.');
        return;
      }
      onLogin(found);
    } else {
      // Create user session based on email
      const customUser: UserSession = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'Petugas Wilayah',
        wilayah: 'Semua Wilayah',
      };
      onLogin(customUser);
    }
  };

  const handleQuickLogin = (user: UserSession) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Subtle background ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 my-auto">
        {/* App Logo & Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-950/60 mb-4 ring-1 ring-white/20">
            <Landmark className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2.5">
            <span>Sistem Informasi Maqami Dakwah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Gerbang Masuk Petugas & Markaz
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto">
            Silakan masuk untuk mengakses rekapitulasi data maqami bulanan, grafik visualisasi tren, dan ekspor dokumen laporan Jawa Tengah & DIY.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rekap 10 Wilayah</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg">
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span>Grafik Batang Interaktif</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor Excel & PDF Resmi</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-5 border-b border-slate-700/70 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">Autentikasi Akun</h2>
                <p className="text-xs text-slate-400">Masukkan kredensial akun petugas maqami</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              Secure Access
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@masqami.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-2.5 px-4 mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Masuk ke Dashboard Laporan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-7 pt-6 border-t border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Akses Cepat 1-Klik (Pilih Akun Demo)
              </span>
              <span className="text-[11px] text-slate-500">Klik langsung untuk masuk</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(usersList.length > 0 ? usersList : DEFAULT_USERS).slice(0, 6).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  type="button"
                  className="p-3 bg-slate-900/70 hover:bg-slate-700/60 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-left transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold transition-colors ${
                      user.role === 'Admin Markaz'
                        ? 'text-emerald-300 group-hover:text-emerald-200'
                        : user.role === 'Petugas Halaqoh'
                        ? 'text-amber-300 group-hover:text-amber-200'
                        : user.role === 'Petugas Wilayah'
                        ? 'text-cyan-300 group-hover:text-cyan-200'
                        : 'text-slate-300 group-hover:text-slate-200'
                    }`}>
                      {user.role}
                    </span>
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-300 truncate font-medium">{user.name}</p>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono truncate max-w-[120px]">
                      {user.role === 'Petugas Halaqoh' && user.subWilayah
                        ? `${user.subWilayah} (${user.wilayah})`
                        : user.wilayah}
                    </span>
                    {user.whatsapp && (
                      <span className="text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                        <Phone className="w-2.5 h-2.5 text-emerald-500" />
                        <span>{user.whatsapp.replace('08', '..')}</span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Laporan Maqami Dakwah &bull; Wilayah Jawa Tengah & DIY</span>
        </div>
      </div>
    </div>
  );
};
