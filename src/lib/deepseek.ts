import axios from 'axios';
import { AnalysisResult } from '@/types/analysis';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// البرومت الاحترافي لتحليل النصوص
function buildPrompt(userInput: string): string {
  return `أنت محلل لغوي خبير في اللغتين العربية والإنجليزية. قم بتحليل النص التالي: "${userInput}"

القاعدة الأساسية:
- إذا كان النص بالعربية، فقم أولاً بترجمته إلى الإنجليزية ترجمة دقيقة وطبيعية.
- إذا كان النص بالإنجليزية، فقم أولاً بترجمته إلى العربية ترجمة دقيقة وطبيعية.
- ثم قم بتحليل النص الأصلي والترجمة معًا، واجعل الترجمة جزءًا من الأمثلة والمرادفات والأخطاء الشائعة.

مخرجات JSON المطلوبة:
{
  "original_text": "${userInput}",
  "detected_language": "ar أو en",
  "translation_to_other_language": "الترجمة الدقيقة إلى اللغة الأخرى",
  "is_sentence": true/false,
  "overall_analysis": {
    "summary": "خلاصة قصيرة عن النص الأصلي والترجمة معًا (باللغة العربية)",
    "pos_tagging": "تحديد نوع الكلمة أو تركيب الجملة (بالعربية)",
    "root_word": "الجذر إن وجد"
  },
  "if_word": {
    "part_of_speech_details": {
      "primary_type": "فعل/اسم/صفة/ظرف (بالعربية)",
      "secondary_types": []
    },
    "morphology": {
      "root": "الجذر أو أصل الكلمة",
      "plural": "الجمع إن أمكن",
      "conjugations": {
        "past": "صيغة الماضي",
        "present": "المضارع",
        "future": "المستقبل",
        "imperative": "الأمر"
      }
    },
    "tense_analysis": {
      "most_common_tense": {
        "tense_name": "الزمن الأكثر شيوعًا",
        "example": "مثال من النص الأصلي أو الترجمة",
        "commonality_percent": 50
      },
      "all_tenses": []
    }
  },
  "if_sentence": {
    "syntactic_analysis": {
      "structure": "نوع الجملة (فعلية/اسمية/مركبة) بالعربية",
      "clauses": [],
      "dependency_relations": "العلاقات النحوية الأساسية"
    },
    "tense_of_sentence": "الزمن الرئيسي للجملة",
    "translation_of_sentence": "ترجمة الجملة كاملة"
  },
  "meanings_by_context": [
    {
      "context": "سياق الاستخدام (مثل: رسمي، عامي، طبي...)",
      "translation": "الترجمة المناسبة لذلك السياق (مع مقارنة بين اللغتين)",
      "example": "مثال من النص الأصلي أو من إنشائك",
      "source": "DeepSeek",
      "frequency": "شائع/نادر"
    }
  ],
  "real_examples": [
    {
      "example": "جملة إنجليزية (إذا كان الأصل عربيًا فضع الترجمة الإنجليزية هنا) أو العكس",
      "translation": "ترجمة المثال إلى اللغة الأخرى",
      "source": "DeepSeek",
      "is_formal": false
    }
  ],
  "common_mistakes": [
    {
      "wrong": "خطأ شائع متعلق بالنص الأصلي أو الترجمة",
      "correct": "الصواب",
      "explanation": "شرح الخطأ مع الإشارة إلى أصل الكلمة أو التركيب"
    }
  ],
  "synonyms_antonyms": {
    "synonyms": [
      {
        "word": "مرادف باللغة الأصلية أو المترجمة",
        "difference": "الفرق بينهما",
        "example": "مثال"
      }
    ],
    "antonyms": [
      {
        "word": "ضد",
        "example": "مثال"
      }
    ]
  },
  "collocations": [
    {
      "phrase": "متلازم لفظي (باللغة الأصلية أو المترجمة)",
      "translation": "ترجمته",
      "formality": "رسمي/عامي"
    }
  ],
  "usage_tips": {
    "formal": "نصيحة للاستخدام الرسمي (بالعربية)",
    "informal": "نصيحة للاستخدام العامي (بالعربية)",
    "register": "مستوى اللغة"
  },
  "cache_key": "${userInput.trim().toLowerCase().replace(/\\s+/g, '_')}"
}

تعليمات إضافية:
- تأكد من أن حقل "real_examples" يحتوي على جمل حقيقية أو واقعية وليست جافة.
- حقل "example" في كل مكان يجب أن يكون باللغة التي تناسب النص الأصلي، ولكن الترجمة موجودة بجانبه.
- إذا كان النص الأصلي عربيًا، اجعل الأمثلة الإنجليزية هي الترجمة، واعرض الترجمة العربية بجانبها.
- الأخطاء الشائعة يجب أن تراعي الفرق بين اللغتين (مثل أخطاء العرب في الإنجليزية أو العكس).
- لا تختلق أمثلة غير منطقية.
- أخرج JSON فقط، بدون أي نص إضافي.`
}

export async function analyzeWithDeepSeek(inputText: string): Promise<AnalysisResult> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
  }

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'أنت محلل لغوي خبير. قم دائمًا بإرجاع JSON فقط، بدون أي نص إضافي خارج JSON.',
          },
          {
            role: 'user',
            content: buildPrompt(inputText),
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content;
    
    // تنظيف الـ JSON من أي نصوص خارجية
    let jsonString = content.trim();
    // إزالة backticks إذا وجدت
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');
    
    const result: AnalysisResult = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to analyze text with DeepSeek');
  }
}