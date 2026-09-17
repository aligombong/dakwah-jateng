import React, { useState, useEffect } from 'react';
import { UserSession, UserRole } from '../types';
import { WILAYAH_LIST } from '../data/initialData';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onSaveProfile: (updated: UserSession) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [wilayah, setWilayah] = useState(currentUser.wilayah || 'Semua Markaz');
  const [password, setPassword] = useState(currentUser.password || '');
  const [pin, setPin] = useState(currentUser.pin || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setWhatsapp(currentUser.whatsapp || '');
      setRole(currentUser.role);
      setWilayah(currentUser.wilayah || 'Semua Markaz');
      setPassword(currentUser.password || '');
      setPin(currentUser.pin || '');
      setError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Harap masukkan alamat email yang valid.');
      return;
    }

    if (pin && !/^\d{6}$/.test(pin.trim())) {
      setError('PIN harus berupa 6 digit angka numerik.');
      return;
    }

    const updatedUser: UserSession = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim() || undefined,
      role: currentUser.role === 'Admin Provinsi' ? role : currentUser.role,
      wilayah: currentUser.role === 'Admin Provinsi' ? wilayah : currentUser.wilayah,
      password: password.trim() || currentUser.password || 'bismillah123',
      pin: pin.trim() || currentUser.pin || '123456',
    };

    onSaveProfile(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Edit Profil Saya</h2>
              <p className="text-xs text-slate-300">
                Perbarui identitas profil dan kredensial akses akun Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Ustadz Ahmad Fauzi"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@masqami.id"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor WhatsApp
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 0812-3456-7890 / 0813xxxxxxxx"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nomor WhatsApp aktif untuk koordinasi laporan maqami
            </p>
          </div>

          {/* Peran / Hak Akses */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Peran (Hak Akses)
              </label>
              {currentUser.role !== 'Admin Provinsi' && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  Ditetapkan oleh Admin
                </span>
              )}
            </div>

            {currentUser.role === 'Admin Provinsi' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="Admin Provinsi">Admin Provinsi (Akses Penuh & Kelola User)</option>
                  <option value="Petugas Markaz">Petugas Markaz (Entri Data Markaz)</option>
                  <option value="Petugas Halaqoh">Petugas Halaqoh (Entri Data Halaqoh)</option>
                  <option value="Khidmat Laporan">Khidmat Laporan (Rekapitulasi & Ekspor)</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{currentUser.role}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  {currentUser.role === 'Petugas Markaz' || (currentUser.role as string) === 'Petugas Wilayah'
                    ? 'Akses Entri Markaz'
                    : currentUser.role === 'Petugas Halaqoh'
                    ? 'Akses Entri Halaqoh'
                    : 'Akses Tinjauan & Laporan'}
                </span>
              </div>
            )}
          </div>

          {/* Markaz Tugas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Markaz Tugas
            </label>
            {currentUser.role === 'Admin Provinsi' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="Semua Markaz">Semua Markaz (Jawa Tengah & DIY)</option>
                  {WILAYAH_LIST.map((wil) => (
                    <option key={wil} value={wil}>
                      {wil}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-800">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">{currentUser.wilayah || 'Semua Markaz'}</span>
                </div>
                {currentUser.subWilayah && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Halaqoh Tugas: <strong>{currentUser.subWilayah}</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PIN 6 Angka (Autentikasi Cepat) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                PIN 6 Angka (Untuk Login)
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium">
                6 Digit Unik
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4 text-emerald-600" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="6 digit angka, misal: 123456"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono tracking-wider text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              PIN ini digunakan untuk masuk ke sistem di halaman login tanpa perlu email & kata sandi.
            </p>
          </div>

          {/* Kata Sandi Baru */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi Akun
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Biarkan jika tidak ingin mengubah"
                className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
