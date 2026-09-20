import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function DisclaimerModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center space-x-3 text-amber-600 mb-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {language === 'kn' ? 'ಎಐ ಸಹಾಯದ ಸೂಚನೆ' : 'AI Diagnosis Disclaimer'}
          </h3>
        </div>

        <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
          {language === 'kn' ? (
            <>
              <p>
                ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ನೀಡಲಾದ ರೋಗ ಮತ್ತು ಕೀಟಗಳ ರೋಗನಿರ್ಣಯವು ಎಐ (ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ) ಆಧಾರಿತ ಸಹಾಯವಾಗಿದೆ.
              </p>
              <p className="font-semibold text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                ಉತ್ತಮ ಇಳುವರಿ ಮತ್ತು ಪ್ರಮುಖ ಬೆಳೆ ನಿರ್ಧಾರಗಳಿಗಾಗಿ, ದಯವಿಟ್ಟು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಅಧಿಕಾರಿಗಳು ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ತಜ್ಞರಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.
              </p>
            </>
          ) : (
            <>
              <p>
                The disease and pest diagnoses provided by Raitha Mithra are AI-assisted computer vision recommendations.
              </p>
              <p className="font-semibold text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                For high-value crop decisions, please confirm the treatment steps with your local Krishi Vigyan Kendra (KVK) or Agricultural Extension Officer.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{language === 'kn' ? 'ನನಗೆ ಅರ್ಥವಾಯಿತು' : 'I Understand & Agree'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
