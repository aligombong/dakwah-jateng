import { MaqamiRecord } from '../types';

export interface MaqamiSummary {
  // 1. HALAQAH
  jumlahHalaqah: number;
  jamaahRangka: number;
  jamaah3Hari: number;

  // 2. KARKUN
  karkunUlama1Tahun: number;
  karkun4Bulan: number;
  karkun40Hari: number;
  totalKarkun: number;

  // 3. MASJID
  jumlahMasjidMushalla: number;
  masjid5Amal: number;
  masjid4Amal: number;
  masjid3Amal: number;
  masjid2Amal: number;
  masjid1Amal: number;
  totalMasjidAdaAmal: number;

  // 4. MASTURAT
  masturat2BlnIP: number;
  masturat40Hari: number;
  masturat10_15Hari: number;
  masturat3Hari: number;
  masturatTaklimRumahHarian: number;
  masturatTaklimMahallaPekanan: number;

  // 5. PELAJAR MAHASISWA
  pelajarMalamMarkaz: number;
  pelajarKeluar1Hari: number;
}

export function calculateSummary(records: MaqamiRecord[]): MaqamiSummary {
  const sum: MaqamiSummary = {
    jumlahHalaqah: 0,
    jamaahRangka: 0,
    jamaah3Hari: 0,

    karkunUlama1Tahun: 0,
    karkun4Bulan: 0,
    karkun40Hari: 0,
    totalKarkun: 0,

    jumlahMasjidMushalla: 0,
    masjid5Amal: 0,
    masjid4Amal: 0,
    masjid3Amal: 0,
    masjid2Amal: 0,
    masjid1Amal: 0,
    totalMasjidAdaAmal: 0,

    masturat2BlnIP: 0,
    masturat40Hari: 0,
    masturat10_15Hari: 0,
    masturat3Hari: 0,
    masturatTaklimRumahHarian: 0,
    masturatTaklimMahallaPekanan: 0,

    pelajarMalamMarkaz: 0,
    pelajarKeluar1Hari: 0,
  };

  records.forEach((r) => {
    sum.jumlahHalaqah += Number(r.jumlahHalaqah) || 0;
    sum.jamaahRangka += Number(r.jamaahRangka) || 0;
    sum.jamaah3Hari += Number(r.jamaah3Hari) || 0;

    sum.karkunUlama1Tahun += Number(r.karkunUlama1Tahun) || 0;
    sum.karkun4Bulan += Number(r.karkun4Bulan) || 0;
    sum.karkun40Hari += Number(r.karkun40Hari) || 0;

    sum.jumlahMasjidMushalla += Number(r.jumlahMasjidMushalla) || 0;
    sum.masjid5Amal += Number(r.masjid5Amal) || 0;
    sum.masjid4Amal += Number(r.masjid4Amal) || 0;
    sum.masjid3Amal += Number(r.masjid3Amal) || 0;
    sum.masjid2Amal += Number(r.masjid2Amal) || 0;
    sum.masjid1Amal += Number(r.masjid1Amal) || 0;

    sum.masturat2BlnIP += Number(r.masturat2BlnIP) || 0;
    sum.masturat40Hari += Number(r.masturat40Hari) || 0;
    sum.masturat10_15Hari += Number(r.masturat10_15Hari) || 0;
    sum.masturat3Hari += Number(r.masturat3Hari) || 0;
    sum.masturatTaklimRumahHarian += Number(r.masturatTaklimRumahHarian) || 0;
    sum.masturatTaklimMahallaPekanan += Number(r.masturatTaklimMahallaPekanan) || 0;

    sum.pelajarMalamMarkaz += Number(r.pelajarMalamMarkaz) || 0;
    sum.pelajarKeluar1Hari += Number(r.pelajarKeluar1Hari) || 0;
  });

  sum.totalKarkun = sum.karkunUlama1Tahun + sum.karkun4Bulan + sum.karkun40Hari;
  sum.totalMasjidAdaAmal =
    sum.masjid5Amal + sum.masjid4Amal + sum.masjid3Amal + sum.masjid2Amal + sum.masjid1Amal;

  return sum;
}

export function formatNumberIndo(num: number | string | undefined | null): string {
  if (num === null || num === undefined || num === '') return '0';
  const n = typeof num === 'string' ? parseFloat(num.toString().replace(/\./g, '').replace(/,/g, '.')) : num;
  if (isNaN(n)) return '0';

  const isNegative = n < 0;
  const absNum = Math.abs(n);
  const parts = absNum.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Always use dot '.' as thousands separator in Indonesian notation (e.g. 1.000, 25.000, 1.250.000)
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const result = decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
  return isNegative ? `-${result}` : result;
}

export interface DeltaMetric {
  current: number;
  previous: number;
  diff: number;
  percent: number;
  isIncrease: boolean;
  isDecrease: boolean;
  isZero: boolean;
  formattedDiff: string;
  formattedPercent: string;
  badgeClass: string;
  textClass: string;
}

export function calculateDelta(current: number = 0, previous: number = 0): DeltaMetric {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  const diff = curr - prev;
  const percent = prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;
  const isIncrease = diff > 0;
  const isDecrease = diff < 0;
  const isZero = diff === 0;

  const formattedDiff = isIncrease ? `+${formatNumberIndo(diff)}` : formatNumberIndo(diff);
  const formattedPercent = isIncrease
    ? `+${percent.toFixed(1)}%`
    : isDecrease
    ? `${percent.toFixed(1)}%`
    : '0%';

  const badgeClass = isIncrease
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isDecrease
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-slate-50 text-slate-600 border-slate-200';

  const textClass = isIncrease
    ? 'text-emerald-700 font-semibold'
    : isDecrease
    ? 'text-rose-600 font-semibold'
    : 'text-slate-500';

  return {
    current: curr,
    previous: prev,
    diff,
    percent,
    isIncrease,
    isDecrease,
    isZero,
    formattedDiff,
    formattedPercent,
    badgeClass,
    textClass,
  };
}
