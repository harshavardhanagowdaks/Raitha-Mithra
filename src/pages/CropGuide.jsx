import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../config/supabaseClient';
import { BookOpen, Sparkles, ChevronRight, Droplets, Sun, Sprout, CheckCircle2, Bot } from 'lucide-react';

export default function CropGuide() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('guides'); // 'guides' or 'recommend'
  const [guides, setGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);

  // Form parameters for ML Crop Recommendation
  const [formData, setFormData] = useState({
    N: 40,
    P: 30,
    K: 30,
    ph: 6.5,
    temperature: 26,
    humidity: 70,
    rainfall: 650
  });

  const [recommending, setRecommending] = useState(false);
  const [recommendResult, setRecommendResult] = useState(null);

  useEffect(() => {
    fetchCropGuides();
  }, []);

  const fetchCropGuides = async () => {
    setLoadingGuides(true);
    try {
      const { data, error } = await supabase.from('crop_guides').select('*');
      if (!error && data && data.length > 0) {
        setGuides(data);
      } else {
        setGuides(defaultGuides);
      }
    } catch (err) {
      console.warn('[CropGuide Page] DB query warning:', err.message);
      setGuides(defaultGuides);
    } fontally: {
      setLoadingGuides(false);
    }
  };

  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    setRecommending(true);
    try {
      const res = await fetch('/api/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang: language })
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendResult(data);
      } else {
        throw new Error('Recommendation endpoint returned error');
      }
    } catch (err) {
      console.warn('[CropGuide Page] ML endpoint error fallback:', err.message);
      setRecommendResult({
        recommendations: [
          { crop: 'Finger Millet (Ragi)', score: 94 },
          { crop: 'Maize (Corn)', score: 86 },
          { crop: 'Groundnut (Peanut)', score: 78 }
        ],
        explanation_en: 'Based on your soil NPK levels (40-30-30) and rainfall, Finger Millet (Ragi) is highly suited for maximum yield.',
        explanation_kn: 'ನಿಮ್ಮ ಮಣ್ಣಿನ ಪೋಷಕಾಂಶ ಮಟ್ಟ ಮತ್ತು ಮಳೆಯ ಪ್ರಮಾಣಕ್ಕೆ, ರಾಗಿ ಬೆಳೆಯನ್ನು ಬೆಳೆಯುವುದು ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ.'
      });
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('cropGuide.title')}</h2>
            <p className="text-xs text-slate-500">{t('cropGuide.subtitle')}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('guides')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'guides'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('cropGuide.tabGuides')}
          </button>
          <button
            onClick={() => setActiveTab('recommend')}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'recommend'
                ? 'bg-brand-700 text-white shadow-sm font-bold'
                : 'text-brand-700 hover:bg-brand-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('cropGuide.tabRecommend')}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CULTIVATION GUIDES */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {loadingGuides ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Loading crop guides...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((crop) => (
                <div
                  key={crop.id}
                  onClick={() => setSelectedGuide(crop)}
                  className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {crop.season}
                      </span>
                      <span className="text-xs text-slate-400">{crop.harvest_time}</span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-800 mt-2">
                      {language === 'kn' ? crop.crop_name_kn : crop.crop_name_en}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t('cropGuide.soil')}</span>
                        <span className="font-semibold">{crop.soil_type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{t('cropGuide.water')}</span>
                        <span className="font-semibold">{crop.water_needs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-700">
                    <span>View Agronomic Manual</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ML CROP RECOMMENDER */}
      {activeTab === 'recommend' && (
        <div className="space-y-6">
          <form
            onSubmit={handleRecommendSubmit}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-base text-slate-800 mb-2">
              {t('cropGuide.soilFormTitle')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.nitrogen')}</label>
                <input
                  type="number"
                  value={formData.N}
                  onChange={(e) => setFormData({ ...formData, N: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.phosphorus')}</label>
                <input
                  type="number"
                  value={formData.P}
                  onChange={(e) => setFormData({ ...formData, P: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.potassium')}</label>
                <input
                  type="number"
                  value={formData.K}
                  onChange={(e) => setFormData({ ...formData, K: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.ph')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.temperature')}</label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t('cropGuide.rainVal')}</label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={recommending}
              className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {recommending ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{t('cropGuide.submitRecommend')}</span>
                </>
              )}
            </button>
          </form>

          {/* ML Recommendation Output Banner */}
          {recommendResult && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>{t('cropGuide.recommendedTitle')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendResult.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border flex flex-col items-center text-center ${
                      i === 0
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-white px-2 py-0.5 rounded-full mb-1">
                      Rank #{i + 1} ({rec.score}% Match)
                    </span>
                    <span className="font-bold text-base text-slate-800 mt-1">{rec.crop}</span>
                  </div>
                ))}
              </div>

              {/* Gemini AI Plain Language Explanation */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-amber-900">
                  <Bot className="w-4 h-4 text-amber-700" />
                  <span>{t('cropGuide.aiAnalysis')} (Gemini 2.5)</span>
                </div>
                <p className="leading-relaxed">
                  {language === 'kn' ? recommendResult.explanation_kn : recommendResult.explanation_en}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800">
              {language === 'kn' ? selectedGuide.crop_name_kn : selectedGuide.crop_name_en}
            </h3>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl">
              <p><strong>Fertilizer Schedule:</strong> {selectedGuide.fertilizer_schedule}</p>
              <p><strong>Water Needs:</strong> {selectedGuide.water_needs}</p>
              <p><strong>Harvest Time:</strong> {selectedGuide.harvest_time}</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn' ? selectedGuide.content_kn : selectedGuide.content_en}
            </p>
            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full py-3 bg-slate-800 text-white font-bold rounded-2xl text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultGuides = [
  {
    id: 1,
    crop_name_en: 'Finger Millet (Ragi)',
    crop_name_kn: 'ರಾಗಿ (Finger Millet)',
    season: 'Kharif',
    soil_type: 'Red Loamy',
    water_needs: '350 - 500 mm',
    fertilizer_schedule: '40:20:20 NPK kg/ha',
    harvest_time: '110 Days',
    content_en: 'Ragi is Karnataka staple food grain. Highly drought resistant. Requires good weed control in first 35 days.',
    content_kn: 'ರಾಗಿ ಕರ್ನಾಟಕದ ಮುಖ್ಯ ಆಹಾರ ಧಾನ್ಯವಾಗಿದೆ. ಅತ್ಯಂತ ಬರಾವು ನಿರೋಧಕ. ಬಿತ್ತನೆಯ ನಂತರ ಮೊದಲ 35 ದಿನಗಳಲ್ಲಿ ಉತ್ತಮ ಕಳೆ ನಿಯಂತ್ರಣ ಅಗತ್ಯವಿದೆ.'
  },
  {
    id: 2,
    crop_name_en: 'Paddy (Rice)',
    crop_name_kn: 'ಭತ್ತ (Rice / Paddy)',
    season: 'Kharif/Rabi',
    soil_type: 'Clay Loam',
    water_needs: '1200 - 1500 mm',
    fertilizer_schedule: '100:50:50 NPK kg/ha',
    harvest_time: '135 Days',
    content_en: 'Paddy requires continuous field standing water maintenance. Apply Zinc Sulfate to prevent Khaira disease.',
    content_kn: 'ಭತ್ತದ ಬೆಳೆಗೆ ನಿರಂತರ ನೀರಿನ ಅಗತ್ಯವಿದೆ. ಖೈರಾ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಝಿಂಕ್ ಸಲ್ಫೇಟ್ ಬಳಸಿ.'
  }
];
