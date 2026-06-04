'use client';

import { AnalysisResult } from '@/types/analysis';
import { Copy, Download } from 'lucide-react';

export default function QuickCard({ result }: { result: AnalysisResult }) {
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    alert('تم نسخ التحليل كـ JSON');
  };
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${result.cache_key}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl shadow-md border border-indigo-100 p-5">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            {result.is_sentence ? '📄 جملة' : '🔤 كلمة'} • {result.detected_language === 'ar' ? 'عربية' : 'إنجليزية'}
          </div>
          <div className="text-2xl font-bold text-gray-800">{result.original_text}</div>
          <div className="text-xl text-indigo-600 mt-1">{result.translation_to_other_language}</div>
          <div className="text-sm text-gray-500 mt-2">{result.overall_analysis.summary}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={copyJSON} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition" title="نسخ JSON">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={downloadJSON} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition" title="تحميل JSON">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}