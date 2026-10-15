import React from 'react';
import Link from 'next/link';
import { db } from '../../../../src/db/userTrackingDb';

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default async function StudentDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const userId = resolvedParams.id;

  // Fetch full student details
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { enrollments: true, loginLogs: true },
  });

  // كل الكورسات اللي اشترك فيها من db.enrollment.findMany({ where: { userId } })
  const enrollments = await db.enrollment.findMany({
    where: { userId },
  });

  // سجل دخوله من db.loginLog لو موجود، لو مش موجود اعمل console.log لوقت الدخول
  const loginLogs = await db.loginLog.findMany({
    where: { userId },
  });

  if (!loginLogs || loginLogs.length === 0) {
    console.log(`[Student Detail Log] وقت دخول الطالب (${userId}):`, new Date().toISOString());
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center font-sans" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md w-full">
          <p className="text-xl font-bold text-red-400 mb-2">الطالب غير موجود</p>
          <p className="text-slate-400 text-sm mb-6">لم يتم العثور على سجلات مطابقة لهذا المعرف.</p>
          <Link
            href="/admin"
            className="inline-flex px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
          >
            العودة للوحة الإشراف
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1"
            >
              <span>← العودة لقائمة الطلاب</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-amber-400">الملف الأكاديمي وسجل الطالب</h1>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            ID: {user.id}
          </span>
        </div>

        {/* 1. بياناته الكاملة */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800/80 flex items-center gap-2">
            <span>👤</span>
            <span>البيانات الكاملة للطالب</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">الاسم بالكامل</span>
              <span className="text-base font-bold text-white">{user.name}</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">رقم الموبايل</span>
              <span className="text-base font-bold text-amber-300 font-mono dir-ltr text-right block">
                {user.phone || 'غير مسجل'}
              </span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">البريد الإلكتروني</span>
              <span className="text-sm font-medium text-slate-300 font-mono block truncate">
                {user.email || 'غير متوفر'}
              </span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">المرحلة الدراسية / الشعبة</span>
              <span className="text-sm font-semibold text-indigo-300">{user.stage || 'عام'}</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">تاريخ التسجيل بالمنصة</span>
              <span className="text-sm font-medium text-slate-300">
                {new Date(user.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">آخر ظهور وتواجد</span>
              <span className="text-sm font-medium text-emerald-400">
                {user.lastSeen ? new Date(user.lastSeen).toLocaleDateString('ar-EG') + ' ' + new Date(user.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : 'غير محدد'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. كل الكورسات اللي اشترك فيها من db.enrollment.findMany({ where: { userId } }) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>📚</span>
              <span>الكورسات المشترك بها ({enrollments.length})</span>
            </h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">لم يقم هذا الطالب بالاشتراك في أي كورسات حتى الآن.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">{enr.courseName || enr.courseId}</h3>
                    <p className="text-xs text-slate-400 mt-1">المسار: {enr.track || 'عام'}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(enr.enrolledAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. سجل دخوله من db.loginLog لو موجود، لو مش موجود اعمل console.log لوقت الدخول */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>⏱️</span>
              <span>سجل تسجيل الدخول (Login Logs)</span>
            </h2>
            <span className="text-xs text-slate-400">إجمالي الجلسات: {loginLogs.length}</span>
          </div>

          {loginLogs.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">لا يوجد سجل دخول سابق مخزن. تم تسجيل وقت الدخول بالكونسول.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-950 text-slate-400 text-xs font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">معرف الجلسة</th>
                    <th className="p-3">تاريخ ووقت تسجيل الدخول</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {loginLogs.map((log, index) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400 text-xs font-mono">{index + 1}</td>
                      <td className="p-3 text-slate-400 text-xs font-mono">{log.id}</td>
                      <td className="p-3 text-slate-200 text-xs">
                        {new Date(log.timestamp).toLocaleDateString('ar-EG')} - {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
