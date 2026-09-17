import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MaqamiRecord, PeriodeType } from '../types';
import { DAFTAR_PERIODE, getPreviousPeriode } from '../data/initialData';
import { calculateSummary, formatNumberIndo, calculateDelta } from '../utils/calculations';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter,
  Sparkles,
  Calendar,
  ArrowUpDown,
  Layers,
  Minus,
  Info,
} from 'lucide-react';

interface TrendChartsProps {
  allRecords: MaqamiRecord[];
  currentRecords: MaqamiRecord[];
  periodeLabel: string;
  regionList: string[];
}

type MetricCategory = 'karkun' | 'masjid' | 'jamaah' | 'masturat' | 'pelajar';
type DataDisplayMode = 'delta' | 'absolute';

export const TrendCharts: React.FC<TrendChartsProps> = ({
  allRecords,
  currentRecords,
  periodeLabel,
  regionList,
}) => {
  const [activeCategory, setActiveCategory] = useState<MetricCategory>('karkun');
  const [chartView, setChartView] = useState<'wilayah' | 'tren-periode'>('tren-periode');
  const [trendPeriodeType, setTrendPeriodeType] = useState<PeriodeType>('bulanan');
  const [dataDisplayMode, setDataDisplayMode] = useState<DataDisplayMode>('delta');

  // Find current active period object
  const currentPeriodeValue = currentRecords[0]?.periode || '2026-09';
  const previousPeriodObj = getPreviousPeriode(currentPeriodeValue);
  const previousRecords = previousPeriodObj
    ? allRecords.filter((r) => r.periode === previousPeriodObj.value)
    : [];

  // Summary for active and previous periods
  const currentSummary = calculateSummary(currentRecords);
  const prevSummary = previousRecords.length > 0 ? calculateSummary(previousRecords) : undefined;

  // Key metric deltas for the top growth highlights
  const deltaHighlightKarkun4Bln = prevSummary
    ? calculateDelta(currentSummary.karkun4Bulan, prevSummary.karkun4Bulan)
    : null;
  const deltaHighlightKarkun40Hr = prevSummary
    ? calculateDelta(currentSummary.karkun40Hari, prevSummary.karkun40Hari)
    : null;
  const deltaHighlightMasjid5Amal = prevSummary
    ? calculateDelta(currentSummary.masjid5Amal, prevSummary.masjid5Amal)
    : null;
  const deltaHighlightJamaah3Hari = prevSummary
    ? calculateDelta(currentSummary.jamaah3Hari, prevSummary.jamaah3Hari)
    : null;

  // Prepare data for Regional Bar Chart
  const regionalData = regionList.map((wil) => {
    const rec = currentRecords.find((r) => r.wilayah === wil);
    const prevRec = previousRecords.find((r) => r.wilayah === wil);

    const totalKarkun =
      rec ? (rec.karkunUlama1Tahun || 0) + (rec.karkun4Bulan || 0) + (rec.karkun40Hari || 0) : 0;
    const prevTotalKarkun =
      prevRec ? (prevRec.karkunUlama1Tahun || 0) + (prevRec.karkun4Bulan || 0) + (prevRec.karkun40Hari || 0) : 0;

    const totalMasjidAmal =
      rec
        ? (rec.masjid5Amal || 0) +
          (rec.masjid4Amal || 0) +
          (rec.masjid3Amal || 0) +
          (rec.masjid2Amal || 0) +
          (rec.masjid1Amal || 0)
        : 0;
    const prevTotalMasjidAmal =
      prevRec
        ? (prevRec.masjid5Amal || 0) +
          (prevRec.masjid4Amal || 0) +
          (prevRec.masjid3Amal || 0) +
          (prevRec.masjid2Amal || 0) +
          (prevRec.masjid1Amal || 0)
        : 0;

    if (dataDisplayMode === 'delta') {
      return {
        wilayah: wil,
        isDelta: true,
        // Karkun
        'Ulama 1 Thn': (rec?.karkunUlama1Tahun || 0) - (prevRec?.karkunUlama1Tahun || 0),
        '4 Bulan': (rec?.karkun4Bulan || 0) - (prevRec?.karkun4Bulan || 0),
        '40 Hari': (rec?.karkun40Hari || 0) - (prevRec?.karkun40Hari || 0),
        'Total Karkun': totalKarkun - prevTotalKarkun,

        // Masjid
        '5 Amal': (rec?.masjid5Amal || 0) - (prevRec?.masjid5Amal || 0),
        '4 Amal': (rec?.masjid4Amal || 0) - (prevRec?.masjid4Amal || 0),
        '3 Amal': (rec?.masjid3Amal || 0) - (prevRec?.masjid3Amal || 0),
        '2 Amal': (rec?.masjid2Amal || 0) - (prevRec?.masjid2Amal || 0),
        '1 Amal': (rec?.masjid1Amal || 0) - (prevRec?.masjid1Amal || 0),
        'Total Masjid Beramal': totalMasjidAmal - prevTotalMasjidAmal,

        // Jamaah
        'Jamaah Rangka': (rec?.jamaahRangka || 0) - (prevRec?.jamaahRangka || 0),
        'Jamaah 3 Hari': (rec?.jamaah3Hari || 0) - (prevRec?.jamaah3Hari || 0),
        Halaqah: (rec?.jumlahHalaqah || 0) - (prevRec?.jumlahHalaqah || 0),

        // Masturat
        'Taklim Rumah': (rec?.masturatTaklimRumahHarian || 0) - (prevRec?.masturatTaklimRumahHarian || 0),
        '3 Hari Masturat': (rec?.masturat3Hari || 0) - (prevRec?.masturat3Hari || 0),
        '10-15 Hari': (rec?.masturat10_15Hari || 0) - (prevRec?.masturat10_15Hari || 0),
        '40 Hari Masturat': (rec?.masturat40Hari || 0) - (prevRec?.masturat40Hari || 0),

        // Pelajar
        'Hadir Malam Markaz': (rec?.pelajarMalamMarkaz || 0) - (prevRec?.pelajarMalamMarkaz || 0),
        'Keluar 1 Hari/Bln': (rec?.pelajarKeluar1Hari || 0) - (prevRec?.pelajarKeluar1Hari || 0),

        // Raw records for tooltip
        _rawRec: rec,
        _prevRec: prevRec,
      };
    }

    // Absolute
    return {
      wilayah: wil,
      isDelta: false,
      // Karkun
      'Ulama 1 Thn': rec?.karkunUlama1Tahun || 0,
      '4 Bulan': rec?.karkun4Bulan || 0,
      '40 Hari': rec?.karkun40Hari || 0,
      'Total Karkun': totalKarkun,

      // Masjid
      '5 Amal': rec?.masjid5Amal || 0,
      '4 Amal': rec?.masjid4Amal || 0,
      '3 Amal': rec?.masjid3Amal || 0,
      '2 Amal': rec?.masjid2Amal || 0,
      '1 Amal': rec?.masjid1Amal || 0,
      'Total Masjid Beramal': totalMasjidAmal,

      // Jamaah
      'Jamaah Rangka': rec?.jamaahRangka || 0,
      'Jamaah 3 Hari': rec?.jamaah3Hari || 0,
      Halaqah: rec?.jumlahHalaqah || 0,

      // Masturat
      'Taklim Rumah': rec?.masturatTaklimRumahHarian || 0,
      '3 Hari Masturat': rec?.masturat3Hari || 0,
      '10-15 Hari': rec?.masturat10_15Hari || 0,
      '40 Hari Masturat': rec?.masturat40Hari || 0,

      // Pelajar
      'Hadir Malam Markaz': rec?.pelajarMalamMarkaz || 0,
      'Keluar 1 Hari/Bln': rec?.pelajarKeluar1Hari || 0,

      _rawRec: rec,
      _prevRec: prevRec,
    };
  });

  // Prepare data for Trend Bar Chart filtered by trendPeriodeType (bulanan, 2-bulanan, 4-bulanan, 1-tahun)
  const periodsOfType = DAFTAR_PERIODE.filter((p) => p.type === trendPeriodeType);
  // Reverse to get chronological left-to-right flow (e.g. 2024 -> 2025 -> 2026)
  const chronologicalPeriods = [...periodsOfType].reverse();

  const trendData = chronologicalPeriods.map((p, idx) => {
    const periodRecords = allRecords.filter((r) => r.periode === p.value);
    const sum = calculateSummary(periodRecords);
    const label = p.shortLabel || p.label;

    const prevP = idx > 0 ? chronologicalPeriods[idx - 1] : undefined;
    const prevRecords = prevP ? allRecords.filter((r) => r.periode === prevP.value) : [];
    const prevSum = prevRecords.length > 0 ? calculateSummary(prevRecords) : undefined;

    if (dataDisplayMode === 'delta') {
      return {
        periode: label,
        fullLabel: p.label,
        prevLabel: prevP ? (prevP.shortLabel || prevP.label) : 'Baseline',
        isDelta: true,
        isBaseline: idx === 0,
        // Deltas (current - previous)
        'Total Karkun': prevSum ? sum.totalKarkun - prevSum.totalKarkun : 0,
        '4 Bulan': prevSum ? sum.karkun4Bulan - prevSum.karkun4Bulan : 0,
        '40 Hari': prevSum ? sum.karkun40Hari - prevSum.karkun40Hari : 0,
        'Ulama 1 Thn': prevSum ? sum.karkunUlama1Tahun - prevSum.karkunUlama1Tahun : 0,

        'Total Masjid Beramal': prevSum ? sum.totalMasjidAdaAmal - prevSum.totalMasjidAdaAmal : 0,
        '5 Amal': prevSum ? sum.masjid5Amal - prevSum.masjid5Amal : 0,
        '4 Amal': prevSum ? sum.masjid4Amal - prevSum.masjid4Amal : 0,
        '3 Amal': prevSum ? sum.masjid3Amal - prevSum.masjid3Amal : 0,
        '2 Amal': prevSum ? sum.masjid2Amal - prevSum.masjid2Amal : 0,
        '1 Amal': prevSum ? sum.masjid1Amal - prevSum.masjid1Amal : 0,

        'Jamaah 3 Hari': prevSum ? sum.jamaah3Hari - prevSum.jamaah3Hari : 0,
        'Jamaah Rangka': prevSum ? sum.jamaahRangka - prevSum.jamaahRangka : 0,
        Halaqah: prevSum ? sum.jumlahHalaqah - prevSum.jumlahHalaqah : 0,

        'Taklim Rumah': prevSum ? sum.masturatTaklimRumahHarian - prevSum.masturatTaklimRumahHarian : 0,
        '3 Hari Masturat': prevSum ? sum.masturat3Hari - prevSum.masturat3Hari : 0,
        '10-15 Hari': prevSum ? sum.masturat10_15Hari - prevSum.masturat10_15Hari : 0,
        '40 Hari Masturat': prevSum ? sum.masturat40Hari - prevSum.masturat40Hari : 0,

        'Hadir Malam Markaz': prevSum ? sum.pelajarMalamMarkaz - prevSum.pelajarMalamMarkaz : 0,
        'Keluar 1 Hari/Bln': prevSum ? sum.pelajarKeluar1Hari - prevSum.pelajarKeluar1Hari : 0,

        _sum: sum,
        _prevSum: prevSum,
      };
    }

    // Absolute values
    return {
      periode: label,
      fullLabel: p.label,
      prevLabel: prevP ? (prevP.shortLabel || prevP.label) : undefined,
      isDelta: false,
      'Total Karkun': sum.totalKarkun,
      '4 Bulan': sum.karkun4Bulan,
      '40 Hari': sum.karkun40Hari,
      'Ulama 1 Thn': sum.karkunUlama1Tahun,

      'Total Masjid Beramal': sum.totalMasjidAdaAmal,
      '5 Amal': sum.masjid5Amal,
      '4 Amal': sum.masjid4Amal,
      '3 Amal': sum.masjid3Amal,
      '2 Amal': sum.masjid2Amal,
      '1 Amal': sum.masjid1Amal,

      'Jamaah 3 Hari': sum.jamaah3Hari,
      'Jamaah Rangka': sum.jamaahRangka,
      Halaqah: sum.jumlahHalaqah,

      'Taklim Rumah': sum.masturatTaklimRumahHarian,
      '3 Hari Masturat': sum.masturat3Hari,
      '10-15 Hari': sum.masturat10_15Hari,
      '40 Hari Masturat': sum.masturat40Hari,

      'Hadir Malam Markaz': sum.pelajarMalamMarkaz,
      'Keluar 1 Hari/Bln': sum.pelajarKeluar1Hari,

      _sum: sum,
      _prevSum: prevSum,
    };
  });

  // Custom rich tooltip formatter showing delta and context
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataObj = payload[0].payload;
      const isDeltaMode = dataDisplayMode === 'delta';

      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs min-w-[220px]">
          <div className="border-b border-slate-700 pb-1.5 mb-2">
            <p className="font-bold text-slate-100 text-sm">{label}</p>
            {isDeltaMode ? (
              <p className="text-[10px] text-emerald-400 font-medium">
                {dataObj.isBaseline
                  ? 'Periode Acuan Awal (Baseline)'
                  : `Kenaikan / Penurunan vs ${dataObj.prevLabel || 'Periode Sebelumnya'}`}
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">Data Riil Saat Itu</p>
            )}
          </div>

          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const val = Number(entry.value) || 0;
              const isPositive = val > 0;
              const isNegative = val < 0;

              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span
                      className="w-2.5 h-2.5 rounded-xs inline-block shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}:</span>
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      isDeltaMode
                        ? isPositive
                          ? 'text-emerald-400'
                          : isNegative
                          ? 'text-rose-400'
                          : 'text-slate-300'
                        : 'text-white'
                    }`}
                  >
                    {isDeltaMode && isPositive ? `+${formatNumberIndo(val)}` : formatNumberIndo(val)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Context note in delta mode */}
          {isDeltaMode && dataObj._prevSum && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Dasar Perhitungan:</span>
              <span className="text-slate-300 font-mono">
                Saat Ini &minus; Sebelumnya
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getTrendTypeLabel = () => {
    switch (trendPeriodeType) {
      case '1-tahun':
        return '1 Tahunan (Sep - Agu)';
      case '4-bulanan':
        return '4 Bulanan (Caturwulan)';
      case '2-bulanan':
        return '2 Bulanan (Diawali Sep)';
      case 'bulanan':
      default:
        return 'Bulanan';
    }
  };

  return (
    <div className="space-y-5">
      {/* Growth Summary Cards (Delta from previous period) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Pergerakan Karkun 4 Bulan</span>
            <span className="text-[10px] text-slate-400">vs {previousPeriodObj?.shortLabel || 'Bulan Lalu'}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              {formatNumberIndo(currentSummary.karkun4Bulan)}
            </span>
            {deltaHighlightKarkun4Bln && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold border ${deltaHighlightKarkun4Bln.badgeClass}`}
              >
                {deltaHighlightKarkun4Bln.isIncrease ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{deltaHighlightKarkun4Bln.formattedDiff}</span>
                <span className="text-[10px] opacity-80">({deltaHighlightKarkun4Bln.formattedPercent})</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Pergerakan Karkun 40 Hari</span>
            <span className="text-[10px] text-slate-400">vs {previousPeriodObj?.shortLabel || 'Bulan Lalu'}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              {formatNumberIndo(currentSummary.karkun40Hari)}
            </span>
            {deltaHighlightKarkun40Hr && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold border ${deltaHighlightKarkun40Hr.badgeClass}`}
              >
                {deltaHighlightKarkun40Hr.isIncrease ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{deltaHighlightKarkun40Hr.formattedDiff}</span>
                <span className="text-[10px] opacity-80">({deltaHighlightKarkun40Hr.formattedPercent})</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Pertambahan Masjid 5 Amal</span>
            <span className="text-[10px] text-slate-400">vs {previousPeriodObj?.shortLabel || 'Bulan Lalu'}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              {formatNumberIndo(currentSummary.masjid5Amal)}
            </span>
            {deltaHighlightMasjid5Amal && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold border ${deltaHighlightMasjid5Amal.badgeClass}`}
              >
                {deltaHighlightMasjid5Amal.isIncrease ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{deltaHighlightMasjid5Amal.formattedDiff}</span>
                <span className="text-[10px] opacity-80">({deltaHighlightMasjid5Amal.formattedPercent})</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Keluaran Jama'ah 3 Hari</span>
            <span className="text-[10px] text-slate-400">vs {previousPeriodObj?.shortLabel || 'Bulan Lalu'}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              {formatNumberIndo(currentSummary.jamaah3Hari)}
            </span>
            {deltaHighlightJamaah3Hari && (
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold border ${deltaHighlightJamaah3Hari.badgeClass}`}
              >
                {deltaHighlightJamaah3Hari.isIncrease ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{deltaHighlightJamaah3Hari.formattedDiff}</span>
                <span className="text-[10px] opacity-80">({deltaHighlightJamaah3Hari.formattedPercent})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* View Switcher & Category Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* View Mode & Mode Tampilan */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Chart View (Markaz vs Antar Periode) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setChartView('tren-periode')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartView === 'tren-periode'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tren Antar Periode
              </button>
              <button
                onClick={() => setChartView('wilayah')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartView === 'wilayah'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per Markaz ({periodeLabel})
              </button>
            </div>

            {/* Delta vs Absolute Mode Toggle (Direct User Request!) */}
            <div className="bg-emerald-50/90 border border-emerald-200 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setDataDisplayMode('delta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  dataDisplayMode === 'delta'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-900 hover:bg-emerald-100'
                }`}
                title="Tampilkan kenaikan atau penurunan dibanding periode sebelumnya"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Kenaikan / Penurunan (+/-)</span>
              </button>
              <button
                onClick={() => setDataDisplayMode('absolute')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dataDisplayMode === 'absolute'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-emerald-800 hover:bg-emerald-100'
                }`}
                title="Tampilkan data mutlak/riil saat itu"
              >
                <span>Nilai Riil Saat Itu</span>
              </button>
            </div>
          </div>

          {/* Period type filters when looking at historical trends */}
          {chartView === 'tren-periode' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start lg:self-auto">
              {(
                [
                  { id: 'bulanan', label: 'Bulanan' },
                  { id: '2-bulanan', label: '2 Bulanan' },
                  { id: '4-bulanan', label: '4 Bulanan' },
                  { id: '1-tahun', label: '1 Tahun' },
                ] as const
              ).map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setTrendPeriodeType(pt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    trendPeriodeType === pt.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Metrik:
          </span>
          <button
            onClick={() => setActiveCategory('karkun')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'karkun'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Karkun
          </button>
          <button
            onClick={() => setActiveCategory('masjid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'masjid'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Masjid & Amal
          </button>
          <button
            onClick={() => setActiveCategory('jamaah')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'jamaah'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jama'ah
          </button>
          <button
            onClick={() => setActiveCategory('masturat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'masturat'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Masturat
          </button>
          <button
            onClick={() => setActiveCategory('pelajar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'pelajar'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pelajar & Mahasiswa
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>
                {dataDisplayMode === 'delta'
                  ? `Grafik Kenaikan / Penurunan (Delta) ${chartView === 'wilayah' ? 'Per Markaz' : getTrendTypeLabel()}: Kategori ${activeCategory.toUpperCase()}`
                  : `Grafik Nilai Riil ${chartView === 'wilayah' ? 'Per Markaz' : getTrendTypeLabel()}: Kategori ${activeCategory.toUpperCase()}`}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {dataDisplayMode === 'delta'
                ? `Menghitung selisih pertambahan (+) atau penurunan (&minus;) dibandingkan data periode sebelumnya`
                : `Menampilkan angka riil terdata pada saat periode laporan berlangsung`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                dataDisplayMode === 'delta'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {dataDisplayMode === 'delta' ? 'Mode: Delta (+/-) Periode Sebelumnya' : 'Mode: Nilai Riil Saat Itu'}
            </span>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="h-[420px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartView === 'wilayah' ? regionalData : trendData}
              margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              {dataDisplayMode === 'delta' && (
                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
              )}
              <XAxis
                dataKey={chartView === 'wilayah' ? 'wilayah' : 'periode'}
                angle={chartView === 'wilayah' ? -35 : 0}
                textAnchor={chartView === 'wilayah' ? 'end' : 'middle'}
                interval={0}
                tick={{ fontSize: 11, fill: '#475569' }}
                height={55}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => (dataDisplayMode === 'delta' && val > 0 ? `+${formatNumberIndo(val)}` : formatNumberIndo(val))}
              />
              <Tooltip content={renderTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: 15 }}
                iconType="circle"
                formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
              />

              {/* Dynamic Bars based on Selected Category */}
              {activeCategory === 'karkun' && (
                <>
                  <Bar dataKey="4 Bulan" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="40 Hari" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ulama 1 Thn" fill="#d97706" radius={[4, 4, 0, 0]} />
                </>
              )}

              {activeCategory === 'masjid' && (
                <>
                  <Bar dataKey="5 Amal" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="4 Amal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="3 Amal" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2 Amal" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="1 Amal" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </>
              )}

              {activeCategory === 'jamaah' && (
                <>
                  <Bar dataKey="Jamaah Rangka" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Jamaah 3 Hari" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  {chartView === 'wilayah' && (
                    <Bar dataKey="Halaqah" fill="#ca8a04" radius={[4, 4, 0, 0]} />
                  )}
                </>
              )}

              {activeCategory === 'masturat' && (
                <>
                  <Bar dataKey="Taklim Rumah" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="3 Hari Masturat" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="10-15 Hari" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="40 Hari Masturat" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </>
              )}

              {activeCategory === 'pelajar' && (
                <>
                  <Bar dataKey="Hadir Malam Markaz" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Keluar 1 Hari/Bln" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytical Highlight Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {dataDisplayMode === 'delta'
                ? 'Angka positif (+) menandakan kenaikan capaian dakwah, sedangkan negatif (-) menunjukkan penurunan dibanding periode lalu.'
                : 'Data merefleksikan nilai absolut yang tersimpan pada masing-masing periode laporan.'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Perbandingan aktif: {periodeLabel} vs {previousPeriodObj?.shortLabel || 'Periode Sebelumnya'}
          </span>
        </div>
      </div>
    </div>
  );
};
