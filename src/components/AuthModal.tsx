import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Camera,
  Trash2,
  KeyRound,
  Lock,
  Check,
  ChevronDown,
} from 'lucide-react';
import { awardPoints } from '../utils/gamification';
import {
  processAndCropAvatar,
  saveTemporaryAvatar,
  getTemporaryAvatar,
  clearTemporaryAvatar,
  uploadAvatarToFirebaseStorage,
} from '../utils/avatarProcessor';

export type UserRole = 'student' | 'teacher' | 'supervisor';

export interface StudentUser {
  name: string;
  contact: string; // Egyptian Phone Number (11 digits)
  stage: string;
  theme: 'dark' | 'light';
  loginDate: string;
  role?: UserRole;
  avatarUrl?: string;
  subjectSpecialty?: string;
  supervisorCode?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: StudentUser) => void;
  intendedActionLabel?: string;
  currentTheme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  initialRole?: UserRole;
}

// Strictly Egyptian mobile numbers: 11 digits starting with 010, 011, 012, 015
const EGYPT_PHONE_REGEX = /^01[0-2,5]{1}[0-9]{8}$/;

export const STUDENT_TRACKS = [
  {
    id: 'ثانوية عامة (علمي علوم)',
    title: '🔬 ثانوية عامة (علمي علوم)',
    desc: 'فيزياء • كيمياء • أحياء • جيولوجيا • عربي • لغات',
    badge: 'علمي علوم',
    icon: '🔬',
  },
  {
    id: 'ثانوية عامة (علمي رياضة)',
    title: '📐 ثانوية عامة (علمي رياضة)',
    desc: 'فيزياء • كيمياء • رياضة بحتة • استاتيكا وديناميكا • عربي',
    badge: 'علمي رياضة',
    icon: '📐',
  },
  {
    id: 'ثانوية عامة (شعبة أدبي)',
    title: '📚 ثانوية عامة (شعبة أدبي)',
    desc: 'تاريخ • جغرافيا • فلسفة ومنطق • علم نفس • عربي • لغات',
    badge: 'أدبي',
    icon: '📚',
  },
  {
    id: 'دبلوم تجارة (3 و 5 سنوات)',
    title: '💼 دبلوم تجارة (3 و 5 سنوات)',
    desc: 'محاسبة مالية • إدارة أعمال • اقتصاد • إحصاء • قانون تجاري',
    badge: 'تجارة',
    icon: '💼',
  },
  {
    id: 'دبلوم صنايع وتكنولوجيا',
    title: '⚙️ دبلوم صنايع وتكنولوجيا',
    desc: 'رسم فني صناعي • ميكانيكا • كهرباء • تبريد وتكييف',
    badge: 'صنايع',
    icon: '⚙️',
  },
  {
    id: 'ثانوية عامة لغات (Languages)',
    title: '🌐 ثانوية عامة لغات (Languages)',
    desc: 'Physics • Chemistry • Biology • Pure & Applied Math',
    badge: 'Languages',
    icon: '🌐',
  },
  {
    id: 'دورات جامعية و ICDL',
    title: '💻 دورات جامعية و ICDL',
    desc: 'Microsoft Office • دوال إكسيل • إعداد أبحاث • برمجة',
    badge: 'جامعية',
    icon: '💻',
  },
];

export const TEACHER_SPECIALTIES = [
  { id: 'الفيزياء (علمي)', title: '⚡ الفيزياء (علمي)', desc: 'منهج الفيزياء الحديثة والكهرومغناطيسية', icon: '⚡' },
  { id: 'الكيمياء (علمي)', title: '🧪 الكيمياء (علمي)', desc: 'الكيمياء الكهربية والعضوية والتحليلية', icon: '🧪' },
  { id: 'الأحياء والجيولوجيا', title: '🧬 الأحياء والجيولوجيا', desc: 'المناعة والوراثة الجزيئية وعلوم الأرض', icon: '🧬' },
  { id: 'اللغة الإنجليزية (General & Advanced English)', title: '🇬🇧 اللغة الإنجليزية', desc: 'General & Advanced Grammar, Vocab & Literature', icon: '🇬🇧' },
  { id: 'اللغة العربية', title: '📖 اللغة العربية', desc: 'النحو والبلاغة والنصوص والأدب العربي', icon: '📖' },
  { id: 'الرياضيات البحتة والتطبيقية', title: '📐 الرياضيات البحتة والتطبيقية', desc: 'تفاضل وتكامل واستاتيكا وديناميكا وجبر وهندسة', icon: '📐' },
  { id: 'المحاسبة المالية للدبلومات', title: '💼 المحاسبة المالية للدبلومات', desc: 'المحاسبة المالية والضرائب وإدارة الأعمال', icon: '💼' },
  { id: 'الرسم الفني الصناعي', title: '⚙️ الرسم الفني الصناعي', desc: 'الرسم الهندسي والعمليات التكنولوجية', icon: '⚙️' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  intendedActionLabel = 'تسجيل الدخول للاستفادة من كافة مميزات المنصة',
  currentTheme = 'dark',
  initialRole = 'student',
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [contact, setContact] = useState(''); // Phone number
  const [stage, setStage] = useState('ثانوية عامة (علمي علوم)');
  const [subjectSpecialty, setSubjectSpecialty] = useState('الفيزياء (علمي)');
  const [supervisorCode, setSupervisorCode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>(() => getTemporaryAvatar() || '');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSelectingStage, setIsSelectingStage] = useState(false);
  const [isSelectingSubject, setIsSelectingSubject] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setRole(initialRole);
      // Restore pending avatar from localStorage if available
      const cached = getTemporaryAvatar();
      if (cached && !avatarUrl) {
        setAvatarUrl(cached);
      }
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  // Enforce digits only and strictly max 11 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // strip non-numeric
    if (rawVal.length <= 11) {
      setContact(rawVal);
      if (error) setError('');
    }
  };

  // Image Upload, Auto-Resize (> 2MB), 300x300 Circular Crop, Base64 & LocalStorage
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP).');
      return;
    }

    setIsProcessingAvatar(true);
    setError('');

    try {
      const isLarge = file.size > 2 * 1024 * 1024;
      if (isLarge) {
        setAvatarStatus('الصورة أكبر من 2 ميجا — جاري الضغط والتصغير التلقائي...');
      } else {
        setAvatarStatus('جاري القص الدائري وضبط الأبعاد لـ 300×300 px...');
      }

      // 1- Compress to 300x300 px & 2- Circular Crop & 5- Auto-resize if > 2MB
      const processed = await processAndCropAvatar(file, 300);

      // 3- Convert to base64 and save in localStorage temporarily for instant preview
      saveTemporaryAvatar(processed.base64);
      setAvatarUrl(processed.base64);
      setAvatarStatus(
        isLarge
          ? `تم تصغير الصورة من ${processed.originalSizeMB} MB وقصها دائرياً (300×300 px)`
          : 'تم القص الدائري بنجاح (300×300 px)'
      );
    } catch (err: any) {
      console.error('Avatar processing error:', err);
      setError(err?.message || 'تعذر معالجة الصورة، يرجى اختيار صورة أخرى.');
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarStatus('');
    clearTemporaryAvatar();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Direct Submission: Validate, Upload to Firebase Storage avatars/ folder, and Login
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('يرجى إدخال الاسم بالكامل.');
      return;
    }

    // Phone Validation: Strict Egyptian mobile regex ^01[0-2,5]{1}[0-9]{8}$
    const cleanPhone = contact.trim();
    if (!cleanPhone || cleanPhone.length !== 11 || !EGYPT_PHONE_REGEX.test(cleanPhone)) {
      setError('رقم الهاتف غير صحيح. يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.');
      return;
    }

    // Supervisor secret code validation
    if (role === 'supervisor') {
      if (supervisorCode.trim() !== '1192004') {
        setError('كود الإشراف السري غير صحيح. يرجى إدخال الكود المخصص للمشرفين.');
        return;
      }
    }

    setIsSubmitting(true);

    // 4- Upload to Firebase Storage in avatars/ folder with student name
    let finalAvatarUrl = avatarUrl;
    if (avatarUrl) {
      try {
        const uploadRes = await uploadAvatarToFirebaseStorage(name.trim(), avatarUrl);
        if (uploadRes && uploadRes.url) {
          finalAvatarUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Firebase Storage upload notification:', uploadErr);
      }
    }

    // Success! Create User Object directly
    const newUser: StudentUser = {
      name: name.trim(),
      contact: cleanPhone,
      stage:
        role === 'teacher'
          ? `معلم المادة (${subjectSpecialty})`
          : role === 'supervisor'
          ? 'مشرف عام منصة EduZone'
          : stage,
      theme: 'dark',
      loginDate: new Date().toLocaleDateString('ar-EG'),
      role,
      avatarUrl: finalAvatarUrl || undefined,
      subjectSpecialty: role === 'teacher' ? subjectSpecialty : undefined,
      supervisorCode: role === 'supervisor' ? supervisorCode.trim() : undefined,
    };

    try {
      localStorage.setItem('eduzone_user', JSON.stringify(newUser));
      localStorage.setItem('eduzone_theme', 'dark');
      if (role === 'student') {
        localStorage.setItem('EduZone_Track', stage);
        localStorage.setItem('userBranch', stage);
        window.dispatchEvent(new Event('eduzone_track_changed'));
      }
      // Award login bonus points
      awardPoints(50, 'تسجيل دخول ناجح برقم الهاتف', 'login');

      // Real tracking: record login log in backend (await db.loginLog.create)
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cleanPhone,
          name: name.trim(),
          phone: cleanPhone,
          stage: newUser.stage,
          role,
          avatarUrl: finalAvatarUrl,
        }),
      }).catch((e) => console.log('Auth login log fallback:', e));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
    setError('');
    onSuccess(newUser);
  };

  const isSupervisorCodeValid = supervisorCode.trim() === '1192004';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn text-right">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 bg-slate-900 text-white overflow-hidden flex flex-col transition-colors duration-200">
        {/* Header - Sleek Dark Theme */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
                role === 'supervisor'
                  ? 'bg-amber-600'
                  : role === 'teacher'
                  ? 'bg-emerald-600'
                  : 'bg-indigo-600'
              }`}
            >
              {role === 'supervisor' ? (
                <ShieldCheck className="w-5 h-5 text-amber-200" />
              ) : role === 'teacher' ? (
                <BookOpen className="w-5 h-5 text-emerald-200" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-1.5">
                <span>
                  {role === 'supervisor'
                    ? 'تسجيل المشرف العام'
                    : role === 'teacher'
                    ? 'تسجيل دخول المعلم'
                    : 'تسجيل دخول الطالب'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-amber-300 font-mono">
                  EduZone
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {role === 'supervisor'
                  ? 'لوحة الإشراف والبث المباشر للإشعارات'
                  : intendedActionLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5">اختر صفة الحساب:</div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {/* Student */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setError('');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    role === 'student'
                      ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>طالب</span>
                </button>
                {/* Teacher */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setError('');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>معلم</span>
                </button>
                {/* Supervisor */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('supervisor');
                    setError('');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    role === 'supervisor'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm ring-1 ring-amber-400 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>مشرف (إدارة)</span>
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleSubmitLogin}
              className="p-4 sm:p-5 space-y-3.5 overflow-y-auto max-h-[75vh]"
            >
              {error && (
                <div className="p-2.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-400 font-bold flex items-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Supervisor Secret Code Notice & Input */}
              {role === 'supervisor' && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>كود الإشراف السري (إلزامي):</span>
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                      خاص بالإدارة
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={supervisorCode}
                      onChange={(e) => setSupervisorCode(e.target.value)}
                      placeholder="أدخل كود الإشراف السري"
                      className={`w-full pr-9 pl-3 py-2 border rounded-xl text-xs font-mono font-bold text-left focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors ${
                        isSupervisorCodeValid
                          ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                          : 'bg-slate-950 border-amber-500/50 text-white placeholder:text-slate-500'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-amber-400 absolute right-3 top-2.5" />
                  </div>
                  {isSupervisorCodeValid ? (
                    <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>كود الإشراف صحيح ومعتمد.</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      هذا القسم مخصص لإدارة المنصة والمشرفين المعتمدين فقط
                    </p>
                  )}
                </div>
              )}

              {/* Avatar Upload Section - Purple Circle & 300x300 Circular Crop */}
              <div className="p-3.5 rounded-2xl border border-purple-900/60 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex items-center gap-3.5 shadow-inner">
                {/* Radiant Purple Circle Preview (300x300 circle) */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-purple-500 ring-4 ring-purple-500/25 shadow-lg shadow-purple-950/70 bg-purple-950/80 flex items-center justify-center overflow-hidden aspect-square transition-all duration-300">
                    {isProcessingAvatar ? (
                      <div className="flex flex-col items-center justify-center text-purple-300 p-1">
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-1" />
                        <span className="text-[9px] font-bold">معالجة...</span>
                      </div>
                    ) : avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="معاينة الصورة الدائرية"
                        className="w-full h-full object-cover rounded-full aspect-square block transition-transform duration-200 hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-purple-300/80">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  {avatarUrl && !isProcessingAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      title="حذف الصورة"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 z-10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Avatar Controls & Badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>الصورة الشخصية</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                        300×300 px
                      </span>
                    </span>
                    {avatarUrl && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>معاينة جاهزة</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[10.5px] text-slate-300 mb-1.5 leading-relaxed">
                    قص دائري تلقائي فائق الوضوح في الدائرة البنفسجية وتظهر في حسابك والشهادات.
                  </p>

                  {avatarStatus && (
                    <div className="text-[10px] text-purple-200 font-medium mb-2 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/50">
                      {avatarStatus}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="avatar-upload-input"
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="avatar-upload-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{avatarUrl ? 'تغيير الصورة' : 'رفع صورة'}</span>
                    </label>
                    {avatarUrl && (
                      <span className="text-[10px] text-purple-300">
                        تظهر بوضوح في الدائرة البنفسجية
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-200">
                  {role === 'supervisor'
                    ? 'اسم المشرف بالكامل:'
                    : role === 'teacher'
                    ? 'اسم المعلم ثلاثي:'
                    : 'اسم الطالب ثلاثي:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      role === 'supervisor'
                        ? 'م. عبد الله (المشرف العام)'
                        : role === 'teacher'
                        ? 'أ/ أحمد محمود'
                        : 'مثال: محمد أحمد علي'
                    }
                    className="w-full pr-9 pl-3 py-2.5 border rounded-xl text-xs font-semibold bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* 2. Egyptian Phone Number with Strong Validation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-200">
                    رقم الهاتف المصري (11 رقم):
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {contact.length}/11 رقم
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={11}
                    value={contact}
                    onChange={handlePhoneChange}
                    placeholder="010XXXXXXXX أو 011 / 012 / 015"
                    className={`w-full pr-9 pl-3 py-2.5 border rounded-xl text-xs font-mono font-bold tracking-wider text-left focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      contact.length === 11 && EGYPT_PHONE_REGEX.test(contact)
                        ? 'border-emerald-500 bg-slate-950 text-emerald-400'
                        : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-500'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً بالضبط.</span>
                </p>
              </div>

              {/* 3. Stage Selector for Students (Custom Dark Modern Dialog - No native OS select) */}
              {role === 'student' && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-200">
                    المرحلة الدراسية / الشعبة:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSelectingStage(true)}
                    className="w-full pr-3.5 pl-3 py-2.5 border rounded-xl text-right bg-slate-950 border-slate-700 hover:border-yellow-400 text-slate-100 transition-all cursor-pointer flex items-center justify-between group shadow-sm focus:outline-hidden focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 flex items-center justify-center shrink-0 font-bold text-sm shadow-inner">
                        {STUDENT_TRACKS.find((t) => t.id === stage)?.icon || '🎓'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-yellow-300 transition-colors truncate">
                          {stage}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {STUDENT_TRACKS.find((t) => t.id === stage)?.desc || 'اضغط هنا لاختيار وتغيير شعبتك'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-lg border border-yellow-400/30 shrink-0 mr-2 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-all">
                      <span>تغيير</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              )}

              {/* 3. Specialty Selector for Teachers (Custom Dark Modern Dialog) */}
              {role === 'teacher' && (
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-200">
                    التخصص الدراسي والمادة:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSelectingSubject(true)}
                    className="w-full pr-3.5 pl-3 py-2.5 border rounded-xl text-right bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-100 transition-all cursor-pointer flex items-center justify-between group shadow-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 font-bold text-sm shadow-inner">
                        {TEACHER_SPECIALTIES.find((s) => s.id === subjectSpecialty)?.icon || '📚'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {subjectSpecialty}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {TEACHER_SPECIALTIES.find((s) => s.id === subjectSpecialty)?.desc || 'اضغط هنا لاختيار تخصصك'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 shrink-0 mr-2 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <span>تغيير</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              )}

              {/* Submit Button to Login directly without OTP */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    role === 'supervisor'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : role === 'teacher'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تسجيل الدخول والبدء مباشرة</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 pt-0.5">
                دخول فوري مباشر برقم الهاتف بدون الحاجة لكود تحقق | +50 XP هدية فورية
              </p>

              <div className="pt-2 border-t border-slate-800/80 text-center">
                <p className="text-[10px] text-emerald-400/90 font-medium">
                  📱 معلومة: يمكنك استخدام المنصة بدون المتصفح عن طريق تنزيلها.
                </p>
              </div>
            </form>

            {/* Custom Dark Modern Stage Picker Modal (Styled just like ChangeTrackModal) */}
            {isSelectingStage && (
              <div
                className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-white font-sans text-right animate-fadeIn select-none"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsSelectingStage(false);
                }}
              >
                <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                  {/* Header */}
                  <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-lg">
                        🎓
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white">
                          اختيار الشعبة الدراسية
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          اختار شعبتك عشان نفلترلك المذكرات والأسئلة بدقة
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSelectingStage(false)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tracks List */}
                  <div className="p-4 overflow-y-auto space-y-2.5">
                    {STUDENT_TRACKS.map((t) => {
                      const isSelected = stage === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setStage(t.id);
                            setIsSelectingStage(false);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-md ring-1 ring-yellow-400/40'
                              : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{t.title}</span>
                              {isSelected && (
                                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                                  الشعبة المختارة
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 line-clamp-1">
                              {t.desc}
                            </div>
                          </div>

                          <div className="shrink-0 mr-2">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Note */}
                  <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400">
                    <span>يمكنك تغيير شعبتك في أي وقت لاحقاً من الصفحة الرئيسية أو ملفك الشخصي</span>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Dark Modern Teacher Specialty Picker */}
            {isSelectingSubject && (
              <div
                className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-white font-sans text-right animate-fadeIn select-none"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsSelectingSubject(false);
                }}
              >
                <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                  {/* Header */}
                  <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg">
                        📚
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white">
                          اختيار مادة وتخصص المعلم
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          حدد تخصصك لمتابعة بنك الأسئلة والمذكرات الخاصة بمادتك
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSelectingSubject(false)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Specialties List */}
                  <div className="p-4 overflow-y-auto space-y-2.5">
                    {TEACHER_SPECIALTIES.map((s) => {
                      const isSelected = subjectSpecialty === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSubjectSpecialty(s.id);
                            setIsSelectingSubject(false);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400/40'
                              : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{s.title}</span>
                              {isSelected && (
                                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                                  التخصص المختار
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 line-clamp-1">
                              {s.desc}
                            </div>
                          </div>

                          <div className="shrink-0 mr-2">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-900" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
