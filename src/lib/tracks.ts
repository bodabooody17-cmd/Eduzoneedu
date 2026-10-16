export const TRACKS_CONFIG: any = {
  "ثانوية عامة (علمي علوم)": {
    keywords: ["علمي علوم", "علمي"],
    subjects: ["فيزياء", "كيمياء", "أحياء", "جيولوجيا", "عربي", "لغة عربية", "انجليزي", "فرنساوي", "لغة ثانية"],
    sections: ["الثانوية العامة (علمي وأدبي)", "ثانوية عامة"]
  },
  "ثانوية عامة (علمي رياضة)": {
    keywords: ["علمي رياضة", "رياضة"],
    subjects: ["فيزياء", "كيمياء", "رياضة بحتة", "رياضة تطبيقية", "استاتيكا", "ديناميكا", "تفاضل", "تكامل", "جبر", "عربي", "انجليزي"],
    sections: ["الثانوية العامة (علمي وأدبي)", "ثانوية عامة"]
  },
  "ثانوية عامة (شعبة أدبي)": {
    keywords: ["أدبي", "ادبي"],
    subjects: ["تاريخ", "جغرافيا", "فلسفة", "منطق", "علم نفس", "علم اجتماع", "عربي", "انجليزي", "فرنساوي"],
    sections: ["الثانوية العامة (علمي وأدبي)", "ثانوية عامة"]
  },
  "دبلوم تجارة (3 و 5 سنوات)": {
    keywords: ["تجارة", "دبلوم تجارة"],
    subjects: ["محاسبة", "ادارة اعمال", "اقتصاد", "احصاء", "قانون تجاري", "سكرتارية", "حاسب آلي", "تسويق"],
    sections: ["دبلومات فنية"]
  },
  "دبلوم صنايع وتكنولوجيا": {
    keywords: ["صنايع", "صناعي"],
    subjects: ["رسم فني", "ميكانيكا", "كهرباء", "الكترونيات", "تبريد وتكييف", "حاسب", "أمن صناعي", "تكنولوجيا"],
    sections: ["دبلومات فنية"]
  },
  "ثانوية عامة لغات (Languages)": {
    keywords: ["لغات", "Languages"],
    subjects: ["Physics", "Chemistry", "Biology", "Math", "English", "French", "Geology"],
    sections: ["الثانوية العامة", "لغات"]
  },
  "دورات جامعية و ICDL": {
    keywords: ["ICDL", "جامعية", "دورات"],
    subjects: ["ICDL", "Word", "Excel", "PowerPoint", "برمجة", "انجليزي", "دورات"],
    sections: ["دورات", "ICDL"]
  }
};

// دالة الفلترة الأساسية
export function getMyTrackData() {
  if (typeof window === 'undefined') return null;
  const trackName = localStorage.getItem('EduZone_Track');
  if (!trackName) return null;
  // دور على أقرب ماتش
  for (const key in TRACKS_CONFIG) {
    if (trackName.includes(key) || key.includes(trackName)) {
      return { name: key, ...TRACKS_CONFIG[key] };
    }
  }
  // لو اختار علمي علوم بالظبط
  return TRACKS_CONFIG[trackName] ? { name: trackName, ...TRACKS_CONFIG[trackName] } : null;
}
