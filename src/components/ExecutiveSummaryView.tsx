import React from 'react';
import { MaqamiRecord } from '../types';
import { calculateSummary, formatNumberIndo } from '../utils/calculations';
import { SUB_WILAYAH_DATA, TOTAL_SUB_WILAYAH_COUNT } from '../data/subWilayahData';
import {
  Compass,
  Users,
  Landmark,
  Home,
  GraduationCap,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  MapPin,
} from 'lucide-react';

interface ExecutiveSummaryViewProps {
  records: MaqamiRecord[];
  periodeLabel: string;
  regionList: string[];
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  records,
  periodeLabel,
  regionList,
}) => {
  const summary = calculateSummary(records);

  // Calculate Region Rankings for Karkun
  const sortedByKarkun = [...records].sort((a, b) => {
    const totalA = (a.karkunUlama1Tahun || 0) + (a.karkun4Bulan || 0) + (a.karkun40Hari || 0);
    const totalB = (b.karkunUlama1Tahun || 0) + (b.karkun4Bulan || 0) + (b.karkun40Hari || 0);
    return totalB - totalA;
  });

  // Calculate Region Rankings for Masjid Beramal
  const sortedByMasjidAmal = [...records].sort((a, b) => {
    const totalA =
      (a.masjid5Amal || 0) +
      (a.masjid4Amal || 0) +
      (a.masjid3Amal || 0) +
      (a.masjid2Amal || 0) +
      (a.masjid1Amal || 0);
    const totalB =
      (b.masjid5Amal || 0) +
      (b.masjid4Amal || 0) +
      (b.masjid3Amal || 0) +
      (b.masjid2Amal || 0) +
      (b.masjid1Amal || 0);
    return totalB - totalA;
  });

  const masjidBelumAmal = Math.max(0, summary.jumlahMasjidMushalla - summary.totalMasjidAdaAmal);
  const persenMasjidBelumAmal =
    summary.jumlahMasjidMushalla > 0
      ? ((masjidBelumAmal / summary.jumlahMasjidMushalla) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Executive Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Target className="w-3.5 h-3.5" />
            <span>Rekapitulasi Eksekutif &bull; {periodeLabel}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Potensi & Capaian Kerja Dakwah Maqami Jawa Tengah
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Data terpadu 10 wilayah halaqah di Jawa Tengah mencatatkan total{' '}
            <strong className="text-emerald-400 font-bold">{formatNumberIndo(summary.totalKarkun)}</strong> karkun aktif,{' '}
            <strong className="text-emerald-400 font-bold">{formatNumberIndo(summary.totalMasjidAdaAmal)}</strong> masjid yang telah menghidupkan amal masjid, serta{' '}
            <strong className="text-emerald-400 font-bold">{formatNumberIndo(summary.masturatTaklimRumahHarian)}</strong> taklim rumah harian masturat.
          </p>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Total Karkun 4 Bulan</span>
            <span className="text-lg font-bold text-white mt-0.5 block font-mono">
              {formatNumberIndo(summary.karkun4Bulan)}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Total Karkun 40 Hari</span>
            <span className="text-lg font-bold text-white mt-0.5 block font-mono">
              {formatNumberIndo(summary.karkun40Hari)}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Masjid 5 Amal</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block font-mono">
              {formatNumberIndo(summary.masjid5Amal)}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Jama'ah Rangka</span>
            <span className="text-lg font-bold text-teal-300 mt-0.5 block font-mono">
              {formatNumberIndo(summary.jamaahRangka)}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Potensi Lapangan Masjid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Peluang & Potensi Masjid / Mushalla
              </h3>
              <p className="text-[11px] text-slate-500">Cakupan kerja dakwah memakmurkan masjid</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Masjid Terdata</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {formatNumberIndo(summary.jumlahMasjidMushalla)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Masjid Ada Amal</span>
                <span className="text-xl font-bold text-emerald-600 font-mono">
                  {formatNumberIndo(summary.totalMasjidAdaAmal)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>Persentase Masjid Beramal</span>
                <span className="text-emerald-700 font-bold">
                  {summary.jumlahMasjidMushalla > 0
                    ? ((summary.totalMasjidAdaAmal / summary.jumlahMasjidMushalla) * 100).toFixed(2)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      summary.jumlahMasjidMushalla > 0
                        ? (summary.totalMasjidAdaAmal / summary.jumlahMasjidMushalla) * 100
                        : 0
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Tantangan & Potensi Luar Biasa:</strong> Masih terdapat{' '}
                <strong className="underline">{formatNumberIndo(masjidBelumAmal)}</strong> masjid/mushalla ({persenMasjidBelumAmal}%) yang belum terbentuk amal masjid secara konsisten, membuka ladang dakwah yang sangat luas bagi jaulah dan khuruj jamaah.
              </div>
            </div>
          </div>
        </div>

        {/* Peringkat Markaz (Karkun) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Persebaran Kekuatan Karkun per Markaz
                </h3>
                <p className="text-[11px] text-slate-500">Urutan markaz berdasarkan total karkun</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {sortedByKarkun.slice(0, 5).map((rec, idx) => {
              const total =
                (rec.karkunUlama1Tahun || 0) + (rec.karkun4Bulan || 0) + (rec.karkun40Hari || 0);
              const maxKarkun =
                (sortedByKarkun[0].karkunUlama1Tahun || 0) +
                (sortedByKarkun[0].karkun4Bulan || 0) +
                (sortedByKarkun[0].karkun40Hari || 0);
              const percent = maxKarkun > 0 ? (total / maxKarkun) * 100 : 0;

              return (
                <div key={rec.wilayah} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{rec.wilayah}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatNumberIndo(total)} Karkun
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub Wilayah Distribution Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Distribusi 151 Halaqoh di 10 Markaz
              </h3>
              <p className="text-[11px] text-slate-500">
                Pondasi basis unit halaqoh dakwah di seluruh Jawa Tengah & D.I. Yogyakarta
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl self-start sm:self-auto">
            <span>Total: {formatNumberIndo(TOTAL_SUB_WILAYAH_COUNT)} Halaqoh</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(SUB_WILAYAH_DATA).map(([wil, list]) => {
            const pct = ((list.length / TOTAL_SUB_WILAYAH_COUNT) * 100).toFixed(1);
            return (
              <div
                key={wil}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {wil}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      {formatNumberIndo(list.length)}
                    </span>
                    <span className="text-[10px] text-slate-500">halaqoh</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Porsi</span>
                  <span className="font-semibold text-emerald-700">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
