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
    const existingSnap = await getDoc(studentRef);
    if (existingSnap.exists()) {
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
    // Write to 'students' collection in Firestore
    await setDoc(studentRef, {
      ...studentData,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Also mirror to 'users' collection for broad compatibility
    await setDoc(usersRef, {
      ...studentData,
      updatedAt: serverTimestamp(),
    }, { merge: true }).catch(() => {});

    console.log(`[Firebase Firestore] Student successfully synced: ${studentData.name} (${studentData.username})`);
  } catch (writeErr) {
    console.error('[Firebase Firestore] Failed to sync student document:', writeErr);
  }

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
 * Fetch all students once from Firestore
 */
export async function getFirebaseStudentsList(): Promise<FirebaseStudent[]> {
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    const list: FirebaseStudent[] = [];

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const phone = d.phone || d.contact || docSnap.id;
      const name = d.name || 'طالب';
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
        levelTitle: d.levelTitle || 'طالب مجتهد',
        createdAt: d.createdAt || new Date().toISOString(),
        lastSeen: d.lastSeen || new Date().toISOString(),
        loginCount: d.loginCount || 1,
        enrollments: Array.isArray(d.enrollments) ? d.enrollments : [],
      });
    });

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.warn('[Firebase] Error fetching students from Firestore:', err);
    return [];
  }
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
