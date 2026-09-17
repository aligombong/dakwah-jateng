import React, { useState, useMemo } from 'react';
import {
  SUB_WILAYAH_DATA,
  ALL_SUB_WILAYAH_FLAT,
  TOTAL_SUB_WILAYAH_COUNT,
  SubWilayahItem,
} from '../data/subWilayahData';
import { WILAYAH_LIST } from '../data/initialData';
import { UserSession } from '../types';
import { formatNumberIndo } from '../utils/calculations';
import {
  MapPin,
  Search,
  Building2,
  CheckCircle2,
  Copy,
  Printer,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ExternalLink,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface SubWilayahViewProps {
  currentUser?: UserSession;
  onSelectWilayahForTable?: (wilayah: string) => void;
  onOpenDataEntry?: (wilayah: string) => void;
  onOpenHalaqahPage?: (wilayah: string, halaqah: string) => void;
}

export const SubWilayahView: React.FC<SubWilayahViewProps> = ({
  currentUser,
  onSelectWilayahForTable,
  onOpenDataEntry,
  onOpenHalaqahPage,
}) => {
  const [selectedWilayah, setSelectedWilayah] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered flat list
  const filteredItems = useMemo(() => {
    return ALL_SUB_WILAYAH_FLAT.filter((item) => {
      const matchesWilayah =
        selectedWilayah === 'all' || item.wilayah.toUpperCase() === selectedWilayah.toUpperCase();
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.wilayah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.no).includes(searchTerm);
      return matchesWilayah && matchesSearch;
    });
  }, [selectedWilayah, searchTerm]);

  // Grouped by Wilayah
  const groupedData = useMemo(() => {
    const map: Record<string, SubWilayahItem[]> = {};
    filteredItems.forEach((item) => {
      if (!map[item.wilayah]) {
        map[item.wilayah] = [];
      }
      map[item.wilayah].push(item);
    });
    return map;
  }, [filteredItems]);

  const handleCopyText = (name: string, id: string) => {
    navigator.clipboard.writeText(name);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportCSV = () => {
    const headers = ['No', 'No di Markaz', 'Markaz', 'Nama Halaqoh'];
    const rows = filteredItems.map((item, idx) => [
      idx + 1,
      item.no,
      item.wilayah,
      `"${item.name}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_151_Halaqoh_${selectedWilayah}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Layers className="w-80 h-80 text-emerald-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Struktur Kewilayahan & Halaqoh Resmi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Direktori 151 Halaqoh
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Integrasi lengkap 151 Halaqoh dakwah yang terdistribusi di 10 Markaz se-Jawa Tengah & D.I. Yogyakarta untuk koordinasi pelaporan dan monitoring maqami.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {formatNumberIndo(TOTAL_SUB_WILAYAH_COUNT)}
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Total Halaqoh</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
                {formatNumberIndo(WILAYAH_LIST.length)}
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Markaz</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                {formatNumberIndo(filteredItems.length)}
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">Ditampilkan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama halaqoh..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action buttons & View Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kartu Markaz
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabel 151 Baris
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        {/* Region Pills / Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedWilayah('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedWilayah === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Markaz ({formatNumberIndo(TOTAL_SUB_WILAYAH_COUNT)})
          </button>
          {WILAYAH_LIST.map((wil) => {
            const count = SUB_WILAYAH_DATA[wil]?.length || 0;
            const isSelected = selectedWilayah.toUpperCase() === wil.toUpperCase();
            return (
              <button
                key={wil}
                onClick={() => setSelectedWilayah(wil)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{wil}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-emerald-900/50 text-emerald-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Mode: Grouped Cards */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          {Object.keys(groupedData).length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
              Tidak ditemukan halaqoh yang sesuai dengan kata kunci &quot;{searchTerm}&quot;.
            </div>
          ) : (
            (Object.entries(groupedData) as [string, SubWilayahItem[]][]).map(([wil, items]) => {
              const totalInWilayah = SUB_WILAYAH_DATA[wil]?.length || 0;
              return (
                <div
                  key={wil}
                  className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">WILAYAH {wil}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold font-mono">
                            {items.length} {items.length === totalInWilayah ? 'Halaqoh' : `dari ${totalInWilayah} Halaqoh`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Markaz koordinasi kewilayahan Jawa Tengah
                        </p>
                      </div>
                    </div>

                    {/* Quick action for this region */}
                    <div className="flex items-center gap-2">
                      {onSelectWilayahForTable && (
                        <button
                          onClick={() => onSelectWilayahForTable(wil)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                        >
                          <span>Lihat di Tabel Laporan</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onOpenDataEntry && (
                        <button
                          onClick={() => onOpenDataEntry(wil)}
                          className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 shadow-2xs"
                        >
                          Entri Data
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badges / Items Grid */}
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {items.map((sub) => {
                        const isCopied = copiedId === sub.id;
                        const isMyAssigned =
                          currentUser?.role === 'Petugas Halaqoh' &&
                          currentUser.wilayah?.toUpperCase() === sub.wilayah.toUpperCase() &&
                          currentUser.subWilayah?.toLowerCase() === sub.name.toLowerCase();

                        return (
                          <div
                            key={sub.id}
                            className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                              isMyAssigned
                                ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/40'
                                : 'border-slate-100 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-200'
                            }`}
                          >
                            <div
                              onClick={() => onOpenHalaqahPage && onOpenHalaqahPage(sub.wilayah, sub.name)}
                              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                              title={`Buka Lembar Halaqoh ${sub.name}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-md border font-mono text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                                  isMyAssigned
                                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                                    : 'bg-white border-slate-200 text-slate-600 group-hover:border-emerald-300 group-hover:text-emerald-700'
                                }`}
                              >
                                {sub.no}
                              </span>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-950 truncate hover:underline">
                                  {sub.name}
                                </span>
                                {isMyAssigned && (
                                  <span className="text-[9px] px-1 py-0.2 bg-amber-200 text-amber-950 font-bold rounded shrink-0">
                                    ★ Binaan Anda
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {onOpenHalaqahPage && (
                                <button
                                  onClick={() => onOpenHalaqahPage(sub.wilayah, sub.name)}
                                  title={`Buka lembar tabel ${sub.name}`}
                                  className="p-1 text-slate-400 hover:text-emerald-700 rounded hover:bg-emerald-100/60 transition-colors cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleCopyText(sub.name, sub.id)}
                                title="Salin nama sub wilayah"
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-600 rounded transition-opacity cursor-pointer"
                              >
                                {isCopied ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table Mode: Full 151 Rows */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">No</th>
                  <th className="py-3 px-4 w-28">No di Markaz</th>
                  <th className="py-3 px-4">Markaz</th>
                  <th className="py-3 px-4">Nama Halaqoh</th>
                  <th className="py-3 px-4 w-32 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Tidak ditemukan data yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isCopied = copiedId === item.id;
                    const isMyAssigned =
                      currentUser?.role === 'Petugas Halaqoh' &&
                      currentUser.wilayah?.toUpperCase() === item.wilayah.toUpperCase() &&
                      currentUser.subWilayah?.toLowerCase() === item.name.toLowerCase();

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isMyAssigned ? 'bg-amber-50/70 font-medium' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-4 text-center font-mono text-slate-400 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`font-mono font-medium px-2 py-0.5 rounded text-[11px] ${
                              isMyAssigned
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            #{item.no}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{item.wilayah}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            {isMyAssigned && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-950 font-bold rounded">
                                ★ Halaqoh Binaan Anda
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {onOpenHalaqahPage && (
                              <button
                                onClick={() => onOpenHalaqahPage(item.wilayah, item.name)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Buka Halaman Lembar Halaqoh"
                              >
                                <ExternalLink className="w-3 h-3 text-emerald-600" />
                                <span>Buka</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyText(item.name, item.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Tersalin</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Menampilkan {formatNumberIndo(filteredItems.length)} dari {formatNumberIndo(TOTAL_SUB_WILAYAH_COUNT)} Halaqoh
            </span>
            <span className="font-mono text-[11px]">Jawa Tengah & D.I. Yogyakarta</span>
          </div>
        </div>
      )}
    </div>
  );
};
