export type PeriodeType = '1-tahun' | '4-bulanan' | '2-bulanan' | 'bulanan';

export interface PeriodeItem {
  value: string;
  label: string;
  type: PeriodeType;
  group: string;
  shortLabel?: string;
  keterangan?: string;
}

export interface MaqamiRecord {
  id: string;
  wilayah: string; // e.g. "MAGELANG", "SOLO", etc.
  periode: string; // e.g. "2026-09" (format YYYY-MM) or "1t-2025-2026", "4b-2026-sep-des", "2b-2026-sep-okt"
  periodeLabel: string; // e.g. "September 2026", "4 Bulanan: Sep - Des 2026 (Caturwulan I)"
  
  // 1. JUMLAH HALAQAH
  jumlahHalaqah: number;
  jamaahRangka: number;
  jamaah3Hari: number;

  // 2. KARKUN
  karkunUlama1Tahun: number;
  karkun4Bulan: number;
  karkun40Hari: number;

  // 3. MASJID
  jumlahMasjidMushalla: number;
  masjid5Amal: number;
  masjid4Amal: number;
  masjid3Amal: number;
  masjid2Amal: number;
  masjid1Amal: number;

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

  // Metadata
  updatedAt?: string;
  updatedBy?: string;
}

export type UserRole = 'Admin Provinsi' | 'Petugas Markaz' | 'Petugas Halaqoh' | 'Khidmat Laporan';

export interface HalaqahMaqamiRecord {
  id: string; // e.g. "hal-2026-09-MAGELANG-Mungkid"
  wilayah: string; // e.g. "MAGELANG"
  halaqah: string; // e.g. "Mungkid"
  periode: string; // e.g. "2026-09"
  periodeLabel: string; // e.g. "September 2026"
  
  // 1. JUMLAH MAHALLA / HALAQAH
  jumlahHalaqah: number; // Jumlah Mahalla / Masjid Binaan
  jamaahRangka: number;
  jamaah3Hari: number;

  // 2. KARKUN
  karkunUlama1Tahun: number;
  karkun4Bulan: number;
  karkun40Hari: number;

  // 3. MASJID & AMAL
  jumlahMasjidMushalla: number;
  masjid5Amal: number;
  masjid4Amal: number;
  masjid3Amal: number;
  masjid2Amal: number;
  masjid1Amal: number;

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

  updatedAt?: string;
  updatedBy?: string;
  catatan?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  pin: string; // 6 digit PIN unik untuk autentikasi cepat
  whatsapp?: string; // Nomor WhatsApp aktif untuk koordinasi dan reset PIN
  role: UserRole;
  wilayah?: string; // If restricted to a specific region, or 'Semua Wilayah'
  subWilayah?: string; // Sub Wilayah / Halaqoh spesifik (opsional)
  password?: string;
  createdAt?: string;
}

export type ViewTab =
  | 'laporan-tabel'
  | 'lembar-halaqah'
  | 'sub-wilayah'
  | 'grafik-tren'
  | 'entri-data'
  | 'ringkasan'
  | 'manajemen-user';
