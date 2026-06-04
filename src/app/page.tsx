'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';
import ResultTabs from '@/components/ResultTabs';
import QuickCard from '@/components/QuickCard';
import { AnalysisResult } from '@/types/analysis';

export default function Home() {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyKeys, setHistoryKeys] = useState<string[]>([]);

  // تحميل مفاتيح التاريخ من localStorage عند بدء التشغيل
  useEffect(() => {
    const savedKeys = localStorage.getItem('analysis_history_keys');
    if (savedKeys) {
      try {
        const keys = JSON.parse(savedKeys);
        if (Array.isArray(keys)) setHistoryKeys(keys.slice(0, 20));
      } catch (e) {}
    }
  }, []);

  // حفظ مفتاح جديد في قائمة التاريخ
  const addToHistory = (key: string) => {
    const updated = [key, ...historyKeys.filter(k => k !== key)].slice(0, 20);
    setHistoryKeys(updated);
    localStorage.setItem('analysis_history_keys', JSON.stringify(updated));
  };

  const handleAnalyze = async (text: string, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, forceRefresh }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل التحليل');
      
      setCurrentResult(data);
      const cacheKey = text.trim().toLowerCase();
      
      // حفظ النتيجة في localStorage
      localStorage.setItem(`analysis_${cacheKey}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      
      // إضافة المفتاح إلى التاريخ
      addToHistory(cacheKey);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (key: string) => {
    const raw = localStorage.getItem(`analysis_${key}`);
    if (raw) {
      try {
        const { data } = JSON.parse(raw);
        setCurrentResult(data);
      } catch (e) {}
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ========== قسم العنوان الجديد (Hero) ========== */}
        <div className="text-center mb-14 relative">
          {/* خلفية زخرفية خفيفة خلف العنوان */}
          <div className="absolute inset-0 flex justify-center -z-0">
            <div className="w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          </div>
          
          <div className="relative z-10">
            {/* شارة */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium text-indigo-600">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              تحليل فوري بالذكاء الاصطناعي
            </div>
            
            {/* العنوان الرئيسي */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-800 bg-clip-text text-transparent">
               مترجم 
               ذكي
             </span>
            </h1>
            
            {/* وصف قصير */}
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
              حلل كلماتك وجملك بالعربية أو الإنجليزية.<br />
              ترجمة دقيقة، أمثلة واقعية، وتحليل نحوي شامل.
            </p>
            
            {/* علامات ثنائية اللغة */}
            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50/80 rounded-full px-3 py-1">
                <span>🇬🇧</span> English
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50/80 rounded-full px-3 py-1">
                <span>🇸🇦</span> العربية
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي (شريط جانبي + بحث + نتائج) */}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <Sidebar 
              historyKeys={historyKeys} 
              onLoadHistory={loadFromHistory} 
              currentResult={currentResult}
            />
          </aside>

          <div className="flex-1 space-y-6">
            <SearchBar onAnalyze={handleAnalyze} loading={loading} />
            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-xl shadow-sm">
                {error}
              </div>
            )}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            )}
            {currentResult && !loading && (
              <>
                <QuickCard result={currentResult} />
                <ResultTabs result={currentResult} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}