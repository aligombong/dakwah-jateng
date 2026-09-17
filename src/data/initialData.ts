import { MaqamiRecord, UserSession, PeriodeItem } from '../types';
import { generateHalaqahAccounts } from './subWilayahData';

export const WILAYAH_LIST = [
  'MAGELANG',
  'PATI',
  'PEKALONGAN',
  'PURWOKERTO',
  'PURWOREJO',
  'SEMARANG',
  'SOLO',
  'SRAGEN',
  'TEGAL',
  'YOGYAKARTA',
];

export const MARKAZ_LIST = WILAYAH_LIST;

export const DAFTAR_PERIODE: PeriodeItem[] = [
  // 1. 1 TAHUN (Diawali September)
  {
    value: '1t-2026-2027',
    label: '1 Tahun: Sep 2026 - Agu 2027 (Berjalan)',
    shortLabel: '1 Thn 26/27',
    type: '1-tahun',
    group: '1 Tahun (Sep - Agu)',
    keterangan: 'Tahun dakwah berjalan diawali September 2026',
  },
  {
    value: '1t-2025-2026',
    label: '1 Tahun: Sep 2025 - Agu 2026 (Tahun Penuh)',
    shortLabel: '1 Thn 25/26',
    type: '1-tahun',
    group: '1 Tahun (Sep - Agu)',
    keterangan: 'Tahun dakwah penuh September 2025 s.d. Agustus 2026',
  },
  {
    value: '1t-2024-2025',
    label: '1 Tahun: Sep 2024 - Agu 2025',
    shortLabel: '1 Thn 24/25',
    type: '1-tahun',
    group: '1 Tahun (Sep - Agu)',
    keterangan: 'Tahun dakwah September 2024 s.d. Agustus 2025',
  },

  // 2. 4 BULANAN (Caturwulan - Diawali September)
  {
    value: '4b-2026-sep-des',
    label: '4 Bulanan: Sep - Des 2026 (Caturwulan I)',
    shortLabel: '4B Sep-Des 26',
    type: '4-bulanan',
    group: '4 Bulanan (Caturwulan)',
    keterangan: 'Caturwulan I (Sep - Des 2026)',
  },
  {
    value: '4b-2026-mei-agu',
    label: '4 Bulanan: Mei - Agu 2026 (Caturwulan III)',
    shortLabel: '4B Mei-Agu 26',
    type: '4-bulanan',
    group: '4 Bulanan (Caturwulan)',
    keterangan: 'Caturwulan III (Mei - Agu 2026)',
  },
  {
    value: '4b-2026-jan-apr',
    label: '4 Bulanan: Jan - Apr 2026 (Caturwulan II)',
    shortLabel: '4B Jan-Apr 26',
    type: '4-bulanan',
    group: '4 Bulanan (Caturwulan)',
    keterangan: 'Caturwulan II (Jan - Apr 2026)',
  },
  {
    value: '4b-2025-sep-des',
    label: '4 Bulanan: Sep - Des 2025 (Caturwulan I)',
    shortLabel: '4B Sep-Des 25',
    type: '4-bulanan',
    group: '4 Bulanan (Caturwulan)',
    keterangan: 'Caturwulan I (Sep - Des 2025)',
  },

  // 3. 2 BULANAN (Dua Bulanan - Diawali September)
  {
    value: '2b-2026-sep-okt',
    label: '2 Bulanan: Sep - Okt 2026 (Siklus 1)',
    shortLabel: '2B Sep-Okt 26',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 1 diawali September (Sep - Okt 2026)',
  },
  {
    value: '2b-2026-jul-agu',
    label: '2 Bulanan: Jul - Agu 2026 (Siklus 6)',
    shortLabel: '2B Jul-Agu 26',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 6 akhir tahun dakwah (Jul - Agu 2026)',
  },
  {
    value: '2b-2026-mei-jun',
    label: '2 Bulanan: Mei - Jun 2026 (Siklus 5)',
    shortLabel: '2B Mei-Jun 26',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 5 (Mei - Jun 2026)',
  },
  {
    value: '2b-2026-mar-apr',
    label: '2 Bulanan: Mar - Apr 2026 (Siklus 4)',
    shortLabel: '2B Mar-Apr 26',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 4 (Mar - Apr 2026)',
  },
  {
    value: '2b-2026-jan-feb',
    label: '2 Bulanan: Jan - Feb 2026 (Siklus 3)',
    shortLabel: '2B Jan-Feb 26',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 3 (Jan - Feb 2026)',
  },
  {
    value: '2b-2025-nov-des',
    label: '2 Bulanan: Nov - Des 2025 (Siklus 2)',
    shortLabel: '2B Nov-Des 25',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 2 (Nov - Des 2025)',
  },
  {
    value: '2b-2025-sep-okt',
    label: '2 Bulanan: Sep - Okt 2025 (Siklus 1)',
    shortLabel: '2B Sep-Okt 25',
    type: '2-bulanan',
    group: '2 Bulanan',
    keterangan: 'Siklus 1 (Sep - Okt 2025)',
  },

  // 4. BULANAN
  {
    value: '2026-09',
    label: 'September 2026',
    shortLabel: 'Sep 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan September 2026',
  },
  {
    value: '2026-08',
    label: 'Agustus 2026',
    shortLabel: 'Agu 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Agustus 2026',
  },
  {
    value: '2026-07',
    label: 'Juli 2026',
    shortLabel: 'Jul 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Juli 2026',
  },
  {
    value: '2026-06',
    label: 'Juni 2026',
    shortLabel: 'Jun 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Juni 2026',
  },
  {
    value: '2026-05',
    label: 'Mei 2026',
    shortLabel: 'Mei 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Mei 2026',
  },
  {
    value: '2026-04',
    label: 'April 2026',
    shortLabel: 'Apr 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan April 2026',
  },
  {
    value: '2026-03',
    label: 'Maret 2026',
    shortLabel: 'Mar 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Maret 2026',
  },
  {
    value: '2026-02',
    label: 'Februari 2026',
    shortLabel: 'Feb 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Februari 2026',
  },
  {
    value: '2026-01',
    label: 'Januari 2026',
    shortLabel: 'Jan 2026',
    type: 'bulanan',
    group: 'Bulanan',
    keterangan: 'Laporan bulanan Januari 2026',
  },
];

export function getPeriodeBadgeInfo(value: string): { label: string; badgeClass: string } {
  const p = DAFTAR_PERIODE.find((x) => x.value === value);
  const type = p?.type || 'bulanan';
  switch (type) {
    case '1-tahun':
      return {
        label: '1 Tahun (Sep-Agu)',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    case '4-bulanan':
      return {
        label: '4 Bulanan (Caturwulan)',
        badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      };
    case '2-bulanan':
      return {
        label: '2 Bulanan',
        badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      };
    case 'bulanan':
    default:
      return {
        label: 'Bulanan',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
  }
}

export const BASE_DEFAULT_USERS: UserSession[] = [
  {
    id: 'user-admin',
    name: 'Ustadz Ahmad Fauzi',
    email: 'admin@masqami.id',
    pin: '990001',
    whatsapp: '0812-2800-9901',
    role: 'Admin Provinsi',
    wilayah: 'Semua Markaz',
    subWilayah: 'Semua Halaqoh',
  },
  {
    id: 'user-solo',
    name: 'Haji Sulaiman',
    email: 'solo@masqami.id',
    pin: '223344',
    whatsapp: '0813-2911-4422',
    role: 'Petugas Markaz',
    wilayah: 'SOLO',
    subWilayah: 'Serengan',
  },
  {
    id: 'user-hal-mungkid',
    name: 'Ustadz Ridwan (Halaqoh Mungkid)',
    email: 'mungkid@masqami.id',
    pin: '334455',
    whatsapp: '0812-7788-1122',
    role: 'Petugas Halaqoh',
    wilayah: 'MAGELANG',
    subWilayah: 'Mungkid',
  },
  {
    id: 'user-hal-mertoyudan',
    name: 'Akhi Danang (Halaqoh Mertoyudan)',
    email: 'mertoyudan@masqami.id',
    pin: '445566',
    whatsapp: '0813-9988-3344',
    role: 'Petugas Halaqoh',
    wilayah: 'MAGELANG',
    subWilayah: 'Mertoyudan',
  },
  {
    id: 'user-pwt',
    name: 'Mas Irfan Hakim',
    email: 'laporan@masqami.id',
    pin: '556677',
    whatsapp: '0857-4321-8899',
    role: 'Khidmat Laporan',
    wilayah: 'PURWOKERTO',
    subWilayah: 'Kotatif',
  },
];

/**
 * Daftar Akun Pengguna Bawaan (Termasuk Akun untuk 151 Halaqoh).
 * Menghasilkan akun unik untuk seluruh 151 halaqah di 10 wilayah (mengabaikan halaqah yang sudah ada akunnya).
 */
export const DEFAULT_USERS: UserSession[] = [
  ...BASE_DEFAULT_USERS,
  ...generateHalaqahAccounts(BASE_DEFAULT_USERS),
];

// September 2026 - Exact dataset provided by the user
export const RAW_SEPTEMBER_2026: Record<string, Partial<MaqamiRecord>> = {
  MAGELANG: {
    jumlahHalaqah: 32,
    jamaahRangka: 159,
    jamaah3Hari: 38,
    karkunUlama1Tahun: 146,
    karkun4Bulan: 610,
    karkun40Hari: 476,
    jumlahMasjidMushalla: 12927,
    masjid5Amal: 13,
    masjid4Amal: 22,
    masjid3Amal: 96,
    masjid2Amal: 147,
    masjid1Amal: 283,
    masturat2BlnIP: 34,
    masturat40Hari: 9,
    masturat10_15Hari: 113,
    masturat3Hari: 327,
    masturatTaklimRumahHarian: 538,
    masturatTaklimMahallaPekanan: 33,
    pelajarMalamMarkaz: 25,
    pelajarKeluar1Hari: 74,
  },
  PATI: {
    jumlahHalaqah: 2,
    jamaahRangka: 4,
    jamaah3Hari: 1,
    karkunUlama1Tahun: 2,
    karkun4Bulan: 43,
    karkun40Hari: 21,
    jumlahMasjidMushalla: 15393,
    masjid5Amal: 1,
    masjid4Amal: 1,
    masjid3Amal: 2,
    masjid2Amal: 2,
    masjid1Amal: 1,
    masturat2BlnIP: 0,
    masturat40Hari: 1,
    masturat10_15Hari: 5,
    masturat3Hari: 14,
    masturatTaklimRumahHarian: 15,
    masturatTaklimMahallaPekanan: 0,
    pelajarMalamMarkaz: 1,
    pelajarKeluar1Hari: 2,
  },
  PEKALONGAN: {
    jumlahHalaqah: 4,
    jamaahRangka: 7,
    jamaah3Hari: 5,
    karkunUlama1Tahun: 5,
    karkun4Bulan: 48,
    karkun40Hari: 39,
    jumlahMasjidMushalla: 12283,
    masjid5Amal: 1,
    masjid4Amal: 12,
    masjid3Amal: 13,
    masjid2Amal: 11,
    masjid1Amal: 13,
    masturat2BlnIP: 0,
    masturat40Hari: 4,
    masturat10_15Hari: 4,
    masturat3Hari: 26,
    masturatTaklimRumahHarian: 36,
    masturatTaklimMahallaPekanan: 4,
    pelajarMalamMarkaz: 0,
    pelajarKeluar1Hari: 0,
  },
  PURWOKERTO: {
    jumlahHalaqah: 28,
    jamaahRangka: 82,
    jamaah3Hari: 42,
    karkunUlama1Tahun: 22,
    karkun4Bulan: 347,
    karkun40Hari: 298,
    jumlahMasjidMushalla: 24110,
    masjid5Amal: 4,
    masjid4Amal: 35,
    masjid3Amal: 63,
    masjid2Amal: 63,
    masjid1Amal: 91,
    masturat2BlnIP: 9,
    masturat40Hari: 18,
    masturat10_15Hari: 105,
    masturat3Hari: 173,
    masturatTaklimRumahHarian: 291,
    masturatTaklimMahallaPekanan: 29,
    pelajarMalamMarkaz: 6,
    pelajarKeluar1Hari: 3,
  },
  PURWOREJO: {
    jumlahHalaqah: 8,
    jamaahRangka: 60,
    jamaah3Hari: 22,
    karkunUlama1Tahun: 21,
    karkun4Bulan: 253,
    karkun40Hari: 131,
    jumlahMasjidMushalla: 9430,
    masjid5Amal: 5,
    masjid4Amal: 17,
    masjid3Amal: 29,
    masjid2Amal: 34,
    masjid1Amal: 62,
    masturat2BlnIP: 14,
    masturat40Hari: 16,
    masturat10_15Hari: 51,
    masturat3Hari: 73,
    masturatTaklimRumahHarian: 154,
    masturatTaklimMahallaPekanan: 8,
    pelajarMalamMarkaz: 5,
    pelajarKeluar1Hari: 3,
  },
  SEMARANG: {
    jumlahHalaqah: 10,
    jamaahRangka: 15,
    jamaah3Hari: 0,
    karkunUlama1Tahun: 23,
    karkun4Bulan: 74,
    karkun40Hari: 58,
    jumlahMasjidMushalla: 16374,
    masjid5Amal: 0,
    masjid4Amal: 0,
    masjid3Amal: 0,
    masjid2Amal: 0,
    masjid1Amal: 0,
    masturat2BlnIP: 3,
    masturat40Hari: 2,
    masturat10_15Hari: 27,
    masturat3Hari: 44,
    masturatTaklimRumahHarian: 59,
    masturatTaklimMahallaPekanan: 3,
    pelajarMalamMarkaz: 5,
    pelajarKeluar1Hari: 4,
  },
  SOLO: {
    jumlahHalaqah: 31,
    jamaahRangka: 126,
    jamaah3Hari: 63,
    karkunUlama1Tahun: 23,
    karkun4Bulan: 432,
    karkun40Hari: 372,
    jumlahMasjidMushalla: 19100,
    masjid5Amal: 24,
    masjid4Amal: 53,
    masjid3Amal: 69,
    masjid2Amal: 89,
    masjid1Amal: 171,
    masturat2BlnIP: 9,
    masturat40Hari: 24,
    masturat10_15Hari: 108,
    masturat3Hari: 145,
    masturatTaklimRumahHarian: 421,
    masturatTaklimMahallaPekanan: 50,
    pelajarMalamMarkaz: 17,
    pelajarKeluar1Hari: 11,
  },
  SRAGEN: {
    jumlahHalaqah: 13,
    jamaahRangka: 63,
    jamaah3Hari: 30,
    karkunUlama1Tahun: 13,
    karkun4Bulan: 220,
    karkun40Hari: 141,
    jumlahMasjidMushalla: 3002,
    masjid5Amal: 11,
    masjid4Amal: 37,
    masjid3Amal: 50,
    masjid2Amal: 23,
    masjid1Amal: 36,
    masturat2BlnIP: 11,
    masturat40Hari: 10,
    masturat10_15Hari: 67,
    masturat3Hari: 91,
    masturatTaklimRumahHarian: 223,
    masturatTaklimMahallaPekanan: 19,
    pelajarMalamMarkaz: 8,
    pelajarKeluar1Hari: 2,
  },
  TEGAL: {
    jumlahHalaqah: 8,
    jamaahRangka: 18,
    jamaah3Hari: 10,
    karkunUlama1Tahun: 6,
    karkun4Bulan: 106,
    karkun40Hari: 358,
    jumlahMasjidMushalla: 10154,
    masjid5Amal: 2,
    masjid4Amal: 7,
    masjid3Amal: 12,
    masjid2Amal: 15,
    masjid1Amal: 14,
    masturat2BlnIP: 6,
    masturat40Hari: 2,
    masturat10_15Hari: 21,
    masturat3Hari: 43,
    masturatTaklimRumahHarian: 43,
    masturatTaklimMahallaPekanan: 2,
    pelajarMalamMarkaz: 8,
    pelajarKeluar1Hari: 23,
  },
  YOGYAKARTA: {
    jumlahHalaqah: 15,
    jamaahRangka: 35,
    jamaah3Hari: 26,
    karkunUlama1Tahun: 28,
    karkun4Bulan: 85,
    karkun40Hari: 76,
    jumlahMasjidMushalla: 13899,
    masjid5Amal: 5,
    masjid4Amal: 11,
    masjid3Amal: 34,
    masjid2Amal: 19,
    masjid1Amal: 53,
    masturat2BlnIP: 4,
    masturat40Hari: 3,
    masturat10_15Hari: 9,
    masturat3Hari: 25,
    masturatTaklimRumahHarian: 59,
    masturatTaklimMahallaPekanan: 5,
    pelajarMalamMarkaz: 5,
    pelajarKeluar1Hari: 15,
  },
};

export function generateInitialData(): MaqamiRecord[] {
  const records: MaqamiRecord[] = [];

  // September 2026
  WILAYAH_LIST.forEach((wil) => {
    const raw = RAW_SEPTEMBER_2026[wil] || {};
    records.push({
      id: `rec-2026-09-${wil.toLowerCase()}`,
      wilayah: wil,
      periode: '2026-09',
      periodeLabel: 'September 2026',
      jumlahHalaqah: raw.jumlahHalaqah ?? 0,
      jamaahRangka: raw.jamaahRangka ?? 0,
      jamaah3Hari: raw.jamaah3Hari ?? 0,
      karkunUlama1Tahun: raw.karkunUlama1Tahun ?? 0,
      karkun4Bulan: raw.karkun4Bulan ?? 0,
      karkun40Hari: raw.karkun40Hari ?? 0,
      jumlahMasjidMushalla: raw.jumlahMasjidMushalla ?? 0,
      masjid5Amal: raw.masjid5Amal ?? 0,
      masjid4Amal: raw.masjid4Amal ?? 0,
      masjid3Amal: raw.masjid3Amal ?? 0,
      masjid2Amal: raw.masjid2Amal ?? 0,
      masjid1Amal: raw.masjid1Amal ?? 0,
      masturat2BlnIP: raw.masturat2BlnIP ?? 0,
      masturat40Hari: raw.masturat40Hari ?? 0,
      masturat10_15Hari: raw.masturat10_15Hari ?? 0,
      masturat3Hari: raw.masturat3Hari ?? 0,
      masturatTaklimRumahHarian: raw.masturatTaklimRumahHarian ?? 0,
      masturatTaklimMahallaPekanan: raw.masturatTaklimMahallaPekanan ?? 0,
      pelajarMalamMarkaz: raw.pelajarMalamMarkaz ?? 0,
      pelajarKeluar1Hari: raw.pelajarKeluar1Hari ?? 0,
      updatedAt: '2026-09-08 07:30',
      updatedBy: 'Khidmat Markaz',
    });
  });

  // Historical months (Agustus 2026 down to Januari 2026) with realistic previous states for month-over-month bar charts
  const historyConfigs = [
    { periode: '2026-08', label: 'Agustus 2026', factor: 0.94, date: '2026-08-30 18:00' },
    { periode: '2026-07', label: 'Juli 2026', factor: 0.89, date: '2026-07-30 18:00' },
    { periode: '2026-06', label: 'Juni 2026', factor: 0.84, date: '2026-06-30 18:00' },
    { periode: '2026-05', label: 'Mei 2026', factor: 0.80, date: '2026-05-30 18:00' },
    { periode: '2026-04', label: 'April 2026', factor: 0.76, date: '2026-04-30 18:00' },
    { periode: '2026-03', label: 'Maret 2026', factor: 0.72, date: '2026-03-30 18:00' },
    { periode: '2026-02', label: 'Februari 2026', factor: 0.68, date: '2026-02-28 18:00' },
    { periode: '2026-01', label: 'Januari 2026', factor: 0.65, date: '2026-01-30 18:00' },
  ];

  historyConfigs.forEach(({ periode, label, factor, date }) => {
    WILAYAH_LIST.forEach((wil) => {
      const raw = RAW_SEPTEMBER_2026[wil] || {};
      records.push({
        id: `rec-${periode}-${wil.toLowerCase()}`,
        wilayah: wil,
        periode,
        periodeLabel: label,
        jumlahHalaqah: Math.max(1, Math.round((raw.jumlahHalaqah ?? 0) * factor)),
        jamaahRangka: Math.max(0, Math.round((raw.jamaahRangka ?? 0) * factor)),
        jamaah3Hari: Math.max(0, Math.round((raw.jamaah3Hari ?? 0) * factor)),
        karkunUlama1Tahun: Math.max(0, Math.round((raw.karkunUlama1Tahun ?? 0) * factor)),
        karkun4Bulan: Math.max(0, Math.round((raw.karkun4Bulan ?? 0) * factor)),
        karkun40Hari: Math.max(0, Math.round((raw.karkun40Hari ?? 0) * factor)),
        jumlahMasjidMushalla: raw.jumlahMasjidMushalla ?? 0,
        masjid5Amal: Math.max(0, Math.round((raw.masjid5Amal ?? 0) * factor)),
        masjid4Amal: Math.max(0, Math.round((raw.masjid4Amal ?? 0) * factor)),
        masjid3Amal: Math.max(0, Math.round((raw.masjid3Amal ?? 0) * factor)),
        masjid2Amal: Math.max(0, Math.round((raw.masjid2Amal ?? 0) * factor)),
        masjid1Amal: Math.max(0, Math.round((raw.masjid1Amal ?? 0) * factor)),
        masturat2BlnIP: Math.max(0, Math.round((raw.masturat2BlnIP ?? 0) * factor)),
        masturat40Hari: Math.max(0, Math.round((raw.masturat40Hari ?? 0) * factor)),
        masturat10_15Hari: Math.max(0, Math.round((raw.masturat10_15Hari ?? 0) * factor)),
        masturat3Hari: Math.max(0, Math.round((raw.masturat3Hari ?? 0) * factor)),
        masturatTaklimRumahHarian: Math.max(0, Math.round((raw.masturatTaklimRumahHarian ?? 0) * factor)),
        masturatTaklimMahallaPekanan: Math.max(0, Math.round((raw.masturatTaklimMahallaPekanan ?? 0) * factor)),
        pelajarMalamMarkaz: Math.max(0, Math.round((raw.pelajarMalamMarkaz ?? 0) * factor)),
        pelajarKeluar1Hari: Math.max(0, Math.round((raw.pelajarKeluar1Hari ?? 0) * factor)),
        updatedAt: date,
        updatedBy: 'Sistem Sinkronisasi',
      });
    });
  });

  // 2 Bulanan, 4 Bulanan, and 1 Tahun multi-month configurations starting in September
  const multiMonthConfigs = [
    // 1 Tahun (Diawali September)
    {
      periode: '1t-2026-2027',
      label: '1 Tahun: Sep 2026 - Agu 2027 (Berjalan)',
      keluarFactor: 11.8,
      amalFactor: 1.05,
      date: '2026-09-08 10:00',
    },
    {
      periode: '1t-2025-2026',
      label: '1 Tahun: Sep 2025 - Agu 2026 (Tahun Penuh)',
      keluarFactor: 11.2,
      amalFactor: 0.98,
      date: '2026-08-31 20:00',
    },
    {
      periode: '1t-2024-2025',
      label: '1 Tahun: Sep 2024 - Agu 2025',
      keluarFactor: 10.4,
      amalFactor: 0.92,
      date: '2025-08-31 20:00',
    },

    // 4 Bulanan (Caturwulan - Diawali September)
    {
      periode: '4b-2026-sep-des',
      label: '4 Bulanan: Sep - Des 2026 (Caturwulan I)',
      keluarFactor: 4.0,
      amalFactor: 1.02,
      date: '2026-09-08 09:30',
    },
    {
      periode: '4b-2026-mei-agu',
      label: '4 Bulanan: Mei - Agu 2026 (Caturwulan III)',
      keluarFactor: 3.7,
      amalFactor: 0.95,
      date: '2026-08-30 18:00',
    },
    {
      periode: '4b-2026-jan-apr',
      label: '4 Bulanan: Jan - Apr 2026 (Caturwulan II)',
      keluarFactor: 3.4,
      amalFactor: 0.90,
      date: '2026-04-30 18:00',
    },
    {
      periode: '4b-2025-sep-des',
      label: '4 Bulanan: Sep - Des 2025 (Caturwulan I)',
      keluarFactor: 3.2,
      amalFactor: 0.88,
      date: '2025-12-30 18:00',
    },

    // 2 Bulanan (Dua Bulanan - Diawali September)
    {
      periode: '2b-2026-sep-okt',
      label: '2 Bulanan: Sep - Okt 2026 (Siklus 1)',
      keluarFactor: 2.05,
      amalFactor: 1.02,
      date: '2026-09-08 09:00',
    },
    {
      periode: '2b-2026-jul-agu',
      label: '2 Bulanan: Jul - Agu 2026 (Siklus 6)',
      keluarFactor: 1.92,
      amalFactor: 0.96,
      date: '2026-08-30 18:00',
    },
    {
      periode: '2b-2026-mei-jun',
      label: '2 Bulanan: Mei - Jun 2026 (Siklus 5)',
      keluarFactor: 1.82,
      amalFactor: 0.92,
      date: '2026-06-30 18:00',
    },
    {
      periode: '2b-2026-mar-apr',
      label: '2 Bulanan: Mar - Apr 2026 (Siklus 4)',
      keluarFactor: 1.72,
      amalFactor: 0.88,
      date: '2026-04-30 18:00',
    },
    {
      periode: '2b-2026-jan-feb',
      label: '2 Bulanan: Jan - Feb 2026 (Siklus 3)',
      keluarFactor: 1.62,
      amalFactor: 0.84,
      date: '2026-02-28 18:00',
    },
    {
      periode: '2b-2025-nov-des',
      label: '2 Bulanan: Nov - Des 2025 (Siklus 2)',
      keluarFactor: 1.58,
      amalFactor: 0.82,
      date: '2025-12-30 18:00',
    },
    {
      periode: '2b-2025-sep-okt',
      label: '2 Bulanan: Sep - Okt 2025 (Siklus 1)',
      keluarFactor: 1.52,
      amalFactor: 0.80,
      date: '2025-10-30 18:00',
    },
  ];

  multiMonthConfigs.forEach(({ periode, label, keluarFactor, amalFactor, date }) => {
    WILAYAH_LIST.forEach((wil) => {
      const raw = RAW_SEPTEMBER_2026[wil] || {};
      records.push({
        id: `rec-${periode}-${wil.toLowerCase()}`,
        wilayah: wil,
        periode,
        periodeLabel: label,
        jumlahHalaqah: raw.jumlahHalaqah ?? 0,
        jumlahMasjidMushalla: raw.jumlahMasjidMushalla ?? 0,
        // Masjid amal
        masjid5Amal: Math.max(0, Math.round((raw.masjid5Amal ?? 0) * amalFactor)),
        masjid4Amal: Math.max(0, Math.round((raw.masjid4Amal ?? 0) * amalFactor)),
        masjid3Amal: Math.max(0, Math.round((raw.masjid3Amal ?? 0) * amalFactor)),
        masjid2Amal: Math.max(0, Math.round((raw.masjid2Amal ?? 0) * amalFactor)),
        masjid1Amal: Math.max(0, Math.round((raw.masjid1Amal ?? 0) * amalFactor)),
        // Masturat taklim
        masturatTaklimRumahHarian: Math.max(0, Math.round((raw.masturatTaklimRumahHarian ?? 0) * amalFactor)),
        masturatTaklimMahallaPekanan: Math.max(0, Math.round((raw.masturatTaklimMahallaPekanan ?? 0) * amalFactor)),
        // Output / Keluar (cumulative output over the period)
        jamaahRangka: Math.max(0, Math.round((raw.jamaahRangka ?? 0) * keluarFactor)),
        jamaah3Hari: Math.max(0, Math.round((raw.jamaah3Hari ?? 0) * keluarFactor)),
        karkunUlama1Tahun: Math.max(0, Math.round((raw.karkunUlama1Tahun ?? 0) * keluarFactor)),
        karkun4Bulan: Math.max(0, Math.round((raw.karkun4Bulan ?? 0) * keluarFactor)),
        karkun40Hari: Math.max(0, Math.round((raw.karkun40Hari ?? 0) * keluarFactor)),
        masturat2BlnIP: Math.max(0, Math.round((raw.masturat2BlnIP ?? 0) * keluarFactor)),
        masturat40Hari: Math.max(0, Math.round((raw.masturat40Hari ?? 0) * keluarFactor)),
        masturat10_15Hari: Math.max(0, Math.round((raw.masturat10_15Hari ?? 0) * keluarFactor)),
        masturat3Hari: Math.max(0, Math.round((raw.masturat3Hari ?? 0) * keluarFactor)),
        pelajarKeluar1Hari: Math.max(0, Math.round((raw.pelajarKeluar1Hari ?? 0) * keluarFactor)),
        pelajarMalamMarkaz: Math.max(0, Math.round((raw.pelajarMalamMarkaz ?? 0) * (keluarFactor > 2 ? 1.4 : keluarFactor))),
        updatedAt: date,
        updatedBy: 'Sistem Sinkronisasi Multi-Periode',
      });
    });
  });

  return records;
}

/**
 * Get the logical previous period for comparison based on period category.
 * If viewing monthly (e.g. Sep 2026), returns Aug 2026.
 * If viewing 2-bulanan (e.g. Sep-Okt 2026), returns Jul-Agu 2026.
 * If viewing 4-bulanan (e.g. Sep-Des 2026), returns Mei-Agu 2026.
 * If viewing 1-tahun (e.g. 2026-2027), returns 2025-2026.
 */
export function getPreviousPeriode(currentPeriodeValue: string): PeriodeItem | undefined {
  const current = DAFTAR_PERIODE.find((p) => p.value === currentPeriodeValue);
  if (!current) return undefined;

  // First try finding the previous period within the same type (e.g. bulanan -> previous bulanan)
  const sameTypePeriods = DAFTAR_PERIODE.filter((p) => p.type === current.type);
  const currentIndex = sameTypePeriods.findIndex((p) => p.value === currentPeriodeValue);

  if (currentIndex >= 0 && currentIndex < sameTypePeriods.length - 1) {
    return sameTypePeriods[currentIndex + 1];
  }

  // Fallback: search in overall list
  const fullIndex = DAFTAR_PERIODE.findIndex((p) => p.value === currentPeriodeValue);
  if (fullIndex >= 0 && fullIndex < DAFTAR_PERIODE.length - 1) {
    return DAFTAR_PERIODE[fullIndex + 1];
  }

  return undefined;
}
