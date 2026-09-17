import React, { useState, useRef, useEffect } from 'react';
import { UserSession } from '../types';
import { DEFAULT_USERS } from '../data/initialData';
import { ResetPinModal } from './ResetPinModal';
import {
  Landmark,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Delete,
  Sparkles,
  RefreshCw,
  Phone,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
  usersList?: UserSession[];
  onResetPin?: (userId: string, newPin: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  usersList = DEFAULT_USERS,
  onResetPin,
}) => {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [successUser, setSuccessUser] = useState<UserSession | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDemoAccordionOpen, setIsDemoAccordionOpen] = useState(false);
  const [demoHalaqahSearch, setDemoHalaqahSearch] = useState('');
  const [demoWilayahFilter, setDemoWilayahFilter] = useState('ALL');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus on the first empty digit or first digit on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    setError('');
    const cleanVal = val.replace(/[^0-9]/g, '');

    // If pasted string with multiple digits
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('');
      const newDigits = [...pinDigits];
      chars.forEach((c, idx) => {
        newDigits[idx] = c;
      });
      setPinDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      inputRefs.current[nextIdx]?.focus();

      if (chars.length === 6) {
        verifyPin(newDigits.join(''));
      }
      return;
    }

    const newDigits = [...pinDigits];
    newDigits[index] = cleanVal;
    setPinDigits(newDigits);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically verify PIN
    if (cleanVal && index === 5) {
      const fullPin = newDigits.join('');
      if (fullPin.length === 6) {
        verifyPin(fullPin);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        // Move back and clear previous
        const newDigits = [...pinDigits];
        newDigits[index - 1] = '';
        setPinDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...pinDigits];
        newDigits[index] = '';
        setPinDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeypadPress = (val: string) => {
    setError('');
    const firstEmptyIndex = pinDigits.findIndex((d) => d === '');

    if (val === 'clear') {
      setPinDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    if (val === 'backspace') {
      const lastFilledIndex = pinDigits.map((d, i) => (d !== '' ? i : -1)).filter((i) => i !== -1).pop();
      if (lastFilledIndex !== undefined) {
        const newDigits = [...pinDigits];
        newDigits[lastFilledIndex] = '';
        setPinDigits(newDigits);
        inputRefs.current[lastFilledIndex]?.focus();
      }
      return;
    }

    // Numeric digit
    if (firstEmptyIndex !== -1) {
      const newDigits = [...pinDigits];
      newDigits[firstEmptyIndex] = val;
      setPinDigits(newDigits);

      if (firstEmptyIndex < 5) {
        inputRefs.current[firstEmptyIndex + 1]?.focus();
      } else {
        // 6th digit filled
        const fullPin = newDigits.join('');
        verifyPin(fullPin);
      }
    }
  };

  const verifyPin = (enteredPin: string) => {
    const activeList = usersList.length > 0 ? usersList : DEFAULT_USERS;
    const matchedUser = activeList.find((u) => u.pin === enteredPin);

    if (matchedUser) {
      setSuccessUser(matchedUser);
      setError('');
      // Smooth delayed login transition
      setTimeout(() => {
        onLogin(matchedUser);
      }, 400);
    } else {
      setError('PIN 6 angka yang Anda masukkan salah atau belum terdaftar.');
      // Shake animation and reset focus
      setTimeout(() => {
        setPinDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 300);
    }
  };

  const handleQuickFillPin = (pin: string) => {
    const digits = pin.split('');
    setPinDigits(digits);
    verifyPin(pin);
  };

  const handleInternalResetPin = (userId: string, newPin: string) => {
    if (onResetPin) {
      onResetPin(userId, newPin);
    }
  };

  const handleSuccessReset = (userName: string, newPin: string) => {
    setError('');
    // Auto-fill new PIN for ease
    const digits = newPin.split('');
    setPinDigits(digits);
    verifyPin(newPin);
  };

  const isFullPin = pinDigits.every((d) => d !== '');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-950/60 mb-3.5 ring-1 ring-white/20">
            <Landmark className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>Sistem Informasi Maqami Dakwah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Masukkan PIN 6 Angka
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            Gunakan PIN rahasia 6 angka yang terdaftar pada akun petugas Anda untuk membuka akses sistem.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
          {/* Status Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successUser && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                PIN Valid! Ahlan wa Sahlan, <strong>{successUser.name}</strong> ({successUser.role}).
              </span>
            </div>
          )}

          {/* 6 PIN Input Boxes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>PIN Petugas (6 Digit)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                title={showPin ? 'Samarkan Angka' : 'Tampilkan Angka'}
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Sembunyikan' : 'Perlihatkan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={Boolean(successUser)}
                  className={`w-full aspect-square text-center font-mono text-xl sm:text-2xl font-bold rounded-2xl border transition-all focus:outline-none select-none ${
                    digit
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-800/80 border-slate-700 text-white hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  } ${error ? 'border-rose-500 bg-rose-950/20' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* On-Screen Numeric Keypad */}
          <div className="mb-5">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  disabled={Boolean(successUser)}
                  className="py-3 bg-slate-800/70 hover:bg-slate-750 hover:bg-slate-700 active:scale-95 text-white font-mono text-lg font-semibold rounded-xl border border-slate-700/70 transition-all cursor-pointer select-none"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypadPress('clear')}
                disabled={Boolean(successUser)}
                className="py-3 bg-slate-800/40 hover:bg-rose-950/30 hover:text-rose-300 text-slate-400 font-semibold text-xs rounded-xl border border-slate-700/50 transition-all cursor-pointer flex items-center justify-center"
                title="Hapus Semua Angka"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                disabled={Boolean(successUser)}
                className="py-3 bg-slate-800/70 hover:bg-slate-700 active:scale-95 text-white font-mono text-lg font-semibold rounded-xl border border-slate-700/70 transition-all cursor-pointer select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('backspace')}
                disabled={Boolean(successUser)}
                className="py-3 bg-slate-800/40 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/50 transition-all cursor-pointer flex items-center justify-center active:scale-95"
                title="Hapus Digit Terakhir"
              >
                <Delete className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={() => {
              if (isFullPin) {
                verifyPin(pinDigits.join(''));
              } else {
                setError('Harap lengkapi seluruh 6 digit PIN Anda.');
              }
            }}
            disabled={Boolean(successUser)}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              isFullPin
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 active:scale-[0.99]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-750 border border-slate-700'
            }`}
          >
            <span>Masuk ke Sistem</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Reset PIN Trigger Button */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-800/60"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Lupa PIN? Reset PIN Petugas</span>
            </button>
          </div>
        </div>

        {/* Demo Helper Drawer for Testing / Reviewing */}
        <div className="mt-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setIsDemoAccordionOpen(!isDemoAccordionOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Daftar Akun & PIN Default (Bantuan Pengujian)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              {isDemoAccordionOpen ? 'Tutup ▲' : 'Buka ▼'}
            </span>
          </button>

          {isDemoAccordionOpen && (
            <div className="p-3 pt-2 border-t border-slate-800 space-y-3 text-xs">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Akun Peran Utama</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Klik untuk langsung isi PIN</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {(usersList.length > 0 ? usersList : DEFAULT_USERS).slice(0, 5).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickFillPin(u.pin)}
                      className="p-2 bg-slate-800/80 hover:bg-slate-800 hover:border-emerald-500/50 border border-slate-700/60 rounded-xl text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-emerald-300 truncate max-w-[150px]">
                          {u.name}
                        </span>
                        <span className="font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-1.5 py-0.2 rounded text-[11px]">
                          {u.pin}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>{u.role}</span>
                        <span className="text-slate-500 font-mono">
                          {u.subWilayah || u.wilayah}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 151 Halaqoh Quick Search / Tester */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Cari Cepat Akun 151 Halaqoh
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Total: {usersList.filter((u) => u.role === 'Petugas Halaqoh').length} Halaqoh
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    value={demoHalaqahSearch}
                    onChange={(e) => setDemoHalaqahSearch(e.target.value)}
                    placeholder="Ketik nama halaqoh (cth: Salaman, Gombong, Jepara)..."
                    className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {demoHalaqahSearch && (
                    <button
                      type="button"
                      onClick={() => setDemoHalaqahSearch('')}
                      className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {usersList
                    .filter((u) => u.role === 'Petugas Halaqoh')
                    .filter((u) => {
                      if (!demoHalaqahSearch) return true;
                      const q = demoHalaqahSearch.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        (u.subWilayah && u.subWilayah.toLowerCase().includes(q)) ||
                        (u.wilayah && u.wilayah.toLowerCase().includes(q)) ||
                        u.pin.includes(q)
                      );
                    })
                    .slice(0, 8)
                    .map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickFillPin(u.pin)}
                        className="w-full p-2 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 border border-slate-700/50 rounded-lg text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="truncate mr-2">
                          <div className="font-semibold text-slate-200 group-hover:text-emerald-300 text-xs truncate">
                            {u.subWilayah}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Markaz {u.wilayah} &bull; {u.email}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 rounded text-[11px]">
                            {u.pin}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center mt-5 text-[11px] text-slate-500">
          <span>Hak Akses Terdistribusi: Admin Provinsi &bull; Petugas Markaz &bull; Petugas Halaqoh &bull; Khidmat Laporan</span>
        </div>
      </div>

      {/* Reset PIN Modal */}
      <ResetPinModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        usersList={usersList}
        onResetPin={handleInternalResetPin}
        onSuccessReset={handleSuccessReset}
      />
    </div>
  );
};
