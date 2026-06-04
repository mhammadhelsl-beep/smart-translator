'use client';

import { useState } from 'react';
import { Search, RefreshCw, Sparkles } from 'lucide-react';

export default function SearchBar({ onAnalyze, loading }: { onAnalyze: (text: string, forceRefresh?: boolean) => void; loading: boolean }) {
  const [text, setText] = useState('');
  const [forceRefresh, setForceRefresh] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !loading) onAnalyze(text.trim(), forceRefresh);
  };

  return (
    <div className="glass-card p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="أدخل كلمة أو جملة بالعربية أو الإنجليزية...&#10;مثال: run  |  يركض  |  I have been running"
            className="search-textarea w-full"
            rows={4}
            disabled={loading}
          />
          <div className="absolute left-4 bottom-4 text-gray-300 text-xs flex gap-1">
            <Sparkles className="w-3 h-3" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer bg-gray-50/80 px-3 py-1.5 rounded-full">
            <input
              type="checkbox"
              checked={forceRefresh}
              onChange={(e) => setForceRefresh(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>تجاهل الكاش وإعادة التحليل</span>
          </label>
          <button type="submit" disabled={loading || !text.trim()} className="btn-primary">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'جاري التحليل...' : 'تحليل'}
          </button>
        </div>
      </form>
    </div>
  );
}