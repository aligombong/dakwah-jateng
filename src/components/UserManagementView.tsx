import React, { useState, useMemo, useEffect } from 'react';
import { UserSession, UserRole } from '../types';
import { WILAYAH_LIST } from '../data/initialData';
import { getSubWilayahList } from '../data/subWilayahData';
import {
  Users,
  UserPlus,
  Shield,
  MapPin,
  Mail,
  Phone,
  Lock,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Check,
  Layers,
  ChevronRight,
  Copy,
  Sparkles,
  RotateCcw,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface UserManagementViewProps {
  users: UserSession[];
  currentUser: UserSession;
  onAddUser: (user: UserSession) => void;
  onUpdateUser: (user: UserSession) => void;
  onDeleteUser: (userId: string) => void;
  initialSubWilayahForAdd?: string;
  onClearInitialSubWilayah?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  initialSubWilayahForAdd,
  onClearInitialSubWilayah,
}) => {
  const isAdmin = currentUser.role === 'Admin Markaz';
  const isPetugasWilayah = currentUser.role === 'Petugas Wilayah';
  const currentWilayah = currentUser.wilayah || 'MAGELANG';

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'daftar-user' | 'penugasan-halaqah'>('daftar-user');

  // Modal State for Add / Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSession | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    whatsapp: string;
    role: UserRole;
    wilayah: string;
    subWilayah?: string;
    password?: string;
    pin: string;
  }>({
    name: '',
    email: '',
    whatsapp: '',
    role: isPetugasWilayah ? 'Petugas Halaqoh' : 'Petugas Wilayah',
    wilayah: isPetugasWilayah ? currentWilayah : 'MAGELANG',
    subWilayah: '',
    password: '',
    pin: '',
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // PIN visibility state per user & copied state
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  // Reset PIN modal state
  const [userForResetPin, setUserForResetPin] = useState<UserSession | null>(null);
  const [newPinAdminInput, setNewPinAdminInput] = useState('');
  const [resetPinSuccessMsg, setResetPinSuccessMsg] = useState('');
  const [resetPinErrorMsg, setResetPinErrorMsg] = useState('');

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState<UserSession | null>(null);

  // Halaqoh in Wilayah
  const halaqahListInWilayah = useMemo(() => {
    return isPetugasWilayah ? getSubWilayahList(currentWilayah) : [];
  }, [isPetugasWilayah, currentWilayah]);

  // Petugas Halaqoh in this Wilayah
  const officersInWilayah = useMemo(() => {
    return users.filter(
      (u) =>
        u.role === 'Petugas Halaqoh' &&
        u.wilayah?.toUpperCase() === currentWilayah.toUpperCase()
    );
  }, [users, currentWilayah]);

  // Map of subWilayah -> assigned officer
  const halaqahOfficerMap = useMemo(() => {
    const map = new Map<string, UserSession>();
    officersInWilayah.forEach((u) => {
      if (u.subWilayah) {
        map.set(u.subWilayah.toLowerCase(), u);
      }
    });
    return map;
  }, [officersInWilayah]);

  // Scoped Users based on authority:
  // Admin Markaz: all users
  // Petugas Wilayah: users belonging to their assigned wilayah + themselves
  const scopedUsers = useMemo(() => {
    if (isAdmin) return users;
    if (isPetugasWilayah) {
      return users.filter(
        (u) =>
          (u.wilayah && u.wilayah.toUpperCase() === currentWilayah.toUpperCase()) ||
          u.id === currentUser.id
      );
    }
    return users.filter((u) => u.id === currentUser.id);
  }, [users, isAdmin, isPetugasWilayah, currentWilayah, currentUser.id]);

  // Filtered Users
  const filteredUsers = scopedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.whatsapp && u.whatsapp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.wilayah && u.wilayah.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.subWilayah && u.subWilayah.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Role Counts for Admin
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'Admin Markaz').length;
  const petugasCount = users.filter((u) => u.role === 'Petugas Wilayah').length;
  const petugasHalaqahCount = users.filter((u) => u.role === 'Petugas Halaqoh').length;
  const laporanCount = users.filter((u) => u.role === 'Khidmat Laporan').length;

  // Stats for Petugas Wilayah
  const totalHalaqah = halaqahListInWilayah.length;
  const assignedHalaqahCount = halaqahOfficerMap.size;
  const unassignedHalaqahCount = Math.max(0, totalHalaqah - assignedHalaqahCount);

  // Permission checkers
  const canEditUser = (targetUser: UserSession) => {
    if (isAdmin) return true;
    if (isPetugasWilayah) {
      if (targetUser.id === currentUser.id) return true;
      return (
        targetUser.role === 'Petugas Halaqoh' &&
        targetUser.wilayah?.toUpperCase() === currentWilayah.toUpperCase()
      );
    }
    return false;
  };

  const canDeleteUser = (targetUser: UserSession) => {
    if (isAdmin) return targetUser.id !== currentUser.id;
    if (isPetugasWilayah) {
      return (
        targetUser.id !== currentUser.id &&
        targetUser.role === 'Petugas Halaqoh' &&
        targetUser.wilayah?.toUpperCase() === currentWilayah.toUpperCase()
      );
    }
    return false;
  };

  const generateUniquePin = (existingList: UserSession[], excludeUserId?: string) => {
    let pin = '';
    let attempts = 0;
    do {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
    } while (
      attempts < 1000 &&
      existingList.some((u) => u.pin === pin && u.id !== excludeUserId)
    );
    return pin;
  };

  const handleOpenAddModal = (defaultSubWilayah?: string) => {
    setEditingUser(null);
    const targetWil = isPetugasWilayah ? currentWilayah : 'MAGELANG';
    const subList = getSubWilayahList(targetWil);
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      role: isPetugasWilayah ? 'Petugas Halaqoh' : 'Petugas Wilayah',
      wilayah: targetWil,
      subWilayah: defaultSubWilayah || (isPetugasWilayah ? subList[0] || '' : ''),
      password: 'bismillah123',
      pin: generateUniquePin(users),
    });
    setFormError('');
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  // Open modal if initialSubWilayahForAdd is passed from Halaqoh view
  useEffect(() => {
    if (initialSubWilayahForAdd) {
      handleOpenAddModal(initialSubWilayahForAdd);
      onClearInitialSubWilayah?.();
    }
  }, [initialSubWilayahForAdd]);

  const handleOpenEditModal = (user: UserSession) => {
    if (!canEditUser(user)) return;
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp || '',
      role: user.role,
      wilayah: user.wilayah || (isPetugasWilayah ? currentWilayah : 'Semua Wilayah'),
      subWilayah: user.subWilayah || '',
      password: user.password || '',
      pin: user.pin || generateUniquePin(users, user.id),
    });
    setFormError('');
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  const handleOpenResetPinModal = (targetUser: UserSession) => {
    setUserForResetPin(targetUser);
    setNewPinAdminInput(generateUniquePin(users, targetUser.id));
    setResetPinSuccessMsg('');
    setResetPinErrorMsg('');
  };

  const handleSaveAdminResetPin = () => {
    if (!userForResetPin) return;
    const cleanPin = newPinAdminInput.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setResetPinErrorMsg('PIN baru harus berupa 6 digit angka.');
      return;
    }
    const isTaken = users.some((u) => u.pin === cleanPin && u.id !== userForResetPin.id);
    if (isTaken) {
      setResetPinErrorMsg('PIN 6 angka ini sudah dipakai petugas lain.');
      return;
    }

    const updatedUser = { ...userForResetPin, pin: cleanPin };
    onUpdateUser(updatedUser);
    setResetPinSuccessMsg(`Alhamdulillah, PIN ${userForResetPin.name} berhasil diubah menjadi ${cleanPin}`);
    setTimeout(() => {
      setUserForResetPin(null);
    }, 1800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Format alamat email tidak valid.');
      return;
    }

    if (!formData.pin || !/^\d{6}$/.test(formData.pin.trim())) {
      setFormError('PIN wajib diisi dengan 6 digit angka.');
      return;
    }

    const pinTaken = users.some(
      (u) => u.pin === formData.pin.trim() && u.id !== editingUser?.id
    );
    if (pinTaken) {
      setFormError('PIN 6 angka ini sudah digunakan pengguna lain. Harap buat PIN unik.');
      return;
    }

    // Role enforcement for Petugas Wilayah
    if (isPetugasWilayah && (!editingUser || editingUser.id !== currentUser.id)) {
      if (formData.role !== 'Petugas Halaqoh') {
        setFormError('Sebagai Petugas Wilayah, Anda hanya berwenang mengelola peran Petugas Halaqoh.');
        return;
      }
      if (formData.wilayah.toUpperCase() !== currentWilayah.toUpperCase()) {
        setFormError(`Kewenangan Anda terbatas pada Wilayah ${currentWilayah}.`);
        return;
      }
    }

    // Validate Petugas Halaqoh requirements
    if (formData.role === 'Petugas Halaqoh') {
      if (!formData.wilayah || formData.wilayah === 'Semua Wilayah') {
        setFormError('Peran Petugas Halaqoh wajib memilih salah satu Wilayah tugas spesifik.');
        return;
      }
      if (!formData.subWilayah || !formData.subWilayah.trim()) {
        setFormError('Peran Petugas Halaqoh wajib memilih Sub Wilayah / Halaqoh yang dibina.');
        return;
      }
    }

    // Check duplicate email (excluding currently edited user)
    const emailExists = users.some(
      (u) =>
        u.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        u.id !== editingUser?.id
    );
    if (emailExists) {
      setFormError('Alamat email ini sudah terdaftar untuk pengguna lain.');
      return;
    }

    if (editingUser) {
      // Update
      const updated: UserSession = {
        ...editingUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim() || undefined,
        role: formData.role,
        wilayah: formData.wilayah,
        subWilayah: formData.subWilayah?.trim() || undefined,
        password: formData.password?.trim() || editingUser.password || 'bismillah123',
        pin: formData.pin.trim(),
      };
      onUpdateUser(updated);
    } else {
      // Add
      const newUser: UserSession = {
        id: `user-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim() || undefined,
        role: formData.role,
        wilayah: formData.wilayah,
        subWilayah: formData.subWilayah?.trim() || undefined,
        password: formData.password?.trim() || 'bismillah123',
        pin: formData.pin.trim(),
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      onAddUser(newUser);
    }

    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      setUserToDelete(null);
      return;
    }
    if (!canDeleteUser(userToDelete)) {
      alert('Anda tidak memiliki hak akses untuk menghapus akun ini.');
      setUserToDelete(null);
      return;
    }
    onDeleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1.5 border border-emerald-200">
            <Shield className="w-3.5 h-3.5" />
            <span>
              {isPetugasWilayah
                ? `Kewenangan Wilayah Markaz ${currentWilayah}`
                : 'Otorisasi Hak Akses Markaz'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isPetugasWilayah
              ? `Manajemen Petugas Halaqoh Wilayah ${currentWilayah}`
              : 'Manajemen Pengguna & Hak Akses'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isPetugasWilayah
              ? `Kelola penugasan, tambahkan akun baru, dan perbarui data kontak Petugas Halaqoh di bawah pembinaan Markaz ${currentWilayah}.`
              : 'Kelola data akun pengguna, peran akses (Admin, Petugas, Khidmat), dan penugasan wilayah.'}
          </p>
        </div>

        <button
          id="btn-tambah-user"
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>
            {isPetugasWilayah
              ? `+ Tambah Petugas Halaqoh ${currentWilayah}`
              : 'Tambah Pengguna Baru'}
          </span>
        </button>
      </div>

      {/* Metric Cards */}
      {isPetugasWilayah ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Wilayah Binaan</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-blue-900 mt-2">{currentWilayah}</div>
            <div className="text-[11px] text-blue-600/80 mt-0.5">Kewenangan Anda</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Halaqoh</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{totalHalaqah}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sub wilayah terdaftar</div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Petugas Ditugaskan</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">
              {assignedHalaqahCount}
            </div>
            <div className="text-[11px] text-emerald-600/80 mt-0.5">Halaqoh ada PIC resmi</div>
          </div>

          <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Belum Ada PIC</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2">
              {unassignedHalaqahCount}
            </div>
            <div className="text-[11px] text-amber-600/80 mt-0.5">Perlu penugasan petugas</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Pengguna</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{totalUsers}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Akun terdaftar</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Admin Markaz</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{adminCount}</div>
            <div className="text-[11px] text-emerald-600/80 mt-0.5">Akses penuh sistem</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Petugas Wilayah</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{petugasCount}</div>
            <div className="text-[11px] text-blue-600/80 mt-0.5">Entri data wilayah</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Petugas Halaqoh</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2">{petugasHalaqahCount}</div>
            <div className="text-[11px] text-amber-600/80 mt-0.5">Entri data sub wilayah</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Khidmat Laporan</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2">{laporanCount}</div>
            <div className="text-[11px] text-purple-600/80 mt-0.5">Lihat & ekspor data</div>
          </div>
        </div>
      )}

      {/* Sub Tabs for Petugas Wilayah */}
      {isPetugasWilayah && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveSubTab('daftar-user')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'daftar-user'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Akun Petugas ({filteredUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('penugasan-halaqah')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'penugasan-halaqah'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              Matriks Penugasan {totalHalaqah} Halaqoh ({assignedHalaqahCount}/{totalHalaqah} Terisi)
            </span>
          </button>
        </div>
      )}

      {/* Content: View Mode Penugasan Halaqah (Khusus Petugas Wilayah) */}
      {isPetugasWilayah && activeSubTab === 'penugasan-halaqah' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                Daftar & Status Penugasan Seluruh Halaqoh Wilayah {currentWilayah}
              </h3>
              <p className="text-[11px] text-slate-500">
                Pastikan setiap halaqoh memiliki penanggung jawab (PIC) aktif agar entri data maqami bulanan berjalan tertib.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Petugas Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">No</th>
                  <th className="py-3 px-4">Nama Sub Wilayah / Halaqoh</th>
                  <th className="py-3 px-4">Status Penugasan</th>
                  <th className="py-3 px-4">Petugas / PIC Resmi</th>
                  <th className="py-3 px-4">Kontak WhatsApp</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {halaqahListInWilayah.map((halaqahName, idx) => {
                  const assignedOfficer = halaqahOfficerMap.get(halaqahName.toLowerCase());
                  const isAssigned = !!assignedOfficer;

                  return (
                    <tr
                      key={halaqahName}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isAssigned ? '' : 'bg-amber-50/30'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 text-xs">
                          {halaqahName}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Wilayah {currentWilayah}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isAssigned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Ada Petugas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-semibold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Belum Ada PIC</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {assignedOfficer ? (
                          <div>
                            <div className="font-semibold text-slate-800">
                              {assignedOfficer.name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{assignedOfficer.email}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            - Dibina langsung oleh Petugas Wilayah -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {assignedOfficer?.whatsapp ? (
                          <a
                            href={`https://wa.me/${assignedOfficer.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-medium border border-emerald-200"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{assignedOfficer.whatsapp}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {assignedOfficer ? (
                          <button
                            onClick={() => handleOpenEditModal(assignedOfficer)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit Petugas</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAddModal(halaqahName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3 text-emerald-700" />
                            <span>+ Tugaskan PIC</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isPetugasWilayah
                    ? `Cari nama petugas halaqoh di ${currentWilayah}...`
                    : 'Cari nama, email, atau wilayah...'
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {isAdmin ? (
                  <>
                    <option value="all">Semua Peran ({users.length})</option>
                    <option value="Admin Markaz">Admin Markaz ({adminCount})</option>
                    <option value="Petugas Wilayah">Petugas Wilayah ({petugasCount})</option>
                    <option value="Petugas Halaqoh">Petugas Halaqoh ({petugasHalaqahCount})</option>
                    <option value="Khidmat Laporan">Khidmat Laporan ({laporanCount})</option>
                  </>
                ) : (
                  <>
                    <option value="all">Semua Akun di {currentWilayah} ({scopedUsers.length})</option>
                    <option value="Petugas Halaqoh">
                      Khusus Petugas Halaqoh ({officersInWilayah.length})
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">PIN 6 Angka</th>
                <th className="py-3.5 px-4">Peran (Hak Akses)</th>
                <th className="py-3.5 px-4">Wilayah Tugas</th>
                <th className="py-3.5 px-4">Status & Dibuat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const cleanWa = user.whatsapp
                    ? user.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')
                    : '';
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.5 rounded">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* WhatsApp Column */}
                      <td className="py-3.5 px-4">
                        {user.whatsapp ? (
                          <a
                            href={`https://wa.me/${cleanWa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Kirim pesan WhatsApp ke ${user.name}`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 text-[11px] font-medium transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{user.whatsapp}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">- Belum diisi -</span>
                        )}
                      </td>

                      {/* PIN 6 Angka Column */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                          <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                            {revealedPins[user.id] ? user.pin || '------' : '••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedPins((prev) => ({
                                ...prev,
                                [user.id]: !prev[user.id],
                              }))
                            }
                            className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
                            title={revealedPins[user.id] ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                          >
                            {revealedPins[user.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                          {user.pin && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(user.pin);
                                setCopiedPinId(user.id);
                                setTimeout(() => setCopiedPinId(null), 1500);
                              }}
                              className="text-slate-400 hover:text-emerald-600 p-0.5 rounded cursor-pointer transition-colors"
                              title="Salin PIN"
                            >
                              {copiedPinId === user.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {user.role === 'Admin Markaz' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                            <Shield className="w-3 h-3" />
                            <span>Admin Markaz</span>
                          </span>
                        )}
                        {user.role === 'Petugas Wilayah' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
                            <MapPin className="w-3 h-3" />
                            <span>Petugas Wilayah</span>
                          </span>
                        )}
                        {user.role === 'Petugas Halaqoh' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300 font-semibold text-[11px]">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>Petugas Halaqoh</span>
                          </span>
                        )}
                        {user.role === 'Khidmat Laporan' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">
                            <UserCheck className="w-3 h-3" />
                            <span>Khidmat Laporan</span>
                          </span>
                        )}
                      </td>

                      {/* Region */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            {user.wilayah || 'Semua Wilayah'}
                          </span>
                          {user.subWilayah && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                              <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Halaqoh: {user.subWilayah}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created date / status */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {user.createdAt || 'Akun Bawaan'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {canEditUser(user) && (
                            <button
                              onClick={() => handleOpenResetPinModal(user)}
                              title={`Reset PIN 6 Angka ${user.name}`}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canEditUser(user) ? (
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              title={
                                isCurrent
                                  ? 'Edit Profil Saya'
                                  : `Edit Data ${user.name}`
                              }
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span
                              title="Akun di luar wewenang Anda"
                              className="p-1.5 text-slate-300 cursor-not-allowed"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}

                          {canDeleteUser(user) && (
                            <button
                              onClick={() => setUserToDelete(user)}
                              title="Hapus Akun Pengguna"
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriks & Panduan Hak Akses 4 Tingkat */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Matriks Tingkat Hak Akses & Kewenangan Pengguna
            </h3>
            <p className="text-[11px] text-slate-500">
              Struktur perizinan data maqami dakwah dari tingkat Markaz, Wilayah, hingga Sub Wilayah (Halaqoh)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Admin Markaz */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h4 className="font-bold text-emerald-950">1. Admin Markaz</h4>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                Tingkat tertinggi pengelola sistem maqami provinsi.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">&check;</span>
                  <span>Akses seluruh 10 Wilayah & 151 Halaqoh</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">&check;</span>
                  <span>Kelola akun, peran, & wilayah petugas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">&check;</span>
                  <span>Entri & revisi data maqami seluruh level</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[10px] font-semibold text-emerald-800">
              Cakupan: Seluruh Jawa Tengah & DIY
            </div>
          </div>

          {/* Petugas Wilayah */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h4 className="font-bold text-blue-950">2. Petugas Wilayah</h4>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                Penanggung jawab data maqami pada tingkat kabupaten/kota.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Entri data agregat wilayah binaan</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Kelola & update seluruh halaqoh di wilayahnya</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">&bull;</span>
                  <span>Melihat rekapitulasi perbandingan wilayah lain</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200/60 text-[10px] font-semibold text-blue-800">
              Cakupan: 1 Wilayah & Halaqoh di dalamnya
            </div>
          </div>

          {/* Petugas Halaqoh (Sub Wilayah) */}
          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/50 flex flex-col justify-between shadow-xs ring-1 ring-amber-400/20">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                  <h4 className="font-bold text-amber-950">3. Petugas Halaqoh</h4>
                </div>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-200 text-amber-900 rounded">
                  Sub Wilayah
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                Akses spesifik untuk koordinator halaqoh di lapangan.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">&check;</span>
                  <span>Entri & update data 1 halaqoh binaan sendiri</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">&check;</span>
                  <span>Cetak lembar & ekspor PDF/Excel halaqoh</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">&bull;</span>
                  <span>Halaqoh lain & data agregat bersifat read-only</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 text-[10px] font-semibold text-amber-900">
              Cakupan: 1 Sub Wilayah (Halaqoh) Binaan
            </div>
          </div>

          {/* Khidmat Laporan */}
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <h4 className="font-bold text-purple-950">4. Khidmat Laporan</h4>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                Akses evaluasi dokumen, monitoring, dan analisis tren.
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">&check;</span>
                  <span>Melihat matriks data & grafik tren visual</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">&check;</span>
                  <span>Ekspor seluruh dokumen PDF dan Excel</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">&bull;</span>
                  <span>Read-only (tidak dapat mengubah angka data)</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 pt-2 border-t border-purple-200/60 text-[10px] font-semibold text-purple-800">
              Cakupan: Seluruh Laporan (Mode Tinjau)
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Add / Edit User Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
                  {editingUser ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {editingUser
                      ? `Edit Data ${editingUser.name}`
                      : isPetugasWilayah
                      ? `Tambah Petugas Halaqoh ${currentWilayah}`
                      : 'Tambah Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {editingUser
                      ? 'Perbarui nama, email, peran, atau penugasan wilayah'
                      : isPetugasWilayah
                      ? `Buat akun login untuk penanggung jawab halaqoh di ${currentWilayah}`
                      : 'Buat akun pengguna baru dan tentukan hak aksesnya'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pengguna <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ustadz Ahmad Fauzi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Username Login) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@masqami.id"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Nomor kontak WhatsApp untuk koordinasi maqami
                </p>
              </div>

              {/* Peran / Hak Akses */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peran & Hak Akses <span className="text-rose-500">*</span>
                </label>
                {isPetugasWilayah && (!editingUser || editingUser.id !== currentUser.id) ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                        <span className="font-bold text-xs text-amber-950">Petugas Halaqoh</span>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded">
                        Sub Wilayah
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Kewenangan Anda sebagai Petugas Wilayah adalah mengelola Petugas Halaqoh binaan.
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      let newWil = formData.wilayah;
                      let newSub = formData.subWilayah;
                      if (newRole === 'Petugas Halaqoh') {
                        if (!newWil || newWil === 'Semua Wilayah') {
                          newWil = isPetugasWilayah ? currentWilayah : 'MAGELANG';
                          newSub = getSubWilayahList(newWil)[0] || '';
                        } else if (!newSub) {
                          newSub = getSubWilayahList(newWil)[0] || '';
                        }
                      }
                      setFormData({
                        ...formData,
                        role: newRole,
                        wilayah: newWil,
                        subWilayah: newSub,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Admin Markaz">
                      Admin Markaz (Akses Penuh Kelola Data & Pengguna)
                    </option>
                    <option value="Petugas Wilayah">
                      Petugas Wilayah (Entri & Update Data Wilayah)
                    </option>
                    <option value="Petugas Halaqoh">
                      Petugas Halaqoh (Entri & Update Data Sub Wilayah / Halaqoh Binaan)
                    </option>
                    <option value="Khidmat Laporan">
                      Khidmat Laporan (Melihat Rekapitulasi & Ekspor Laporan)
                    </option>
                  </select>
                )}

                {formData.role === 'Petugas Halaqoh' && !isPetugasWilayah && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Tingkat Hak Akses Sub Wilayah (Halaqoh):</strong> Pengguna dengan peran ini berfokus menginput, memperbarui, dan mengevaluasi data lembar maqami khusus 1 halaqoh yang dibinanya.
                    </div>
                  </div>
                )}
              </div>

              {/* Wilayah Tugas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wilayah Tugas / Binaan <span className="text-rose-500">*</span>
                </label>
                {isPetugasWilayah && (!editingUser || editingUser.id !== currentUser.id) ? (
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-950">Wilayah {currentWilayah}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded">
                      Wilayah Anda
                    </span>
                  </div>
                ) : (
                  <select
                    value={formData.wilayah}
                    onChange={(e) => {
                      const newWil = e.target.value;
                      const subList = getSubWilayahList(newWil);
                      const stillValid = formData.subWilayah && subList.includes(formData.subWilayah);
                      const newSub = stillValid
                        ? formData.subWilayah
                        : formData.role === 'Petugas Halaqoh'
                        ? subList[0] || ''
                        : '';
                      setFormData({
                        ...formData,
                        wilayah: newWil,
                        subWilayah: newSub,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {formData.role !== 'Petugas Halaqoh' && (
                      <option value="Semua Wilayah">Semua Wilayah (Jawa Tengah & DIY)</option>
                    )}
                    {WILAYAH_LIST.map((wil) => (
                      <option key={wil} value={wil}>
                        {wil}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Sub Wilayah / Halaqoh Tugas (Khusus per wilayah) */}
              {formData.wilayah !== 'Semua Wilayah' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Sub Wilayah / Halaqoh Tugas {formData.role === 'Petugas Halaqoh' ? <span className="text-rose-500">* (Wajib)</span> : '(Opsional)'}
                    </label>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {getSubWilayahList(formData.wilayah).length} Halaqoh tersedia
                    </span>
                  </div>
                  <select
                    value={formData.subWilayah || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, subWilayah: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {formData.role !== 'Petugas Halaqoh' && (
                      <option value="">-- Seluruh Wilayah {formData.wilayah} (Tanpa batasan Halaqoh) --</option>
                    )}
                    {getSubWilayahList(formData.wilayah).map((sub, idx) => {
                      const currentAssignee = halaqahOfficerMap.get(sub.toLowerCase());
                      const isTaken = currentAssignee && currentAssignee.id !== editingUser?.id;
                      return (
                        <option key={sub} value={sub}>
                          {idx + 1}. {sub} {isTaken ? `(Saat ini: ${currentAssignee.name})` : '(Tersedia)'}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {formData.role === 'Petugas Halaqoh'
                      ? 'Petugas hanya dapat mengentri dan mengubah data lembar maqami halaqoh yang dipilih ini.'
                      : 'Petugas dapat ditugaskan untuk mengawal koordinasi halaqoh tertentu.'}
                  </p>
                </div>
              )}

              {/* PIN 6 Angka */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    PIN 6 Angka (Login Cepat Petugas) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        pin: generateUniquePin(users, editingUser?.id),
                      })
                    }
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Acak PIN Unik</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pin: e.target.value.replace(/[^0-9]/g, ''),
                      })
                    }
                    placeholder="Contoh: 990001"
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <KeyRound className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  PIN unik ini digunakan petugas untuk masuk ke sistem tanpa perlu email & kata sandi.
                </p>
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Akun {editingUser && '(Kosongkan jika tidak diubah)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Masukkan kata sandi'}
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Akun Pengguna?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> ({userToDelete.email})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-700/20 transition-all cursor-pointer"
              >
                Ya, Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin / Petugas Wilayah Reset PIN Modal */}
      {userForResetPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Reset PIN 6 Angka Petugas</h3>
                  <p className="text-[11px] text-slate-400">Atur ulang PIN akses login untuk petugas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserForResetPin(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User details card */}
            <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl mb-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Nama Petugas:</span>
                <span className="font-bold text-white">{userForResetPin.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peran & Wilayah:</span>
                <span className="text-emerald-300">
                  {userForResetPin.role} ({userForResetPin.wilayah})
                </span>
              </div>
              {userForResetPin.subWilayah && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Halaqoh:</span>
                  <span className="text-teal-300 font-medium">{userForResetPin.subWilayah}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono text-slate-200">{userForResetPin.whatsapp || '-'}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/60">
                <span className="text-slate-400">PIN Saat Ini:</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/40">
                  {userForResetPin.pin || 'Belum diatur'}
                </span>
              </div>
            </div>

            {/* Alerts */}
            {resetPinErrorMsg && (
              <div className="mb-3 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{resetPinErrorMsg}</span>
              </div>
            )}

            {resetPinSuccessMsg && (
              <div className="mb-3 p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resetPinSuccessMsg}</span>
              </div>
            )}

            {/* New PIN input */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    PIN 6 Angka Baru
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewPinAdminInput(generateUniquePin(users, userForResetPin.id))
                    }
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Acak PIN Baru</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={newPinAdminInput}
                  onChange={(e) =>
                    setNewPinAdminInput(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="Contoh: 887766"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveAdminResetPin}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan PIN Baru</span>
                </button>

                {userForResetPin.whatsapp ? (
                  <a
                    href={`https://wa.me/${userForResetPin.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=Assalamu%27alaikum%20${encodeURIComponent(userForResetPin.name)},%20PIN%20akses%20akun%20Sistem%20Maqami%20Anda%20telah%20diatur%20ulang%20oleh%20Admin.%20PIN%20baru%20Anda:%20${newPinAdminInput}.%20Silakan%20gunakan%20untuk%20masuk.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim via WhatsApp</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUserForResetPin(null)}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
