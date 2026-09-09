import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MaqamiRecord } from '../types';
import { calculateSummary, formatNumberIndo } from './calculations';

export function exportMaqamiToPdf(
  records: MaqamiRecord[],
  periodeLabel: string,
  regionList: string[]
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const recordMap = new Map<string, MaqamiRecord>();
  records.forEach((r) => recordMap.set(r.wilayah, r));

  const totalSummary = calculateSummary(records);

  // Title & Header Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('DATA MAQAMI & POTENSI KERJA DAKWAH JAWA TENGAH', 148, 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Periode: ${periodeLabel} | Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 148, 20, { align: 'center' });

  // Table Columns
  const tableHeaders = ['URAIAN', ...regionList, 'JAWA TENGAH'];

  // Table Body Rows
  const tableRows: (string | { content: string; styles?: Record<string, unknown> })[][] = [];

  const addRow = (
    label: string,
    isSub: boolean,
    isHeader: boolean,
    isTotal: boolean,
    getter: (r: MaqamiRecord) => number,
    totalVal: number
  ) => {
    const formattedLabel = isSub ? `   ${label}` : label;
    const row: (string | { content: string; styles?: Record<string, unknown> })[] = [
      {
        content: formattedLabel,
        styles: {
          fontStyle: isHeader || isTotal ? 'bold' : 'normal',
          fillColor: isHeader ? [241, 245, 249] : isTotal ? [248, 250, 252] : undefined,
          textColor: isTotal ? [15, 23, 42] : [51, 65, 85],
        },
      },
    ];

    regionList.forEach((wil) => {
      const rec = recordMap.get(wil);
      const val = rec ? getter(rec) : 0;
      row.push({
        content: formatNumberIndo(val),
        styles: {
          halign: 'right',
          fontStyle: isTotal || isHeader ? 'bold' : 'normal',
          fillColor: isHeader ? [241, 245, 249] : isTotal ? [248, 250, 252] : undefined,
          textColor: isTotal ? [15, 23, 42] : [71, 85, 105],
        },
      });
    });

    row.push({
      content: formatNumberIndo(totalVal),
      styles: {
        halign: 'right',
        fontStyle: 'bold',
        fillColor: [238, 242, 255], // indigo-50
        textColor: [30, 58, 138], // blue-900
      },
    });

    tableRows.push(row);
  };

  // Section 1: JUMLAH HALAQAH
  addRow('JUMLAH HALAQAH', false, true, false, (r) => r.jumlahHalaqah, totalSummary.jumlahHalaqah);
  addRow("Jama'ah Rangka", true, false, false, (r) => r.jamaahRangka, totalSummary.jamaahRangka);
  addRow("Jama'ah 3 Hari", true, false, false, (r) => r.jamaah3Hari, totalSummary.jamaah3Hari);
  addRow("Jama'ah Jaulah 2", true, false, false, (r) => r.jamaahJaulah2, totalSummary.jamaahJaulah2);

  // Section 2: KARKUN
  addRow('KARKUN', false, true, false, () => 0, 0);
  addRow("'Ulama 1 Tahun", true, false, false, (r) => r.karkunUlama1Tahun, totalSummary.karkunUlama1Tahun);
  addRow('4 Bulan', true, false, false, (r) => r.karkun4Bulan, totalSummary.karkun4Bulan);
  addRow('40 Hari', true, false, false, (r) => r.karkun40Hari, totalSummary.karkun40Hari);
  addRow(
    'TOTAL KARKUN',
    false,
    false,
    true,
    (r) => (r.karkunUlama1Tahun || 0) + (r.karkun4Bulan || 0) + (r.karkun40Hari || 0),
    totalSummary.totalKarkun
  );

  // Section 3: MASJID
  addRow('MASJID', false, true, false, () => 0, 0);
  addRow('Jumlah Masjid / Mushalla', true, false, false, (r) => r.jumlahMasjidMushalla, totalSummary.jumlahMasjidMushalla);
  addRow('5 Amal Masjid', true, false, false, (r) => r.masjid5Amal, totalSummary.masjid5Amal);
  addRow('4 Amal Masjid', true, false, false, (r) => r.masjid4Amal, totalSummary.masjid4Amal);
  addRow('3 Amal Masjid', true, false, false, (r) => r.masjid3Amal, totalSummary.masjid3Amal);
  addRow('2 Amal Masjid', true, false, false, (r) => r.masjid2Amal, totalSummary.masjid2Amal);
  addRow('1 Amal Masjid', true, false, false, (r) => r.masjid1Amal, totalSummary.masjid1Amal);
  addRow(
    'TOTAL MASJID ADA AMAL',
    false,
    false,
    true,
    (r) =>
      (r.masjid5Amal || 0) +
      (r.masjid4Amal || 0) +
      (r.masjid3Amal || 0) +
      (r.masjid2Amal || 0) +
      (r.masjid1Amal || 0),
    totalSummary.totalMasjidAdaAmal
  );

  // Section 4: MASTURAT
  addRow('MASTURAT', false, true, false, () => 0, 0);
  addRow('2 Bln IP', true, false, false, (r) => r.masturat2BlnIP, totalSummary.masturat2BlnIP);
  addRow('40 Hari', true, false, false, (r) => r.masturat40Hari, totalSummary.masturat40Hari);
  addRow('10/15 Hari', true, false, false, (r) => r.masturat10_15Hari, totalSummary.masturat10_15Hari);
  addRow('3 Hari', true, false, false, (r) => r.masturat3Hari, totalSummary.masturat3Hari);
  addRow('Taklim Rumah Harian', true, false, false, (r) => r.masturatTaklimRumahHarian, totalSummary.masturatTaklimRumahHarian);
  addRow('Taklim Mahalla Pekanan', true, false, false, (r) => r.masturatTaklimMahallaPekanan, totalSummary.masturatTaklimMahallaPekanan);

  // Section 5: PELAJAR MAHASISWA
  addRow('PELAJAR MAHASISWA', false, true, false, () => 0, 0);
  addRow('Hadir Malam Markaz (Rata2)', true, false, false, (r) => r.pelajarMalamMarkaz, totalSummary.pelajarMalamMarkaz);
  addRow('Keluar 1 Hari / Bulan (Rata2)', true, false, false, (r) => r.pelajarKeluar1Hari, totalSummary.pelajarKeluar1Hari);

  autoTable(doc, {
    startY: 25,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.8,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 44, halign: 'left' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
      10: { halign: 'right' },
      11: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { top: 25, left: 10, right: 10, bottom: 12 },
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Halaman ${data.pageNumber} dari ${doc.getNumberOfPages()}`;
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(str, 148, 202, { align: 'center' });
    },
  });

  const cleanPeriode = periodeLabel.replace(/\s+/g, '_');
  doc.save(`Laporan_Data_Maqami_${cleanPeriode}.pdf`);
}
