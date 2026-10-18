import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || 'b4eeea32-69c4-4ef9-a0d4-d6a8bbc8cde0';

import { db } from './src/db/userTrackingDb';
import { GoogleGenAI } from '@google/genai';

function getTopicForBatch(subject: string = '', b: number): string {
  const norm = (subject || '').trim();
  
  if (norm.includes('فيزياء') || norm.includes('Physics')) {
    const list = [
      '1-3: التيار الكهربي وقانون أوم وتوصيل المقاومات وقانون أوم للدائرة المغلقة',
      '4-6: قانونا كيرشوف وحساب فروق الجهد وتحليل المسارات المعقدة',
      '7-9: التأثير المغناطيسي للتيار الكهربي في السلك والملف الدائري والحلزوني',
      '10-12: القوة المغناطيسية وعزم الازدواج وأجهزة القياس (الجلفانومتر والأميتر والفولتميتر والأوميتر)',
      '13-15: الحث الكهرومغناطيسي، قانون فاراداي، قاعدة لنز، والحث الذاتي والمتبادل',
      '16-18: الدينامو ومولد التيار المتردد والمحول الكهربي والمحرك',
      '19-21: دوائر التيار المتردد (R-L-C) وحالة الرنين وتوصيل المكثفات',
      '22-24: فيزياء حديثة، إشعاع الجسم الأسود، الظاهرة الكهروضوئية، وأشعة الليزر ونصائح ليلة الامتحان'
    ];
    return list[b - 1] || 'الفيزياء الحديثة والكهرومغناطيسية';
  }

  if (norm.includes('كيمياء') || norm.includes('Chemistry')) {
    const list = [
      '1-3: العناصر الانتقالية والسلسلة الأولى واستخداماتها وحالات التأكسد والخواص المغناطيسية',
      '4-6: خامات الحديد واستخلاصه وتفاعلات وتمايز أكاسيد الحديد وسبائكها',
      '7-9: التحليل الكيميائي الوصفي النوعي والكشف عن الأنيونات والكاتيونات',
      '10-12: التحليل الكمي والحجمي وقوانين المعايرة والتطاير ومسائل الترسيب',
      '13-15: الاتزان الكيميائي والأيوني، قاعدة لوشاتيليه، والـ pH والـ pOH وحاصل الإذابة',
      '16-18: الكيمياء الكهربية والخلايا الجلفانية والمتسلسلة الكهروكيميائية وقوانين فاراداي',
      '19-21: الكيمياء العضوية: الهيدروكربونات الأليفاتية (ألكانات، ألكينات، ألكاينات) وقاعدة ماركونيكوف',
      '22-24: مشتقات الهيدروكربونات العضوية (الكحولات، الفينولات، الأحماض، الأسترات) وأهم التفاعلات'
    ];
    return list[b - 1] || 'الكيمياء العامة والعضوية';
  }

  if (norm.includes('أحياء') || norm.includes('احياء') || norm.includes('Biology')) {
    const list = [
      '1-3: الدعامة الفسيولوجية والتركيبية في النبات والحركة في الإنسان والعضلات',
      '4-6: التنسيق الهرموني والغدد الصماء ووظائف الهرمونات في الإنسان',
      '7-9: التكاثر اللاجنسي والجنسي ودورات الحياة والتكاثر في النباتات الزهرية',
      '10-12: الجهاز التناسلي في الإنسان، دورة الطمث، الإخصاب، وتكوين الجنين',
      '13-15: المناعة في النبات والمناعة التركيبية والبيوكيميائية والأعضاء الليمفاوية في الإنسان',
      '16-18: آليات الاستجابة المناعية الخلطية بالأجسام المضادة والمناعة الخلوية بالخلايا التائية',
      '19-21: الحمض النووي DNA وتركيبه وتضاعفه وإنزيمات إصلاح عيوب الـ DNA',
      '22-24: الحمض النووي RNA وتخليق البروتين والشفرة الوراثية والهندسة الوراثية'
    ];
    return list[b - 1] || 'الأحياء والجيولوجيا';
  }

  if (norm.includes('جيولوجيا') || norm.includes('Geology')) {
    const list = [
      '1-3: تركيب الأرض وأغلفة كوكب الأرض ومكوناتها وتاريخ كوكب الأرض',
      '4-6: الجيولوجيا التركيبية: الطيات والفوالق والفواصل وأسطح عدم التوافق الشاملة',
      '7-9: المعادن والأنظمة البلورية والخواص الفيزيائية والبصرية والتماسكية',
      '10-12: دورة الصخور والصخور النارية والرسوبية والمتحولة والبراكين',
      '13-15: الحركات الأرضية والانجراف القاري ونظرية تكتونية الألواح والزلازل',
      '16-18: التجوية والعمل الجيولوجي لعوامل النقل (الرياح، السيول، الأنهار، والبحار)',
      '19-21: مفاهيم البيئة والنظام البيئي البحري والنظام البيئي الصحراوي وسلاسل الغذاء',
      '22-24: استنزاف الموارد الطبيعية المتجددة وغير المتجددة وتلوث البيئة وطرق حمايتها'
    ];
    return list[b - 1] || 'الجيولوجيا وعلوم البيئة';
  }

  if (norm.includes('بحتة') || norm.includes('تفاضل') || norm.includes('تكامل') || norm.includes('جبر')) {
    const list = [
      '1-3: اشتقاق الدوال المثلثية والاشتقاق الضمني والبارامتري والمشتقات العليا',
      '4-6: تطبيقات التفاضل والمعدلات الزمنية المرتبطة ومسائل القيم العظمى والصغرى',
      '7-9: نهايات وتفاضل وتكامل الدوال الأسية واللوغاريتمية الطبيعية',
      '10-12: سلوك الدالة ورسم المنحنيات وفترات التحدب ونقاط الانقلاب',
      '13-15: طرق التكامل بالتجزيء وبالتعويض والمساحات المستوية وحجوم الأجسام الدورانية',
      '16-18: الجبر والهندسة الفراغية: مبدأ العد، التباديل، التوافيق، ونظرية ذات الحدين',
      '19-21: الأعداد المركبة بالصورة الجبرية والمثلثية ونظرية دي موافر والجذور التكعيبية للواحد',
      '22-24: المحددات والمصفوفات ومعادلة المستقيم والمستوى في الفراغ ثلاثي الأبعاد'
    ];
    return list[b - 1] || 'الرياضيات البحتة';
  }

  if (norm.includes('تطبيقية') || norm.includes('استاتيكا') || norm.includes('ديناميكا')) {
    const list = [
      '1-3: الاحتكاك على مستوى أفقي ومستوى مائل خشن وقوانين رد الفعل المحصل',
      '4-6: عزوم القوى في المستوى ثنائي الأبعاد وفي الفراغ ثلاثي الأبعاد',
      '7-9: القوى المتوازية المستوية ومحصلتها والاتزان العام للأجسام الجاسئة',
      '10-12: الازدواجات ومركز الثقل وطرق تحديد مراكز الثقل للأجسام المركبة والكتل السالبة',
      '13-15: تفاضل وتكامل الدوال المتجهة والسرعة والعجلة والحركة في خط مستقيم',
      '16-18: كمية الحركة وقوانين نيوتن الثلاثة للحركة وتطبيقاتها',
      '19-21: حركة المصاعد وحركة الأجسام على البكرات البسيطة والمستويات المائلة الملساء والخشنة',
      '22-24: الدفع والتصادم، الشغل، طاقة الحركة، طاقة الوضع، والقدرة ومبدأ ثبوت الطاقة'
    ];
    return list[b - 1] || 'الرياضيات التطبيقية';
  }

  if (norm.includes('تاريخ') || norm.includes('History')) {
    const list = [
      '1-3: الحملة الفرنسية على مصر والشام، مقاومة الشعب المصري، ونزول نابليون',
      '4-6: خروج الحملة الفرنسية، بروز الشخصية الوطنية، وتولية محمد علي حكم مصر',
      '7-9: سياسة محمد علي في بناء الدولة الحديثة وتطبيق نظام الاحتكار الاقتصادي',
      '10-12: سياسة مصر الخارجية في عهد محمد علي وخلفائه وسقوط نظام الاحتكار والأزمة المالية',
      '13-15: الثورة العرابية، الاحتلال البريطاني لمصر، والكفاح الوطني لمصطفى كامل ومحمد فريد',
      '16-18: ثورة 1919، تصريح 28 فبراير، معاهدة 1936، ومصر أثناء الحرب العالمية الثانية',
      '19-21: ثورة 23 يوليو 1952 وإنجازاتها السياسية والاقتصادية والقومية والدولية',
      '22-24: القضية الفلسطينية والصراع العربي الإسرائيلي وحرب أكتوبر المجيدة 1973 وثورات مصر المعاصرة'
    ];
    return list[b - 1] || 'التاريخ الحديث';
  }

  if (norm.includes('جغرافيا') || norm.includes('Geography')) {
    const list = [
      '1-3: مدخل لدراسة الجغرافيا السياسية، مفهوم الدولة، وأنواع الدول والأنظمة السياسية',
      '4-6: المقومات الطبيعية لقوة الدولة: الموقع والمساحة والتضاريس والمناخ والموارد',
      '7-9: المقومات البشرية لقوة الدولة: التركيب الديموغرافي والاقتصادي والقوة العسكرية والتكنولوجية',
      '10-12: النظام السياسي والانتخابي للدولة والحدود السياسية: مفهومها ووظائفها ونشأتها',
      '13-15: أنواع الحدود السياسية الطبيعية والهندسية والبشرية',
      '16-18: المشكلات السياسية والاقتصادية ومشاكل الأقليات والمياه والطاقة والنزاعات الدولية',
      '19-21: التكتلات الاقتصادية العالمية الكبرى (الاتحاد الأوروبي، الكوميسا، النفتا) والأحلاف العسكرية',
      '22-24: النظام العالمي الجديد وخصائصه وأثره على دول العالم النامي ونصائح الخرائط'
    ];
    return list[b - 1] || 'الجغرافيا السياسية';
  }

  if (norm.includes('فلسفة') || norm.includes('منطق')) {
    const list = [
      '1-3: الفلسفة وقضايا البيئة ومراحل علاقة الإنسان بالبيئة عبر العصور',
      '4-6: الفلسفة وأخلاقيات البيولوجيا والطب (البيوتيقا) ومشاكل زرع الأعضاء والاستنساخ',
      '7-9: الأخلاق المهنية والمسؤولية الاجتماعية للمؤسسات وأخلاقيات الوظيفة العامة',
      '10-12: التفلسف وعلاقته بالقيم (الحق، الخير، الجمال) وقيمة الحرية الإنسانية',
      '13-15: الاستدلال الاستقرائي وتطبيقه في العلوم الطبيعية والمنهج العلمي الاستقرائي',
      '16-18: الاستنباط والمنسق الرياضي والبديهيات والمسلمات والتعريفات الرياضية',
      '19-21: التكامل بين المنهج الاستقرائي والمنهج الاستنباطي (المنهج العلمي المعاصر)',
      '22-24: المنطق وتكنولوجيا الاتصال والذكاء الاصطناعي والمغالطات الصورية وغير الصورية'
    ];
    return list[b - 1] || 'الفلسفة والمنطق';
  }

  if (norm.includes('محاسبة') || norm.includes('تجارة') || norm.includes('ادارة اعمال')) {
    const list = [
      '1-3: نظرية القيد المزدوج ومعادلة المركز المالي وتحليل العمليات المالية',
      '4-6: دفتر اليومية العام وقيود الشراء والبيع والمردودات والخصومات التجارية والنقدية',
      '7-9: دفتر الأستاذ العام والترصيد وإعداد ميزان المراجعة بالأرصدة والمجاميع',
      '10-12: التسويات الجردية للأصول الثابتة وحساب قسط الإهلاك ومجمع الإهلاك',
      '13-15: التسويات الجردية للمصروفات والإيرادات والمقدمات والمستحقات والديون المشكوك فيها',
      '16-18: الحسابات الختامية: حساب المتاجرة، الأرباح والخسائر، وقائمة الدخل الحديثة',
      '19-21: الميزانية العمومية والتحليل المالي لنسب السيولة والربحية والمركز المالي',
      '22-24: مبادئ إدارة الأعمال والتسويق (4Ps) وقوانين الشركات والأعمال التجارية'
    ];
    return list[b - 1] || 'المحاسبة المالية والتجارة';
  }

  if (norm.includes('رسم فني') || norm.includes('ميكانيكا') || norm.includes('صنايع')) {
    const list = [
      '1-3: قواعد الرسم الهندسي واستنتاج المساقط الثلاثة (رأسي، أفقي، جانبي)',
      '4-6: القطاعات الهندسية الكاملة ونصف القطاع وأنواع التهشير بزاوية 45 درجة',
      '7-9: عناصر التوصيل والربط الميكانيكي (المسامير، الصواميل، الخوابير، والتيل)',
      '10-12: رموز ومخططات الدوائر الكهربائية والإلكترونية الصناعية',
      '13-15: دورات التبريد وتكييف الهواء الميكانيكية وأعطالها وطرق الصيانة',
      '16-18: المحركات الكهربائية الحثية ثلاثية الأوجه ودوائر التحكم الآلي الكلاسيكي',
      '19-21: تكنولوجيا الخامات والمعادن وخواص الشد والصلادة والمعالجات الحرارية',
      '22-24: السلامة والصحة المهنية والأمن الصناعي وحماية خطوط الإنتاج'
    ];
    return list[b - 1] || 'التعليم الفني والصناعي';
  }

  if (norm.includes('حاسب') || norm.includes('ICDL') || norm.includes('جامع')) {
    const list = [
      '1-3: أساسيات تكنولوجيا المعلومات وأنظمة التشغيل الحديثة وإدارة الملفات الرقمية',
      '4-6: معالج الكلمات Microsoft Word والتنسيقات الاحترافية للمذكرات والأبحاث',
      '7-9: الجداول والمخططات التوضيحية وتنسيق الهوامش والمراجع في Word',
      '10-12: الجداول الإلكترونية Microsoft Excel وتنسيق الخلايا والفرز والتصفية',
      '13-15: دوال Excel المتقدمة (SUM, IF, VLOOKUP, XLOOKUP, COUNTIF) والجداول المحورية',
      '16-18: العروض التقديمية التفاعلية Microsoft PowerPoint وتصميم الشرائح الذكية',
      '19-21: أمن المعلومات وحماية البيانات والنسخ الاحتياطي ومكافحة الفيروسات',
      '22-24: أدوات التعاون السحابي والبريد الإلكتروني والذكاء الاصطناعي في بيئة العمل'
    ];
    return list[b - 1] || 'الحاسب الآلي ودورات ICDL';
  }

  // Fallback: Arabic default
  const topics = [
    '1-3: المشتقات اسم الفاعل واسم المفعول وصيغ المبالغة وتطبيقات إعرابية',
    '4-6: المصادر كلها الميمي والصناعي والمرة والهيئة وأحكامها',
    '7-9: البلاغة التشبيه وأركانه وأنواعه وصور الجمال',
    '10-12: الاستعارة التصريحية والمكنية والكناية والمجاز المرسل',
    '13-15: المحسنات البديعية اللفظية والمعنوية والأساليب الإنشائية والخبرية',
    '16-18: النحو المبتدأ والخبر وكان وأخواتها وكاد وإن ولا النافية للجنس',
    '19-21: التوابع والمنصوبات والمجرورات والأساليب النحوية',
    '22-24: مراجعة شاملة وأسئلة امتحانية متوقعة وإعراب الثوابت الذهبية'
  ];
  return topics[b - 1] || 'مذكرة المراجعة والإنقاذ الذهبية';
}

// AI 24-Page Booklet Generator Endpoint (Gemini 3.8 Flash via @google/genai)
app.post('/api/ai/generate-batch', async (req: Request, res: Response) => {
  try {
    const { batch, subject, subjectTitle, customApiKey, customPrompt } = req.body || {};
    const batchNum = parseInt(batch, 10);
    if (!batchNum || batchNum < 1 || batchNum > 8) {
      return res.status(400).json({ success: false, error: 'batch must be between 1 and 8' });
    }

    const key = (customApiKey && typeof customApiKey === 'string' && customApiKey.trim()) || process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'يرجى إدخال مفتاح Gemini API Key في الحقل المخصص أو ضبطه في متغيرات البيئة.',
      });
    }

    const startPage = (batchNum - 1) * 3 + 1;
    const endPage = batchNum * 3;
    const effectiveSubject = subject || subjectTitle || 'اللغة العربية';
    const topic = getTopicForBatch(effectiveSubject, batchNum);
    const bookletName = subjectTitle || `مذكرة ${effectiveSubject} الذهبية`;

    const prompt =
      customPrompt ||
      `اكتب صفحات ${startPage} الى ${endPage} فقط من ${bookletName} - ثانوية عامة / شهادات معتمدة 2026/2027
كل صفحة 500 كلمة كاملة بالتفصيل مع الشرح والقوانين والأمثلة ونصائح ليلة الامتحان.
التزم بهذا الشكل بالحرف:
[بداية صفحة ${startPage}] محتوى صفحة ${startPage} 500 كلمة [نهاية صفحة ${startPage}]
[بداية صفحة ${startPage + 1}] محتوى صفحة ${startPage + 1} 500 كلمة [نهاية صفحة ${startPage + 1}]
[بداية صفحة ${endPage}] محتوى صفحة ${endPage} 500 كلمة [نهاية صفحة ${endPage}]
الموضوع: ${topic}`;

    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 8000,
        temperature: 0.5,
      },
    });

    const rawText = response.text || '';
    const regex = /\[بداية صفحة \d+\]([\s\S]*?)\[نهاية صفحة \d+\]/g;
    let m;
    const pages: { pageNumber: number; content: string }[] = [];
    let pNum = startPage;
    while ((m = regex.exec(rawText)) !== null) {
      pages.push({
        pageNumber: pNum,
        content: m[1].trim(),
      });
      pNum++;
    }

    if (pages.length === 0 && rawText.trim()) {
      pages.push({
        pageNumber: startPage,
        content: rawText.trim(),
      });
    }

    return res.status(200).json({
      success: true,
      batch: batchNum,
      startPage,
      endPage,
      pages,
      rawText,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/generate-batch:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'فشل توليد محتوى الدفعة بالذكاء الاصطناعي',
    });
  }
});

// OneSignal Push Notification REST API endpoint
app.post('/api/send-notification', async (req: Request, res: Response) => {
  try {
    const { title, message, actionUrl } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required',
      });
    }

    // Always store the announcement in database so it appears in /notifications
    const savedNotification = await db.notification.create({
      data: {
        userId: 'all',
        title,
        message,
        actionUrl: actionUrl || undefined,
        type: 'update',
      },
    });

    const payload: Record<string, any> = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: {
        en: title,
        ar: title,
      },
      contents: {
        en: message,
        ar: message,
      },
    };

    if (actionUrl && typeof actionUrl === 'string' && actionUrl.trim()) {
      payload.url = actionUrl.trim();
    }

    // Retrieve OneSignal App REST API key from environment
    const apiKey = (process.env.ONESIGNAL_REST_API_KEY || process.env.ONESIGNAL_API_KEY || '').trim();
    if (!apiKey) {
      // Still return 200 since notification was saved in database
      return res.status(200).json({
        success: true,
        notification: savedNotification,
        message: 'تم حفظ الإشعار في المنصة بنجاح وسيظهر لجميع الطلاب (تنبيه: مفتاح OneSignal غير مضبوط للإرسال الخارجي)',
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Key ${apiKey}`,
    };

    console.log(`[OneSignal] Dispatching real notification to app_id: ${ONESIGNAL_APP_ID}, included_segments: All`);

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.warn(`[OneSignal] Dispatch returned status ${response.status}:`, data);
      return res.status(200).json({
        success: true,
        notification: savedNotification,
        warning: data?.errors || `OneSignal error (${response.status})`,
        onesignal: data,
        message: 'تم حفظ الإشعار في المنصة بنجاح وسيظهر للطلاب في قائمة الإشعارات',
      });
    }

    console.log('[OneSignal] Notification successfully sent for real:', data);

    return res.status(200).json({
      success: true,
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      notification_id: data?.id,
      notification: savedNotification,
      onesignal: data,
      message: 'تم إرسال الإشعار بنجاح وحفظه في المنصة لجميع الطلاب!',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error while processing notification',
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
    });
  }
});

// Notifications Database Endpoints
app.get('/api/notifications', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'all';
    const notifications = await db.notification.findMany({
      where: userId !== 'all' ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch notifications',
    });
  }
});

app.post('/api/notifications', async (req: Request, res: Response) => {
  try {
    const { title, message, userId = 'all', actionUrl, type = 'update' } = req.body || {};

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required',
      });
    }

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        actionUrl,
        type,
      },
    });

    return res.status(201).json({
      success: true,
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create notification',
    });
  }
});

app.all('/api/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.status(200).json({
      success: true,
      notification: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to update notification',
    });
  }
});

app.post('/api/notifications/read-all', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body || {};
    const result = await db.notification.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      count: result.count,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to mark all as read',
    });
  }
});

// Real Student Tracking & Admin APIs
app.get('/api/admin/users', async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      include: { enrollments: true },
    });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch registered students',
    });
  }
});

app.get('/api/admin/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: { id },
      include: { enrollments: true, loginLogs: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'الطالب غير موجود' });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: id },
    });

    const loginLogs = await db.loginLog.findMany({
      where: { userId: id },
    });

    // Fallback log if empty as requested: "لو مش موجود اعمل console.log لوقت الدخول"
    if (!loginLogs || loginLogs.length === 0) {
      console.log(`[StudentTracking] User ${id} login time fallback:`, new Date().toISOString());
    }

    return res.status(200).json({
      success: true,
      user,
      enrollments,
      loginLogs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch student details',
    });
  }
});

// Real auth tracking: login and register logging
app.post(['/api/auth/login', '/api/auth/register', '/api/auth/log'], async (req: Request, res: Response) => {
  try {
    const { id, name, phone, email, stage, role, avatarUrl } = req.body || {};

    if (!name && !phone) {
      return res.status(400).json({ success: false, error: 'User details required' });
    }

    const user = await db.user.create({
      data: {
        id,
        name: name || 'طالب جديد',
        phone,
        email,
        stage,
        role: role || 'student',
        avatarUrl,
        lastSeen: new Date(),
      },
    });

    // Real tracking: await db.loginLog.create({ data: { userId: user.id, timestamp: new Date() } })
    const loginLog = await db.loginLog.create({
      data: {
        userId: user.id,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      user,
      loginLog,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to log user login',
    });
  }
});

// Real enrollment API
app.post('/api/enroll', async (req: Request, res: Response) => {
  try {
    const { userId, courseId, courseName, track } = req.body || {};
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, error: 'userId and courseId are required' });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        courseName,
        track,
      },
    });

    return res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to enroll in course',
    });
  }
});

// Direct APK attachment download
app.get(['/EduZone.apk', '/eduzone.apk'], (_req: Request, res: Response) => {
  const apkPath = path.resolve(__dirname, 'public/EduZone.apk');
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="EduZone.apk"');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    return fs.createReadStream(apkPath).pipe(res);
  }
  res.status(404).send('APK file not found');
});

// Direct Service Worker script serving with strict JavaScript MIME type
app.get(
  ['/sw.js', '/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'],
  (req: Request, res: Response) => {
    const fileName = req.path.replace('/', '');
    const possiblePaths = [
      path.resolve(__dirname, 'public', fileName),
      path.resolve(__dirname, 'dist', fileName),
    ];
    for (const swPath of possiblePaths) {
      if (fs.existsSync(swPath)) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Service-Worker-Allowed', '/');
        return fs.createReadStream(swPath).pipe(res);
      }
    }
    res.status(404).send('Service worker script not found');
  }
);

// Configure Vite in development or static in production
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
