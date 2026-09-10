import * as XLSX from 'xlsx';
import { MaqamiRecord } from '../types';
import { calculateSummary } from './calculations';

export function exportMaqamiToExcel(
  records: MaqamiRecord[],
  periodeLabel: string,
  regionList: string[]
) {
  // Sort or filter records by region list
  const recordMap = new Map<string, MaqamiRecord>();
  records.forEach((r) => recordMap.set(r.wilayah, r));

  const totalSummary = calculateSummary(records);

  // Build rows array for SheetJS
  const rows: (string | number)[][] = [];

  // Header Title
  rows.push(['DATA MAQAMI & POTENSI KERJA DAKWAH']);
  rows.push([`Periode: ${periodeLabel}`]);
  rows.push([]);

  // Column Headers
  const headerRow: (string | number)[] = ['NO', 'URAIAN', 'SUB-URAIAN'];
  regionList.forEach((wil, idx) => {
    headerRow.push(`${idx + 1}. ${wil}`);
  });
  headerRow.push('TOTAL JAWA TENGAH');
  rows.push(headerRow);

  // Helper to push a row
  const addDataRow = (
    no: string,
    uraian: string,
    subUraian: string,
    getter: (r: MaqamiRecord) => number,
    totalVal: number
  ) => {
    const row: (string | number)[] = [no, uraian, subUraian];
    regionList.forEach((wil) => {
      const rec = recordMap.get(wil);
      row.push(rec ? getter(rec) : 0);
    });
    row.push(totalVal);
    rows.push(row);
  };

  // 1. JUMLAH HALAQAH
  addDataRow('I', 'JUMLAH HALAQAH', 'Jumlah Halaqah', (r) => r.jumlahHalaqah, totalSummary.jumlahHalaqah);
  addDataRow('', '', "Jama'ah Rangka", (r) => r.jamaahRangka, totalSummary.jamaahRangka);
  addDataRow('', '', "Jama'ah 3 Hari", (r) => r.jamaah3Hari, totalSummary.jamaah3Hari);
  rows.push([]);

  // 2. KARKUN
  addDataRow('II', 'KARKUN', "'Ulama 1 Tahun", (r) => r.karkunUlama1Tahun, totalSummary.karkunUlama1Tahun);
  addDataRow('', '', '4 Bulan', (r) => r.karkun4Bulan, totalSummary.karkun4Bulan);
  addDataRow('', '', '40 Hari', (r) => r.karkun40Hari, totalSummary.karkun40Hari);
  addDataRow(
    '',
    'TOTAL KARKUN',
    '',
    (r) => (r.karkunUlama1Tahun || 0) + (r.karkun4Bulan || 0) + (r.karkun40Hari || 0),
    totalSummary.totalKarkun
  );
  rows.push([]);

  // 3. MASJID
  addDataRow('III', 'MASJID', 'Jumlah Masjid / Mushalla', (r) => r.jumlahMasjidMushalla, totalSummary.jumlahMasjidMushalla);
  addDataRow('', 'Amal Masjid', '5 Amal', (r) => r.masjid5Amal, totalSummary.masjid5Amal);
  addDataRow('', '', '4 Amal', (r) => r.masjid4Amal, totalSummary.masjid4Amal);
  addDataRow('', '', '3 Amal', (r) => r.masjid3Amal, totalSummary.masjid3Amal);
  addDataRow('', '', '2 Amal', (r) => r.masjid2Amal, totalSummary.masjid2Amal);
  addDataRow('', '', '1 Amal', (r) => r.masjid1Amal, totalSummary.masjid1Amal);
  addDataRow(
    '',
    'TOTAL MASJID ADA AMAL',
    '',
    (r) =>
      (r.masjid5Amal || 0) +
      (r.masjid4Amal || 0) +
      (r.masjid3Amal || 0) +
      (r.masjid2Amal || 0) +
      (r.masjid1Amal || 0),
    totalSummary.totalMasjidAdaAmal
  );
  rows.push([]);

  // 4. MASTURAT
  addDataRow('IV', 'MASTURAT', '2 Bln IP', (r) => r.masturat2BlnIP, totalSummary.masturat2BlnIP);
  addDataRow('', '', '40 Hari', (r) => r.masturat40Hari, totalSummary.masturat40Hari);
  addDataRow('', '', '10/15 Hari', (r) => r.masturat10_15Hari, totalSummary.masturat10_15Hari);
  addDataRow('', '', '3 Hari', (r) => r.masturat3Hari, totalSummary.masturat3Hari);
  addDataRow('', '', 'Taklim Rumah Harian', (r) => r.masturatTaklimRumahHarian, totalSummary.masturatTaklimRumahHarian);
  addDataRow('', '', 'Taklim Mahalla Pekanan', (r) => r.masturatTaklimMahallaPekanan, totalSummary.masturatTaklimMahallaPekanan);
  rows.push([]);

  // 5. PELAJAR MAHASISWA
  addDataRow('V', 'PELAJAR MAHASISWA', 'Hadir Malam Markaz (Rata2)', (r) => r.pelajarMalamMarkaz, totalSummary.pelajarMalamMarkaz);
  addDataRow('', '', 'Keluar 1 Hari / Bulan (Rata2)', (r) => r.pelajarKeluar1Hari, totalSummary.pelajarKeluar1Hari);

  // Generate Worksheet & Workbook
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Styling column widths
  const colWidths = [{ wch: 5 }, { wch: 26 }, { wch: 24 }];
  regionList.forEach(() => colWidths.push({ wch: 14 }));
  colWidths.push({ wch: 20 });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Maqami');

  // Trigger download
  const cleanPeriode = periodeLabel.replace(/\s+/g, '_');
  XLSX.writeFile(wb, `Laporan_Data_Maqami_${cleanPeriode}.xlsx`);
}
