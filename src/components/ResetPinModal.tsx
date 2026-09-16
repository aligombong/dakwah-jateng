import React, { useState } from 'react';
import { UserSession } from '../types';
import {
  X,
  Phone,
  Mail,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  UserCheck,
} from 'lucide-react';

interface ResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersList: UserSession[];
  onResetPin: (userId: string, newPin: string) => void;
  onSuccessReset: (userName: string, newPin: string) => void;
}

type ResetMethod = 'whatsapp' | 'email' | 'admin';

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  isOpen,
  onClose,
  usersList,
  onResetPin,
  onSuccessReset,
}) => {
  const [activeTab, setActiveTab] = useState<ResetMethod>('whatsapp');
  
  // WhatsApp flow states
  const [waInput, setWaInput] = useState('');
  const [foundUserWa, setFoundUserWa] = useState<UserSession | null>(null);
  const [otpWaSent, setOtpWaSent] = useState(false);
  const [generatedOtpWa, setGeneratedOtpWa] = useState('');
  const [otpWaInput, setOtpWaInput] = useState('');
  const [isWaVerified, setIsWaVerified] = useState(false);
  const [newPinWa, setNewPinWa] = useState('');
  const [confirmPinWa, setConfirmPinWa] = useState('');

  // Email flow states
  const [emailInput, setEmailInput] = useState('');
  const [foundUserEmail, setFoundUserEmail] = useState<UserSession | null>(null);
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [generatedOtpEmail, setGeneratedOtpEmail] = useState('');
  const [otpEmailInput, setOtpEmailInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPinEmail, setNewPinEmail] = useState('');
  const [confirmPinEmail, setConfirmPinEmail] = useState('');

  // Common UI states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const normalizePhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').replace(/^62/, '0');
  };

  // 1. WhatsApp Search
  const handleCheckWa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const cleanInput = normalizePhone(waInput);

    if (!cleanInput || cleanInput.length < 9) {
      setErrorMsg('Harap masukkan nomor WhatsApp yang valid (contoh: 081228009901).');
      return;
    }

    const matched = usersList.find((u) => {
      if (!u.whatsapp) return false;
      return normalizePhone(u.whatsapp) === cleanInput;
    });

    if (!matched) {
      setErrorMsg(
        'Nomor WhatsApp ini tidak terdaftar pada akun petugas manapun. Periksa kembali atau hubungi Admin Provinsi.'
      );
      return;
    }

    // Found user
    setFoundUserWa(matched);
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpWa(mockOtp);
    setOtpWaSent(true);
    setSuccessMsg(`Akun terverifikasi untuk ${matched.name}. Kode verifikasi siap dikirim.`);
  };

  const handleVerifyOtpWa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpWaInput.trim() !== generatedOtpWa) {
      setErrorMsg('Kode verifikasi OTP salah. Silakan masukkan kode yang tepat.');
      return;
    }

    setIsWaVerified(true);
    setErrorMsg('');
    setSuccessMsg('Verifikasi berhasil! Silakan tentukan PIN 6 angka yang baru.');
  };

  const handleSaveNewPinWa = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^\d{6}$/.test(newPinWa)) {
      setErrorMsg('PIN baru harus berupa 6 angka eksak.');
      return;
    }

    if (newPinWa !== confirmPinWa) {
      setErrorMsg('Konfirmasi PIN tidak cocok dengan PIN baru.');
      return;
    }

    // Check uniqueness across other users
    const isTaken = usersList.some(
      (u) => u.pin === newPinWa && u.id !== foundUserWa?.id
    );
    if (isTaken) {
      setErrorMsg('PIN 6 angka ini sudah digunakan oleh petugas lain. Harap gunakan kombinasi PIN yang berbeda.');
      return;
    }

    if (foundUserWa) {
      onResetPin(foundUserWa.id, newPinWa);
      onSuccessReset(foundUserWa.name, newPinWa);
      handleClose();
    }
  };

  // 2. Email Search
  const handleCheckEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Harap masukkan alamat email yang valid.');
      return;
    }

    const matched = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      setErrorMsg('Alamat email ini tidak terdaftar dalam sistem. Silakan periksa kembali.');
      return;
    }

    setFoundUserEmail(matched);
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpEmail(mockOtp);
    setOtpEmailSent(true);
    setSuccessMsg(`Akun terverifikasi untuk ${matched.name}. Kode verifikasi siap digunakan.`);
  };

  const handleVerifyOtpEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpEmailInput.trim() !== generatedOtpEmail) {
      setErrorMsg('Kode verifikasi OTP email salah.');
      return;
    }

    setIsEmailVerified(true);
    setErrorMsg('');
    setSuccessMsg('Email terverifikasi! Silakan buat PIN 6 angka baru.');
  };

  const handleSaveNewPinEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^\d{6}$/.test(newPinEmail)) {
      setErrorMsg('PIN baru harus berupa 6 digit angka.');
      return;
    }

    if (newPinEmail !== confirmPinEmail) {
      setErrorMsg('Konfirmasi PIN tidak cocok.');
      return;
    }

    const isTaken = usersList.some(
      (u) => u.pin === newPinEmail && u.id !== foundUserEmail?.id
    );
    if (isTaken) {
      setErrorMsg('PIN 6 angka ini sudah dipakai petugas lain. Harap buat PIN unik.');
      return;
    }

    if (foundUserEmail) {
      onResetPin(foundUserEmail.id, newPinEmail);
      onSuccessReset(foundUserEmail.name, newPinEmail);
      handleClose();
    }
  };

  const handleClose = () => {
    setWaInput('');
    setFoundUserWa(null);
    setOtpWaSent(false);
    setGeneratedOtpWa('');
    setOtpWaInput('');
    setIsWaVerified(false);
    setNewPinWa('');
    setConfirmPinWa('');

    setEmailInput('');
    setFoundUserEmail(null);
    setOtpEmailSent(false);
    setGeneratedOtpEmail('');
    setOtpEmailInput('');
    setIsEmailVerified(false);
    setNewPinEmail('');
    setConfirmPinEmail('');

    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Reset PIN 6 Angka Petugas
              </h2>
              <p className="text-xs text-slate-400">
                Pulihkan akses PIN akun maqami Anda secara aman
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tabs Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 p-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('whatsapp');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Nomor WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-teal-300" />
            <span>Alamat Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Provinsi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: WHATSAPP RESET */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              {!otpWaSent ? (
                <form onSubmit={handleCheckWa} className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Masukkan nomor WhatsApp yang terdaftar pada profil akun Anda untuk verifikasi identitas:
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nomor WhatsApp Terdaftar
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={waInput}
                        onChange={(e) => setWaInput(e.target.value)}
                        placeholder="Contoh: 0812-2800-9901 atau 081329114422"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Cari & Kirim Kode Verifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : !isWaVerified ? (
                <form onSubmit={handleVerifyOtpWa} className="space-y-3">
                  {foundUserWa && (
                    <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-100">{foundUserWa.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {foundUserWa.role} &bull; {foundUserWa.wilayah}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        {foundUserWa.whatsapp}
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-emerald-300 font-medium">Kode OTP Verifikasi WhatsApp:</span>
                      <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider">
                        {generatedOtpWa}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/${normalizePhone(foundUserWa?.whatsapp || '').replace(/^0/, '62')}?text=Kode%20Verifikasi%20Reset%20PIN%20Sistem%20Maqami:%20${generatedOtpWa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Buka Aplikasi WhatsApp untuk Mengirim/Menerima Kode</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Masukkan 6 Angka Kode Verifikasi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpWaInput}
                      onChange={(e) => setOtpWaInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={generatedOtpWa}
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono text-center tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpWaSent(false)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Verifikasi Kode OTP</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveNewPinWa} className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Verifikasi berhasil. Masukkan PIN 6 angka baru yang unik untuk akun Anda:
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      PIN 6 Angka Baru
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPinWa}
                      onChange={(e) => setNewPinWa(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Contoh: 654321"
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Konfirmasi Ulang PIN Baru
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPinWa}
                      onChange={(e) => setConfirmPinWa(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Ketik ulang 6 angka PIN"
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Simpan PIN Baru & Selesai</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL RESET */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {!otpEmailSent ? (
                <form onSubmit={handleCheckEmail} className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Masukkan alamat email petugas Anda untuk verifikasi identitas:
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Alamat Email Petugas
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@masqami.id atau solo@masqami.id"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Cari Akun & Buat Kode Verifikasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : !isEmailVerified ? (
                <form onSubmit={handleVerifyOtpEmail} className="space-y-3">
                  {foundUserEmail && (
                    <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-slate-100">{foundUserEmail.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {foundUserEmail.role} &bull; {foundUserEmail.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-teal-950/40 border border-teal-800/50 rounded-xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-teal-300 font-medium">Kode Verifikasi Email:</span>
                      <span className="font-mono text-sm font-bold text-teal-400 tracking-wider">
                        {generatedOtpEmail}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      (Kode simulasi email di atas dapat langsung disalin ke isian di bawah)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Masukkan 6 Angka Kode Verifikasi
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpEmailInput}
                      onChange={(e) => setOtpEmailInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={generatedOtpEmail}
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono text-center tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpEmailSent(false)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Verifikasi Kode</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveNewPinEmail} className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Email terverifikasi. Masukkan PIN 6 angka baru yang unik:
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      PIN 6 Angka Baru
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={newPinEmail}
                      onChange={(e) => setNewPinEmail(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Contoh: 789123"
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Konfirmasi Ulang PIN Baru
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={confirmPinEmail}
                      onChange={(e) => setConfirmPinEmail(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Ketik ulang 6 angka PIN"
                      className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Simpan PIN Baru & Selesai</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN PROVINSI */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Ustadz Ahmad Fauzi (Admin Provinsi)
                    </h4>
                    <p className="text-xs text-amber-400 font-medium">
                      Pengelola Kredensial & Autentikasi Jawa Tengah
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-700 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">WhatsApp Resmi:</span>
                    <span className="font-mono font-bold text-emerald-400">0812-2800-9901</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email Admin:</span>
                    <span className="font-mono text-slate-200">admin@masqami.id</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Jam Layanan:</span>
                    <span className="text-slate-200 font-medium">24 Jam untuk Kepentingan Dakwah</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prosedur Reset oleh Admin Provinsi:</span>
                </div>
                <p className="leading-relaxed">
                  Admin Provinsi memiliki wewenang langsung di menu <strong>Kelola Pengguna</strong> untuk melihat, mengatur ulang, atau mengacak PIN 6 angka baru bagi setiap petugas yang lupa PIN.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="https://wa.me/6281228009901?text=Assalamu%27alaikum%20Warahmatullahi%20Wabarakatuh%20Ustadz%20Ahmad%20Fauzi%20(Admin%20Provinsi).%20Saya%20petugas%20Maqami,%20mohon%20bantuan%20reset%20PIN%206%20angka%20akun%20saya."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi via WhatsApp</span>
                </a>

                <a
                  href="mailto:admin@masqami.id?subject=Permohonan%20Reset%20PIN%20Petugas%20Maqami&body=Assalamu%27alaikum%20Admin%20Provinsi,%20mohon%20bantuan%20reset%20PIN%206%20angka%20akun%20saya."
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Kirim Email Resmi</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950/60 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
