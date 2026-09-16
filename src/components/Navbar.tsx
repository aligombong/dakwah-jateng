import React from 'react';
import { UserSession, ViewTab } from '../types';
import { DAFTAR_PERIODE } from '../data/initialData';
import {
  Landmark,
  TableProperties,
  BarChart3,
  FileSpreadsheet,
  FileText,
  PlusCircle,
  LogOut,
  Printer,
  Calendar,
  Layers,
  MapPin,
  Users,
  UserCheck,
  User,
} from 'lucide-react';

interface NavbarProps {
  user: UserSession;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedPeriode: string;
  setSelectedPeriode: (periode: string) => void;
  onOpenDataEntry: () => void;
  onOpenEditProfile: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  selectedPeriode,
  setSelectedPeriode,
  onOpenDataEntry,
  onOpenEditProfile,
  onExportExcel,
  onExportPdf,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Top Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  Data Maqami Dakwah
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Jawa Tengah
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Sistem Pencatatan & Rekapitulasi Laporan Bulanan Otomatis
              </p>
            </div>
          </div>

          {/* Period selector & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Periode Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {DAFTAR_PERIODE.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Data Button */}
            <button
              id="btn-tambah-data"
              onClick={onOpenDataEntry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Entri Data</span>
            </button>

            {/* Export Dropdown / Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                id="btn-ekspor-excel"
                onClick={onExportExcel}
                title="Ekspor Laporan ke Excel (.xlsx)"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Excel</span>
              </button>

              <button
                id="btn-ekspor-pdf"
                onClick={onExportPdf}
                title="Ekspor Laporan ke PDF (.pdf)"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span className="hidden md:inline">PDF</span>
              </button>

              <button
                id="btn-cetak-laporan"
                onClick={() => window.print()}
                title="Cetak Laporan / Cetak Dokumen"
                className="hidden lg:inline-flex items-center gap-1 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                id="btn-edit-profile"
                onClick={onOpenEditProfile}
                title="Lihat & Edit Profil Saya"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:ring-2 group-hover:ring-emerald-500/40 transition-all">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden xl:block">
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                    <span>{user.name}</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1.5">
                    <span>{user.role}</span>
                    {user.subWilayah && (
                      <span className="text-amber-800 bg-amber-100 px-1 py-0.2 rounded font-semibold text-[9px]">
                        {user.subWilayah}
                      </span>
                    )}
                    {user.whatsapp && (
                      <span className="text-slate-400 font-normal">&bull; WA: {user.whatsapp}</span>
                    )}
                  </div>
                </div>
              </button>

              <button
                id="btn-logout"
                onClick={onLogout}
                title="Keluar dari Akun"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-t border-slate-100 py-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-laporan-tabel"
            onClick={() => setActiveTab('laporan-tabel')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'laporan-tabel'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>Matriks 10 Wilayah</span>
          </button>

          <button
            id="tab-lembar-halaqah"
            onClick={() => setActiveTab('lembar-halaqah')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lembar-halaqah'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lembar Per Halaqoh</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono font-bold">
              151
            </span>
          </button>

          <button
            id="tab-sub-wilayah"
            onClick={() => setActiveTab('sub-wilayah')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sub-wilayah'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Daftar 151 Halaqoh</span>
          </button>

          <button
            id="tab-grafik-tren"
            onClick={() => setActiveTab('grafik-tren')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'grafik-tren'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grafik Tren</span>
          </button>

          <button
            id="tab-ringkasan"
            onClick={() => setActiveTab('ringkasan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ringkasan'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ringkasan Eksekutif</span>
          </button>

          {/* User Management Tab (Accessible for Admin Provinsi and Petugas Wilayah) */}
          <button
            id="tab-manajemen-user"
            onClick={() => setActiveTab('manajemen-user')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'manajemen-user'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {user.role === 'Petugas Wilayah' ? 'Kelola Petugas Halaqoh' : 'Kelola Pengguna'}
            </span>
            {user.role === 'Admin Provinsi' ? (
              <span className="text-[10px] bg-emerald-600/40 text-emerald-100 px-1.5 py-0.2 rounded font-mono font-medium">
                Admin
              </span>
            ) : user.role === 'Petugas Wilayah' ? (
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">
                Halaqoh
              </span>
            ) : (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                Hak Akses
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
