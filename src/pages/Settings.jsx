import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Check, Mail, AlertTriangle, Info, HelpCircle } from 'lucide-react';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, authDiagnosticError, signInWithGoogle, signInWithMagicLink, signOut, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    district: 'Mandya',
    state: 'Karnataka',
    land_size_acres: 2,
    crops_grown: 'Finger Millet (Ragi), Paddy'
  });

  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        district: profile.district || 'Mandya',
        state: profile.state || 'Karnataka',
        land_size_acres: profile.land_size_acres || 2,
        crops_grown: Array.isArray(profile.crops_grown) ? profile.crops_grown.join(', ') : (profile.crops_grown || 'Finger Millet (Ragi)')
      });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const cropsArray = formData.crops_grown.split(',').map(c => c.trim()).filter(Boolean);
    const result = await updateProfile({
      ...formData,
      crops_grown: cropsArray,
      preferred_language: language
    });

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert('Failed to update profile: ' + result.error);
    }
  };

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    if (!magicEmail) return;
    const res = await signInWithMagicLink(magicEmail);
    if (res.success) {
      setMagicSent(true);
    } else {
      alert('Magic link error: ' + res.error);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-brand-100 text-brand-800 rounded-2xl">
            <User className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('settings.title')}</h2>
            <p className="text-xs text-slate-500">{t('settings.profileDetails')}</p>
          </div>
        </div>
      </div>

      {/* Auth Status & Google Login Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-800 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{profile?.full_name || 'Farmer User'}</h4>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('settings.logout')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center py-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('settings.loginPrompt')}
            </p>

            {/* Google OAuth Login Button */}
            <button
              onClick={signInWithGoogle}
              className="w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-3 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{t('settings.googleLogin')}</span>
            </button>

            {/* Diagnostic Error Box (Priority 1 UI Fix) */}
            {authDiagnosticError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs text-amber-950 space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Google Sign-In Setup Diagnostic</span>
                </div>
                <p className="whitespace-pre-line leading-relaxed font-mono text-[11px] bg-white p-3 rounded-xl border border-amber-200">
                  {authDiagnosticError}
                </p>
                <div className="text-[11px] text-amber-900 space-y-1 pt-1">
                  <p className="font-semibold">Quick Verification Checklist:</p>
                  <p>1. Google Cloud Console -&gt; Authorized JavaScript origins: <code className="bg-amber-100 px-1 rounded">{window.location.origin}</code></p>
                  <p>2. Google Cloud Console -&gt; Authorized redirect URI: <code className="bg-amber-100 px-1 rounded">https://&lt;supabase-ref&gt;.supabase.co/auth/v1/callback</code></p>
                  <p>3. Supabase Auth -&gt; URL Configuration -&gt; Site URL matches your deployed domain.</p>
                </div>
              </div>
            )}

            {/* Email Magic Link Fallback */}
            <div className="pt-2 border-t border-slate-100">
              <form onSubmit={handleMagicLinkSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email for Magic Link fallback"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Link</span>
                </button>
              </form>
              {magicSent && (
                <span className="text-[11px] text-emerald-600 font-bold block mt-2">
                  Magic Login Link sent to your email inbox!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Configuration Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-800 mb-2">
          Farmer Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.name')}</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.phone')}</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.district')}</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.state')}</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.landSize')}</label>
            <input
              type="number"
              value={formData.land_size_acres}
              onChange={(e) => setFormData({ ...formData, land_size_acres: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('settings.cropsGrown')}</label>
            <input
              type="text"
              value={formData.crops_grown}
              onChange={(e) => setFormData({ ...formData, crops_grown: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="pt-2">
          <label className="block font-semibold text-slate-700 text-xs mb-2">{t('settings.language')}</label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('kn')}
              className={`p-3 rounded-2xl border font-bold transition-all ${
                language === 'kn'
                  ? 'bg-amber-400 border-amber-500 text-brand-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-2xl border font-bold transition-all ${
                language === 'en'
                  ? 'bg-amber-400 border-amber-500 text-brand-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-4"
        >
          {saveSuccess ? (
            <>
              <Check className="w-5 h-5 text-amber-300" />
              <span>Profile Updated!</span>
            </>
          ) : (
            <span>{t('settings.saveProfile')}</span>
          )}
        </button>
      </form>
    </div>
  );
}
