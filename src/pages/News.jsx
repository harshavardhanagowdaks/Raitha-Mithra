import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Newspaper, Youtube, ExternalLink, Calendar, Play } from 'lucide-react';

export default function News() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('news'); // 'news' or 'videos'
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsAndVideos();
  }, [language]);

  const fetchNewsAndVideos = async () => {
    setLoading(true);
    try {
      const [newsRes, ytRes] = await Promise.all([
        fetch(`/api/news?lang=${language}`),
        fetch(`/api/youtube`)
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setArticles(newsData.articles || []);
      }

      if (ytRes.ok) {
        const ytData = await ytRes.json();
        setVideos(ytData.videos || []);
      }
    } catch (err) {
      console.warn('[News Page] Fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-2xl">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('news.title')}</h2>
            <p className="text-xs text-slate-500">{t('news.subtitle')}</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('news')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'news'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t('news.tabNews')}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'videos'
                ? 'bg-red-600 text-white shadow-sm font-bold'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <Youtube className="w-4 h-4 text-amber-300" />
            <span>{t('news.tabVideos')}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AGRI NEWS */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Loading agricultural news...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={art.image}
                      alt={art.title_en}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {art.source}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-800 leading-snug">
                        {language === 'kn' ? art.title_kn : art.title_en}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {language === 'kn' ? art.summary_kn : art.summary_en}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-all"
                    >
                      <span>{t('news.readMore')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: YOUTUBE FARMING VIDEOS */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="relative group cursor-pointer">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 flex items-center justify-center transition-all">
                  <div className="p-3 bg-red-600 text-white rounded-full shadow-lg group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  {vid.channel}
                </span>
                <h3 className="font-bold text-xs text-slate-800 mt-2 leading-snug line-clamp-2">
                  {vid.title}
                </h3>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-all"
                >
                  <Youtube className="w-4 h-4" />
                  <span>{t('news.watchVideo')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
