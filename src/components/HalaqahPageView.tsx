import React, { useState, useMemo } from 'react';
import { HalaqahMaqamiRecord, MaqamiRecord, UserSession, ViewTab } from '../types';
import { formatNumberIndo } from '../utils/calculations';
import {
  SUB_WILAYAH_DATA,
  ALL_SUB_WILAYAH_FLAT,
  getSubWilayahList,
} from '../data/subWilayahData';
import {
  exportHalaqahToPdf,
  exportHalaqahToExcel,
  generateHalaqahWhatsAppText,
} from '../utils/exportHalaqah';
import { HalaqahDataEntryModal } from './HalaqahDataEntryModal';
import {
  MapPin,
  Building2,
  Users,
  Landmark,
  Heart,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Share2,
  Edit2,
  Phone,
  CheckCircle2,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

interface HalaqahPageViewProps {
  halaqahRecords: HalaqahMaqamiRecord[];
  wilayahRecords: MaqamiRecord[];
  selectedWilayah: string;
  selectedHalaqah: string;
  onSelectHalaqah: (wilayah: string, halaqah: string) => void;
  onUpdateHalaqahRecord: (record: HalaqahMaqamiRecord) => void;
  periodeLabel: string;
  users: UserSession[];
  currentUser: UserSession;
  onNavigateToTab: (tab: ViewTab) => void;
  onAssignPetugas?: (subWilayah: string) => void;
}

export const HalaqahPageView: React.FC<HalaqahPageViewProps> = ({
  halaqahRecords,
  wilayahRecords,
  selectedWilayah,
  selectedHalaqah,
  onSelectHalaqah,
  onUpdateHalaqahRecord,
  periodeLabel,
  users,
  currentUser,
  onNavigateToTab,
  onAssignPetugas,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const wilayahList = Object.keys(SUB_WILAYAH_DATA);
  const currentSubList = getSubWilayahList(selectedWilayah);

  // Current halaqoh index in the current region
  const currentIndex = currentSubList.indexOf(selectedHalaqah);
  const halaqahNo = currentIndex >= 0 ? currentIndex + 1 : 1;

  // Find current halaqah record
  const currentRecord = useMemo(() => {
    const found = halaqahRecords.find(
      (r) =>
        r.wilayah.toUpperCase() === selectedWilayah.toUpperCase() &&
        r.halaqah.toLowerCase() === selectedHalaqah.toLowerCase()
    );
    if (found) return found;

    // Fallback default
    return (
      halaqahRecords[0] || {
        id: 'default',
        wilayah: selectedWilayah,
        halaqah: selectedHalaqah,
        periode: '2026-09',
        periodeLabel,
        jumlahHalaqah: 4,
        jamaahRangka: 10,
        jamaah3Hari: 3,
        karkunUlama1Tahun: 5,
        karkun4Bulan: 25,
        karkun40Hari: 20,
        jumlahMasjidMushalla: 400,
        masjid5Amal: 2,
        masjid4Amal: 3,
        masjid3Amal: 8,
        masjid2Amal: 12,
        masjid1Amal: 25,
        masturat2BlnIP: 2,
        masturat40Hari: 1,
        masturat10_15Hari: 8,
        masturat3Hari: 15,
        masturatTaklimRumahHarian: 30,
        masturatTaklimMahallaPekanan: 3,
        pelajarMalamMarkaz: 4,
        pelajarKeluar1Hari: 5,
      }
    );
  }, [halaqahRecords, selectedWilayah, selectedHalaqah, periodeLabel]);

  // Find parent wilayah record for comparison
  const parentWilayahRecord = useMemo(() => {
    return wilayahRecords.find(
      (w) => w.wilayah.toUpperCase() === selectedWilayah.toUpperCase()
    );
  }, [wilayahRecords, selectedWilayah]);

  // Assigned PIC / Petugas
  const assignedPetugas = useMemo(() => {
    return users.find(
      (u) =>
        u.wilayah === selectedWilayah &&
        u.subWilayah &&
        u.subWilayah.toLowerCase() === selectedHalaqah.toLowerCase()
    );
  }, [users, selectedWilayah, selectedHalaqah]);

  // Evaluasi Hak Akses Khusus Tingkat Halaqoh (Sub Wilayah)
  const isPetugasHalaqoh = currentUser.role === 'Petugas Halaqoh';
  const isOwnHalaqah =
    isPetugasHalaqoh &&
    currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase() &&
    currentUser.subWilayah?.toLowerCase() === selectedHalaqah.toLowerCase();

  const isOwnWilayah =
    currentUser.role === 'Petugas Wilayah' &&
    (currentUser.wilayah === 'Semua Wilayah' ||
      currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase());

  const canEditCurrentHalaqah = useMemo(() => {
    if (currentUser.role === 'Admin Markaz') return true;
    if (currentUser.role === 'Petugas Wilayah') {
      return (
        currentUser.wilayah === 'Semua Wilayah' ||
        currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase()
      );
    }
    if (currentUser.role === 'Petugas Halaqoh') {
      const matchWil =
        currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase();
      const matchSub =
        currentUser.subWilayah?.toLowerCase() === selectedHalaqah.toLowerCase();
      return Boolean(matchWil && matchSub);
    }
    // Khidmat Laporan: Read-only
    return false;
  }, [currentUser, selectedWilayah, selectedHalaqah]);

  // Petugas Wilayah & Admin Markaz can manage Petugas Halaqoh
  const canManageHalaqahOfficers = useMemo(() => {
    if (currentUser.role === 'Admin Markaz') return true;
    if (currentUser.role === 'Petugas Wilayah') {
      return (
        currentUser.wilayah === 'Semua Wilayah' ||
        currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase()
      );
    }
    return false;
  }, [currentUser, selectedWilayah]);

  // Handle Prev / Next Halaqoh
  const handlePrevHalaqah = () => {
    if (currentIndex > 0) {
      onSelectHalaqah(selectedWilayah, currentSubList[currentIndex - 1]);
    } else {
      // Loop to last
      onSelectHalaqah(selectedWilayah, currentSubList[currentSubList.length - 1]);
    }
  };

  const handleNextHalaqah = () => {
    if (currentIndex < currentSubList.length - 1) {
      onSelectHalaqah(selectedWilayah, currentSubList[currentIndex + 1]);
    } else {
      // Loop to first
      onSelectHalaqah(selectedWilayah, currentSubList[0]);
    }
  };

  // Search Results for Auto-Suggest
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return ALL_SUB_WILAYAH_FLAT.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.wilayah.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8);
  }, [searchTerm]);

  // Calculations for this halaqoh
  const totalKarkun =
    (currentRecord.karkunUlama1Tahun || 0) +
    (currentRecord.karkun4Bulan || 0) +
    (currentRecord.karkun40Hari || 0);

  const totalMasjidAmal =
    (currentRecord.masjid5Amal || 0) +
    (currentRecord.masjid4Amal || 0) +
    (currentRecord.masjid3Amal || 0) +
    (currentRecord.masjid2Amal || 0) +
    (currentRecord.masjid1Amal || 0);

  const masjidBelumAmal = Math.max(
    0,
    currentRecord.jumlahMasjidMushalla - totalMasjidAmal
  );

  const persenMasjidAmal =
    currentRecord.jumlahMasjidMushalla > 0
      ? ((totalMasjidAmal / currentRecord.jumlahMasjidMushalla) * 100).toFixed(1)
      : '0';

  // Parent Wilayah Stats
  const parentTotalKarkun = parentWilayahRecord
    ? (parentWilayahRecord.karkunUlama1Tahun || 0) +
      (parentWilayahRecord.karkun4Bulan || 0) +
      (parentWilayahRecord.karkun40Hari || 0)
    : 0;

  const parentTotalMasjidAmal = parentWilayahRecord
    ? (parentWilayahRecord.masjid5Amal || 0) +
      (parentWilayahRecord.masjid4Amal || 0) +
      (parentWilayahRecord.masjid3Amal || 0) +
      (parentWilayahRecord.masjid2Amal || 0) +
      (parentWilayahRecord.masjid1Amal || 0)
    : 0;

  const halaqahCountInWil = currentSubList.length || 1;

  // Handle Copy to WhatsApp
  const handleShareWhatsApp = () => {
    const text = generateHalaqahWhatsAppText(currentRecord, periodeLabel);
    navigator.clipboard.writeText(text);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);

    // Open WhatsApp Web/App
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Table Row Definition
  interface HalaqahTableRow {
    no: string;
    section?: string;
    uraian: string;
    subUraian?: string;
    isHeader?: boolean;
    isTotal?: boolean;
    value: number;
    parentTotal: number;
  }

  const tableRows: HalaqahTableRow[] = [
    // I. HALAQAH
    {
      no: 'I',
      section: 'I. JUMLAH MAHALLA & JAMAAH',
      uraian: 'JUMLAH MAHALLA BINAAN',
      subUraian: 'Jumlah Mahalla / Masjid Binaan',
      isHeader: true,
      value: currentRecord.jumlahHalaqah,
      parentTotal: parentWilayahRecord?.jumlahHalaqah || 0,
    },
    {
      no: '1',
      uraian: "Jama'ah Rangka",
      value: currentRecord.jamaahRangka,
      parentTotal: parentWilayahRecord?.jamaahRangka || 0,
    },
    {
      no: '2',
      uraian: "Jama'ah 3 Hari",
      value: currentRecord.jamaah3Hari,
      parentTotal: parentWilayahRecord?.jamaah3Hari || 0,
    },

    // II. KARKUN
    {
      no: 'II',
      section: 'II. KARKUN',
      uraian: 'KARKUN',
      subUraian: "'Ulama 1 Tahun",
      isHeader: true,
      value: currentRecord.karkunUlama1Tahun,
      parentTotal: parentWilayahRecord?.karkunUlama1Tahun || 0,
    },
    {
      no: '3',
      uraian: '4 Bulan',
      value: currentRecord.karkun4Bulan,
      parentTotal: parentWilayahRecord?.karkun4Bulan || 0,
    },
    {
      no: '4',
      uraian: '40 Hari',
      value: currentRecord.karkun40Hari,
      parentTotal: parentWilayahRecord?.karkun40Hari || 0,
    },
    {
      no: '',
      uraian: 'TOTAL KARKUN',
      isTotal: true,
      value: totalKarkun,
      parentTotal: parentTotalKarkun,
    },

    // III. MASJID
    {
      no: 'III',
      section: 'III. MASJID & AMAL MASJID',
      uraian: 'MASJID',
      subUraian: 'Jumlah Masjid / Mushalla',
      isHeader: true,
      value: currentRecord.jumlahMasjidMushalla,
      parentTotal: parentWilayahRecord?.jumlahMasjidMushalla || 0,
    },
    {
      no: '5',
      uraian: 'Amal Masjid',
      subUraian: '5 Amal',
      value: currentRecord.masjid5Amal,
      parentTotal: parentWilayahRecord?.masjid5Amal || 0,
    },
    {
      no: '6',
      uraian: '',
      subUraian: '4 Amal',
      value: currentRecord.masjid4Amal,
      parentTotal: parentWilayahRecord?.masjid4Amal || 0,
    },
    {
      no: '7',
      uraian: '',
      subUraian: '3 Amal',
      value: currentRecord.masjid3Amal,
      parentTotal: parentWilayahRecord?.masjid3Amal || 0,
    },
    {
      no: '8',
      uraian: '',
      subUraian: '2 Amal',
      value: currentRecord.masjid2Amal,
      parentTotal: parentWilayahRecord?.masjid2Amal || 0,
    },
    {
      no: '9',
      uraian: '',
      subUraian: '1 Amal',
      value: currentRecord.masjid1Amal,
      parentTotal: parentWilayahRecord?.masjid1Amal || 0,
    },
    {
      no: '',
      uraian: 'TOTAL MASJID ADA AMAL',
      isTotal: true,
      value: totalMasjidAmal,
      parentTotal: parentTotalMasjidAmal,
    },

    // IV. MASTURAT
    {
      no: 'IV',
      section: 'IV. MASTURAT',
      uraian: 'MASTURAT',
      subUraian: '2 Bulan IP',
      isHeader: true,
      value: currentRecord.masturat2BlnIP,
      parentTotal: parentWilayahRecord?.masturat2BlnIP || 0,
    },
    {
      no: '10',
      uraian: '40 Hari',
      value: currentRecord.masturat40Hari,
      parentTotal: parentWilayahRecord?.masturat40Hari || 0,
    },
    {
      no: '11',
      uraian: '10/15 Hari',
      value: currentRecord.masturat10_15Hari,
      parentTotal: parentWilayahRecord?.masturat10_15Hari || 0,
    },
    {
      no: '12',
      uraian: '3 Hari',
      value: currentRecord.masturat3Hari,
      parentTotal: parentWilayahRecord?.masturat3Hari || 0,
    },
    {
      no: '13',
      uraian: 'Taklim Rumah Harian',
      value: currentRecord.masturatTaklimRumahHarian,
      parentTotal: parentWilayahRecord?.masturatTaklimRumahHarian || 0,
    },
    {
      no: '14',
      uraian: 'Taklim Mahalla Pekanan',
      value: currentRecord.masturatTaklimMahallaPekanan,
      parentTotal: parentWilayahRecord?.masturatTaklimMahallaPekanan || 0,
    },

    // V. PELAJAR MAHASISWA
    {
      no: 'V',
      section: 'V. PELAJAR & MAHASISWA',
      uraian: 'PELAJAR / MAHASISWA',
      subUraian: 'Hadir Malam Markaz',
      isHeader: true,
      value: currentRecord.pelajarMalamMarkaz,
      parentTotal: parentWilayahRecord?.pelajarMalamMarkaz || 0,
    },
    {
      no: '15',
      uraian: 'Keluar 1 Hari / Bulan',
      value: currentRecord.pelajarKeluar1Hari,
      parentTotal: parentWilayahRecord?.pelajarKeluar1Hari || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-semibold">
            Format laporan WhatsApp berhasil disalin & diarahkan ke WhatsApp!
          </span>
        </div>
      )}

      {/* Top Navigation & Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Wilayah & Halaqoh Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Wilayah Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Wilayah:</span>
              <select
                value={selectedWilayah}
                onChange={(e) => {
                  const newWil = e.target.value;
                  const newSubs = getSubWilayahList(newWil);
                  onSelectHalaqah(newWil, newSubs[0] || '');
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {wilayahList.map((wil) => (
                  <option key={wil} value={wil}>
                    {wil} ({getSubWilayahList(wil).length} Halaqoh)
                  </option>
                ))}
              </select>
            </div>

            {/* Halaqoh Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Halaqoh:</span>
              <select
                value={selectedHalaqah}
                onChange={(e) => onSelectHalaqah(selectedWilayah, e.target.value)}
                className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {currentSubList.map((hal, idx) => {
                  const isMyHalaqah =
                    isPetugasHalaqoh &&
                    currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase() &&
                    currentUser.subWilayah?.toLowerCase() === hal.toLowerCase();
                  return (
                    <option key={hal} value={hal}>
                      #{idx + 1} {hal} {isMyHalaqah ? '★ (Binaan Anda)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Prev / Next Halaqoh Buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={handlePrevHalaqah}
                title="Halaqoh Sebelumnya"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-600 px-1">
                {halaqahNo} / {currentSubList.length}
              </span>
              <button
                onClick={handleNextHalaqah}
                title="Halaqoh Selanjutnya"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump to own halaqoh for Petugas Halaqoh */}
            {isPetugasHalaqoh && !isOwnHalaqah && currentUser.subWilayah && (
              <button
                onClick={() =>
                  onSelectHalaqah(currentUser.wilayah || selectedWilayah, currentUser.subWilayah!)
                }
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                title={`Pindah langsung ke Halaqoh ${currentUser.subWilayah}`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Halaqoh Saya ({currentUser.subWilayah})</span>
              </button>
            )}
          </div>

          {/* Quick Jump Search to any of the 151 Halaqoh */}
          <div className="relative min-w-[240px]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Cari dari 151 halaqoh..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Daftar Halaqoh Ditemukan
                </div>
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectHalaqah(item.wilayah, item.name);
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold flex items-center justify-center">
                        {item.no}
                      </span>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {item.wilayah}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Access Control Status Banner */}
      {isOwnHalaqah ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-emerald-950">
                  Akses Entri Aktif: Halaqoh Binaan Anda
                </h4>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded-md">
                  PIC Resmi
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Anda terautentikasi sebagai <strong>{currentUser.name}</strong> ({currentUser.role}). Anda memiliki wewenang penuh untuk mengisi, memperbarui, dan menyimpan lembar capaian halaqoh ini.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="shrink-0 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Entri Data Sekarang</span>
          </button>
        </div>
      ) : isPetugasHalaqoh ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-amber-950">
                  Mode Tinjau (Hanya Lihat) — Pembatasan Hak Akses Sub Wilayah
                </h4>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-md">
                  Read-Only
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Anda login sebagai <strong>{currentUser.name}</strong> (Petugas Halaqoh). Hak akses entri Anda dibatasi untuk <strong>Halaqoh {currentUser.subWilayah}</strong> ({currentUser.wilayah}). Halaman Halaqoh {selectedHalaqah} ini hanya dapat Anda tinjau.
              </p>
            </div>
          </div>
          {currentUser.subWilayah && (
            <button
              onClick={() =>
                onSelectHalaqah(currentUser.wilayah || selectedWilayah, currentUser.subWilayah!)
              }
              className="shrink-0 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Buka Halaqoh Binaan Saya ({currentUser.subWilayah})</span>
            </button>
          )}
        </div>
      ) : currentUser.role === 'Petugas Wilayah' && !isOwnWilayah ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-blue-950">
                  Mode Tinjau Wilayah Lain
                </h4>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-900 text-[10px] font-bold rounded-md">
                  Read-Only
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Anda login sebagai <strong>{currentUser.name}</strong> (Petugas Wilayah {currentUser.wilayah}). Lembar halaqoh di Wilayah {selectedWilayah} ini hanya dapat Anda tinjau.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const subList = getSubWilayahList(currentUser.wilayah);
              onSelectHalaqah(currentUser.wilayah, subList[0] || '');
            }}
            className="shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Kembali ke Wilayah {currentUser.wilayah}</span>
          </button>
        </div>
      ) : currentUser.role === 'Khidmat Laporan' ? (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-purple-900 shadow-xs">
          <Info className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <strong>Akses Khidmat Laporan (Tinjau & Ekspor):</strong> Anda dapat menganalisis data capaian halaqoh serta mengunduh dokumen PDF, Excel, dan pesan WhatsApp. Fitur entri angka dinonaktifkan.
          </div>
        </div>
      ) : null}

      {/* Halaqoh Page Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Halaqoh #{halaqahNo} di Wilayah {selectedWilayah}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>{periodeLabel}</span>
              </span>
              {isOwnHalaqah && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Binaan Anda</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              Halaqoh {selectedHalaqah}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Lembar catatan data maqami dan capaian amal dakwah unit halaqoh{' '}
              <strong className="text-emerald-400 font-bold">{selectedHalaqah}</strong>, berada di bawah pembinaan Markaz{' '}
              <strong className="text-white font-bold">{selectedWilayah}</strong>.
            </p>

            {/* PIC Coordinator Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-xs text-slate-200">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Petugas / PIC:{' '}
                  <strong className="text-white">
                    {assignedPetugas ? assignedPetugas.name : `Petugas Wilayah ${selectedWilayah}`}
                  </strong>
                </span>
                {(assignedPetugas?.email === currentUser.email || isOwnHalaqah) && (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded">
                    Akun Anda
                  </span>
                )}
              </div>
              {assignedPetugas?.whatsapp && (
                <a
                  href={`https://wa.me/${assignedPetugas.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-emerald-300" />
                  <span>WA: {assignedPetugas.whatsapp}</span>
                </a>
              )}

              {canManageHalaqahOfficers && onAssignPetugas && (
                <button
                  onClick={() => onAssignPetugas(selectedHalaqah)}
                  className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title={
                    assignedPetugas
                      ? `Kelola / Edit Penugasan ${assignedPetugas.name}`
                      : `Tugaskan Petugas Halaqoh untuk ${selectedHalaqah}`
                  }
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                  <span>
                    {assignedPetugas ? 'Kelola / Ganti Petugas' : '+ Tugaskan Petugas Halaqoh'}
                  </span>
                </button>
              )}
            </div>

            {/* Aggregation notice */}
            <div className="mt-3.5 inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-200">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Data halaqoh ini otomatis terakumulasi ke dalam total <strong>Wilayah {selectedWilayah}</strong> ({currentSubList.length} halaqoh) dan Markaz Jawa Tengah.
              </span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {canEditCurrentHalaqah ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>{isOwnHalaqah ? 'Entri / Edit Halaqoh Saya' : 'Entri / Edit Data Halaqoh'}</span>
              </button>
            ) : (
              <div className="relative group">
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/90 text-slate-400 border border-slate-700/80 rounded-xl text-xs font-semibold cursor-not-allowed select-none"
                  title={
                    isPetugasHalaqoh
                      ? `Terkunci: Anda bertugas khusus untuk Halaqoh ${currentUser.subWilayah}`
                      : currentUser.role === 'Petugas Wilayah'
                      ? `Terkunci: Anda bertugas khusus untuk Wilayah ${currentUser.wilayah}`
                      : 'Terkunci: Akses Khidmat Laporan bersifat Read-Only'
                  }
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>
                    {isPetugasHalaqoh
                      ? 'Terkunci (Bukan Halaqoh Anda)'
                      : currentUser.role === 'Petugas Wilayah'
                      ? 'Terkunci (Bukan Wilayah Anda)'
                      : 'Terkunci (Mode Tinjau)'}
                  </span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  exportHalaqahToPdf(currentRecord, parentWilayahRecord, periodeLabel)
                }
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-all cursor-pointer"
                title="Ekspor PDF Lembar Halaqoh"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-300" />
                <span>PDF</span>
              </button>

              <button
                onClick={() =>
                  exportHalaqahToExcel(currentRecord, parentWilayahRecord, periodeLabel)
                }
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-all cursor-pointer"
                title="Ekspor Excel Lembar Halaqoh"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                <span>Excel</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl border border-emerald-500/40 transition-all cursor-pointer"
                title="Kirim Laporan ke WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>WA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-700/80">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Total Karkun Halaqoh</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block font-mono">
              {formatNumberIndo(totalKarkun)}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">
              {parentTotalKarkun > 0
                ? `${((totalKarkun / parentTotalKarkun) * 100).toFixed(1)}% dari Wilayah`
                : ''}
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Masjid 5 Amal</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block font-mono">
              {formatNumberIndo(currentRecord.masjid5Amal)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              dari {formatNumberIndo(totalMasjidAmal)} masjid beramal
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Jama'ah Rangka</span>
            <span className="text-xl font-extrabold text-teal-300 mt-0.5 block font-mono">
              {formatNumberIndo(currentRecord.jamaahRangka)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {formatNumberIndo(currentRecord.jumlahHalaqah)} mahalla binaan
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block">Taklim Rumah Masturat</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block font-mono">
              {formatNumberIndo(currentRecord.masturatTaklimRumahHarian)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {formatNumberIndo(currentRecord.masturat3Hari)} jamaah 3 hari
            </span>
          </div>
        </div>
      </div>

      {/* THE IDENTICAL MAQAMI TABLE FOR THIS SPECIFIC HALAQOH */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Toolbar / Title */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Tabel Data Maqami: Halaqoh {selectedHalaqah}
              </h2>
              <p className="text-[11px] text-slate-500">
                Rincian 21 indikator tertib amal dengan perbandingan rata-rata & total Wilayah {selectedWilayah}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('sub-wilayah')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Daftar 151 Halaqoh</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigateToTab('laporan-tabel')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span>Tabel Utama Wilayah</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center border-r border-slate-800">
                  No
                </th>
                <th className="py-3 px-4 min-w-[260px] border-r border-slate-800">
                  Uraian / Indikator Maqami
                </th>
                <th className="py-3 px-4 text-right min-w-[150px] bg-emerald-950 border-r border-emerald-900 text-emerald-300">
                  Capaian Halaqoh ({selectedHalaqah})
                </th>
                <th className="py-3 px-4 text-right min-w-[130px] border-r border-slate-800 text-slate-300">
                  Rata-rata Wilayah
                </th>
                <th className="py-3 px-4 text-right min-w-[130px] border-r border-slate-800 text-slate-300">
                  Total Wilayah ({selectedWilayah})
                </th>
                <th className="py-3 px-4 text-right min-w-[110px] border-r border-slate-800">
                  Kontribusi
                </th>
                <th className="py-3 px-4 min-w-[130px] text-center">
                  Status Evaluasi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((row, idx) => {
                // Section Header Row
                if (row.section && row.no.match(/^[IVXLCDM]+$/)) {
                  const avgVal =
                    halaqahCountInWil > 0
                      ? Math.round(row.parentTotal / halaqahCountInWil)
                      : 0;
                  const pct =
                    row.parentTotal > 0
                      ? ((row.value / row.parentTotal) * 100).toFixed(1)
                      : '0';

                  return (
                    <React.Fragment key={`sec-${row.section}-${idx}`}>
                      <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                        <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-800 bg-slate-200/60 border-r border-slate-200">
                          {row.no}
                        </td>
                        <td
                          className="py-2.5 px-4 font-extrabold text-slate-900 uppercase tracking-wide border-r border-slate-200"
                        >
                          {row.section}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold bg-emerald-50/70 text-emerald-900 border-r border-emerald-200">
                          {formatNumberIndo(row.value)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-600 border-r border-slate-200">
                          {formatNumberIndo(avgVal)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-600 border-r border-slate-200">
                          {formatNumberIndo(row.parentTotal)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700 font-semibold border-r border-slate-200">
                          {pct}%
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            Aktif
                          </span>
                        </td>
                      </tr>
                      {/* Secondary Sub-Header Item if defined */}
                      {row.subUraian && (
                        <tr className="hover:bg-emerald-50/20 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100">
                            1
                          </td>
                          <td className="py-2 px-4 text-slate-700 pl-8 border-r border-slate-100">
                            {row.subUraian}
                          </td>
                          <td className="py-2 px-4 text-right font-mono font-bold bg-emerald-50/40 text-emerald-900 border-r border-emerald-100">
                            {formatNumberIndo(row.value)}
                          </td>
                          <td className="py-2 px-4 text-right font-mono text-slate-500 border-r border-slate-100">
                            {formatNumberIndo(avgVal)}
                          </td>
                          <td className="py-2 px-4 text-right font-mono text-slate-600 border-r border-slate-100">
                            {formatNumberIndo(row.parentTotal)}
                          </td>
                          <td className="py-2 px-4 text-right font-mono text-slate-600 border-r border-slate-100">
                            {pct}%
                          </td>
                          <td className="py-2 px-4 text-center">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {row.value > 0 ? 'Tercatat' : 'Belum Ada'}
                            </span>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                // Total Calculated Rows
                if (row.isTotal) {
                  const avgVal =
                    halaqahCountInWil > 0
                      ? Math.round(row.parentTotal / halaqahCountInWil)
                      : 0;
                  const pct =
                    row.parentTotal > 0
                      ? ((row.value / row.parentTotal) * 100).toFixed(1)
                      : '0';

                  return (
                    <tr
                      key={`total-${row.uraian}-${idx}`}
                      className="bg-emerald-50/70 font-bold text-emerald-950 border-t border-b border-emerald-200"
                    >
                      <td className="py-2.5 px-3 text-center border-r border-emerald-200">
                        &Sigma;
                      </td>
                      <td className="py-2.5 px-4 uppercase tracking-wide font-extrabold text-emerald-950 border-r border-emerald-200">
                        {row.uraian}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-black text-emerald-900 text-sm border-r border-emerald-300">
                        {formatNumberIndo(row.value)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-800 border-r border-emerald-200">
                        {formatNumberIndo(avgVal)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-emerald-900 border-r border-emerald-200">
                        {formatNumberIndo(row.parentTotal)}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-extrabold text-emerald-900 border-r border-emerald-200">
                        {pct}%
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                          Kekuatan Utama
                        </span>
                      </td>
                    </tr>
                  );
                }

                // Standard Data Row
                const avgVal =
                  halaqahCountInWil > 0
                    ? Math.round(row.parentTotal / halaqahCountInWil)
                    : 0;
                const pct =
                  row.parentTotal > 0
                    ? ((row.value / row.parentTotal) * 100).toFixed(1)
                    : '0';

                // Status tag
                const isOptimal = row.value >= avgVal && row.value > 0;
                const isNeedImprovement = row.value === 0 && row.parentTotal > 0;

                return (
                  <tr
                    key={`row-${row.uraian}-${row.subUraian}-${idx}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100">
                      {row.no}
                    </td>
                    <td className="py-2 px-4 text-slate-800 pl-6 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        {row.uraian && (
                          <span className="font-semibold text-slate-700">
                            {row.uraian}
                          </span>
                        )}
                        {row.subUraian && (
                          <span className="text-slate-600">{row.subUraian}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold bg-emerald-50/30 text-emerald-900 border-r border-emerald-100">
                      {formatNumberIndo(row.value)}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-500 border-r border-slate-100">
                      {formatNumberIndo(avgVal)}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-600 border-r border-slate-100">
                      {formatNumberIndo(row.parentTotal)}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-600 border-r border-slate-100">
                      {pct}%
                    </td>
                    <td className="py-2 px-4 text-center">
                      {isOptimal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Optimal</span>
                        </span>
                      ) : isNeedImprovement ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
                          <span>Perlu Peningkatan</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          Berjalan
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>
              Data halaqoh tersinkronisasi otomatis dengan database lokal dan rekapitulasi Wilayah {selectedWilayah}.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Terakhir diperbarui: {currentRecord.updatedAt || 'September 2026'} &bull; Oleh: {currentRecord.updatedBy || 'Petugas'}
          </span>
        </div>
      </div>

      {/* Other Halaqoh in the same Wilayah - Quick Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daftar Halaqoh Lain di Wilayah {selectedWilayah} ({currentSubList.length} Halaqoh)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Klik nama halaqoh untuk membuka halamannya
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentSubList.map((hal, idx) => {
            const isActive = hal.toLowerCase() === selectedHalaqah.toLowerCase();
            const isMyAssignedHalaqah =
              isPetugasHalaqoh &&
              currentUser.wilayah?.toUpperCase() === selectedWilayah.toUpperCase() &&
              currentUser.subWilayah?.toLowerCase() === hal.toLowerCase();

            return (
              <button
                key={hal}
                onClick={() => onSelectHalaqah(selectedWilayah, hal)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isMyAssignedHalaqah
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <span className="text-[10px] opacity-75 font-mono">#{idx + 1}</span>
                <span>{hal}</span>
                {isMyAssignedHalaqah && (
                  <span className="text-[9px] px-1 py-0.2 bg-amber-200 text-amber-950 font-bold rounded">
                    ★ Binaan Anda
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Halaqah Data Entry Modal */}
      {isEditModalOpen && (
        <HalaqahDataEntryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={currentRecord}
          currentUser={currentUser}
          onSave={(updated) => {
            onUpdateHalaqahRecord(updated);
          }}
        />
      )}
    </div>
  );
};
