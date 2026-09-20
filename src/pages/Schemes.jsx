import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { Landmark, ExternalLink, Award, CheckCircle2, ChevronRight, X, Flag, MapPin } from 'lucide-react';

export default function Schemes() {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const userState = profile?.state || 'Karnataka';

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all', 'central', 'my_state', 'other_state'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedState, setSelectedState] = useState(userState);
  const [activeScheme, setActiveScheme] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schemes')
        .select('*');

      if (!error && data && data.length > 0) {
        setSchemes(data);
      } else {
        setSchemes(defaultNationwideSchemes);
      }
    } catch (err) {
      console.warn('[Schemes Page] DB query warning:', err.message);
      setSchemes(defaultNationwideSchemes);
    } finally {
      setLoading(false);
    }
  };

  const allStates = ['Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Tamil Nadu', 'Andhra Pradesh', 'Madhya Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal'];

  const filteredSchemes = schemes.filter(s => {
    // 1. Scope filter
    if (scopeFilter === 'central' && s.scope !== 'central') return false;
    if (scopeFilter === 'my_state' && (s.scope !== 'state' || s.state !== userState)) return false;
    if (scopeFilter === 'other_state' && s.state !== selectedState && s.scope === 'state') return false;

    // 2. Category filter
    if (categoryFilter !== 'all' && s.category !== categoryFilter && s.category !== 'all') return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('schemes.title')} (Nationwide)</h2>
            <p className="text-xs text-slate-500">Central Government & Multi-State Subsidy Directory</p>
          </div>
        </div>

        {/* Scope Filter Buttons */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setScopeFilter('all')}
            className={`py-2 rounded-xl transition-all ${
              scopeFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setScopeFilter('central')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              scopeFilter === 'central'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-amber-300" />
            <span>Central Schemes</span>
          </button>
          <button
            onClick={() => setScopeFilter('my_state')}
            className={`py-2 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              scopeFilter === 'my_state'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{userState} Schemes</span>
          </button>
        </div>

        {/* Category & State Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            <option value="all">All Farmer Categories</option>
            <option value="small">Small Farmers (&lt; 2 Ha)</option>
            <option value="marginal">Marginal Farmers (&lt; 1 Ha)</option>
            <option value="women">Women Farmers</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setScopeFilter('other_state'); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            {allStates.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/4"></div>
              <div className="h-6 bg-slate-100 rounded w-3/4"></div>
              <div className="h-12 bg-slate-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    scheme.scope === 'central'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}>
                    {scheme.scope === 'central' ? '🇮🇳 Central Scheme' : `🏛️ ${scheme.state} State`}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {scheme.category === 'small' ? 'Small Farmers' : scheme.category === 'marginal' ? 'Marginal' : 'All Farmers'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-800 mt-3 leading-snug">
                  {language === 'kn' ? scheme.name_kn : scheme.name_en}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {language === 'kn' ? scheme.description_kn : scheme.description_en}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveScheme(scheme)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
                >
                  <span>{t('schemes.details')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {scheme.application_link && (
                  <a
                    href={scheme.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <span>{t('schemes.applyNow')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheme Detail Popup Modal */}
      {activeScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setActiveScheme(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              {activeScheme.scope === 'central' ? 'Central Government Scheme' : `${activeScheme.state} State Scheme`}
            </span>

            <h3 className="text-xl font-bold text-slate-800 pr-8">
              {language === 'kn' ? activeScheme.name_kn : activeScheme.name_en}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn' ? activeScheme.description_kn : activeScheme.description_en}
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('schemes.eligibility')}</span>
                </div>
                <p className="text-xs text-slate-700">
                  {language === 'kn' ? activeScheme.eligibility_kn : activeScheme.eligibility_en}
                </p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs mb-1">
                  <Award className="w-4 h-4" />
                  <span>{t('schemes.benefit')}</span>
                </div>
                <p className="text-xs text-amber-950 font-medium">
                  {language === 'kn' ? activeScheme.benefit_kn : activeScheme.benefit_en}
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Deadline: {activeScheme.deadline || 'Ongoing'}
              </span>
              {activeScheme.application_link && (
                <a
                  href={activeScheme.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-md transition-all"
                >
                  <span>{t('schemes.applyNow')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultNationwideSchemes = [
  {
    id: 1,
    name_en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    name_kn: 'ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)',
    description_en: 'Direct income support scheme providing ₹6,000 annually to all landholding farmer families across India.',
    description_kn: 'ಭಾರತದಾದ್ಯಂತ ಭೂಮಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ ಬೆಂಬಲ ನೀಡುವ ಕೇಂದ್ರ ಯೋಜನೆ.',
    eligibility_en: 'Landholding farmer families with cultivable land in their names.',
    eligibility_kn: 'ತಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಸಾಗುವಳಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳು.',
    benefit_en: '₹6,000 per year transferred in 3 equal installments of ₹2,000 directly to bank accounts.',
    benefit_kn: 'ವರ್ಷಕ್ಕೆ ₹6,000 ಮೊತ್ತವನ್ನು ತಲಾ ₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.',
    scope: 'central',
    state: null,
    category: 'all',
    application_link: 'https://pmkisan.gov.in/',
    deadline: 'Ongoing'
  },
  {
    id: 2,
    name_en: 'Raitha Vidya Nidhi Scheme',
    name_kn: 'ರೈತ ವಿದ್ಯಾ ನಿಧಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)',
    description_en: 'Scholarship scheme for children of registered farmers in Karnataka studying in PUC, Degree, Engineering, or Medicine.',
    description_kn: 'ಉನ್ನತ ಶಿಕ್ಷಣದಲ್ಲಿ ವ್ಯಾಸಂಗ ಮಾಡುತ್ತಿರುವ ಕರ್ನಾಟಕದ ರೈತರ ಮಕ್ಕಳಿಗೆ ಆರ್ಥಿಕ ನೆರವು ನೀಡುವ ಯೋಜನೆ.',
    eligibility_en: 'Children of farmers in Karnataka registered on FRUITS portal studying post-10th.',
    eligibility_kn: 'ಫ್ರೂಟ್ಸ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತರಾದ ಕರ್ನಾಟಕದ ರೈತರ ಮಕ್ಕಳು.',
    benefit_en: 'Annual scholarship grant from ₹2,500 to ₹11,000 directly transferred via SSP.',
    benefit_kn: 'ಎಸ್‌ಎಸ್‌ಪಿ ಪೋರ್ಟಲ್ ಮೂಲಕ ನೇರವಾಗಿ ವಿದ್ಯಾರ್ಥಿ ಖಾತೆಗೆ ₹2,500 ರಿಂದ ₹11,000 ವಾರ್ಷಿಕ ನೆರವು.',
    scope: 'state',
    state: 'Karnataka',
    category: 'marginal',
    application_link: 'https://ssp.postmatric.karnataka.gov.in/',
    deadline: 'SSP Annual Cycle'
  }
];
