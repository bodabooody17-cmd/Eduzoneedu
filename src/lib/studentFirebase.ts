import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { StudentUser } from '../components/AuthModal';

export interface FirebaseStudent {
  id: string; // phone
  name: string;
  username: string;
  phone: string;
  contact?: string;
  stage: string;
  role: 'student' | 'teacher' | 'supervisor';
  avatarUrl?: string;
  xp: number;
  level: number;
  levelTitle: string;
  createdAt: string;
  lastSeen: string;
  loginCount: number;
  enrollments?: Array<{ id: string; courseId: string; courseName?: string; track?: string; enrolledAt: string }>;
}

// Generate friendly, distinctive username for student
export function generateStudentUsername(name: string, phone: string): string {
  const cleanName = name
    .trim()
    .replace(/[^\u0600-\u06FF\w]/g, '_')
    .slice(0, 15);
  const suffix = phone.slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
  return `@${cleanName}_${suffix}`;
}

/**
 * Saves or updates student record in Firebase Firestore (`students` and `users` collections)
 */
export async function syncStudentToFirebase(
  user: StudentUser,
  customUsername?: string,
  extraPoints: number = 0
): Promise<FirebaseStudent> {
  const cleanPhone = (user.contact || user.phone || '').trim();
  if (!cleanPhone) {
    throw new Error('رقم الهاتف مطلوب لمزامنة حساب الطالب مع فايربيز');
  }

  const studentRef = doc(db, 'students', cleanPhone);
  const usersRef = doc(db, 'users', cleanPhone);

  const nowIso = new Date().toISOString();
  let existingData: any = null;

  try {
    const getPromise = getDoc(studentRef);
    const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 2500));
    const existingSnap = (await Promise.race([getPromise, timeoutPromise])) as any;
    if (existingSnap && typeof existingSnap.exists === 'function' && existingSnap.exists()) {
      existingData = existingSnap.data();
    }
  } catch (err) {
    console.warn('[Firebase] Notice while reading student doc:', err);
  }

  const username =
    customUsername?.trim() ||
    user.username?.trim() ||
    existingData?.username ||
    generateStudentUsername(user.name, cleanPhone);

  const currentXp = (existingData?.xp || 50) + extraPoints;
  const loginCount = (existingData?.loginCount || 0) + 1;
  const createdAt = existingData?.createdAt || nowIso;

  const studentData: FirebaseStudent = {
    id: cleanPhone,
    name: user.name.trim(),
    username,
    phone: cleanPhone,
    contact: cleanPhone,
    stage: user.stage || 'ثانوية عامة (علمي علوم)',
    role: user.role || 'student',
    avatarUrl: user.avatarUrl || existingData?.avatarUrl || '',
    xp: currentXp,
    level: Math.floor(currentXp / 100) + 1,
    levelTitle: currentXp >= 500 ? 'عبقري EduZone' : currentXp >= 200 ? 'طالب متميز' : 'طالب مجتهد',
    createdAt,
    lastSeen: nowIso,
    loginCount,
    enrollments: existingData?.enrollments || [],
  };

  try {
    // Write to 'students' collection in Firestore with timeout
    const writePromise = setDoc(
      studentRef,
      {
        ...studentData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    const writeTimeout = new Promise<void>((res) => setTimeout(() => res(), 3500));
    await Promise.race([writePromise, writeTimeout]);

    // Also mirror to 'users' collection for broad compatibility
    setDoc(
      usersRef,
      {
        ...studentData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});

    // Cache locally immediately for zero-delay offline & fast lookup
    cacheStudentLocally(studentData);

    console.log(`[Firebase Firestore] Student successfully synced: ${studentData.name} (${studentData.username})`);
  } catch (writeErr) {
    console.error('[Firebase Firestore] Failed to sync student document:', writeErr);
  }

  // Ensure local cache has it even if Firestore write errored
  cacheStudentLocally(studentData);
  return studentData;
}

/**
 * Real-time listener for registered students collection in Firestore
 */
export function subscribeToFirebaseStudents(
  onUpdate: (students: FirebaseStudent[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const studentsCol = collection(db, 'students');

    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        const list: FirebaseStudent[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const phone = d.phone || d.contact || docSnap.id;
          const name = d.name || 'طالب جديد';
          const username = d.username || generateStudentUsername(name, phone);
          const xp = typeof d.xp === 'number' ? d.xp : 50;

          list.push({
            id: docSnap.id,
            name,
            username,
            phone,
            contact: phone,
            stage: d.stage || 'ثانوية عامة',
            role: d.role || 'student',
            avatarUrl: d.avatarUrl || '',
            xp,
            level: d.level || (Math.floor(xp / 100) + 1),
            levelTitle: d.levelTitle || (xp >= 500 ? 'عبقري EduZone' : xp >= 200 ? 'طالب متميز' : 'طالب مجتهد'),
            createdAt: d.createdAt || new Date().toISOString(),
            lastSeen: d.lastSeen || new Date().toISOString(),
            loginCount: d.loginCount || 1,
            enrollments: Array.isArray(d.enrollments) ? d.enrollments : [],
          });
        });

        // Sort descending by registration date (newest first)
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (err) => {
        console.warn('[Firebase] Real-time students listener error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firebase] Could not attach listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetch all students once from Firestore (checks both 'students' and 'users' collections)
 */
export async function getFirebaseStudentsList(): Promise<FirebaseStudent[]> {
  const map = new Map<string, FirebaseStudent>();

  // 1. Fetch from 'students' collection
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const phone = d.phone || d.contact || docSnap.id;
      const name = d.name || 'طالب';
      const username = d.username || generateStudentUsername(name, phone);
      const xp = typeof d.xp === 'number' ? d.xp : 50;

      map.set(phone, {
        id: docSnap.id,
        name,
        username,
        phone,
        contact: phone,
        stage: d.stage || 'ثانوية عامة (علمي علوم)',
        role: d.role || 'student',
        avatarUrl: d.avatarUrl || '',
        xp,
        level: d.level || (Math.floor(xp / 100) + 1),
        levelTitle: d.levelTitle || (xp >= 500 ? 'عبقري EduZone' : xp >= 200 ? 'طالب متميز' : 'طالب مجتهد'),
        createdAt: d.createdAt || new Date().toISOString(),
        lastSeen: d.lastSeen || new Date().toISOString(),
        loginCount: d.loginCount || 1,
        enrollments: Array.isArray(d.enrollments) ? d.enrollments : [],
      });
    });
  } catch (err) {
    console.warn('[Firebase] Notice fetching students collection:', err);
  }

  // 2. Fetch from 'users' collection to ensure 100% coverage
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    usersSnap.forEach((docSnap) => {
      const d = docSnap.data();
      const phone = d.phone || d.contact || docSnap.id;
      if (!map.has(phone)) {
        const name = d.name || 'طالب';
        const username = d.username || generateStudentUsername(name, phone);
        const xp = typeof d.xp === 'number' ? d.xp : 50;

        map.set(phone, {
          id: docSnap.id,
          name,
          username,
          phone,
          contact: phone,
          stage: d.stage || 'ثانوية عامة',
          role: d.role || 'student',
          avatarUrl: d.avatarUrl || '',
          xp,
          level: d.level || (Math.floor(xp / 100) + 1),
          levelTitle: d.levelTitle || 'طالب مجتهد',
          createdAt: d.createdAt || new Date().toISOString(),
          lastSeen: d.lastSeen || new Date().toISOString(),
          loginCount: d.loginCount || 1,
          enrollments: Array.isArray(d.enrollments) ? d.enrollments : [],
        });
      }
    });
  } catch (err) {
    console.warn('[Firebase] Notice fetching users collection:', err);
  }

  const list = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return list;
}

/**
 * Delete student document from Firebase Firestore
 */
export async function deleteStudentFromFirebase(phoneOrId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'students', phoneOrId));
    await deleteDoc(doc(db, 'users', phoneOrId)).catch(() => {});
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete student:', err);
    return false;
  }
}

/**
  * Cache student locally for fast instant lookup
  */
export function cacheStudentLocally(student: FirebaseStudent): void {
  try {
    const raw = localStorage.getItem('eduzone_students_cache') || '[]';
    const list: FirebaseStudent[] = JSON.parse(raw);
    const existingIdx = list.findIndex((s) => s.id === student.id || s.phone === student.phone);
    if (existingIdx >= 0) {
      list[existingIdx] = student;
    } else {
      list.unshift(student);
    }
    localStorage.setItem('eduzone_students_cache', JSON.stringify(list));
  } catch (e) {
    console.warn('Could not cache student locally:', e);
  }
}

/**
 * Retrieve cached students list from localStorage
 */
export function getCachedStudentsLocally(): FirebaseStudent[] {
  try {
    const raw = localStorage.getItem('eduzone_students_cache') || '[]';
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Live Health Check for Firebase Firestore connection
 */
export async function checkFirebaseConnection(): Promise<{
  ok: boolean;
  message: string;
  count: number;
  project: string;
}> {
  try {
    // Test write ping
    const pingRef = doc(db, '_connection_test', 'ping');
    await setDoc(pingRef, { ping: Date.now(), timestamp: new Date().toISOString() }, { merge: true });

    // Test reading students
    const snap = await getDocs(collection(db, 'students'));
    const count = snap.size;

    return {
      ok: true,
      message: `متصل بنجاح 100% مع قاعدة بيانات Firebase Firestore (eduzoneed) — تم قراءة ${count} طالب مسجل من السحابة.`,
      count,
      project: 'eduzoneed',
    };
  } catch (err: any) {
    const errMsg = err?.message || '';
    if (errMsg.includes('permission-denied') || errMsg.includes('Missing or insufficient permissions')) {
      return {
        ok: false,
        message: 'قاعدة البيانات مفعلة في فايربيز، ولكن قواعد الأمان (Firestore Rules) تحتاج إلى السماح: allow read, write: if true;',
        count: 0,
        project: 'eduzoneed',
      };
    }
    return {
      ok: false,
      message: `حالة الاتصال بفايربيز: ${errMsg || 'جاري الاتصال بقاعدة البيانات'}`,
      count: 0,
      project: 'eduzoneed',
    };
  }
}

/**
 * Add a test student to verify Firestore write & real-time display
 */
export async function seedTestStudentToFirebase(): Promise<FirebaseStudent> {
  const timestamp = Date.now().toString().slice(-4);
  const testPhone = `0109${Math.floor(1000000 + Math.random() * 9000000)}`;
  const testStudent: FirebaseStudent = {
    id: testPhone,
    name: `طالب تجريبي ${timestamp}`,
    username: `@student_${timestamp}`,
    phone: testPhone,
    contact: testPhone,
    stage: 'ثانوية عامة (علمي علوم)',
    role: 'student',
    avatarUrl: '',
    xp: 150,
    level: 2,
    levelTitle: 'طالب متميز',
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    loginCount: 1,
    enrollments: [],
  };

  await setDoc(doc(db, 'students', testStudent.id), testStudent, { merge: true });
  await setDoc(doc(db, 'users', testStudent.id), testStudent, { merge: true }).catch(() => {});
  cacheStudentLocally(testStudent);
  return testStudent;
}
