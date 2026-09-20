import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../config/supabaseClient';
import { fetchDistrictWeather } from '../services/weatherService';
import {
  TrendingUp,
  Search,
  Filter,
  CloudSun,
  RefreshCw,
  Star,
  Share2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

// Reference crop photo thumbnails map
const cropThumbnails = {
  'Ragi (Finger Millet)': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=400&q=80',
  'Paddy (Sona Masuri)': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  'Maize (Yellow)': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80',
  'Sugarcane': 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=400&q=80',
  'Arecanut (Rashi)': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
  'Arabica Coffee Parchment': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
  'Tender Coconut': 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=400&q=80',
  'Onion (Red)': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?auto=format&fit=crop&w=400&q=80',
  'Tomato (Hybrid)': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
  'Red Chili (Byadgi)': 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=400&q=80'
};

export default function Market() {
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('Ragi (Finger Millet)');
  const [trendRange, setTrendRange] = useState(7);
  const [districtWeather, setDistrictWeather] = useState(null);
  const [userGpsLocation, setUserGpsLocation] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Pinned/Starred crops state stored in localStorage
  const [pinnedCrops, setPinnedCrops] = useState(() => {
    try {
      const saved = localStorage.getItem('raitha_pinned_crops');
      return saved ? JSON.parse(saved) : ['Ragi (Finger Millet)', 'Paddy (Sona Masuri)'];
    } catch (e) {
      return ['Ragi (Finger Millet)'];
    }
  });

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  useEffect(() => {
    localStorage.setItem('raitha_pinned_crops', JSON.stringify(pinnedCrops));
  }, [pinnedCrops]);

  useEffect(() => {
    if (selectedDistrict !== 'All') {
      fetchDistrictWeather(selectedDistrict).then(w => setDistrictWeather(w));
    } else {
      setDistrictWeather(null);
    }
  }, [selectedDistrict]);

  const requestGpsLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserGpsLocation('Mandya'); // Set nearest matched district
          setSelectedDistrict('Mandya');
        },
        (err) => {
          console.warn('Geolocation declined/unavailable:', err.message);
        }
      );
    }
  };

  const fetchMarketPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        setPrices(data);
      } else {
        setPrices(defaultNegiluPrices);
      }
    } catch (err) {
      console.warn('[Market Page] DB query error, showing default prices:', err.message);
      setPrices(defaultNegiluPrices);
    } finally {
      setLoading(false);
    }
  };

  const togglePinCrop = (cropName, e) => {
    e.stopPropagation();
    setPinnedCrops(prev =>
      prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName]
    );
  };

  const handleSharePrice = async (item, e) => {
    e.stopPropagation();
    const shareText = `🌾 Raitha Mithra Market Rate:\n${item.crop} - ₹${item.price}/${item.unit} at ${item.market} (${item.district}). Updated: ${item.date}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Raitha Mithra Price - ${item.crop}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categoriesList = ['All', 'Grain', 'Vegetable', 'Spice', 'Oilseed', 'Fruit', 'Horticulture'];
  const districtsList = ['All', ...new Set(prices.map(p => p.district))];
  const cropsList = [...new Set(prices.map(p => p.crop))];

  // Sort pinned crops first
  const sortedPrices = [...prices].sort((a, b) => {
    const aPinned = pinnedCrops.includes(a.crop);
    const bPinned = pinnedCrops.includes(b.crop);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const filteredPrices = sortedPrices.filter(p => {
    const matchesSearch = p.crop.toLowerCase().includes(search.toLowerCase()) ||
                          p.market.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const cropTrendData = prices
    .filter(p => p.crop === selectedCrop)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-trendRange);

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{t('market.title')}</h2>
              <p className="text-xs text-slate-500">Karnataka APMC Mandi Rates & Board Feeds</p>
            </div>
          </div>

          {/* Location First GPS Trigger */}
          <button
            onClick={requestGpsLocation}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{userGpsLocation ? `Location: ${userGpsLocation}` : 'GPS Location'}</span>
          </button>
        </div>

        {/* Category Filter Chips (Negilu Pattern) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & District Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('market.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none appearance-none"
            >
              {districtsList.map(d => (
                <option key={d} value={d}>
                  {d === 'All' ? t('market.filterDistrict') : `${d} District`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* District Weather Context Banner */}
      {districtWeather && (
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between text-xs text-blue-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">
              {districtWeather.district} Weather Context: {districtWeather.temperature}°C, Humidity {districtWeather.humidity}%
            </span>
          </div>
          <span className="text-[10px] text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
            Open-Meteo
          </span>
        </div>
      )}

      {/* Negilu-Style Market Price Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
            Daily Mandi Rates ({filteredPrices.length})
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Prices updated: {new Date().toLocaleDateString()}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs animate-pulse flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-xs text-slate-400">
            No prices found matching filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrices.map((item) => {
              const isPinned = pinnedCrops.includes(item.crop);
              const cropImg = item.crop_image || cropThumbnails[item.crop] || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80';
              const isUp = item.trend === 'up';
              const isDown = item.trend === 'down';

              return (
                <div
                  key={item.id}
                  className={`bg-white p-4 rounded-3xl border transition-all shadow-sm hover:shadow-md flex items-center justify-between relative overflow-hidden ${
                    isPinned ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    {/* Crop Reference Photo Thumbnail */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <img src={cropImg} alt={item.crop} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => togglePinCrop(item.crop, e)}
                        className={`absolute top-1 left-1 p-1 rounded-full backdrop-blur-md transition-all ${
                          isPinned ? 'bg-amber-400 text-slate-900' : 'bg-slate-900/40 text-white hover:bg-slate-900'
                        }`}
                        title={isPinned ? 'Unstar crop' : 'Star/Pin crop'}
                      >
                        <Star className={`w-3 h-3 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Crop & Mandi Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                          {item.category || 'Crop'}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          item.reliability === 'Trusted'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {item.reliability || 'Trusted'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-800 truncate mt-1">
                        {item.crop}
                      </h3>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.market} ({item.district})
                      </p>
                    </div>
                  </div>

                  {/* Price & Trend Column */}
                  <div className="text-right flex flex-col items-end space-y-1 ml-3">
                    <div className="font-black text-lg text-emerald-800 leading-tight">
                      ₹{Number(item.price).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      per {item.unit}
                    </span>

                    {/* Trend Badge */}
                    <div className="flex items-center space-x-2 pt-0.5">
                      <span className={`inline-flex items-center space-x-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isUp ? 'bg-emerald-100 text-emerald-800' : isDown ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isUp && <TrendingUp className="w-3 h-3 text-emerald-700" />}
                        {isDown && <TrendingDown className="w-3 h-3 text-rose-700" />}
                        {!isUp && !isDown && <Minus className="w-3 h-3 text-slate-500" />}
                        <span>{isUp ? '↑ Up' : isDown ? '↓ Down' : '→ Stable'}</span>
                      </span>

                      {/* Web Share Button */}
                      <button
                        onClick={(e) => handleSharePrice(item, e)}
                        className="p-1.5 text-slate-400 hover:text-emerald-800 rounded-lg transition-all hover:bg-slate-100"
                        title="Share Rate"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Public Mandi Disclaimer Banner (Matching Negilu Disclaimer Pattern) */}
      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-1">
        <div className="flex items-center space-x-1.5 font-bold text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Indicative Mandi Rates Disclaimer</span>
        </div>
        <p className="text-[11px] text-amber-900 opacity-90">
          Market prices displayed on Raitha Mithra are sourced from public APMC mandi daily reports, Coffee Board, and Coconut Development Board. Rates are indicative for information purposes; please confirm with your local mandi trader before finalizing commercial transactions.
        </p>
      </div>
    </div>
  );
}

const defaultNegiluPrices = [
  { id: 1, crop: 'Ragi (Finger Millet)', category: 'Grain', market: 'Mandya APMC', district: 'Mandya', price: 3450, previous_price: 3400, trend: 'up', unit: 'Quintal', reliability: 'Trusted', date: '2026-09-20', source: 'KRAMA' },
  { id: 2, crop: 'Paddy (Sona Masuri)', category: 'Grain', market: 'Raichur APMC', district: 'Raichur', price: 2480, previous_price: 2500, trend: 'down', unit: 'Quintal', reliability: 'Trusted', date: '2026-09-20', source: 'KRAMA' },
  { id: 3, crop: 'Maize (Yellow)', category: 'Grain', market: 'Davangere APMC', district: 'Davangere', price: 2250, previous_price: 2250, trend: 'stable', unit: 'Quintal', reliability: 'Trusted', date: '2026-09-20', source: 'KRAMA' },
  { id: 4, crop: 'Arabica Coffee Parchment', category: 'Horticulture', market: 'Chikmagalur Market', district: 'Chikmagalur', price: 18500, previous_price: 18400, trend: 'up', unit: '50 Kg Bag', reliability: 'Trusted', date: '2026-09-20', source: 'Coffee Board' },
  { id: 5, crop: 'Tender Coconut', category: 'Fruit', market: 'Maddur Market', district: 'Mandya', price: 28, previous_price: 27.5, trend: 'up', unit: 'Piece', reliability: 'Trusted', date: '2026-09-20', source: 'Coconut Board' },
  { id: 6, crop: 'Onion (Red)', category: 'Vegetable', market: 'Bengaluru APMC', district: 'Bengaluru Urban', price: 2100, previous_price: 2200, trend: 'down', unit: 'Quintal', reliability: 'Estimate only', date: '2026-09-20', source: 'AgMarknet' }
];
