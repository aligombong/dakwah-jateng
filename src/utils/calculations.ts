import { MaqamiRecord } from '../types';

export interface MaqamiSummary {
  // 1. HALAQAH
  jumlahHalaqah: number;
  jamaahRangka: number;
  jamaah3Hari: number;
  jamaahJaulah2: number;

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
    jamaahJaulah2: 0,

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
    sum.jamaahJaulah2 += Number(r.jamaahJaulah2) || 0;

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

export function formatNumberIndo(num: number): string {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}
