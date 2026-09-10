import { HalaqahMaqamiRecord, MaqamiRecord } from '../types';
import { SUB_WILAYAH_DATA, ALL_SUB_WILAYAH_FLAT } from './subWilayahData';
import { partitionInteger } from '../utils/halaqahAggregation';
import { RAW_SEPTEMBER_2026 } from './initialData';

export const STORAGE_KEY = 'masqami_halaqah_records_v2';

/**
 * Simple pseudo-random weight generator based on string to create realistic varied numbers per halaqoh
 */
export function getDeterministicWeight(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 0.6 + (Math.abs(hash) % 80) / 100; // Between 0.6 and 1.4
}

/**
 * Generate initial realistic seed data for all 151 halaqoh.
 * Uses exact integer partitioning so that the sum of all halaqohs in a Wilayah
 * matches the Wilayah's totals with 100% mathematical precision.
 */
export function generateInitialHalaqahRecords(
  periode: string = '2026-09',
  periodeLabel: string = 'September 2026',
  wilayahRecords?: MaqamiRecord[]
): HalaqahMaqamiRecord[] {
  const wilMap = new Map<string, Partial<MaqamiRecord>>();
  if (wilayahRecords && wilayahRecords.length > 0) {
    wilayahRecords.forEach((w) => wilMap.set(w.wilayah.toUpperCase(), w));
  } else {
    Object.entries(RAW_SEPTEMBER_2026).forEach(([w, r]) => wilMap.set(w.toUpperCase(), r));
  }

  const records: HalaqahMaqamiRecord[] = [];

  Object.entries(SUB_WILAYAH_DATA).forEach(([wilayah, halaqahList]) => {
    const parentRec = wilMap.get(wilayah.toUpperCase()) || RAW_SEPTEMBER_2026[wilayah.toUpperCase()] || {};
    const weights = halaqahList.map((h) => getDeterministicWeight(`${wilayah}-${h}`));

    // Exactly partition each metric so that the sum of halaqoh records === parent Wilayah total
    const pRangka = partitionInteger(parentRec.jamaahRangka ?? 0, weights);
    const p3Hari = partitionInteger(parentRec.jamaah3Hari ?? 0, weights);

    const pUlama = partitionInteger(parentRec.karkunUlama1Tahun ?? 0, weights);
    const p4Bulan = partitionInteger(parentRec.karkun4Bulan ?? 0, weights);
    const p40Hari = partitionInteger(parentRec.karkun40Hari ?? 0, weights);

    const pMasjid = partitionInteger(parentRec.jumlahMasjidMushalla ?? 0, weights);
    const pM5 = partitionInteger(parentRec.masjid5Amal ?? 0, weights);
    const pM4 = partitionInteger(parentRec.masjid4Amal ?? 0, weights);
    const pM3 = partitionInteger(parentRec.masjid3Amal ?? 0, weights);
    const pM2 = partitionInteger(parentRec.masjid2Amal ?? 0, weights);
    const pM1 = partitionInteger(parentRec.masjid1Amal ?? 0, weights);

    const pMast2Bln = partitionInteger(parentRec.masturat2BlnIP ?? 0, weights);
    const pMast40Hr = partitionInteger(parentRec.masturat40Hari ?? 0, weights);
    const pMast10Hr = partitionInteger(parentRec.masturat10_15Hari ?? 0, weights);
    const pMast3Hr = partitionInteger(parentRec.masturat3Hari ?? 0, weights);
    const pMastHarian = partitionInteger(parentRec.masturatTaklimRumahHarian ?? 0, weights);
    const pMastPekanan = partitionInteger(parentRec.masturatTaklimMahallaPekanan ?? 0, weights);

    const pPelajarMalam = partitionInteger(parentRec.pelajarMalamMarkaz ?? 0, weights);
    const pPelajarKeluar = partitionInteger(parentRec.pelajarKeluar1Hari ?? 0, weights);

    halaqahList.forEach((halaqahName, idx) => {
      const record: HalaqahMaqamiRecord = {
        id: `hal-${periode}-${wilayah.toLowerCase()}-${idx + 1}`,
        wilayah,
        halaqah: halaqahName,
        periode,
        periodeLabel,

        // 1. JUMLAH HALAQAH (1 halaqoh per unit, sehingga total sum = jumlah halaqoh wilayah)
        jumlahHalaqah: 1,
        jamaahRangka: pRangka[idx],
        jamaah3Hari: p3Hari[idx],

        // 2. KARKUN
        karkunUlama1Tahun: pUlama[idx],
        karkun4Bulan: p4Bulan[idx],
        karkun40Hari: p40Hari[idx],

        // 3. MASJID & AMAL
        jumlahMasjidMushalla: pMasjid[idx],
        masjid5Amal: pM5[idx],
        masjid4Amal: pM4[idx],
        masjid3Amal: pM3[idx],
        masjid2Amal: pM2[idx],
        masjid1Amal: pM1[idx],

        // 4. MASTURAT
        masturat2BlnIP: pMast2Bln[idx],
        masturat40Hari: pMast40Hr[idx],
        masturat10_15Hari: pMast10Hr[idx],
        masturat3Hari: pMast3Hr[idx],
        masturatTaklimRumahHarian: pMastHarian[idx],
        masturatTaklimMahallaPekanan: pMastPekanan[idx],

        // 5. PELAJAR MAHASISWA
        pelajarMalamMarkaz: pPelajarMalam[idx],
        pelajarKeluar1Hari: pPelajarKeluar[idx],

        updatedAt: '2026-09-08 08:00',
        updatedBy: 'Sistem Maqami',
      };

      records.push(record);
    });
  });

  return records;
}

/**
 * Load halaqah records from localStorage or initialize with seed data
 */
export function loadHalaqahRecordsFromStorage(
  periode: string = '2026-09',
  periodeLabel: string = 'September 2026',
  wilayahRecords?: MaqamiRecord[]
): HalaqahMaqamiRecord[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${periode}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= ALL_SUB_WILAYAH_FLAT.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load halaqah records from storage', e);
  }

  // Fallback to generating fresh seed
  const initial = generateInitialHalaqahRecords(periode, periodeLabel, wilayahRecords);
  saveHalaqahRecordsToStorage(initial, periode);
  return initial;
}

/**
 * Save all halaqah records to localStorage
 */
export function saveHalaqahRecordsToStorage(
  records: HalaqahMaqamiRecord[],
  periode: string = '2026-09'
): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${periode}`, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save halaqah records to storage', e);
  }
}
