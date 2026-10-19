export function filterQuestions<T extends { subject: string; track?: string; [key: string]: any }>(
  questions: T[],
  studentTrack: string
): T[] {
  const track =
    studentTrack ||
    (typeof window !== 'undefined' ? localStorage.getItem('EduZone_Track') || localStorage.getItem('userBranch') || '' : '');

  if (!track || track === 'all' || track.includes('عام') || track === 'الكل') {
    return questions;
  }

  return questions.filter((q) => {
    const sub = (q.subject || '').toLowerCase().trim();

    // 1. شعبة أدبي: لغة عربية + لغة إنجليزية + تاريخ + جغرافيا + فلسفة ومنطق + علم نفس واجتماع
    if (track.includes('أدبي') || track === 'thanawya_arts') {
      const allowed = ['عربي', 'عربية', 'إنجليزي', 'انجليزي', 'إنجليزية', 'انجليزية', 'تاريخ', 'جغرافيا', 'فلسفة', 'منطق', 'علم نفس', 'اجتماع'];
      const matches = allowed.some((a) => sub.includes(a));
      if (!matches) return false;
      // استبعاد أي مادة علمية أو تجارية صريحة
      const forbidden = ['فيزياء', 'كيمياء', 'أحياء', 'احياء', 'جيولوجيا', 'رياضيات', 'استاتيكا', 'محاسبة', 'رسم فني', 'صناعي'];
      if (forbidden.some((f) => sub.includes(f))) return false;
      return true;
    }

    // 2. شعبة علمي علوم: لغة عربية + لغة إنجليزية + فيزياء + كيمياء + أحياء + جيولوجيا
    if (track.includes('علمي علوم') || (track === 'thanawya_science' && !track.includes('رياضة'))) {
      const allowed = ['عربي', 'عربية', 'إنجليزي', 'انجليزي', 'إنجليزية', 'انجليزية', 'فيزياء', 'كيمياء', 'أحياء', 'احياء', 'جيولوجيا'];
      const matches = allowed.some((a) => sub.includes(a));
      if (!matches) return false;
      // استبعاد المواد الأدبية والرياضية والتجارية
      const forbidden = ['تاريخ', 'جغرافيا', 'فلسفة', 'علم نفس', 'رياضيات', 'استاتيكا', 'محاسبة', 'رسم فني'];
      if (forbidden.some((f) => sub.includes(f))) return false;
      return true;
    }

    // 3. شعبة علمي رياضة: لغة عربية + لغة إنجليزية + فيزياء + كيمياء + رياضيات + استاتيكا
    if (track.includes('علمي رياضة') || track.includes('رياضة')) {
      const allowed = ['عربي', 'عربية', 'إنجليزي', 'انجليزي', 'إنجليزية', 'انجليزية', 'فيزياء', 'كيمياء', 'رياضيات', 'رياضة', 'استاتيكا'];
      const matches = allowed.some((a) => sub.includes(a));
      if (!matches) return false;
      // استبعاد الأحياء والجيولوجيا والمواد الأدبية
      const forbidden = ['أحياء', 'احياء', 'جيولوجيا', 'تاريخ', 'جغرافيا', 'فلسفة', 'علم نفس', 'محاسبة', 'رسم فني'];
      if (forbidden.some((f) => sub.includes(f))) return false;
      return true;
    }

    // 4. مدارس اللغات: English, Arabic, Physics, Chemistry, Biology, Math, Statics
    if (track.includes('لغات') || track === 'languages' || track.toLowerCase().includes('lang')) {
      const allowed = ['إنجليزي', 'انجليزي', 'عربي', 'فيزياء', 'كيمياء', 'أحياء', 'احياء', 'رياضيات', 'استاتيكا', 'math', 'physics', 'chemistry', 'biology', 'statics'];
      return allowed.some((a) => sub.includes(a));
    }

    // 5. دبلوم تجارة: محاسبة مالية + إدارة أعمال + لغة عربية + لغة إنجليزية
    if (track.includes('تجارة') || track === 'commerce_diploma') {
      const allowed = ['محاسبة', 'ادارة', 'إدارة', 'اقتصاد', 'عربي', 'إنجليزي', 'تجاري'];
      const matches = allowed.some((a) => sub.includes(a));
      if (!matches) return false;
      const forbidden = ['فيزياء', 'كيمياء', 'أحياء', 'جيولوجيا', 'تاريخ', 'جغرافيا', 'فلسفة', 'علم نفس', 'رسم فني'];
      return !forbidden.some((f) => sub.includes(f));
    }

    // 6. دبلوم صنايع / فني: رسم فني وصناعي + ميكانيكا + لغة عربية + لغة إنجليزية
    if (track.includes('صنايع') || track.includes('صناعي') || track === 'technical_industrial' || track === 'technical_secondary') {
      const allowed = ['رسم فني', 'صناعي', 'ميكانيكا', 'كهرباء', 'عربي', 'إنجليزي'];
      const matches = allowed.some((a) => sub.includes(a));
      if (!matches) return false;
      const forbidden = ['أحياء', 'جيولوجيا', 'تاريخ', 'جغرافيا', 'فلسفة', 'علم نفس', 'محاسبة'];
      return !forbidden.some((f) => sub.includes(f));
    }

    // 7. دورات ICDL وحاسب آلي
    if (track.includes('ICDL') || track === 'university_courses') {
      const allowed = ['icdl', 'حاسب', 'أوفيس', 'excel', 'word'];
      return allowed.some((a) => sub.includes(a));
    }

    return true;
  });
}
