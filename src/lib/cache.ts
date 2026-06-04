import { AnalysisResult } from '@/types/analysis';

// استخدام localStorage في المتصفح (هذا الكود سيعمل على العميل فقط)
// في Next.js API routes، لا يوجد localStorage، لذا سنستخدم Map بسيط مؤقت
// وللعميل سنقدم دالة للتخزين المحلي

// خادم مؤقت بسيط (للـ API routes)
const serverCache = new Map<string, { data: AnalysisResult; timestamp: number }>();
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 يوم

// دالة لحفظ النتيجة في الكاش (للاستخدام في API route)
export function saveToServerCache(key: string, data: AnalysisResult): void {
  serverCache.set(key, { data, timestamp: Date.now() });
}

// دالة لاسترجاع من الكاش (للاستخدام في API route)
export function getFromServerCache(key: string): AnalysisResult | null {
  const cached = serverCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    serverCache.delete(key);
    return null;
  }
  return cached.data;
}

// دوال للاستخدام في المتصفح (Client-side)
export function saveToLocalCache(key: string, data: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  const cacheItem = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
}

export function getFromLocalCache(key: string): AnalysisResult | null {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(`cache_${key}`);
  if (!item) return null;
  try {
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

// توليد مفتاح كاش من النص
export function generateCacheKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, '_');
}