import { HalaqahMaqamiRecord, MaqamiRecord } from '../types';
import { WILAYAH_HALAQAH_COUNTS } from '../data/subWilayahData';

/**
 * Largest Remainder (Hamilton-Hare) method for exact integer partitioning.
 * Guarantees sum(result) === total and all result elements are non-negative integers.
 */
export function partitionInteger(total: number, weights: number[]): number[] {
  if (total <= 0 || weights.length === 0) {
    return new Array(weights.length).fill(0);
  }
  const weightSum = weights.reduce((a, b) => a + b, 0);
  if (weightSum <= 0) {
    const base = Math.floor(total / weights.length);
    const rem = total % weights.length;
    return weights.map((_, i) => base + (i < rem ? 1 : 0));
  }

  const quotas = weights.map((w) => (w / weightSum) * total);
  const floors = quotas.map((q) => Math.floor(q));
  const floorSum = floors.reduce((a, b) => a + b, 0);
  let remainder = total - floorSum;

  const remainders = quotas.map((q, i) => ({
    rem: q - floors[i],
    idx: i,
  }));
  remainders.sort((a, b) => b.rem - a.rem);

  const result = [...floors];
  for (let i = 0; i < remainder; i++) {
    result[remainders[i % remainders.length].idx] += 1;
  }
  return result;
}

/**
 * Aggregates a list of halaqoh records belonging to a specific Wilayah into a single Wilayah MaqamiRecord.
 * Every metric is the direct mathematical sum of the halaqohs in that wilayah.
 */
export function aggregateHalaqahToWilayahRecord(
  halaqahList: HalaqahMaqamiRecord[],
  wilayah: string,
  periode: string,
  periodeLabel: string,
  fallbackRecord?: MaqamiRecord
): MaqamiRecord {
  const normWilayah = wilayah.toUpperCase();
  const matched = halaqahList.filter(
    (h) => h.wilayah.toUpperCase() === normWilayah && h.periode === periode
  );

  // If no halaqoh records exist for this period yet, use fallback or zeroes
  if (matched.length === 0) {
    if (fallbackRecord) {
      return fallbackRecord;
    }
    return {
      id: `rec-${periode}-${wilayah.toLowerCase()}`,
      wilayah,
      periode,
      periodeLabel,
      jumlahHalaqah: WILAYAH_HALAQAH_COUNTS[normWilayah] || 0,
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
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedBy: 'Sistem Sinkronisasi',
    };
  }

  // Count of halaqoh in this wilayah
  const halaqahCount = matched.length;

  // Sum helper
  const sumField = (fn: (h: HalaqahMaqamiRecord) => number | undefined) =>
    matched.reduce((acc, h) => acc + (fn(h) || 0), 0);

  // Latest update time among halaqohs
  let latestUpdate = matched[0]?.updatedAt || '';
  for (const h of matched) {
    if (h.updatedAt && h.updatedAt > latestUpdate) {
      latestUpdate = h.updatedAt;
    }
  }

  return {
    id: `rec-${periode}-${wilayah.toLowerCase()}`,
    wilayah,
    periode,
    periodeLabel,

    // 1. JUMLAH HALAQAH (Banyaknya halaqoh yang bergabung)
    jumlahHalaqah: halaqahCount,
    jamaahRangka: sumField((h) => h.jamaahRangka),
    jamaah3Hari: sumField((h) => h.jamaah3Hari),
    jamaahJaulah2: sumField((h) => h.jamaahJaulah2),

    // 2. KARKUN
    karkunUlama1Tahun: sumField((h) => h.karkunUlama1Tahun),
    karkun4Bulan: sumField((h) => h.karkun4Bulan),
    karkun40Hari: sumField((h) => h.karkun40Hari),

    // 3. MASJID & AMAL
    jumlahMasjidMushalla: sumField((h) => h.jumlahMasjidMushalla),
    masjid5Amal: sumField((h) => h.masjid5Amal),
    masjid4Amal: sumField((h) => h.masjid4Amal),
    masjid3Amal: sumField((h) => h.masjid3Amal),
    masjid2Amal: sumField((h) => h.masjid2Amal),
    masjid1Amal: sumField((h) => h.masjid1Amal),

    // 4. MASTURAT
    masturat2BlnIP: sumField((h) => h.masturat2BlnIP),
    masturat40Hari: sumField((h) => h.masturat40Hari),
    masturat10_15Hari: sumField((h) => h.masturat10_15Hari),
    masturat3Hari: sumField((h) => h.masturat3Hari),
    masturatTaklimRumahHarian: sumField((h) => h.masturatTaklimRumahHarian),
    masturatTaklimMahallaPekanan: sumField((h) => h.masturatTaklimMahallaPekanan),

    // 5. PELAJAR MAHASISWA
    pelajarMalamMarkaz: sumField((h) => h.pelajarMalamMarkaz),
    pelajarKeluar1Hari: sumField((h) => h.pelajarKeluar1Hari),

    updatedAt: latestUpdate || new Date().toISOString().replace('T', ' ').slice(0, 16),
    updatedBy: 'Gabungan Data Halaqoh',
  };
}

/**
 * Aggregates all wilayah in wilayahList from the current halaqah records.
 * Returns an array of MaqamiRecord where each wilayah is the sum of its halaqohs.
 */
export function aggregateAllWilayahFromHalaqah(
  halaqahRecords: HalaqahMaqamiRecord[],
  wilayahList: string[],
  periode: string,
  periodeLabel: string,
  fallbackRecords?: MaqamiRecord[]
): MaqamiRecord[] {
  return wilayahList.map((wil) => {
    const fallback = fallbackRecords?.find(
      (r) => r.wilayah.toUpperCase() === wil.toUpperCase() && r.periode === periode
    );
    return aggregateHalaqahToWilayahRecord(
      halaqahRecords,
      wil,
      periode,
      periodeLabel,
      fallback
    );
  });
}

/**
 * When an administrative user edits a Wilayah record directly in DataEntryModal,
 * distribute the numbers across the halaqohs using exact partitioning so the halaqohs sum up to the new Wilayah numbers.
 */
export function distributeWilayahRecordToHalaqahs(
  updatedWilayahRecord: MaqamiRecord,
  existingHalaqahs: HalaqahMaqamiRecord[]
): HalaqahMaqamiRecord[] {
  const normWil = updatedWilayahRecord.wilayah.toUpperCase();
  const matchedHalaqahs = existingHalaqahs.filter(
    (h) => h.wilayah.toUpperCase() === normWil && h.periode === updatedWilayahRecord.periode
  );

  if (matchedHalaqahs.length === 0) {
    return existingHalaqahs;
  }

  // Use current values as weights or deterministic weights if all zeros
  const getWeightsForField = (fn: (h: HalaqahMaqamiRecord) => number) => {
    const weights = matchedHalaqahs.map((h, i) => {
      const v = fn(h);
      return v > 0 ? v : 1 + (i % 3);
    });
    return weights;
  };

  const pRangka = partitionInteger(
    updatedWilayahRecord.jamaahRangka,
    getWeightsForField((h) => h.jamaahRangka)
  );
  const p3Hari = partitionInteger(
    updatedWilayahRecord.jamaah3Hari,
    getWeightsForField((h) => h.jamaah3Hari)
  );
  const pJaulah2 = partitionInteger(
    updatedWilayahRecord.jamaahJaulah2,
    getWeightsForField((h) => h.jamaahJaulah2)
  );

  const pUlama = partitionInteger(
    updatedWilayahRecord.karkunUlama1Tahun,
    getWeightsForField((h) => h.karkunUlama1Tahun)
  );
  const p4Bulan = partitionInteger(
    updatedWilayahRecord.karkun4Bulan,
    getWeightsForField((h) => h.karkun4Bulan)
  );
  const p40Hari = partitionInteger(
    updatedWilayahRecord.karkun40Hari,
    getWeightsForField((h) => h.karkun40Hari)
  );

  const pMasjid = partitionInteger(
    updatedWilayahRecord.jumlahMasjidMushalla,
    getWeightsForField((h) => h.jumlahMasjidMushalla)
  );
  const pM5 = partitionInteger(
    updatedWilayahRecord.masjid5Amal,
    getWeightsForField((h) => h.masjid5Amal)
  );
  const pM4 = partitionInteger(
    updatedWilayahRecord.masjid4Amal,
    getWeightsForField((h) => h.masjid4Amal)
  );
  const pM3 = partitionInteger(
    updatedWilayahRecord.masjid3Amal,
    getWeightsForField((h) => h.masjid3Amal)
  );
  const pM2 = partitionInteger(
    updatedWilayahRecord.masjid2Amal,
    getWeightsForField((h) => h.masjid2Amal)
  );
  const pM1 = partitionInteger(
    updatedWilayahRecord.masjid1Amal,
    getWeightsForField((h) => h.masjid1Amal)
  );

  const pMast2Bln = partitionInteger(
    updatedWilayahRecord.masturat2BlnIP,
    getWeightsForField((h) => h.masturat2BlnIP)
  );
  const pMast40Hr = partitionInteger(
    updatedWilayahRecord.masturat40Hari,
    getWeightsForField((h) => h.masturat40Hari)
  );
  const pMast10Hr = partitionInteger(
    updatedWilayahRecord.masturat10_15Hari,
    getWeightsForField((h) => h.masturat10_15Hari)
  );
  const pMast3Hr = partitionInteger(
    updatedWilayahRecord.masturat3Hari,
    getWeightsForField((h) => h.masturat3Hari)
  );
  const pMastHarian = partitionInteger(
    updatedWilayahRecord.masturatTaklimRumahHarian,
    getWeightsForField((h) => h.masturatTaklimRumahHarian)
  );
  const pMastPekanan = partitionInteger(
    updatedWilayahRecord.masturatTaklimMahallaPekanan,
    getWeightsForField((h) => h.masturatTaklimMahallaPekanan)
  );

  const pPelajarMalam = partitionInteger(
    updatedWilayahRecord.pelajarMalamMarkaz,
    getWeightsForField((h) => h.pelajarMalamMarkaz)
  );
  const pPelajarKeluar = partitionInteger(
    updatedWilayahRecord.pelajarKeluar1Hari,
    getWeightsForField((h) => h.pelajarKeluar1Hari)
  );

  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const updatedMatched = matchedHalaqahs.map((h, i) => ({
    ...h,
    jamaahRangka: pRangka[i],
    jamaah3Hari: p3Hari[i],
    jamaahJaulah2: pJaulah2[i],
    karkunUlama1Tahun: pUlama[i],
    karkun4Bulan: p4Bulan[i],
    karkun40Hari: p40Hari[i],
    jumlahMasjidMushalla: pMasjid[i],
    masjid5Amal: pM5[i],
    masjid4Amal: pM4[i],
    masjid3Amal: pM3[i],
    masjid2Amal: pM2[i],
    masjid1Amal: pM1[i],
    masturat2BlnIP: pMast2Bln[i],
    masturat40Hari: pMast40Hr[i],
    masturat10_15Hari: pMast10Hr[i],
    masturat3Hari: pMast3Hr[i],
    masturatTaklimRumahHarian: pMastHarian[i],
    masturatTaklimMahallaPekanan: pMastPekanan[i],
    pelajarMalamMarkaz: pPelajarMalam[i],
    pelajarKeluar1Hari: pPelajarKeluar[i],
    updatedAt: nowStr,
    updatedBy: updatedWilayahRecord.updatedBy || 'Penyesuaian Wilayah',
  }));

  const updatedMap = new Map(updatedMatched.map((h) => [h.id, h]));
  return existingHalaqahs.map((h) => updatedMap.get(h.id) || h);
}
