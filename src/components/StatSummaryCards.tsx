import React from 'react';
import { MaqamiSummary, formatNumberIndo } from '../utils/calculations';
import { Users, Landmark, Compass, Home, GraduationCap } from 'lucide-react';

interface StatSummaryCardsProps {
  summary: MaqamiSummary;
  periodeLabel: string;
}

export const StatSummaryCards: React.FC<StatSummaryCardsProps> = ({ summary, periodeLabel }) => {
  const percentMasjidAmal =
    summary.jumlahMasjidMushalla > 0
      ? ((summary.totalMasjidAdaAmal / summary.jumlahMasjidMushalla) * 100).toFixed(2)
      : '0';

  const totalJamaahKeluar =
    summary.jamaahRangka + summary.jamaah3Hari + summary.jamaahJaulah2;

  const totalMasturatKeluar =
    summary.masturat2BlnIP +
    summary.masturat40Hari +
    summary.masturat10_15Hari +
    summary.masturat3Hari;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Total Karkun */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Total Karkun
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatNumberIndo(summary.totalKarkun)}
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>4 Bulan: <strong className="text-slate-800">{formatNumberIndo(summary.karkun4Bulan)}</strong></span>
          <span>40 Hari: <strong className="text-slate-800">{formatNumberIndo(summary.karkun40Hari)}</strong></span>
        </div>
      </div>

      {/* 2. Masjid Ada Amal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Masjid Ada Amal
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatNumberIndo(summary.totalMasjidAdaAmal)}
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Total Masjid: <strong className="text-slate-800">{formatNumberIndo(summary.jumlahMasjidMushalla)}</strong></span>
          <span className="text-emerald-700 font-medium">{percentMasjidAmal}%</span>
        </div>
      </div>

      {/* 3. Halaqah & Jamaah */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Halaqah & Jama'ah
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatNumberIndo(summary.jumlahHalaqah)} <span className="text-xs font-normal text-slate-500">Halaqah</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Rangka: <strong className="text-slate-800">{formatNumberIndo(summary.jamaahRangka)}</strong></span>
          <span>3 Hari: <strong className="text-slate-800">{formatNumberIndo(summary.jamaah3Hari)}</strong></span>
        </div>
      </div>

      {/* 4. Masturat */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Taklim Rumah Masturat
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatNumberIndo(summary.masturatTaklimRumahHarian)}
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Keluar 3 Hr: <strong className="text-slate-800">{formatNumberIndo(summary.masturat3Hari)}</strong></span>
          <span>10-15 Hr: <strong className="text-slate-800">{formatNumberIndo(summary.masturat10_15Hari)}</strong></span>
        </div>
      </div>

      {/* 5. Pelajar Mahasiswa */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Pelajar & Mahasiswa
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatNumberIndo(summary.pelajarMalamMarkaz)} <span className="text-xs font-normal text-slate-500">Mlm Markaz</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Keluar 1 Hari: <strong className="text-slate-800">{formatNumberIndo(summary.pelajarKeluar1Hari)}</strong></span>
          <span className="text-slate-400">Rata2</span>
        </div>
      </div>
    </div>
  );
};
