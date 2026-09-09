import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MaqamiRecord } from '../types';
import { calculateSummary, formatNumberIndo } from '../utils/calculations';
import { BarChart3, TrendingUp, Filter, Sparkles } from 'lucide-react';

interface TrendChartsProps {
  allRecords: MaqamiRecord[];
  currentRecords: MaqamiRecord[];
  periodeLabel: string;
  regionList: string[];
}

type MetricCategory = 'karkun' | 'masjid' | 'jamaah' | 'masturat' | 'pelajar';

export const TrendCharts: React.FC<TrendChartsProps> = ({
  allRecords,
  currentRecords,
  periodeLabel,
  regionList,
}) => {
  const [activeCategory, setActiveCategory] = useState<MetricCategory>('karkun');
  const [chartView, setChartView] = useState<'wilayah' | 'tren-bulanan'>('wilayah');

  // Prepare data for Regional Bar Chart
  const regionalData = regionList.map((wil) => {
    const rec = currentRecords.find((r) => r.wilayah === wil);
    const totalKarkun =
      rec ? (rec.karkunUlama1Tahun || 0) + (rec.karkun4Bulan || 0) + (rec.karkun40Hari || 0) : 0;
    const totalMasjidAmal =
      rec
        ? (rec.masjid5Amal || 0) +
          (rec.masjid4Amal || 0) +
          (rec.masjid3Amal || 0) +
          (rec.masjid2Amal || 0) +
          (rec.masjid1Amal || 0)
        : 0;

    return {
      wilayah: wil,
      // Karkun
      'Ulama 1 Thn': rec?.karkunUlama1Tahun || 0,
      '4 Bulan': rec?.karkun4Bulan || 0,
      '40 Hari': rec?.karkun40Hari || 0,
      'Total Karkun': totalKarkun,

      // Masjid
      '5 Amal': rec?.masjid5Amal || 0,
      '4 Amal': rec?.masjid4Amal || 0,
      '3 Amal': rec?.masjid3Amal || 0,
      '2 Amal': rec?.masjid2Amal || 0,
      '1 Amal': rec?.masjid1Amal || 0,
      'Total Masjid Beramal': totalMasjidAmal,

      // Jamaah
      'Jamaah Rangka': rec?.jamaahRangka || 0,
      'Jamaah 3 Hari': rec?.jamaah3Hari || 0,
      Halaqah: rec?.jumlahHalaqah || 0,

      // Masturat
      'Taklim Rumah': rec?.masturatTaklimRumahHarian || 0,
      '3 Hari Masturat': rec?.masturat3Hari || 0,
      '10-15 Hari': rec?.masturat10_15Hari || 0,
      '40 Hari Masturat': rec?.masturat40Hari || 0,

      // Pelajar
      'Hadir Malam Markaz': rec?.pelajarMalamMarkaz || 0,
      'Keluar 1 Hari/Bln': rec?.pelajarKeluar1Hari || 0,
    };
  });

  // Prepare data for Monthly Trend Bar Chart
  // Group all records by period
  const uniquePeriodes = Array.from(new Set(allRecords.map((r) => r.periode))).sort();
  const monthlyTrendData = uniquePeriodes.map((per) => {
    const periodRecords = allRecords.filter((r) => r.periode === per);
    const sum = calculateSummary(periodRecords);
    const label = periodRecords[0]?.periodeLabel || per;

    return {
      periode: label,
      'Total Karkun': sum.totalKarkun,
      '4 Bulan': sum.karkun4Bulan,
      '40 Hari': sum.karkun40Hari,
      'Masjid Beramal': sum.totalMasjidAdaAmal,
      '5 Amal': sum.masjid5Amal,
      'Jamaah 3 Hari': sum.jamaah3Hari,
      'Jamaah Rangka': sum.jamaahRangka,
      'Taklim Rumah': sum.masturatTaklimRumahHarian,
      'Masturat 3 Hari': sum.masturat3Hari,
      'Pelajar Keluar': sum.pelajarKeluar1Hari,
      'Pelajar Malam Markaz': sum.pelajarMalamMarkaz,
    };
  });

  // Custom tooltip formatter
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-bold border-b border-slate-700 pb-1 mb-2 text-slate-200">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-mono font-bold text-white">
                  {formatNumberIndo(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* View Switcher & Category Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: View Mode (Per Wilayah vs Tren Bulanan) */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setChartView('wilayah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartView === 'wilayah'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Komparasi Antar Wilayah ({periodeLabel})
            </button>
            <button
              onClick={() => setChartView('tren-bulanan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartView === 'tren-bulanan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tren Progresi Bulanan
            </button>
          </div>
        </div>

        {/* Right: Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Metrik:
          </span>
          <button
            onClick={() => setActiveCategory('karkun')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'karkun'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Karkun
          </button>
          <button
            onClick={() => setActiveCategory('masjid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'masjid'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Masjid & Amal
          </button>
          <button
            onClick={() => setActiveCategory('jamaah')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'jamaah'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Jama'ah
          </button>
          <button
            onClick={() => setActiveCategory('masturat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'masturat'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Masturat
          </button>
          <button
            onClick={() => setActiveCategory('pelajar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'pelajar'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pelajar & Mahasiswa
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>
                {chartView === 'wilayah'
                  ? `Grafik Batang Per Wilayah: Kategori ${activeCategory.toUpperCase()}`
                  : `Grafik Batang Tren Bulanan: Kategori ${activeCategory.toUpperCase()}`}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {chartView === 'wilayah'
                ? `Visualisasi komparatif data maqami untuk seluruh wilayah Jawa Tengah (${periodeLabel})`
                : 'Analisis pergerakan volume dakwah dari bulan ke bulan secara komparatif'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Data Terkini Terintegrasi
            </span>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="h-[420px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartView === 'wilayah' ? regionalData : monthlyTrendData}
              margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey={chartView === 'wilayah' ? 'wilayah' : 'periode'}
                angle={chartView === 'wilayah' ? -35 : 0}
                textAnchor={chartView === 'wilayah' ? 'end' : 'middle'}
                interval={0}
                tick={{ fontSize: 11, fill: '#475569' }}
                height={55}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => formatNumberIndo(val)}
              />
              <Tooltip content={renderTooltip} />
              <Legend
                wrapperStyle={{ paddingTop: 15 }}
                iconType="circle"
                formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
              />

              {/* Dynamic Bars based on Selected Category */}
              {activeCategory === 'karkun' && (
                <>
                  <Bar dataKey="4 Bulan" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="40 Hari" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  {chartView === 'wilayah' && (
                    <Bar dataKey="Ulama 1 Thn" fill="#d97706" radius={[4, 4, 0, 0]} />
                  )}
                </>
              )}

              {activeCategory === 'masjid' && (
                <>
                  <Bar dataKey="5 Amal" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="4 Amal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="3 Amal" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  {chartView === 'wilayah' && (
                    <>
                      <Bar dataKey="2 Amal" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="1 Amal" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </>
              )}

              {activeCategory === 'jamaah' && (
                <>
                  <Bar dataKey="Jamaah Rangka" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Jamaah 3 Hari" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  {chartView === 'wilayah' && (
                    <Bar dataKey="Halaqah" fill="#ca8a04" radius={[4, 4, 0, 0]} />
                  )}
                </>
              )}

              {activeCategory === 'masturat' && (
                <>
                  <Bar dataKey="Taklim Rumah" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={chartView === 'wilayah' ? '3 Hari Masturat' : 'Masturat 3 Hari'} fill="#059669" radius={[4, 4, 0, 0]} />
                  {chartView === 'wilayah' && (
                    <Bar dataKey="10-15 Hari" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  )}
                </>
              )}

              {activeCategory === 'pelajar' && (
                <>
                  <Bar dataKey={chartView === 'wilayah' ? 'Hadir Malam Markaz' : 'Pelajar Malam Markaz'} fill="#e11d48" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={chartView === 'wilayah' ? 'Keluar 1 Hari/Bln' : 'Pelajar Keluar'} fill="#ea580c" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytical Highlight Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {activeCategory === 'karkun' && 'Karkun 4 Bulan dan 40 Hari merupakan kekuatan utama pergerakan dakwah maqami.'}
              {activeCategory === 'masjid' && 'Grafik menampilkan perbandingan masjid yang telah menghidupkan 5 amal dan amal lainnya.'}
              {activeCategory === 'jamaah' && 'Jumlah Jamaah Rangka dan Jamaah 3 Hari menunjukkan mobilitas dakwah wilayah.'}
              {activeCategory === 'masturat' && 'Taklim Rumah Harian merupakan pilar ketahanan taklim keluarga di setiap mahalla.'}
              {activeCategory === 'pelajar' && 'Potensi generasi muda dan mahasiswa dalam menghadiri malam markaz dan khuruj bulanan.'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Pembaruan otomatis tiap data tersimpan</span>
        </div>
      </div>
    </div>
  );
};
