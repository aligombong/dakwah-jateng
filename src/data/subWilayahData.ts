import { UserSession } from '../types';

export interface SubWilayahItem {
  id: string;
  no: number;
  name: string;
  wilayah: string;
}

/**
 * Master Data 151 Sub Wilayah / Halaqoh di 10 Wilayah Markaz Jawa Tengah & DIY
 */
export const SUB_WILAYAH_DATA: Record<string, string[]> = {
  PATI: [
    'Halaqoh Pati',
    'Halaqoh Jepara',
  ],
  PEKALONGAN: [
    'Kabupaten Pemalang',
    'Kabupaten Pekalongan',
    'Kota Pekalongan',
    'Kota Batang',
  ],
  PURWOREJO: [
    'Kemiri',
    'BNG',
    'Purwodadi',
    'Purworejo Kota',
    'Kebumen Timur',
    'Kebumen Tengah',
    'Kebumen Selatan',
    'Gombong',
  ],
  SOLO: [
    'Serengan',
    'Pasar Kliwon',
    'Jebres',
    'Banjarlawe',
    'Colomadu',
    'Wonogiri kota',
    'Manyaran',
    'Praci',
    'Tirtomoyo',
    'Sidoharjo',
    'Klaten kota',
    'Wonosari',
    'Cawas',
    'Kartasura',
    'Cemani',
    'Grogol',
    'Mojolaban',
    'Polokarto',
    'Sukoharjo kota',
    'Palur',
    'Karanganyar kota',
    'Gondangrejo',
    'Mojogedang',
    'Karangpandan',
    'Tawangmangu',
    'Tasikmadu',
    'Jatipuro',
    'Jumapolo',
    'Ngemplak',
    'Boyolali kota',
    'Gemolong',
  ],
  SEMARANG: [
    'Bandungan',
    'Salatiga',
    'Ungaran',
    'Gunungpati',
    'Boja mijen',
    'Demak',
    'Purwodadi',
    'Genuk',
    'Tembalang',
    'Semarang utara',
  ],
  MAGELANG: [
    'Mungkid',
    'Salaman',
    'Mertoyudan',
    'Kaliangkrik',
    'Dukun',
    'Pakis',
    'Candimulyo',
    'Tegalrejo',
    'Magelang Kota',
    'Payaman',
    'Windusari',
    'Secang',
    'Pirikan',
    'Grabag',
    'Ngablak Atas',
    'Ngablak Bawah',
    'Temanggung Kota',
    'Kaloran',
    'Kandangan',
    'Bulu',
    'Parakan Bansari',
    'Ngadirejo',
    'Jumo',
    'Gemawang',
    'Wonoboyo',
    'Sukorejo',
    'Kejajar',
    'Dieng',
    'Garung',
    'Wonosobo Kretek',
    'Sapuran',
    'Kaliwiro',
  ],
  YOGYAKARTA: [
    'Kalasan',
    'Ngaglik',
    'Sleman Selatan',
    'Gamping',
    'Kota Barat',
    'Kota Timur',
    'Bantul Utara',
    'Bantul Timur',
    'Bantul Kota',
    'Kulon Progo',
    'Pathuk',
    'Karangmojo',
    'Semin',
    'Depok',
    'Kaliworo',
  ],
  PURWOKERTO: [
    'Ajibarang',
    'Kembaran',
    'Kotatif',
    'Jatilawang',
    'Selatan',
    'Sumbang',
    'Wangon',
    'Utara',
    'Kota Cilacap',
    'Kroya',
    'Kawunganten',
    'Gandrungmangu',
    'Cinangsi',
    'Kota Banjar',
    'Sigaluh',
    'Banjarmangu',
    'Karangkobar',
    'Punggelan',
    'Purwonegoro',
    'Mandiraja',
    'Kota (Purbalingga)',
    'Bojongsari',
    'Mrebet / Karang reja',
    'Kemangkon',
    'Pengadegan',
    'Bantarkawung',
    'Sukasari',
    'Salem',
  ],
  SRAGEN: [
    'Kota',
    'Ngrampal 1',
    'Sidoharjo',
    'Masaran',
    'Karangmalang',
    'Kedawung',
    'Ngrampal 2',
    'Sambirjo',
    'Gondang',
    'Sambungmacan',
    'Tangen Jenar',
    'Plupuh',
    'Kebak Kramat',
  ],
  TEGAL: [
    'Surodadi',
    'Kramat',
    'Tegal Kota',
    'Slawi',
    'Lebaksiu',
    'Brebes Timur',
    'Ketanggungan',
    'Brebes Barat',
  ],
};

/**
 * Daftar flat 151 Sub Wilayah untuk memudahkan pencarian dan filtering
 */
export const ALL_SUB_WILAYAH_FLAT: SubWilayahItem[] = Object.entries(SUB_WILAYAH_DATA).flatMap(
  ([wilayah, list]) =>
    list.map((name, idx) => ({
      id: `${wilayah.toLowerCase()}-${idx + 1}`,
      no: idx + 1,
      name,
      wilayah,
    }))
);

export const TOTAL_SUB_WILAYAH_COUNT = ALL_SUB_WILAYAH_FLAT.length; // 151

export function getSubWilayahList(wilayah: string): string[] {
  if (!wilayah) return [];
  const normalized = wilayah.toUpperCase().trim();
  return SUB_WILAYAH_DATA[normalized] || [];
}

export function getSubWilayahCount(wilayah: string): number {
  return getSubWilayahList(wilayah).length;
}

export const WILAYAH_HALAQAH_COUNTS: Record<string, number> = Object.fromEntries(
  Object.entries(SUB_WILAYAH_DATA).map(([k, v]) => [k, v.length])
);

export const WILAYAH_PIN_PREFIX: Record<string, string> = {
  PATI: '11',
  PEKALONGAN: '12',
  PURWOREJO: '13',
  SOLO: '14',
  SEMARANG: '15',
  MAGELANG: '16',
  YOGYAKARTA: '17',
  PURWOKERTO: '18',
  SRAGEN: '19',
  TEGAL: '20',
};

/**
 * Membuat akun Petugas Halaqoh untuk 151 halaqah.
 * ATURAN: Abaikan jika halaqah sudah memiliki akun petugas (baik di DEFAULT_USERS maupun yang sudah tersimpan).
 */
export function generateHalaqahAccounts(existingUsers: UserSession[] = []): UserSession[] {
  const existingSet = new Set(
    existingUsers
      .filter((u) => u.subWilayah && u.wilayah)
      .map((u) => `${u.wilayah!.toUpperCase()}:::${u.subWilayah!.trim().toLowerCase()}`)
  );

  const existingPins = new Set(existingUsers.map((u) => u.pin).filter(Boolean));
  const existingEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));

  const newAccounts: UserSession[] = [];

  ALL_SUB_WILAYAH_FLAT.forEach((item) => {
    const key = `${item.wilayah.toUpperCase()}:::${item.name.trim().toLowerCase()}`;
    // Abaikan jika halaqah sudah memiliki akun
    if (existingSet.has(key)) {
      return;
    }

    const cleanWil = item.wilayah.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSub = item.name
      .toLowerCase()
      .replace(/[\/\(\)]/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '');

    const prefix = WILAYAH_PIN_PREFIX[item.wilayah.toUpperCase()] || '21';
    let pinNum = parseInt(`${prefix}${String(item.no).padStart(4, '0')}`, 10);
    while (existingPins.has(pinNum.toString()) || pinNum < 100000 || pinNum > 999999) {
      pinNum = (pinNum + 1) % 1000000;
      if (pinNum < 100000) pinNum += 100000;
    }
    const pinStr = pinNum.toString();
    existingPins.add(pinStr);

    let email = `hal.${cleanSub}.${cleanWil}@masqami.id`;
    if (existingEmails.has(email)) {
      email = `hal.${cleanSub}.${item.no}.${cleanWil}@masqami.id`;
    }
    existingEmails.add(email);

    // Format WhatsApp Indonesia
    const wa = `0812-${prefix}${String(item.no).padStart(2, '0')}-${String(1000 + item.no * 7).slice(-4)}`;

    const newOfficer: UserSession = {
      id: `user-hal-${cleanWil}-${cleanSub}`,
      name: `Petugas Halaqoh ${item.name}`,
      email,
      pin: pinStr,
      whatsapp: wa,
      role: 'Petugas Halaqoh',
      wilayah: item.wilayah,
      subWilayah: item.name,
      password: 'bismillah123',
      createdAt: 'Akun Halaqoh Bawaan',
    };

    newAccounts.push(newOfficer);
    existingSet.add(key);
  });

  return newAccounts;
}

