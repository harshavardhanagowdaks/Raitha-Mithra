import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { Calculator as CalcIcon, DollarSign, TrendingUp, Save, History, Check } from 'lucide-react';

export default function Calculator() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    crop: 'Ragi (Finger Millet)',
    acres: 1,
    seeds: 1500,
    fertilizer: 4500,
    labor: 8000,
    irrigation: 2000,
    machinery: 3000,
    landRent: 0,
    yieldExpected: 15, // quintals
    unitPrice: 3450 // ₹ per quintal
  });

  const [savedHistory, setSavedHistory] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSavedHistory(data);
      }
    } catch (err) {
      console.warn('[Calculator Page] History fetch error:', err.message);
    }
  };

  const autoFillMarketPrice = async () => {
    try {
      const { data } = await supabase
        .from('market_prices')
        .select('price')
        .ilike('crop', `%${formData.crop.split(' ')[0]}%`)
        .order('date', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, unitPrice: Number(data[0].price) }));
      }
    } catch (err) {
      console.warn('[Calculator Page] Auto-fill price fallback:', err.message);
    }
  };

  const acres = Number(formData.acres) || 1;
  const totalCost = (
    Number(formData.seeds) +
    Number(formData.fertilizer) +
    Number(formData.labor) +
    Number(formData.irrigation) +
    Number(formData.machinery) +
    Number(formData.landRent)
  ) * acres;

  const grossRevenue = Number(formData.yieldExpected) * Number(formData.unitPrice) * acres;
  const netProfit = grossRevenue - totalCost;
  const profitPerAcre = netProfit / acres;

  const handleSaveCalculation = async () => {
    if (!user) {
      alert(t('settings.loginPrompt'));
      return;
    }

    try {
      const { data, error } = await supabase.from('calculations').insert({
        user_id: user.id,
        crop: formData.crop,
        season: 'Kharif',
        costs_json: {
          seeds: formData.seeds,
          fertilizer: formData.fertilizer,
          labor: formData.labor,
          irrigation: formData.irrigation,
          machinery: formData.machinery,
          landRent: formData.landRent
        },
        yield_expected: formData.yieldExpected,
        unit_price: formData.unitPrice,
        revenue: grossRevenue,
        profit: netProfit
      }).select();

      if (!error && data) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchHistory();
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('calculator.title')}</h2>
            <p className="text-xs text-slate-500">{t('calculator.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Input Form & Realtime Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.cropName')}</label>
              <input
                type="text"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.landAcres')}</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.acres}
                onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.seedCost')}</label>
              <input
                type="number"
                value={formData.seeds}
                onChange={(e) => setFormData({ ...formData, seeds: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.fertilizerCost')}</label>
              <input
                type="number"
                value={formData.fertilizer}
                onChange={(e) => setFormData({ ...formData, fertilizer: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.laborCost')}</label>
              <input
                type="number"
                value={formData.labor}
                onChange={(e) => setFormData({ ...formData, labor: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.irrigationCost')}</label>
              <input
                type="number"
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.machineryCost')}</label>
              <input
                type="number"
                value={formData.machinery}
                onChange={(e) => setFormData({ ...formData, machinery: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.landRentCost')}</label>
              <input
                type="number"
                value={formData.landRent}
                onChange={(e) => setFormData({ ...formData, landRent: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('calculator.expectedYield')}</label>
              <input
                type="number"
                value={formData.yieldExpected}
                onChange={(e) => setFormData({ ...formData, yieldExpected: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">{t('calculator.marketPrice')}</label>
                <button
                  type="button"
                  onClick={autoFillMarketPrice}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  {t('calculator.autoFillPrice')}
                </button>
              </div>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Realtime Output Card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Realtime Profit Summary
            </h3>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <span className="text-xs text-slate-300 block">{t('calculator.totalCost')}</span>
                <span className="text-xl font-extrabold text-amber-300">
                  ₹{totalCost.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <span className="text-xs text-slate-300 block">{t('calculator.grossRevenue')}</span>
                <span className="text-xl font-extrabold text-emerald-300">
                  ₹{grossRevenue.toLocaleString()}
                </span>
              </div>

              <div className={`p-4 rounded-2xl border ${netProfit >= 0 ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/80 border-rose-500/40 text-rose-200'}`}>
                <span className="text-xs font-semibold block">{t('calculator.netProfit')}</span>
                <span className="text-2xl font-black mt-1 block">
                  ₹{netProfit.toLocaleString()}
                </span>
                <span className="text-[11px] opacity-80 block mt-0.5">
                  ({t('calculator.profitPerAcre')}: ₹{Math.round(profitPerAcre).toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveCalculation}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
          >
            {saveSuccess ? (
              <>
                <Check className="w-5 h-5 text-amber-300" />
                <span>Saved to Profile!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 text-amber-300" />
                <span>{t('calculator.saveCalc')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Log */}
      {savedHistory.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
            <History className="w-5 h-5 text-slate-500" />
            <span>{t('calculator.history')}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {savedHistory.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{item.crop}</span>
                  <span className="text-[10px] text-slate-400 block">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${item.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    Net Profit: ₹{Number(item.profit).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Revenue: ₹{Number(item.revenue).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
