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
    // فلتر 1: حسب الشعبة والمادة
    if (!isAllowedForTrack(q.subject, track)) return false;

    // فلتر 2: لو السؤال نفسه متسجل بشعبة معينة
    if (q.track && !q.track.includes('عام')) {
      if (track.includes('علمي علوم')) {
        if (q.track.includes('أدبي') || q.track.includes('رياضة') || q.track.includes('تجارة') || q.track.includes('صنايع')) return false;
      } else if (track.includes('علمي رياضة')) {
        if (q.track.includes('أدبي') || q.track.includes('علوم') || q.track.includes('أحياء') || q.track.includes('جيولوجيا') || q.track.includes('تجارة') || q.track.includes('صنايع')) return false;
      } else if (track.includes('أدبي')) {
        if (q.track.includes('علمي') || q.track.includes('تجارة') || q.track.includes('صنايع')) return false;
      } else if (track.includes('تجارة')) {
        if (!q.track.includes('تجارة')) return false;
      } else if (track.includes('صنايع')) {
        if (!q.track.includes('صنايع')) return false;
      } else if (track.includes('ICDL')) {
        if (!q.track.includes('ICDL') && !q.track.includes('دورات')) return false;
      }
    }
    return true;
  });
}
