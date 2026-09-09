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
