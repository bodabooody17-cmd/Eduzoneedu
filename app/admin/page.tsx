import React from 'react';
import Link from 'next/link';
import { db, prisma } from '../../src/db/userTrackingDb';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // 1. البيانات لازم تكون حقيقية 100%:
  // استخدم فقط await db.user.findMany({ include: { enrollments: true } }) و await prisma.user.findMany
  const users = await db.user.findMany({
    include: { enrollments: true },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-amber-400">لوحة الإشراف والمتابعة</h1>
            <p className="text-sm text-slate-400 mt-1">منصة EduZone التعليمية - إدارة وتتبع الطلاب المسجلين</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              إجمالي الطلاب: {users.length}
            </span>
          </div>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-800 gap-2">
          <button className="px-5 py-2.5 text-sm font-bold border-b-2 border-amber-500 text-amber-400 bg-slate-900/60 rounded-t-lg transition">
            الطلاب المسجلين
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200">قائمة تتبع الطلاب المسجلين</h2>
            <span className="text-xs text-slate-400">تحديث فوري من قاعدة البيانات</span>
          </div>

          {/* 1. لو مفيش مستخدمين اعرض رسالة "لا يوجد طلاب مسجلين حتى الآن" */}
          {!users || users.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl">
                👥
              </div>
              <p className="text-slate-300 font-bold text-lg">لا يوجد طلاب مسجلين حتى الآن</p>
              <p className="text-xs text-slate-500 mt-1">سيتم إدراج الطلاب فور تسجيل دخولهم أو اشتراكهم في المنصة.</p>
            </div>
          ) : (
            /* 2. شكل الجدول: shadcn/ui Table */
            <div className="relative w-full overflow-auto rounded-xl border border-slate-800">
              <table className="w-full caption-bottom text-sm text-right">
                <thead className="[&_tr]:border-b bg-slate-950/80 text-slate-400 text-xs font-bold border-slate-800">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">الاسم</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">رقم الموبايل</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">الايميل</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">تاريخ التسجيل</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">عدد الكورسات</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300">آخر ظهور</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-300 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0 divide-y divide-slate-800/60">
                  {users.map((user) => {
                    const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString('ar-EG');
                    const formattedLastSeen = user.lastSeen
                      ? new Date(user.lastSeen).toLocaleDateString('ar-EG') + ' ' + new Date(user.lastSeen).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                      : 'غير محدد';
                    const enrollmentsCount = user.enrollments ? user.enrollments.length : 0;

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-slate-800 transition-colors hover:bg-slate-800/40 text-slate-200"
                      >
                        {/* الاسم */}
                        <td className="p-4 align-middle font-semibold text-white flex items-center gap-2">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                              {user.name.charAt(0) || 'ط'}
                            </div>
                          )}
                          <span>{user.name}</span>
                        </td>

                        {/* رقم الموبايل */}
                        <td className="p-4 align-middle font-mono text-slate-300 dir-ltr text-right">
                          {user.phone || 'غير مسجل'}
                        </td>

                        {/* الايميل */}
                        <td className="p-4 align-middle text-slate-400 text-xs font-mono">
                          {user.email || '—'}
                        </td>

                        {/* تاريخ التسجيل: بصيغة toLocaleDateString('ar-EG') */}
                        <td className="p-4 align-middle text-slate-300 text-xs">
                          {formattedCreatedAt}
                        </td>

                        {/* عدد الكورسات: enrollments.length */}
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {enrollmentsCount} كورس
                          </span>
                        </td>

                        {/* آخر ظهور */}
                        <td className="p-4 align-middle text-slate-400 text-xs">
                          {formattedLastSeen}
                        </td>

                        {/* إجراء: لما ادوس على "عرض" يوديني لـ /admin/users/[id] */}
                        <td className="p-4 align-middle text-center">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md active:scale-95"
                          >
                            عرض
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
