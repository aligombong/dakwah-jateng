import React, { useState, useEffect } from 'react';
import { HalaqahMaqamiRecord, UserSession } from '../types';
import { formatNumberIndo } from '../utils/calculations';
import {
  X,
  Save,
  CheckCircle2,
  Users,
  Landmark,
  Heart,
  GraduationCap,
  Sparkles,
  MapPin,
  Building2,
  Shield,
} from 'lucide-react';

interface HalaqahDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: HalaqahMaqamiRecord;
  onSave: (updated: HalaqahMaqamiRecord) => void;
  currentUser?: UserSession;
}

export const HalaqahDataEntryModal: React.FC<HalaqahDataEntryModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
  currentUser,
}) => {
  const [formData, setFormData] = useState<HalaqahMaqamiRecord>({ ...record });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...record });
      setSaveSuccess(false);
    }
  }, [isOpen, record]);

  if (!isOpen) return null;

  const handleChange = (field: keyof HalaqahMaqamiRecord, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, value || 0),
    }));
  };

  const calculatedTotalKarkun =
    (formData.karkunUlama1Tahun || 0) +
    (formData.karkun4Bulan || 0) +
    (formData.karkun40Hari || 0);

  const calculatedTotalMasjidAmal =
    (formData.masjid5Amal || 0) +
    (formData.masjid4Amal || 0) +
    (formData.masjid3Amal || 0) +
    (formData.masjid2Amal || 0) +
    (formData.masjid1Amal || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HalaqahMaqamiRecord = {
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Petugas Halaqoh',
    };
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Entri Data Maqami Halaqoh: {record.halaqah}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 font-semibold">
                  Markaz {record.wilayah}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Periode: {record.periodeLabel} &bull; Pembaruan data capaian dakwah tingkat halaqoh
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-200 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                <Shield className="w-3 h-3 text-emerald-300" />
                <span>Petugas: {currentUser.name}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Section 1: HALAQAH & JAMAAH */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>I. JUMLAH MAHALLA & JAMAAH</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Mahalla Binaan
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlahHalaqah}
                  onChange={(e) => handleChange('jumlahHalaqah', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jama'ah Rangka
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jamaahRangka}
                  onChange={(e) => handleChange('jamaahRangka', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jama'ah 3 Hari
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jamaah3Hari}
                  onChange={(e) => handleChange('jamaah3Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: KARKUN */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-slate-900 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>II. KARKUN</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold font-mono">
                Total: {formatNumberIndo(calculatedTotalKarkun)} Karkun
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  'Ulama 1 Tahun
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.karkunUlama1Tahun}
                  onChange={(e) => handleChange('karkunUlama1Tahun', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Karkun 4 Bulan
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.karkun4Bulan}
                  onChange={(e) => handleChange('karkun4Bulan', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Karkun 40 Hari
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.karkun40Hari}
                  onChange={(e) => handleChange('karkun40Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: MASJID & AMAL */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-slate-900 font-bold text-sm">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>III. MASJID & AMAL MASJID</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold font-mono">
                Ada Amal: {formatNumberIndo(calculatedTotalMasjidAmal)} / {formatNumberIndo(formData.jumlahMasjidMushalla)} Masjid
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="col-span-2 sm:col-span-3 lg:col-span-6 mb-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Jumlah Masjid / Mushalla di Halaqoh
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlahMasjidMushalla}
                  onChange={(e) => handleChange('jumlahMasjidMushalla', parseInt(e.target.value))}
                  className="w-full sm:w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  5 Amal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masjid5Amal}
                  onChange={(e) => handleChange('masjid5Amal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  4 Amal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masjid4Amal}
                  onChange={(e) => handleChange('masjid4Amal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3 Amal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masjid3Amal}
                  onChange={(e) => handleChange('masjid3Amal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2 Amal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masjid2Amal}
                  onChange={(e) => handleChange('masjid2Amal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1 Amal
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masjid1Amal}
                  onChange={(e) => handleChange('masjid1Amal', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: MASTURAT */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200 text-slate-900 font-bold text-sm">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>IV. MASTURAT</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2 Bln IP
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturat2BlnIP}
                  onChange={(e) => handleChange('masturat2BlnIP', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  40 Hari
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturat40Hari}
                  onChange={(e) => handleChange('masturat40Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  10/15 Hari
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturat10_15Hari}
                  onChange={(e) => handleChange('masturat10_15Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3 Hari
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturat3Hari}
                  onChange={(e) => handleChange('masturat3Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taklim Rumah Harian
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturatTaklimRumahHarian}
                  onChange={(e) => handleChange('masturatTaklimRumahHarian', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taklim Pekanan
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.masturatTaklimMahallaPekanan}
                  onChange={(e) => handleChange('masturatTaklimMahallaPekanan', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: PELAJAR MAHASISWA */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200 text-slate-900 font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>V. PELAJAR & MAHASISWA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hadir Malam Markaz
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pelajarMalamMarkaz}
                  onChange={(e) => handleChange('pelajarMalamMarkaz', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keluar 1 Hari / Bulan
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pelajarKeluar1Hari}
                  onChange={(e) => handleChange('pelajarKeluar1Hari', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Data Halaqoh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
