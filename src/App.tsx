import React, { useState, useEffect } from 'react';
import { UserSession, MaqamiRecord, HalaqahMaqamiRecord, ViewTab } from './types';
import { WILAYAH_LIST, DAFTAR_PERIODE, DEFAULT_USERS, BASE_DEFAULT_USERS, generateInitialData } from './data/initialData';
import { calculateSummary } from './utils/calculations';
import { exportMaqamiToExcel } from './utils/exportExcel';
import { exportMaqamiToPdf } from './utils/exportPdf';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { StatSummaryCards } from './components/StatSummaryCards';
import { MaqamiTable } from './components/MaqamiTable';
import { TrendCharts } from './components/TrendCharts';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { DataEntryModal } from './components/DataEntryModal';
import { EditProfileModal } from './components/EditProfileModal';
import { UserManagementView } from './components/UserManagementView';
import { SubWilayahView } from './components/SubWilayahView';
import { HalaqahPageView } from './components/HalaqahPageView';
import {
  loadHalaqahRecordsFromStorage,
  saveHalaqahRecordsToStorage,
  generateInitialHalaqahRecords,
} from './data/halaqahInitialData';
import {
  aggregateAllWilayahFromHalaqah,
  distributeWilayahRecordToHalaqahs,
} from './utils/halaqahAggregation';
import {
  WILAYAH_HALAQAH_COUNTS,
  getSubWilayahList,
  getSubWilayahCount,
  generateHalaqahAccounts,
} from './data/subWilayahData';
import { CheckCircle2, RotateCcw, Landmark, FileSpreadsheet, FileText, ShieldAlert, UserCheck } from 'lucide-react';

const STORAGE_KEY_USER = 'masqami_auth_user_v1';
const STORAGE_KEY_DATA = 'masqami_records_data_v3';
const STORAGE_KEY_USERS_LIST = 'masqami_users_list_v1';

export default function App() {
  // Registered Users State (Admin can add, edit, delete)
  const [users, setUsers] = useState<UserSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS_LIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Buatkan akun untuk 151 halaqah (abaikan jika halaqah sudah memiliki akun di parsed)
          const cleanParsed = parsed.map((u: any) => ({
            ...u,
            role:
              u.role === 'Admin Markaz'
                ? 'Admin Provinsi'
                : u.role === 'Petugas Wilayah'
                ? 'Petugas Markaz'
                : u.role,
            wilayah: u.wilayah === 'Semua Wilayah' ? 'Semua Markaz' : u.wilayah,
          }));
          const newHalaqahAccounts = generateHalaqahAccounts(cleanParsed);

          // Pastikan akun utama (Admin Provinsi, dsb.) tetap ada jika belum terdaftar
          const existingIds = new Set(cleanParsed.map((u: UserSession) => u.id));
          const missingBaseDefaults = BASE_DEFAULT_USERS.filter((du) => !existingIds.has(du.id));

          const merged = [...cleanParsed, ...missingBaseDefaults, ...newHalaqahAccounts];

          // Pastikan setiap akun memiliki nomor WhatsApp dan PIN 6 angka yang valid
          return merged.map((u: UserSession) => {
            const matchedDefault = DEFAULT_USERS.find(
              (du) => du.id === u.id || du.email.toLowerCase() === u.email.toLowerCase()
            );
            return {
              ...u,
              role:
                (u.role as string) === 'Admin Markaz'
                  ? 'Admin Provinsi'
                  : (u.role as string) === 'Petugas Wilayah'
                  ? 'Petugas Markaz'
                  : u.role,
              wilayah: u.wilayah === 'Semua Wilayah' ? 'Semua Markaz' : u.wilayah,
              whatsapp: u.whatsapp || matchedDefault?.whatsapp || '0812-3456-7890',
              pin: u.pin || matchedDefault?.pin || '990001',
            };
          });
        }
      }
    } catch (e) {
      console.error('Error reading users list from localStorage', e);
    }
    return DEFAULT_USERS;
  });

  // Authentication State - Defaults to null so the user is always presented with the Login Page first before the Dashboard
  const [user, setUser] = useState<UserSession | null>(null);

  // Modal State for Edit Profile
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Active Period & Tab
  const [selectedPeriode, setSelectedPeriode] = useState('2026-09');
  const [activeTab, setActiveTab] = useState<ViewTab>('laporan-tabel');

  // Halaqoh Individual Records State (151 Halaqoh master)
  const [halaqahRecords, setHalaqahRecords] = useState<HalaqahMaqamiRecord[]>(() => {
    return loadHalaqahRecordsFromStorage(
      '2026-09',
      'September 2026',
      generateInitialData().filter((r) => r.periode === '2026-09')
    );
  });

  // Data Records State (Wilayah records derived directly from halaqoh aggregation)
  const [records, setRecords] = useState<MaqamiRecord[]>(() => {
    // Purge deprecated period data from localStorage
    try {
      ['2026-10', '2026-11', '2026-12'].forEach((delPer) => {
        localStorage.removeItem(`masqami_halaqah_records_v1_${delPer}`);
      });
      localStorage.removeItem('masqami_records_data_v2');
      localStorage.removeItem('masqami_records_data_v1');
    } catch (_) {}

    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validPeriodSet = new Set(DAFTAR_PERIODE.map((p) => p.value));
          const filtered = parsed.filter((r: MaqamiRecord) => validPeriodSet.has(r.periode));
          const existingPeriods = new Set(filtered.map((r: MaqamiRecord) => r.periode));

          // If all current periods exist, return filtered
          const baseInitial = generateInitialData();
          const missing = baseInitial.filter((r) => !existingPeriods.has(r.periode));
          if (missing.length === 0 && filtered.length === parsed.length) {
            return filtered;
          }

          // Otherwise merge missing periods (such as Jan - Mei 2026) and persist
          const merged = [...filtered, ...missing];
          try {
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
          } catch (_) {}
          return merged;
        }
      }
    } catch (e) {
      console.error('Error reading records from localStorage', e);
    }

    // Default: Aggregate Wilayah records from the 151 halaqoh records for September 2026
    const baseInitial = generateInitialData();
    const initialHalaqahs = loadHalaqahRecordsFromStorage(
      '2026-09',
      'September 2026',
      baseInitial.filter((r) => r.periode === '2026-09')
    );
    const aggregatedSep = aggregateAllWilayahFromHalaqah(
      initialHalaqahs,
      WILAYAH_LIST,
      '2026-09',
      'September 2026',
      baseInitial
    );
    const otherPeriods = baseInitial.filter((r) => r.periode !== '2026-09');
    const merged = [...otherPeriods, ...aggregatedSep];
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
    } catch (e) {
      console.error('Error saving initial records', e);
    }
    return merged;
  });

  // Selected Halaqoh for individual page view
  const [selectedHalaqahWilayah, setSelectedHalaqahWilayah] = useState('MAGELANG');
  const [selectedHalaqahName, setSelectedHalaqahName] = useState(() => {
    const subs = getSubWilayahList('MAGELANG');
    return subs[0] || 'Mertoyudan';
  });

  // Modal State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingWilayah, setEditingWilayah] = useState<string>('MAGELANG');
  const [pendingAssignSubWilayah, setPendingAssignSubWilayah] = useState<string | undefined>(undefined);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users list', e);
    }
  }, [users]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (newUser: UserSession) => {
    setUser(newUser);
    if (newUser.role === 'Petugas Halaqoh') {
      if (newUser.wilayah && newUser.wilayah !== 'Semua Markaz' && newUser.wilayah !== 'Semua Wilayah') {
        setSelectedHalaqahWilayah(newUser.wilayah);
      }
      if (newUser.subWilayah) {
        setSelectedHalaqahName(newUser.subWilayah);
      }
      setActiveTab('lembar-halaqah');
    } else if (
      (newUser.role === 'Petugas Markaz' || (newUser.role as string) === 'Petugas Wilayah') &&
      newUser.wilayah &&
      newUser.wilayah !== 'Semua Markaz' &&
      newUser.wilayah !== 'Semua Wilayah'
    ) {
      setSelectedHalaqahWilayah(newUser.wilayah);
      const subs = getSubWilayahList(newUser.wilayah);
      if (subs.length > 0) {
        setSelectedHalaqahName(subs[0]);
      }
    }
    showToast(`Ahlan wa Sahlan, ${newUser.name} (${newUser.role})`);
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Anda telah keluar dari sesi.');
  };

  // User & Profile Management Handlers
  const handleUpdateProfile = (updatedProfile: UserSession) => {
    setUser(updatedProfile);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedProfile.id ? updatedProfile : u))
    );
    showToast(`Profil ${updatedProfile.name} berhasil diperbarui.`);
  };

  const handleAddUser = (newUser: UserSession) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Pengguna "${newUser.name}" (${newUser.role}) berhasil ditambahkan.`);
  };

  const handleUpdateUser = (updatedUser: UserSession) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
    showToast(`Data pengguna "${updatedUser.name}" berhasil diperbarui.`);
  };

  const handleResetPin = (userId: string, newPin: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, pin: newPin } : u))
    );
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, pin: newPin } : null));
    }
    showToast('Alhamdulillah, PIN berhasil diperbarui. Silakan masuk menggunakan PIN baru Anda.');
  };

  const handleDeleteUser = (userId: string) => {
    if (user && user.id === userId) {
      showToast('Tidak dapat menghapus akun yang sedang aktif digunakan.');
      return;
    }
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`Pengguna "${target?.name || 'terpilih'}" berhasil dihapus.`);
  };

  const handleGenerateAllHalaqahAccounts = () => {
    const newAccounts = generateHalaqahAccounts(users);
    if (newAccounts.length === 0) {
      showToast('Alhamdulillah, seluruh 151 halaqoh telah memiliki akun petugas.');
      return 0;
    }
    setUsers((prev) => [...prev, ...newAccounts]);
    showToast(`Alhamdulillah, berhasil membuat ${newAccounts.length} akun halaqoh baru (halaqoh yang sudah berakun diabaikan).`);
    return newAccounts.length;
  };

  // Filter records for current selected month
  const currentMonthRecords = records.filter((r) => r.periode === selectedPeriode);
  const periodObj = DAFTAR_PERIODE.find((p) => p.value === selectedPeriode);
  const currentPeriodeLabel = periodObj ? periodObj.label : selectedPeriode;
  const currentSummary = calculateSummary(currentMonthRecords);

  const handleOpenDataEntryForRegion = (wil: string) => {
    setEditingWilayah(wil);
    setIsEntryModalOpen(true);
  };

  // Keep halaqah records synced and Wilayah records aggregated when period changes
  useEffect(() => {
    const loaded = loadHalaqahRecordsFromStorage(
      selectedPeriode,
      currentPeriodeLabel,
      records.filter((r) => r.periode === selectedPeriode)
    );
    setHalaqahRecords(loaded);

    // Aggregate Wilayah records from the loaded halaqah records
    const aggregated = aggregateAllWilayahFromHalaqah(
      loaded,
      WILAYAH_LIST,
      selectedPeriode,
      currentPeriodeLabel,
      records
    );
    setRecords((prev) => {
      const otherPeriods = prev.filter((r) => r.periode !== selectedPeriode);
      const merged = [...otherPeriods, ...aggregated];
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
      } catch (e) {
        console.error('Error saving updated period records', e);
      }
      return merged;
    });
  }, [selectedPeriode, currentPeriodeLabel]);

  // Handle updating a single halaqoh record: re-aggregate the Wilayah data automatically!
  const handleUpdateHalaqahRecord = (updated: HalaqahMaqamiRecord) => {
    const nextHalaqahs = halaqahRecords.map((r) => (r.id === updated.id ? updated : r));
    setHalaqahRecords(nextHalaqahs);
    saveHalaqahRecordsToStorage(nextHalaqahs, selectedPeriode);

    // Automatically recalculate Wilayah records by aggregating the halaqohs
    const aggregatedWilayahRecords = aggregateAllWilayahFromHalaqah(
      nextHalaqahs,
      WILAYAH_LIST,
      selectedPeriode,
      currentPeriodeLabel,
      records
    );

    setRecords((prev) => {
      const otherPeriods = prev.filter((r) => r.periode !== selectedPeriode);
      const merged = [...otherPeriods, ...aggregatedWilayahRecords];
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
      } catch (e) {
        console.error('Error saving records', e);
      }
      return merged;
    });

    showToast(`Data halaqoh ${updated.halaqah} disimpan. Data wilayah ${updated.wilayah} otomatis diperbarui dari gabungan data halaqoh.`);
  };

  const handleOpenHalaqahPage = (wil: string, hal?: string) => {
    setSelectedHalaqahWilayah(wil);
    if (hal) {
      setSelectedHalaqahName(hal);
    } else {
      const subs = getSubWilayahList(wil);
      setSelectedHalaqahName(subs[0] || '');
    }
    setActiveTab('lembar-halaqah');
  };

  const handleAssignPetugasHalaqoh = (subWilayah: string) => {
    setPendingAssignSubWilayah(subWilayah);
    setActiveTab('manajemen-user');
  };

  // Handle editing a Wilayah record directly: distribute back to halaqohs to maintain consistency
  const handleSaveRecord = (updatedRecord: MaqamiRecord) => {
    const nextHalaqahs = distributeWilayahRecordToHalaqahs(updatedRecord, halaqahRecords);
    setHalaqahRecords(nextHalaqahs);
    saveHalaqahRecordsToStorage(nextHalaqahs, selectedPeriode);

    const aggregatedWilayahRecords = aggregateAllWilayahFromHalaqah(
      nextHalaqahs,
      WILAYAH_LIST,
      selectedPeriode,
      currentPeriodeLabel,
      records
    );

    setRecords((prev) => {
      const otherPeriods = prev.filter((r) => r.periode !== selectedPeriode);
      const merged = [...otherPeriods, ...aggregatedWilayahRecords];
      try {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
      } catch (e) {
        console.error('Error saving records', e);
      }
      return merged;
    });

    showToast(`Data wilayah ${updatedRecord.wilayah} dan ${getSubWilayahCount(updatedRecord.wilayah)} halaqoh binaan berhasil disinkronkan.`);
  };

  const handleExportExcel = () => {
    exportMaqamiToExcel(currentMonthRecords, currentPeriodeLabel, WILAYAH_LIST);
    showToast(`Laporan Excel untuk ${currentPeriodeLabel} sedang diunduh.`);
  };

  const handleExportPdf = () => {
    exportMaqamiToPdf(currentMonthRecords, currentPeriodeLabel, WILAYAH_LIST);
    showToast(`Laporan PDF untuk ${currentPeriodeLabel} sedang diunduh.`);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data kembali ke data standar Jawa Tengah?')) {
      const freshHalaqahs = generateInitialHalaqahRecords('2026-09', 'September 2026');
      setHalaqahRecords(freshHalaqahs);
      saveHalaqahRecordsToStorage(freshHalaqahs, '2026-09');

      const freshData = generateInitialData();
      const aggregated = aggregateAllWilayahFromHalaqah(
        freshHalaqahs,
        WILAYAH_LIST,
        '2026-09',
        'September 2026',
        freshData
      );
      const otherPeriods = freshData.filter((r) => r.periode !== '2026-09');
      const merged = [...otherPeriods, ...aggregated];
      setRecords(merged);
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(merged));
      showToast('Data berhasil diatur ulang ke data standar Jawa Tengah.');
    }
  };

  // If not logged in, render Login Page
  if (!user) {
    return <LoginPage onLogin={handleLogin} usersList={users} onResetPin={handleResetPin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPeriode={selectedPeriode}
        setSelectedPeriode={setSelectedPeriode}
        onOpenDataEntry={() => {
          setEditingWilayah('MAGELANG');
          setIsEntryModalOpen(true);
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stat Summary Cards - shown on data reports */}
        {activeTab !== 'manajemen-user' && (
          <StatSummaryCards summary={currentSummary} periodeLabel={currentPeriodeLabel} />
        )}

        {/* View Switcher Content */}
        {activeTab === 'laporan-tabel' && (
          <MaqamiTable
            records={currentMonthRecords}
            regionList={WILAYAH_LIST}
            periodeLabel={currentPeriodeLabel}
            onEditRegion={handleOpenDataEntryForRegion}
            onOpenHalaqahPage={handleOpenHalaqahPage}
            halaqahRecords={halaqahRecords}
          />
        )}

        {activeTab === 'lembar-halaqah' && (
          <HalaqahPageView
            halaqahRecords={halaqahRecords}
            wilayahRecords={currentMonthRecords}
            selectedWilayah={selectedHalaqahWilayah}
            selectedHalaqah={selectedHalaqahName}
            onSelectHalaqah={(wil, hal) => {
              setSelectedHalaqahWilayah(wil);
              setSelectedHalaqahName(hal);
            }}
            onUpdateHalaqahRecord={handleUpdateHalaqahRecord}
            periodeLabel={currentPeriodeLabel}
            users={users}
            currentUser={user}
            onNavigateToTab={setActiveTab}
            onAssignPetugas={handleAssignPetugasHalaqoh}
          />
        )}

        {activeTab === 'grafik-tren' && (
          <TrendCharts
            allRecords={records}
            currentRecords={currentMonthRecords}
            periodeLabel={currentPeriodeLabel}
            regionList={WILAYAH_LIST}
          />
        )}

        {activeTab === 'ringkasan' && (
          <ExecutiveSummaryView
            records={currentMonthRecords}
            periodeLabel={currentPeriodeLabel}
            regionList={WILAYAH_LIST}
          />
        )}

        {activeTab === 'sub-wilayah' && (
          <SubWilayahView
            currentUser={user}
            onSelectWilayahForTable={(wil) => {
              setActiveTab('laporan-tabel');
            }}
            onOpenDataEntry={handleOpenDataEntryForRegion}
            onOpenHalaqahPage={handleOpenHalaqahPage}
          />
        )}

        {activeTab === 'manajemen-user' && (
          (user.role === 'Admin Provinsi' || user.role === 'Petugas Markaz' || (user.role as string) === 'Petugas Wilayah') ? (
            <UserManagementView
              users={users}
              currentUser={user}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onGenerateAllHalaqahAccounts={handleGenerateAllHalaqahAccounts}
              initialSubWilayahForAdd={pendingAssignSubWilayah}
              onClearInitialSubWilayah={() => setPendingAssignSubWilayah(undefined)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs max-w-xl mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Akses Terbatas</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Halaman Manajemen Pengguna dikhususkan untuk <strong>Admin Provinsi</strong> dan <strong>Petugas Markaz</strong> untuk mengelola otorisasi dan penugasan Petugas Halaqoh.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs mb-6">
                <div className="font-semibold text-slate-800 mb-1">Status Akun Anda Saat Ini:</div>
                <div className="text-slate-600 flex items-center gap-1.5 mt-1">
                  <span>Nama: <strong>{user.name}</strong></span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 mt-1">
                  <span>Email: <strong>{user.email}</strong></span>
                </div>
                <div className="text-slate-600 flex items-center gap-1.5 mt-1">
                  <span>Peran: <strong className="text-emerald-700">{user.role}</strong> ({user.wilayah || 'Semua Markaz'})</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Edit Profil Saya</span>
              </button>
            </div>
          )
        )}
      </main>

      {/* Modal for Data Entry & Editing */}
      <DataEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSave={handleSaveRecord}
        existingRecords={records}
        initialWilayah={editingWilayah}
        initialPeriode={selectedPeriode}
        onOpenHalaqahPage={handleOpenHalaqahPage}
      />

      {/* Modal for Edit User Profile */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={user}
        onSaveProfile={handleUpdateProfile}
      />

      {/* App Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              M
            </div>
            <span>
              Sistem Data Maqami Dakwah Jawa Tengah &bull; Terintegrasi Rekapitulasi Otomatis
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportExcel}
              className="hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ekspor PDF</span>
            </button>
            <button
              onClick={handleResetData}
              title="Reset data ke nilai default referensi"
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Contoh</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
