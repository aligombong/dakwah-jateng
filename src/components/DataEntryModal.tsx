import React, { useState, useEffect } from 'react';
import { MaqamiRecord } from '../types';
import { DAFTAR_PERIODE, WILAYAH_LIST } from '../data/initialData';
import { getSubWilayahList, getSubWilayahCount } from '../data/subWilayahData';
import { formatNumberIndo } from '../utils/calculations';
import {
  X,
  Save,
  CheckCircle2,
  Users,
  Landmark,
  Compass,
  Home,
  GraduationCap,
  Sparkles,
  MapPin,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MaqamiRecord) => void;
  existingRecords: MaqamiRecord[];
  initialWilayah?: string;
  initialPeriode?: string;
  onOpenHalaqahPage?: (wilayah: string, halaqah?: string) => void;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingRecords,
  initialWilayah = 'MAGELANG',
  initialPeriode = '2026-09',
  onOpenHalaqahPage,
}) => {
  const [wilayah, setWilayah] = useState(initialWilayah);
  const [periode, setPeriode] = useState(initialPeriode);
  const [activeSection, setActiveSection] = useState<'halaqah' | 'karkun' | 'masjid' | 'masturat' | 'pelajar'>('halaqah');

  // Form fields
  const [formData, setFormData] = useState<Omit<MaqamiRecord, 'id' | 'wilayah' | 'periode' | 'periodeLabel'>>({
    jumlahHalaqah: 0,
    jamaahRangka: 0,
    jamaah3Hari: 0,
    jamaahJaulah2: 0,
    karkunUlama1Tahun: 0,
    karkun4Bulan: 0,
    karkun40Hari: 0,
    jumlahMasjidMushalla: 0,
    masjid5Amal: 0,
    masjid4Amal: 0,
    masjid3Amal: 0,
    masjid2Amal: 0,
    masjid1Amal: 0,
    masturat2BlnIP: 0,
    masturat40Hari: 0,
    masturat10_15Hari: 0,
    masturat3Hari: 0,
    masturatTaklimRumahHarian: 0,
    masturatTaklimMahallaPekanan: 0,
    pelajarMalamMarkaz: 0,
    pelajarKeluar1Hari: 0,
  });

  // Whenever wilayah or periode changes, populate if existing
  useEffect(() => {
    if (initialWilayah) setWilayah(initialWilayah);
  }, [initialWilayah]);

  useEffect(() => {
    if (initialPeriode) setPeriode(initialPeriode);
  }, [initialPeriode]);

  useEffect(() => {
    const existing = existingRecords.find(
      (r) => r.wilayah === wilayah && r.periode === periode
    );

    if (existing) {
      setFormData({
        jumlahHalaqah: existing.jumlahHalaqah,
        jamaahRangka: existing.jamaahRangka,
        jamaah3Hari: existing.jamaah3Hari,
        jamaahJaulah2: existing.jamaahJaulah2,
        karkunUlama1Tahun: existing.karkunUlama1Tahun,
        karkun4Bulan: existing.karkun4Bulan,
        karkun40Hari: existing.karkun40Hari,
        jumlahMasjidMushalla: existing.jumlahMasjidMushalla,
        masjid5Amal: existing.masjid5Amal,
        masjid4Amal: existing.masjid4Amal,
        masjid3Amal: existing.masjid3Amal,
        masjid2Amal: existing.masjid2Amal,
        masjid1Amal: existing.masjid1Amal,
        masturat2BlnIP: existing.masturat2BlnIP,
        masturat40Hari: existing.masturat40Hari,
        masturat10_15Hari: existing.masturat10_15Hari,
        masturat3Hari: existing.masturat3Hari,
        masturatTaklimRumahHarian: existing.masturatTaklimRumahHarian,
        masturatTaklimMahallaPekanan: existing.masturatTaklimMahallaPekanan,
        pelajarMalamMarkaz: existing.pelajarMalamMarkaz,
        pelajarKeluar1Hari: existing.pelajarKeluar1Hari,
      });
    } else {
      // Reset
      setFormData({
        jumlahHalaqah: 0,
        jamaahRangka: 0,
        jamaah3Hari: 0,
        jamaahJaulah2: 0,
        karkunUlama1Tahun: 0,
        karkun4Bulan: 0,
        karkun40Hari: 0,
        jumlahMasjidMushalla: 0,
        masjid5Amal: 0,
        masjid4Amal: 0,
        masjid3Amal: 0,
        masjid2Amal: 0,
        masjid1Amal: 0,
        masturat2BlnIP: 0,
        masturat40Hari: 0,
        masturat10_15Hari: 0,
        masturat3Hari: 0,
        masturatTaklimRumahHarian: 0,
        masturatTaklimMahallaPekanan: 0,
        pelajarMalamMarkaz: 0,
        pelajarKeluar1Hari: 0,
      });
    }
  }, [wilayah, periode, existingRecords]);

  if (!isOpen) return null;

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setFormData((prev) => ({ ...prev, [field]: num }));
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
    const periodObj = DAFTAR_PERIODE.find((p) => p.value === periode);
    const periodeLabel = periodObj ? periodObj.label : periode;

    const record: MaqamiRecord = {
      id: `rec-${periode}-${wilayah.toLowerCase()}`,
      wilayah,
      periode,
      periodeLabel,
      ...formData,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedBy: 'Khidmat Laporan',
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pencatatan & Pembaharuan Data Maqami
            </h3>
            <p className="text-xs text-slate-500">
              Masukkan atau perbarui angka laporan maqami berkala wilayah dakwah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Region & Period Selector Bar */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Wilayah / Halaqah:
            </label>
            <select
              value={wilayah}
              onChange={(e) => setWilayah(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {WILAYAH_LIST.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Periode Laporan:
            </label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {DAFTAR_PERIODE.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Aggregation & Synchronization Notice */}
        <div className="px-4 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Wilayah <strong>{wilayah}</strong> membina <strong>{getSubWilayahCount(wilayah)} halaqoh</strong>. Data wilayah ini merupakan gabungan dari halaqoh-halaqoh tersebut.
            </span>
          </div>
          {onOpenHalaqahPage && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHalaqahPage(wilayah);
              }}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-[11px] underline underline-offset-2 shrink-0 cursor-pointer"
            >
              <span>Input per Halaqoh</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-1 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSection('halaqah')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'halaqah'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Halaqah & Jama'ah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('karkun')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'karkun'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Karkun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('masjid')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'masjid'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Masjid & Amal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('masturat')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'masturat'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Masturat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('pelajar')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'pelajar'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pelajar Mahasiswa</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Section 1: HALAQAH */}
          {activeSection === 'halaqah' && (
            <div className="space-y-4">
              {/* Sub-Wilayah Master Helper Card */}
              {(() => {
                const subList = getSubWilayahList(wilayah);
                const masterCount = subList.length;
                return (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-emerald-950">
                            Master Sub Wilayah: {wilayah}
                          </span>
                          <p className="text-[11px] text-emerald-800">
                            Tercatat resmi <strong>{masterCount} Halaqoh</strong> di wilayah ini
                          </p>
                        </div>
                      </div>
                      {masterCount > 0 && formData.jumlahHalaqah !== masterCount && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, jumlahHalaqah: masterCount }))}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          Set Sesuai Master ({masterCount})
                        </button>
                      )}
                    </div>
                    {subList.length > 0 && (
                      <div className="pt-2 border-t border-emerald-200/60">
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                          {subList.map((name, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md font-medium"
                            >
                              {i + 1}. {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Jumlah Halaqah
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Master: {getSubWilayahCount(wilayah)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.jumlahHalaqah}
                    onChange={(e) => handleFieldChange('jumlahHalaqah', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Jama'ah Rangka
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jamaahRangka}
                    onChange={(e) => handleFieldChange('jamaahRangka', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Jama'ah 3 Hari
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jamaah3Hari}
                    onChange={(e) => handleFieldChange('jamaah3Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Jama'ah Jaulah 2
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jamaahJaulah2}
                    onChange={(e) => handleFieldChange('jamaahJaulah2', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: KARKUN */}
          {activeSection === 'karkun' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    'Ulama 1 Tahun
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.karkunUlama1Tahun}
                    onChange={(e) => handleFieldChange('karkunUlama1Tahun', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    4 Bulan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.karkun4Bulan}
                    onChange={(e) => handleFieldChange('karkun4Bulan', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    40 Hari
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.karkun40Hari}
                    onChange={(e) => handleFieldChange('karkun40Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Total Karkun Live Calculation Display */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-900">Total Karkun Otomatis:</span>
                <span className="font-bold text-emerald-800 text-sm font-mono">
                  {formatNumberIndo(calculatedTotalKarkun)} Karkun
                </span>
              </div>
            </div>
          )}

          {/* Section 3: MASJID */}
          {activeSection === 'masjid' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jumlah Seluruh Masjid / Mushalla di Wilayah
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlahMasjidMushalla}
                  onChange={(e) => handleFieldChange('jumlahMasjidMushalla', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-800 block mb-2">
                  Amal Masjid Berjalan:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">5 Amal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.masjid5Amal}
                      onChange={(e) => handleFieldChange('masjid5Amal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">4 Amal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.masjid4Amal}
                      onChange={(e) => handleFieldChange('masjid4Amal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">3 Amal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.masjid3Amal}
                      onChange={(e) => handleFieldChange('masjid3Amal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">2 Amal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.masjid2Amal}
                      onChange={(e) => handleFieldChange('masjid2Amal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">1 Amal</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.masjid1Amal}
                      onChange={(e) => handleFieldChange('masjid1Amal', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Total Masjid Ada Amal Live Display */}
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">Total Masjid Ada Amal Otomatis:</span>
                <span className="font-bold text-blue-800 text-sm font-mono">
                  {formatNumberIndo(calculatedTotalMasjidAmal)} Masjid
                </span>
              </div>
            </div>
          )}

          {/* Section 4: MASTURAT */}
          {activeSection === 'masturat' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    2 Bln IP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturat2BlnIP}
                    onChange={(e) => handleFieldChange('masturat2BlnIP', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    40 Hari
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturat40Hari}
                    onChange={(e) => handleFieldChange('masturat40Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    10/15 Hari
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturat10_15Hari}
                    onChange={(e) => handleFieldChange('masturat10_15Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    3 Hari
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturat3Hari}
                    onChange={(e) => handleFieldChange('masturat3Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Taklim Rumah Harian
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturatTaklimRumahHarian}
                    onChange={(e) => handleFieldChange('masturatTaklimRumahHarian', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Taklim Mahalla Pekanan
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.masturatTaklimMahallaPekanan}
                    onChange={(e) => handleFieldChange('masturatTaklimMahallaPekanan', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: PELAJAR MAHASISWA */}
          {activeSection === 'pelajar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Hadir Malam Markaz (Rata-rata)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pelajarMalamMarkaz}
                    onChange={(e) => handleFieldChange('pelajarMalamMarkaz', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Keluar 1 Hari / Bulan (Rata-rata)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pelajarKeluar1Hari}
                    onChange={(e) => handleFieldChange('pelajarKeluar1Hari', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Semua total dikalkulasi secara otomatis</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
