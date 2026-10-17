import { isAllowedForTrack } from './strictFilter';

export function filterQuestions<T extends { subject: string; track?: string; [key: string]: any }>(
  questions: T[],
  studentTrack: string
): T[] {
  const track =
    studentTrack ||
    (typeof window !== 'undefined' ? localStorage.getItem('EduZone_Track') || '' : '');

  if (!track) return questions;

  return questions.filter((q) => {
    // فلتر 1: التحقق العام من منع المواد المخالفة
    if (!isAllowedForTrack(q.subject, track)) return false;

    // فلتر 2: تطبيق الشعب المتخصصة بدقة 100%
    if (track.includes('أدبي')) {
      // طالب أدبي: 4 أزرار ومواد فقط (تاريخ، جغرافيا، فلسفة ومنطق، علم نفس واجتماع)
      const allowed = ['تاريخ', 'جغرافيا', 'فلسفة', 'منطق', 'علم نفس', 'اجتماع'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      if (q.track && (q.track.includes('علمي') || q.track.includes('تجارة') || q.track.includes('صنايع'))) return false;
      return true;
    }

    if (track.includes('علمي علوم')) {
      // طالب علمي علوم: 4 أزرار ومواد فقط (فيزياء، كيمياء، أحياء، جيولوجيا)
      const allowed = ['فيزياء', 'كيمياء', 'أحياء', 'جيولوجيا'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      if (q.track && (q.track.includes('أدبي') || q.track.includes('رياضة') || q.track.includes('تجارة') || q.track.includes('صنايع'))) return false;
      return true;
    }

    if (track.includes('علمي رياضة')) {
      // طالب علمي رياضة: 3 مواد فقط (فيزياء، كيمياء، رياضيات)
      const allowed = ['فيزياء', 'كيمياء', 'رياضيات', 'رياضة'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      if (q.track && (q.track.includes('أدبي') || q.track.includes('علوم') || q.track.includes('أحياء') || q.track.includes('جيولوجيا') || q.track.includes('تجارة') || q.track.includes('صنايع'))) return false;
      return true;
    }

    if (track.includes('تجارة')) {
      // دبلوم تجارة: محاسبة مالية وإدارة واقتصاد
      const allowed = ['محاسبة', 'ادارة', 'اقتصاد', 'احصاء', 'قانون', 'تجاري'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      return true;
    }

    if (track.includes('صنايع')) {
      // دبلوم صنايع: رسم فني وميكانيكا وفيزياء صنايع
      const allowed = ['رسم فني', 'ميكانيكا', 'كهرباء', 'صناعي', 'فيزياء صنايع', 'رياضة صنايع'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      return true;
    }

    if (track.includes('ICDL')) {
      // كورسات ICDL
      const allowed = ['icdl', 'حاسب', 'أوفيس', 'excel', 'word'];
      const sub = (q.subject || '').toLowerCase();
      if (!allowed.some((a) => sub.includes(a))) return false;
      return true;
    }

    // الحالات العامة الأخرى
    if (q.track && !q.track.includes('عام') && !track.includes(q.track)) {
      return false;
    }

    return true;
  });
}
