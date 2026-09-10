import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HalaqahMaqamiRecord, MaqamiRecord } from '../types';
import { formatNumberIndo } from './calculations';

export function exportHalaqahToExcel(
  record: HalaqahMaqamiRecord,
  wilayahRecord: MaqamiRecord | undefined,
  periodeLabel: string
) {
  const totalKarkun =
    (record.karkunUlama1Tahun || 0) +
    (record.karkun4Bulan || 0) +
    (record.karkun40Hari || 0);

  const totalMasjidAmal =
    (record.masjid5Amal || 0) +
    (record.masjid4Amal || 0) +
    (record.masjid3Amal || 0) +
    (record.masjid2Amal || 0) +
    (record.masjid1Amal || 0);

  const rows: (string | number)[][] = [
    ['LEMBAR LAPORAN DATA MAQAMI HALAQOH'],
    [`Halaqoh: ${record.halaqah}`],
    [`Wilayah Induk: ${record.wilayah}`],
    [`Periode: ${periodeLabel}`],
    [],
    ['NO', 'URAIAN / INDIKATOR MAQAMI', 'CAPAIAN HALAQOH', 'TOTAL WILAYAH', 'KETERANGAN'],
    // I. HALAQAH
    ['I', 'JUMLAH MAHALLA / HALAQAH', '', '', ''],
    ['1', 'Jumlah Mahalla Binaan', record.jumlahHalaqah, wilayahRecord?.jumlahHalaqah || '-', 'Unit Mahalla'],
    ['2', "Jama'ah Rangka", record.jamaahRangka, wilayahRecord?.jamaahRangka || '-', 'Jamaah'],
    ['3', "Jama'ah 3 Hari", record.jamaah3Hari, wilayahRecord?.jamaah3Hari || '-', 'Jamaah'],
    // II. KARKUN
    ['II', 'KARKUN', '', '', ''],
    ['4', "'Ulama 1 Tahun", record.karkunUlama1Tahun, wilayahRecord?.karkunUlama1Tahun || '-', 'Orang'],
    ['5', '4 Bulan', record.karkun4Bulan, wilayahRecord?.karkun4Bulan || '-', 'Orang'],
    ['6', '40 Hari', record.karkun40Hari, wilayahRecord?.karkun40Hari || '-', 'Orang'],
    ['', 'TOTAL KARKUN', totalKarkun, ((wilayahRecord?.karkunUlama1Tahun || 0) + (wilayahRecord?.karkun4Bulan || 0) + (wilayahRecord?.karkun40Hari || 0)), 'Total Orang'],
    // III. MASJID
    ['III', 'MASJID & AMAL', '', '', ''],
    ['7', 'Jumlah Masjid / Mushalla', record.jumlahMasjidMushalla, wilayahRecord?.jumlahMasjidMushalla || '-', 'Masjid/Mushalla'],
    ['8', 'Masjid 5 Amal', record.masjid5Amal, wilayahRecord?.masjid5Amal || '-', 'Masjid'],
    ['9', 'Masjid 4 Amal', record.masjid4Amal, wilayahRecord?.masjid4Amal || '-', 'Masjid'],
    ['10', 'Masjid 3 Amal', record.masjid3Amal, wilayahRecord?.masjid3Amal || '-', 'Masjid'],
    ['11', 'Masjid 2 Amal', record.masjid2Amal, wilayahRecord?.masjid2Amal || '-', 'Masjid'],
    ['12', 'Masjid 1 Amal', record.masjid1Amal, wilayahRecord?.masjid1Amal || '-', 'Masjid'],
    ['', 'TOTAL MASJID ADA AMAL', totalMasjidAmal, ((wilayahRecord?.masjid5Amal || 0) + (wilayahRecord?.masjid4Amal || 0) + (wilayahRecord?.masjid3Amal || 0) + (wilayahRecord?.masjid2Amal || 0) + (wilayahRecord?.masjid1Amal || 0)), 'Masjid'],
    // IV. MASTURAT
    ['IV', 'MASTURAT', '', '', ''],
    ['13', '2 Bln IP', record.masturat2BlnIP, wilayahRecord?.masturat2BlnIP || '-', 'Jamaah'],
    ['14', '40 Hari', record.masturat40Hari, wilayahRecord?.masturat40Hari || '-', 'Jamaah'],
    ['15', '10/15 Hari', record.masturat10_15Hari, wilayahRecord?.masturat10_15Hari || '-', 'Jamaah'],
    ['16', '3 Hari', record.masturat3Hari, wilayahRecord?.masturat3Hari || '-', 'Jamaah'],
    ['17', 'Taklim Rumah Harian', record.masturatTaklimRumahHarian, wilayahRecord?.masturatTaklimRumahHarian || '-', 'Rumah'],
    ['18', 'Taklim Mahalla Pekanan', record.masturatTaklimMahallaPekanan, wilayahRecord?.masturatTaklimMahallaPekanan || '-', 'Mahalla'],
    // V. PELAJAR
    ['V', 'PELAJAR & MAHASISWA', '', '', ''],
    ['19', 'Hadir Malam Markaz', record.pelajarMalamMarkaz, wilayahRecord?.pelajarMalamMarkaz || '-', 'Orang'],
    ['20', 'Keluar 1 Hari / Bulan', record.pelajarKeluar1Hari, wilayahRecord?.pelajarKeluar1Hari || '-', 'Orang'],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 36 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Halaqoh_${record.halaqah.substring(0, 20)}`);
  XLSX.writeFile(wb, `Laporan_Maqami_Halaqoh_${record.wilayah}_${record.halaqah}_${record.periode}.xlsx`);
}

export function exportHalaqahToPdf(
  record: HalaqahMaqamiRecord,
  wilayahRecord: MaqamiRecord | undefined,
  periodeLabel: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalKarkun =
    (record.karkunUlama1Tahun || 0) +
    (record.karkun4Bulan || 0) +
    (record.karkun40Hari || 0);

  const totalMasjidAmal =
    (record.masjid5Amal || 0) +
    (record.masjid4Amal || 0) +
    (record.masjid3Amal || 0) +
    (record.masjid2Amal || 0) +
    (record.masjid1Amal || 0);

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`LEMBAR DATA MAQAMI HALAQOH ${record.halaqah.toUpperCase()}`, 105, 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Wilayah Induk: ${record.wilayah} | Periode: ${periodeLabel}`, 105, 20, { align: 'center' });
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, 25, { align: 'center' });

  const tableRows: (string | { content: string; colSpan?: number; styles?: Record<string, unknown> })[][] = [
    // I. HALAQAH
    [{ content: 'I. JUMLAH MAHALLA / HALAQAH', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }],
    ['Jumlah Mahalla Binaan', formatNumberIndo(record.jumlahHalaqah), wilayahRecord ? formatNumberIndo(wilayahRecord.jumlahHalaqah) : '-'],
    ["Jama'ah Rangka", formatNumberIndo(record.jamaahRangka), wilayahRecord ? formatNumberIndo(wilayahRecord.jamaahRangka) : '-'],
    ["Jama'ah 3 Hari", formatNumberIndo(record.jamaah3Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.jamaah3Hari) : '-'],

    // II. KARKUN
    [{ content: 'II. KARKUN', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }],
    ["'Ulama 1 Tahun", formatNumberIndo(record.karkunUlama1Tahun), wilayahRecord ? formatNumberIndo(wilayahRecord.karkunUlama1Tahun) : '-'],
    ['4 Bulan', formatNumberIndo(record.karkun4Bulan), wilayahRecord ? formatNumberIndo(wilayahRecord.karkun4Bulan) : '-'],
    ['40 Hari', formatNumberIndo(record.karkun40Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.karkun40Hari) : '-'],
    [{ content: 'TOTAL KARKUN', styles: { fontStyle: 'bold' } }, { content: formatNumberIndo(totalKarkun), styles: { fontStyle: 'bold', textColor: [16, 185, 129] } }, { content: wilayahRecord ? formatNumberIndo((wilayahRecord.karkunUlama1Tahun || 0) + (wilayahRecord.karkun4Bulan || 0) + (wilayahRecord.karkun40Hari || 0)) : '-', styles: { fontStyle: 'bold' } }],

    // III. MASJID
    [{ content: 'III. MASJID & AMAL', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }],
    ['Jumlah Masjid / Mushalla', formatNumberIndo(record.jumlahMasjidMushalla), wilayahRecord ? formatNumberIndo(wilayahRecord.jumlahMasjidMushalla) : '-'],
    ['Masjid 5 Amal', formatNumberIndo(record.masjid5Amal), wilayahRecord ? formatNumberIndo(wilayahRecord.masjid5Amal) : '-'],
    ['Masjid 4 Amal', formatNumberIndo(record.masjid4Amal), wilayahRecord ? formatNumberIndo(wilayahRecord.masjid4Amal) : '-'],
    ['Masjid 3 Amal', formatNumberIndo(record.masjid3Amal), wilayahRecord ? formatNumberIndo(wilayahRecord.masjid3Amal) : '-'],
    ['Masjid 2 Amal', formatNumberIndo(record.masjid2Amal), wilayahRecord ? formatNumberIndo(wilayahRecord.masjid2Amal) : '-'],
    ['Masjid 1 Amal', formatNumberIndo(record.masjid1Amal), wilayahRecord ? formatNumberIndo(wilayahRecord.masjid1Amal) : '-'],
    [{ content: 'TOTAL MASJID ADA AMAL', styles: { fontStyle: 'bold' } }, { content: formatNumberIndo(totalMasjidAmal), styles: { fontStyle: 'bold', textColor: [16, 185, 129] } }, { content: wilayahRecord ? formatNumberIndo((wilayahRecord.masjid5Amal || 0) + (wilayahRecord.masjid4Amal || 0) + (wilayahRecord.masjid3Amal || 0) + (wilayahRecord.masjid2Amal || 0) + (wilayahRecord.masjid1Amal || 0)) : '-', styles: { fontStyle: 'bold' } }],

    // IV. MASTURAT
    [{ content: 'IV. MASTURAT', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }],
    ['2 Bulan IP', formatNumberIndo(record.masturat2BlnIP), wilayahRecord ? formatNumberIndo(wilayahRecord.masturat2BlnIP) : '-'],
    ['40 Hari', formatNumberIndo(record.masturat40Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.masturat40Hari) : '-'],
    ['10/15 Hari', formatNumberIndo(record.masturat10_15Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.masturat10_15Hari) : '-'],
    ['3 Hari', formatNumberIndo(record.masturat3Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.masturat3Hari) : '-'],
    ['Taklim Rumah Harian', formatNumberIndo(record.masturatTaklimRumahHarian), wilayahRecord ? formatNumberIndo(wilayahRecord.masturatTaklimRumahHarian) : '-'],
    ['Taklim Mahalla Pekanan', formatNumberIndo(record.masturatTaklimMahallaPekanan), wilayahRecord ? formatNumberIndo(wilayahRecord.masturatTaklimMahallaPekanan) : '-'],

    // V. PELAJAR
    [{ content: 'V. PELAJAR & MAHASISWA', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }],
    ['Hadir Malam Markaz', formatNumberIndo(record.pelajarMalamMarkaz), wilayahRecord ? formatNumberIndo(wilayahRecord.pelajarMalamMarkaz) : '-'],
    ['Keluar 1 Hari / Bulan', formatNumberIndo(record.pelajarKeluar1Hari), wilayahRecord ? formatNumberIndo(wilayahRecord.pelajarKeluar1Hari) : '-'],
  ];

  autoTable(doc, {
    startY: 30,
    head: [['URAIAN MAQAMI', `CAPAIAN HALAQOH (${record.halaqah})`, `TOTAL WILAYAH (${record.wilayah})`]],
    body: tableRows as any,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(`Laporan_Maqami_Halaqoh_${record.wilayah}_${record.halaqah}_${record.periode}.pdf`);
}

export function generateHalaqahWhatsAppText(
  record: HalaqahMaqamiRecord,
  periodeLabel: string
): string {
  const totalKarkun =
    (record.karkunUlama1Tahun || 0) +
    (record.karkun4Bulan || 0) +
    (record.karkun40Hari || 0);

  const totalMasjidAmal =
    (record.masjid5Amal || 0) +
    (record.masjid4Amal || 0) +
    (record.masjid3Amal || 0) +
    (record.masjid2Amal || 0) +
    (record.masjid1Amal || 0);

  return `*LAPORAN DATA MAQAMI DAKWAH*
*Halaqoh:* ${record.halaqah}
*Wilayah:* ${record.wilayah}
*Periode:* ${periodeLabel}

*I. HALAQAH & JAMAAH*
• Mahalla Binaan: ${formatNumberIndo(record.jumlahHalaqah)} unit
• Jamaah Rangka: ${formatNumberIndo(record.jamaahRangka)}
• Jamaah 3 Hari: ${formatNumberIndo(record.jamaah3Hari)}

*II. KARKUN*
• 'Ulama 1 Tahun: ${formatNumberIndo(record.karkunUlama1Tahun)}
• Karkun 4 Bulan: ${formatNumberIndo(record.karkun4Bulan)}
• Karkun 40 Hari: ${formatNumberIndo(record.karkun40Hari)}
• *TOTAL KARKUN: ${formatNumberIndo(totalKarkun)}*

*III. MASJID & AMAL*
• Total Masjid/Mushalla: ${formatNumberIndo(record.jumlahMasjidMushalla)}
• Masjid 5 Amal: ${formatNumberIndo(record.masjid5Amal)}
• Masjid 4 Amal: ${formatNumberIndo(record.masjid4Amal)}
• Masjid 3 Amal: ${formatNumberIndo(record.masjid3Amal)}
• Masjid 2 Amal: ${formatNumberIndo(record.masjid2Amal)}
• Masjid 1 Amal: ${formatNumberIndo(record.masjid1Amal)}
• *TOTAL MASJID ADA AMAL: ${formatNumberIndo(totalMasjidAmal)}*

*IV. MASTURAT*
• 2 Bulan IP: ${formatNumberIndo(record.masturat2BlnIP)}
• 40 Hari: ${formatNumberIndo(record.masturat40Hari)}
• 10/15 Hari: ${formatNumberIndo(record.masturat10_15Hari)}
• 3 Hari: ${formatNumberIndo(record.masturat3Hari)}
• Taklim Rumah Harian: ${formatNumberIndo(record.masturatTaklimRumahHarian)}
• Taklim Mahalla Pekanan: ${formatNumberIndo(record.masturatTaklimMahallaPekanan)}

*V. PELAJAR MAHASISWA*
• Hadir Malam Markaz: ${formatNumberIndo(record.pelajarMalamMarkaz)}
• Keluar 1 Hari: ${formatNumberIndo(record.pelajarKeluar1Hari)}

_Laporan resmi Sistem Maqami & Laporan Dakwah Jawa Tengah_`;
}
