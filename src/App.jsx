import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Market from './pages/Market';
import Schemes from './pages/Schemes';
import CropGuide from './pages/CropGuide';
import DiseaseScan from './pages/DiseaseScan';
import Calculator from './pages/Calculator';
import Assistant from './pages/Assistant';
import News from './pages/News';
import Settings from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'market':
        return <Market />;
      case 'schemes':
        return <Schemes />;
      case 'cropGuide':
        return <CropGuide />;
      case 'diseaseScan':
        return <DiseaseScan />;
      case 'calculator':
        return <Calculator />;
      case 'assistant':
        return <Assistant />;
      case 'news':
        return <News />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
          <Header onNavigate={setActiveTab} />

          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
            {renderTabContent()}
          </main>

          <Navbar activeTab={activeTab} onNavigate={setActiveTab} />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
