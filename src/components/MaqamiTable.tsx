import React, { useState } from 'react';
import { MaqamiRecord, HalaqahMaqamiRecord } from '../types';
import { calculateSummary, formatNumberIndo } from '../utils/calculations';
import { SUB_WILAYAH_DATA, TOTAL_SUB_WILAYAH_COUNT } from '../data/subWilayahData';
import {
  Edit2,
  Search,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  MapPin,
  X,
  Building2,
  ExternalLink,
  Layers,
  Sigma,
  Info,
} from 'lucide-react';

interface MaqamiTableProps {
  records: MaqamiRecord[];
  regionList: string[];
  periodeLabel: string;
  halaqahRecords?: HalaqahMaqamiRecord[];
  onEditRegion: (wilayah: string) => void;
  onOpenHalaqahPage?: (wilayah: string, halaqah: string) => void;
}

export const MaqamiTable: React.FC<MaqamiTableProps> = ({
  records,
  regionList,
  periodeLabel,
  halaqahRecords = [],
  onEditRegion,
  onOpenHalaqahPage,
}) => {
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [halaqahModal, setHalaqahModal] = useState<{
    wilayah: string;
    title: string;
    items: string[];
  } | null>(null);

  const recordMap = new Map<string, MaqamiRecord>();
  records.forEach((r) => recordMap.set(r.wilayah, r));

  const summary = calculateSummary(records);

  interface TableRowDef {
    id: string;
    section?: string;
    uraian: string;
    subUraian?: string;
    isHeader?: boolean;
    isTotal?: boolean;
    getValue: (rec: MaqamiRecord) => number;
    totalVal: number;
    description?: string;
  }

  const rows: TableRowDef[] = [
    // 1. JUMLAH HALAQAH
    {
      id: 'halaqah-jml',
      section: 'I. JUMLAH HALAQAH',
      uraian: 'JUMLAH HALAQAH',
      subUraian: 'Jumlah Halaqah',
      isHeader: true,
      getValue: (r) => r.jumlahHalaqah,
      totalVal: summary.jumlahHalaqah,
    },
    {
      id: 'halaqah-rangka',
      uraian: "Jama'ah Rangka",
      getValue: (r) => r.jamaahRangka,
      totalVal: summary.jamaahRangka,
    },
    {
      id: 'halaqah-3hari',
      uraian: "Jama'ah 3 Hari",
      getValue: (r) => r.jamaah3Hari,
      totalVal: summary.jamaah3Hari,
    },

    // 2. KARKUN
    {
      id: 'karkun-ulama',
      section: 'II. KARKUN',
      uraian: 'KARKUN',
      subUraian: "'Ulama 1 Tahun",
      getValue: (r) => r.karkunUlama1Tahun,
      totalVal: summary.karkunUlama1Tahun,
    },
    {
      id: 'karkun-4bln',
      uraian: '4 Bulan',
      getValue: (r) => r.karkun4Bulan,
      totalVal: summary.karkun4Bulan,
    },
    {
      id: 'karkun-40hari',
      uraian: '40 Hari',
      getValue: (r) => r.karkun40Hari,
      totalVal: summary.karkun40Hari,
    },
    {
      id: 'karkun-total',
      uraian: 'TOTAL KARKUN',
      isTotal: true,
      getValue: (r) =>
        (r.karkunUlama1Tahun || 0) + (r.karkun4Bulan || 0) + (r.karkun40Hari || 0),
      totalVal: summary.totalKarkun,
    },

    // 3. MASJID
    {
      id: 'masjid-jml',
      section: 'III. MASJID',
      uraian: 'MASJID',
      subUraian: 'Jumlah Masjid / Mushalla',
      getValue: (r) => r.jumlahMasjidMushalla,
      totalVal: summary.jumlahMasjidMushalla,
    },
    {
      id: 'masjid-5amal',
      uraian: 'Amal Masjid',
      subUraian: '5 Amal',
      getValue: (r) => r.masjid5Amal,
      totalVal: summary.masjid5Amal,
    },
    {
      id: 'masjid-4amal',
      uraian: '',
      subUraian: '4 Amal',
      getValue: (r) => r.masjid4Amal,
      totalVal: summary.masjid4Amal,
    },
    {
      id: 'masjid-3amal',
      uraian: '',
      subUraian: '3 Amal',
      getValue: (r) => r.masjid3Amal,
      totalVal: summary.masjid3Amal,
    },
    {
      id: 'masjid-2amal',
      uraian: '',
      subUraian: '2 Amal',
      getValue: (r) => r.masjid2Amal,
      totalVal: summary.masjid2Amal,
    },
    {
      id: 'masjid-1amal',
      uraian: '',
      subUraian: '1 Amal',
      getValue: (r) => r.masjid1Amal,
      totalVal: summary.masjid1Amal,
    },
    {
      id: 'masjid-total-amal',
      uraian: 'TOTAL MASJID ADA AMAL',
      isTotal: true,
      getValue: (r) =>
        (r.masjid5Amal || 0) +
        (r.masjid4Amal || 0) +
        (r.masjid3Amal || 0) +
        (r.masjid2Amal || 0) +
        (r.masjid1Amal || 0),
      totalVal: summary.totalMasjidAdaAmal,
    },

    // 4. MASTURAT
    {
      id: 'masturat-2bln',
      section: 'IV. MASTURAT',
      uraian: 'MASTURAT',
      subUraian: '2 Bln IP',
      getValue: (r) => r.masturat2BlnIP,
      totalVal: summary.masturat2BlnIP,
    },
    {
      id: 'masturat-40hari',
      uraian: '40 Hari',
      getValue: (r) => r.masturat40Hari,
      totalVal: summary.masturat40Hari,
    },
    {
      id: 'masturat-10_15hari',
      uraian: '10/15 Hari',
      getValue: (r) => r.masturat10_15Hari,
      totalVal: summary.masturat10_15Hari,
    },
    {
      id: 'masturat-3hari',
      uraian: '3 Hari',
      getValue: (r) => r.masturat3Hari,
      totalVal: summary.masturat3Hari,
    },
    {
      id: 'masturat-taklim-rumah',
      uraian: 'Taklim Rumah Harian',
      getValue: (r) => r.masturatTaklimRumahHarian,
      totalVal: summary.masturatTaklimRumahHarian,
    },
    {
      id: 'masturat-taklim-pekanan',
      uraian: 'Taklim Mahalla Pekanan',
      getValue: (r) => r.masturatTaklimMahallaPekanan,
      totalVal: summary.masturatTaklimMahallaPekanan,
    },

    // 5. PELAJAR MAHASISWA
    {
      id: 'pelajar-malam',
      section: 'V. PELAJAR MAHASISWA',
      uraian: 'PELAJAR MAHASISWA',
      subUraian: 'Hadir Malam Markaz (Rata2)',
      getValue: (r) => r.pelajarMalamMarkaz,
      totalVal: summary.pelajarMalamMarkaz,
    },
    {
      id: 'pelajar-keluar1hr',
      uraian: 'Keluar 1 Hari / Bulan (Rata2)',
      getValue: (r) => r.pelajarKeluar1Hari,
      totalVal: summary.pelajarKeluar1Hari,
    },
  ];

  const filteredRows = searchTerm.trim()
    ? rows.filter(
        (r) =>
          r.uraian.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.subUraian && r.subUraian.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (r.section && r.section.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : rows;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Top Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>DATA MAQAMI & POTENSI KERJA DAKWAH JAWA TENGAH</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
            <p className="text-slate-500">
              Periode Laporan: <strong className="text-slate-700">{periodeLabel}</strong> &bull; Total 10 Markaz
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
              <Layers className="w-3 h-3 text-emerald-600" />
              Data markaz diperoleh dari gabungan 151 data halaqoh
            </span>
          </div>
        </div>

        {/* Quick Search in table & Halaqah button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() =>
              setHalaqahModal({
                wilayah: 'ALL',
                title: `151 Halaqoh Dakwah (10 Markaz)`,
                items: Object.entries(SUB_WILAYAH_DATA).flatMap(([w, list]) =>
                  list.map((name, i) => `${w}: #${i + 1} ${name}`)
                ),
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Daftar 151 Halaqoh</span>
          </button>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari uraian data..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold">
              <th className="sticky left-0 z-20 bg-slate-900 px-4 py-3 min-w-[200px] border-r border-slate-800 tracking-wider text-[11px] uppercase">
                URAIAN
              </th>
              {regionList.map((wil, idx) => {
                const count = SUB_WILAYAH_DATA[wil]?.length || 0;
                return (
                  <th
                    key={wil}
                    onMouseEnter={() => setHoveredCol(wil)}
                    onMouseLeave={() => setHoveredCol(null)}
                    className={`px-3 py-2.5 text-right whitespace-nowrap min-w-[110px] border-r border-slate-800 tracking-wider text-[11px] transition-colors ${
                      hoveredCol === wil ? 'bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex flex-col items-end group">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditRegion(wil)}
                          title={`Edit / sesuaikan data ${wil}`}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-700 text-emerald-400 rounded transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <span>
                          {idx + 1}. {wil}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setHalaqahModal({
                            wilayah: wil,
                            title: `Gabungan ${count} Halaqoh Markaz ${wil}`,
                            items: SUB_WILAYAH_DATA[wil] || [],
                          })
                        }
                        className="mt-0.5 text-[10px] font-normal text-emerald-300 hover:text-emerald-200 bg-emerald-950/70 hover:bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-800/60 cursor-pointer flex items-center gap-0.5 transition-colors"
                        title={`Lihat rincian gabungan ${count} halaqoh`}
                      >
                        <Sigma className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{count} Halaqoh</span>
                      </button>
                    </div>
                  </th>
                );
              })}
              <th className="sticky right-0 z-20 bg-emerald-900/90 text-white px-4 py-3 text-right min-w-[125px] font-bold tracking-wider text-[11px] shadow-l">
                JAWA TENGAH
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/80">
            {filteredRows.map((row) => {
              const isSub = Boolean(row.subUraian && row.uraian !== row.subUraian);
              const isHighlighted = row.isTotal;

              return (
                <tr
                  key={row.id}
                  className={`group transition-colors ${
                    row.isTotal
                      ? 'bg-slate-100/80 font-bold text-slate-900'
                      : row.isHeader
                      ? 'bg-slate-50/70 font-semibold text-slate-900'
                      : 'hover:bg-slate-50/70 text-slate-700'
                  }`}
                >
                  {/* URAIAN (Sticky Left) */}
                  <td
                    className={`sticky left-0 z-10 px-4 py-2 border-r border-slate-200 transition-colors ${
                      row.isTotal
                        ? 'bg-slate-100 font-bold text-slate-900'
                        : row.isHeader
                        ? 'bg-slate-50 font-semibold text-slate-900'
                        : 'bg-white group-hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {row.isTotal ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      ) : isSub ? (
                        <span className="text-slate-400 pl-3">&bull;</span>
                      ) : null}

                      <span className={`${isSub ? 'text-slate-600 font-normal' : ''}`}>
                        {row.subUraian
                          ? row.uraian && row.uraian !== row.subUraian
                            ? `${row.uraian} - ${row.subUraian}`
                            : row.subUraian
                          : row.uraian}
                      </span>
                    </div>
                  </td>

                  {/* REGIONAL VALUES */}
                  {regionList.map((wil) => {
                    const rec = recordMap.get(wil);
                    const val = rec ? row.getValue(rec) : 0;
                    const isColHovered = hoveredCol === wil;
                    const isHalaqahRow = row.id === 'halaqah-jml';
                    const halaqahList = SUB_WILAYAH_DATA[wil] || [];

                    return (
                      <td
                        key={wil}
                        onMouseEnter={() => setHoveredCol(wil)}
                        onMouseLeave={() => setHoveredCol(null)}
                        className={`px-3 py-2 text-right border-r border-slate-200/60 font-mono text-xs tabular-nums transition-colors ${
                          isColHovered
                            ? 'bg-emerald-50/60 text-slate-900 font-medium'
                            : row.isTotal
                            ? 'text-slate-900 font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        {isHalaqahRow ? (
                          <button
                            onClick={() =>
                              setHalaqahModal({
                                wilayah: wil,
                                title: `${halaqahList.length} Halaqoh (Markaz ${wil})`,
                                items: halaqahList,
                              })
                            }
                            title={`Klik untuk melihat ${halaqahList.length} halaqoh di ${wil}`}
                            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-950 hover:underline cursor-pointer"
                          >
                            <span>{formatNumberIndo(val)}</span>
                            <span className="text-[9px] font-normal text-emerald-600 bg-emerald-50 px-1 rounded">
                              info
                            </span>
                          </button>
                        ) : val === 0 && !row.isTotal ? (
                          <span className="text-slate-300">-</span>
                        ) : (
                          formatNumberIndo(val)
                        )}
                      </td>
                    );
                  })}

                  {/* TOTAL JAWA TENGAH (Sticky Right) */}
                  <td
                    className={`sticky right-0 z-10 px-4 py-2 text-right font-mono font-bold text-xs tabular-nums border-l border-slate-300 transition-colors ${
                      row.isTotal
                        ? 'bg-emerald-100 text-emerald-900 font-extrabold'
                        : 'bg-slate-50 group-hover:bg-emerald-50/80 text-slate-900'
                    }`}
                  >
                    {row.id === 'halaqah-jml' ? (
                      <button
                        onClick={() =>
                          setHalaqahModal({
                            wilayah: 'ALL',
                            title: `Total 151 Halaqoh (10 Markaz)`,
                            items: Object.entries(SUB_WILAYAH_DATA).flatMap(([w, list]) =>
                              list.map((name, i) => `${w}: #${i + 1} ${name}`)
                            ),
                          })
                        }
                        title="Klik untuk melihat seluruh 151 halaqoh"
                        className="inline-flex items-center gap-1 font-extrabold text-emerald-900 hover:underline cursor-pointer"
                      >
                        <span>{formatNumberIndo(row.totalVal)}</span>
                        <span className="text-[10px] text-emerald-700 font-normal">Halaqoh</span>
                      </button>
                    ) : (
                      formatNumberIndo(row.totalVal)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Instructions */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Arahkan kursor ke judul kolom wilayah untuk edit data, atau klik baris Jumlah Halaqah untuk melihat rincian nama sub wilayah.</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Format angka otomatis disinkronkan dengan 151 master halaqoh bulanan.
        </div>
      </div>

      {/* Modal Dialog for Halaqah Breakdown */}
      {halaqahModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{halaqahModal.title}</h3>
                  <p className="text-[11px] text-slate-300">
                    {halaqahModal.items.length} Halaqoh terdaftar &bull; Data wilayah merupakan akumulasi halaqoh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHalaqahModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {halaqahModal.wilayah !== 'ALL' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">Prinsip Akumulasi Data: </span>
                    Setiap angka di kolom wilayah <strong>{halaqahModal.wilayah}</strong> diperoleh langsung dari gabungan{' '}
                    <strong>{halaqahModal.items.length} halaqoh</strong> berikut. Setiap perubahan pada data halaqoh langsung memperbarui total wilayah ini.
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {halaqahModal.items.map((item, idx) => {
                  // Clean halaqah name in case of prefix like "MAGELANG: #1 Mertoyudan"
                  const cleanName = item.includes(':') ? item.split(':')[1].replace(/#\d+\s*/, '').trim() : item;
                  const itemWilayah = item.includes(':') ? item.split(':')[0].trim() : halaqahModal.wilayah;

                  const halRec = halaqahRecords.find((h) => {
                    if (itemWilayah !== 'ALL') {
                      return (
                        h.wilayah.toUpperCase() === itemWilayah.toUpperCase() &&
                        h.halaqah.toLowerCase() === cleanName.toLowerCase()
                      );
                    }
                    return h.halaqah.toLowerCase() === cleanName.toLowerCase();
                  });

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 truncate">{cleanName}</div>
                          <div className="text-[10px] text-slate-500">
                            Markaz {halRec?.wilayah || itemWilayah}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                        {halRec && (
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                            <span title="Jamaah Rangka">
                              <span className="text-slate-400">Rangka:</span>{' '}
                              <strong className="text-slate-800">{formatNumberIndo(halRec.jamaahRangka)}</strong>
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span title="Karkun 4 Bulan">
                              <span className="text-slate-400">4Bln:</span>{' '}
                              <strong className="text-slate-800">{formatNumberIndo(halRec.karkun4Bulan)}</strong>
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span title="Masjid 5 Amal">
                              <span className="text-slate-400">M5A:</span>{' '}
                              <strong className="text-slate-800">{formatNumberIndo(halRec.masjid5Amal)}</strong>
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span title="Masturat 3 Hari">
                              <span className="text-slate-400">Mast3H:</span>{' '}
                              <strong className="text-slate-800">{formatNumberIndo(halRec.masturat3Hari)}</strong>
                            </span>
                          </div>
                        )}

                        {onOpenHalaqahPage && (
                          <button
                            onClick={() => {
                              const targetWilayah = halRec?.wilayah || itemWilayah;
                              onOpenHalaqahPage(targetWilayah, cleanName);
                              setHalaqahModal(null);
                            }}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
                          >
                            <span>Buka Lembar</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Sigma className="w-4 h-4 text-emerald-600" />
                <span>
                  Total Gabungan: <strong>{halaqahModal.items.length}</strong> Halaqoh binaan
                </span>
              </div>
              <button
                onClick={() => setHalaqahModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
