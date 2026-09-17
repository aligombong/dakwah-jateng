import React from 'react';
import { MaqamiSummary, formatNumberIndo, calculateDelta, DeltaMetric } from '../utils/calculations';
import { Users, Landmark, Compass, Home, GraduationCap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatSummaryCardsProps {
  summary: MaqamiSummary;
  periodeLabel: string;
  previousSummary?: MaqamiSummary;
  previousPeriodeLabel?: string;
}

export const StatSummaryCards: React.FC<StatSummaryCardsProps> = ({
  summary,
  periodeLabel,
  previousSummary,
  previousPeriodeLabel,
}) => {
  const percentMasjidAmal =
    summary.jumlahMasjidMushalla > 0
      ? ((summary.totalMasjidAdaAmal / summary.jumlahMasjidMushalla) * 100).toFixed(1)
      : '0';

  const prevPercentMasjidAmal =
    previousSummary && previousSummary.jumlahMasjidMushalla > 0
      ? ((previousSummary.totalMasjidAdaAmal / previousSummary.jumlahMasjidMushalla) * 100).toFixed(1)
      : undefined;

  const totalJamaahKeluar = summary.jamaahRangka + summary.jamaah3Hari;
  const prevTotalJamaahKeluar = previousSummary
    ? previousSummary.jamaahRangka + previousSummary.jamaah3Hari
    : undefined;

  // Deltas
  const deltaKarkun = previousSummary
    ? calculateDelta(summary.totalKarkun, previousSummary.totalKarkun)
    : null;

  const deltaKarkun4Bln = previousSummary
    ? calculateDelta(summary.karkun4Bulan, previousSummary.karkun4Bulan)
    : null;

  const deltaKarkun40Hr = previousSummary
    ? calculateDelta(summary.karkun40Hari, previousSummary.karkun40Hari)
    : null;

  const deltaMasjidAmal = previousSummary
    ? calculateDelta(summary.totalMasjidAdaAmal, previousSummary.totalMasjidAdaAmal)
    : null;

  const deltaJamaah = previousSummary && prevTotalJamaahKeluar !== undefined
    ? calculateDelta(totalJamaahKeluar, prevTotalJamaahKeluar)
    : null;

  const deltaRangka = previousSummary
    ? calculateDelta(summary.jamaahRangka, previousSummary.jamaahRangka)
    : null;

  const delta3Hari = previousSummary
    ? calculateDelta(summary.jamaah3Hari, previousSummary.jamaah3Hari)
    : null;

  const deltaMasturat = previousSummary
    ? calculateDelta(summary.masturatTaklimRumahHarian, previousSummary.masturatTaklimRumahHarian)
    : null;

  const deltaMast3Hr = previousSummary
    ? calculateDelta(summary.masturat3Hari, previousSummary.masturat3Hari)
    : null;

  const deltaPelajar = previousSummary
    ? calculateDelta(summary.pelajarKeluar1Hari, previousSummary.pelajarKeluar1Hari)
    : null;

  const deltaPelajarMalam = previousSummary
    ? calculateDelta(summary.pelajarMalamMarkaz, previousSummary.pelajarMalamMarkaz)
    : null;

  const renderDeltaBadge = (delta: DeltaMetric | null) => {
    if (!delta) return null;
    return (
      <span
        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${delta.badgeClass}`}
        title={`Periode lalu: ${formatNumberIndo(delta.previous)} | Selisih: ${delta.formattedDiff}`}
      >
        {delta.isIncrease ? (
          <TrendingUp className="w-2.5 h-2.5 shrink-0" />
        ) : delta.isDecrease ? (
          <TrendingDown className="w-2.5 h-2.5 shrink-0" />
        ) : (
          <Minus className="w-2.5 h-2.5 shrink-0" />
        )}
        <span>{delta.formattedDiff}</span>
        <span className="opacity-80">({delta.formattedPercent})</span>
      </span>
    );
  };

  const renderSmallDelta = (delta: DeltaMetric | null) => {
    if (!delta || delta.isZero) return null;
    return (
      <span className={`text-[10px] ml-1 font-semibold ${delta.isIncrease ? 'text-emerald-600' : 'text-rose-600'}`}>
        ({delta.formattedDiff})
      </span>
    );
  };

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
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatNumberIndo(summary.totalKarkun)}
          </div>
          {renderDeltaBadge(deltaKarkun)}
        </div>
        {previousPeriodeLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            vs {previousPeriodeLabel}
          </p>
        )}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            4 Bulan:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.karkun4Bulan)}</strong>
            {renderSmallDelta(deltaKarkun4Bln)}
          </span>
          <span>
            40 Hari:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.karkun40Hari)}</strong>
            {renderSmallDelta(deltaKarkun40Hr)}
          </span>
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
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatNumberIndo(summary.totalMasjidAdaAmal)}
          </div>
          {renderDeltaBadge(deltaMasjidAmal)}
        </div>
        {previousPeriodeLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            vs {previousPeriodeLabel}
          </p>
        )}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Total:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.jumlahMasjidMushalla)}</strong>
          </span>
          <span className="text-emerald-700 font-medium">
            {percentMasjidAmal}%
            {prevPercentMasjidAmal && (
              <span className="text-[10px] text-slate-400 ml-1">
                ({(parseFloat(percentMasjidAmal) - parseFloat(prevPercentMasjidAmal)).toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 3. Halaqah & Jamaah */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Jama'ah Keluar
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatNumberIndo(totalJamaahKeluar)} <span className="text-xs font-normal text-slate-500">Jm</span>
          </div>
          {renderDeltaBadge(deltaJamaah)}
        </div>
        {previousPeriodeLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            vs {previousPeriodeLabel}
          </p>
        )}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Rangka:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.jamaahRangka)}</strong>
            {renderSmallDelta(deltaRangka)}
          </span>
          <span>
            3 Hari:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.jamaah3Hari)}</strong>
            {renderSmallDelta(delta3Hari)}
          </span>
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
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatNumberIndo(summary.masturatTaklimRumahHarian)}
          </div>
          {renderDeltaBadge(deltaMasturat)}
        </div>
        {previousPeriodeLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            vs {previousPeriodeLabel}
          </p>
        )}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Keluar 3 Hr:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.masturat3Hari)}</strong>
            {renderSmallDelta(deltaMast3Hr)}
          </span>
          <span>
            40 Hr:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.masturat40Hari)}</strong>
          </span>
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
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatNumberIndo(summary.pelajarKeluar1Hari)} <span className="text-xs font-normal text-slate-500">Keluar</span>
          </div>
          {renderDeltaBadge(deltaPelajar)}
        </div>
        {previousPeriodeLabel && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            vs {previousPeriodeLabel}
          </p>
        )}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>
            Malam Markaz:{' '}
            <strong className="text-slate-800">{formatNumberIndo(summary.pelajarMalamMarkaz)}</strong>
            {renderSmallDelta(deltaPelajarMalam)}
          </span>
          <span className="text-slate-400">Rata2</span>
        </div>
      </div>
    </div>
  );
};
