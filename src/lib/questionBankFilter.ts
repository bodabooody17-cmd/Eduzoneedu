export function filterQuestions<T extends { subject: string; track?: string; [key: string]: any }>(
  questions: T[],
  studentTrack: string
): T[] {
  const track =
    studentTrack ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('EduZone_Track') || localStorage.getItem('userBranch') || ''
      : '');

  if (!track || track === 'all' || track === 'الكل') {
    return questions;
  }

  return questions.filter((q) => {
    const sub = (q.subject || '').trim();
    const subLower = sub.toLowerCase();

    // 1. شعبة مدارس اللغات: Physics, Chemistry, Biology, Math, Statics باللغة الإنجليزية + اللغة الإنجليزية
    if (track.includes('لغات') || track === 'languages' || track.toLowerCase().includes('lang')) {
      if (
        q.track === 'languages' ||
        sub.includes('(Languages)') ||
        subLower.includes('physics') ||
        subLower.includes('chemistry') ||
        subLower.includes('biology') ||
        subLower.includes('statics') ||
        subLower.includes('mathematics') ||
        subLower.includes('math')
      ) {
        return true;
      }
      if (sub === 'اللغة الإنجليزية' || subLower.includes('english')) {
        return true;
      }
      return false;
    }

    // لجميع الشعب الأخرى (غير اللغات): استبعاد أسئلة اللغات الإنجليزية المخصصة
    if (q.track === 'languages' || sub.includes('(Languages)')) {
      return false;
    }

    // 2. شعبة أدبي: تاريخ + جغرافيا + فلسفة ومنطق + علم نفس واجتماع + عربي + إنجليزي فقط
    if (track.includes('أدبي') || track === 'thanawya_arts') {
      const allowed = [
        'التاريخ',
        'الجغرافيا',
        'الفلسفة والمنطق',
        'علم النفس والاجتماع',
        'اللغة العربية',
        'اللغة الإنجليزية',
      ];
      return allowed.some((a) => sub.includes(a));
    }

    // 3. شعبة علمي علوم: فيزياء + كيمياء + أحياء + جيولوجيا + عربي + إنجليزي فقط
    if (track.includes('علمي علوم') || (track === 'thanawya_science' && !track.includes('رياضة'))) {
      const allowed = [
        'الفيزياء',
        'الكيمياء',
        'الأحياء',
        'الجيولوجيا',
        'اللغة العربية',
        'اللغة الإنجليزية',
      ];
      return allowed.some((a) => sub.includes(a));
    }

    // 4. شعبة علمي رياضة: فيزياء + كيمياء + رياضيات + استاتيكا + عربي + إنجليزي فقط
    if (track.includes('علمي رياضة') || track.includes('رياضة')) {
      const allowed = [
        'الفيزياء',
        'الكيمياء',
        'الرياضيات',
        'الاستاتيكا',
        'اللغة العربية',
        'اللغة الإنجليزية',
      ];
      return allowed.some((a) => sub.includes(a));
    }

    // 5. دبلوم تجارة: محاسبة مالية + إدارة أعمال + عربي + إنجليزي فقط
    if (track.includes('تجارة') || track === 'commerce_diploma') {
      const allowed = ['المحاسبة المالية', 'إدارة الأعمال', 'اللغة العربية', 'اللغة الإنجليزية'];
      return allowed.some((a) => sub.includes(a));
    }

    // 6. دبلوم صنايع / فني: رسم فني وصناعي + عربي + إنجليزي فقط
    if (
      track.includes('صنايع') ||
      track.includes('صناعي') ||
      track === 'technical_industrial' ||
      track === 'technical_secondary'
    ) {
      const allowed = ['الرسم الفني والصناعي', 'اللغة العربية', 'اللغة الإنجليزية'];
      return allowed.some((a) => sub.includes(a));
    }

    // 7. دورات ICDL وحاسب آلي
    if (track.includes('ICDL') || track === 'university_courses') {
      const allowed = ['مهارات الحاسب و ICDL', 'اللغة الإنجليزية'];
      return allowed.some((a) => sub.includes(a));
    }

    return true;
  });
}
