import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  email?: string;
  stage?: string;
  role: string;
  avatarUrl?: string;
  xp?: number;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
  enrollments?: EnrollmentRecord[];
  loginLogs?: LoginLogRecord[];
}

export interface EnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  courseName?: string;
  track?: string;
  enrolledAt: string;
}

export interface LoginLogRecord {
  id: string;
  userId: string;
  timestamp: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  type?: 'update' | 'reminder' | 'whatsapp';
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ENROLLMENTS_FILE = path.join(DATA_DIR, 'enrollments.json');
const LOGIN_LOGS_FILE = path.join(DATA_DIR, 'login_logs.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Ensure storage files
function readFile<T>(filePath: string, defaultData: T): T {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? (parsed as T) : defaultData;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeFile<T>(filePath: string, data: T) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export const db = {
  user: {
    async findMany(args?: {
      include?: { enrollments?: boolean; loginLogs?: boolean };
      where?: { role?: string };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    }): Promise<UserRecord[]> {
      const users = readFile<UserRecord[]>(USERS_FILE, []);
      const enrollments = readFile<EnrollmentRecord[]>(ENROLLMENTS_FILE, []);
      const loginLogs = readFile<LoginLogRecord[]>(LOGIN_LOGS_FILE, []);

      let result = users.map((u) => {
        const copy: UserRecord = { ...u };
        if (args?.include?.enrollments) {
          copy.enrollments = enrollments.filter((e) => e.userId === u.id);
        }
        if (args?.include?.loginLogs) {
          copy.loginLogs = loginLogs.filter((l) => l.userId === u.id);
        }
        return copy;
      });

      if (args?.where?.role) {
        result = result.filter((u) => u.role === args.where!.role);
      }

      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return result;
    },

    async findUnique(args: {
      where: { id?: string; phone?: string; email?: string };
      include?: { enrollments?: boolean; loginLogs?: boolean };
    }): Promise<UserRecord | null> {
      const users = readFile<UserRecord[]>(USERS_FILE, []);
      const user = users.find(
        (u) =>
          (args.where.id && u.id === args.where.id) ||
          (args.where.phone && u.phone === args.where.phone) ||
          (args.where.email && u.email === args.where.email)
      );

      if (!user) return null;

      const copy: UserRecord = { ...user };
      if (args.include?.enrollments) {
        const enrollments = readFile<EnrollmentRecord[]>(ENROLLMENTS_FILE, []);
        copy.enrollments = enrollments.filter((e) => e.userId === user.id);
      }
      if (args.include?.loginLogs) {
        const loginLogs = readFile<LoginLogRecord[]>(LOGIN_LOGS_FILE, []);
        copy.loginLogs = loginLogs.filter((l) => l.userId === user.id);
      }
      return copy;
    },

    async create(args: {
      data: {
        id?: string;
        name: string;
        username?: string;
        phone?: string;
        email?: string;
        stage?: string;
        role?: string;
        avatarUrl?: string;
        xp?: number;
        createdAt?: Date | string;
        lastSeen?: Date | string;
      };
    }): Promise<UserRecord> {
      const users = readFile<UserRecord[]>(USERS_FILE, []);
      const nowStr = new Date().toISOString();
      const newUser: UserRecord = {
        id: args.data.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: args.data.name,
        username: args.data.username || undefined,
        phone: args.data.phone || undefined,
        email: args.data.email || undefined,
        stage: args.data.stage || 'ثانوية عامة',
        role: args.data.role || 'student',
        avatarUrl: args.data.avatarUrl,
        xp: args.data.xp ?? 50,
        createdAt:
          typeof args.data.createdAt === 'string'
            ? args.data.createdAt
            : args.data.createdAt
            ? args.data.createdAt.toISOString()
            : nowStr,
        updatedAt: nowStr,
        lastSeen:
          typeof args.data.lastSeen === 'string'
            ? args.data.lastSeen
            : args.data.lastSeen
            ? args.data.lastSeen.toISOString()
            : nowStr,
      };

      // Check if existing user by phone
      const existingIdx = users.findIndex(
        (u) => (args.data.phone && u.phone === args.data.phone) || (args.data.id && u.id === args.data.id)
      );

      if (existingIdx >= 0) {
        users[existingIdx] = {
          ...users[existingIdx],
          ...newUser,
          id: users[existingIdx].id,
          createdAt: users[existingIdx].createdAt,
          lastSeen: nowStr,
          updatedAt: nowStr,
        };
        writeFile(USERS_FILE, users);
        return users[existingIdx];
      }

      users.unshift(newUser);
      writeFile(USERS_FILE, users);
      return newUser;
    },

    async update(args: {
      where: { id: string };
      data: Partial<UserRecord>;
    }): Promise<UserRecord | null> {
      const users = readFile<UserRecord[]>(USERS_FILE, []);
      const idx = users.findIndex((u) => u.id === args.where.id);
      if (idx === -1) return null;

      users[idx] = {
        ...users[idx],
        ...args.data,
        updatedAt: new Date().toISOString(),
      };
      writeFile(USERS_FILE, users);
      return users[idx];
    },
  },

  enrollment: {
    async findMany(args?: {
      where?: { userId?: string; courseId?: string };
    }): Promise<EnrollmentRecord[]> {
      const enrollments = readFile<EnrollmentRecord[]>(ENROLLMENTS_FILE, []);
      if (!args?.where) return enrollments;

      return enrollments.filter((e) => {
        if (args.where?.userId && e.userId !== args.where.userId) return false;
        if (args.where?.courseId && e.courseId !== args.where.courseId) return false;
        return true;
      });
    },

    async create(args: {
      data: {
        userId: string;
        courseId: string;
        courseName?: string;
        track?: string;
      };
    }): Promise<EnrollmentRecord> {
      const enrollments = readFile<EnrollmentRecord[]>(ENROLLMENTS_FILE, []);
      const newEnrollment: EnrollmentRecord = {
        id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: args.data.userId,
        courseId: args.data.courseId,
        courseName: args.data.courseName || 'كورس تعليمي',
        track: args.data.track || 'عام',
        enrolledAt: new Date().toISOString(),
      };

      // Avoid duplicates
      const exists = enrollments.some(
        (e) => e.userId === newEnrollment.userId && e.courseId === newEnrollment.courseId
      );
      if (!exists) {
        enrollments.unshift(newEnrollment);
        writeFile(ENROLLMENTS_FILE, enrollments);
      }
      return newEnrollment;
    },
  },

  loginLog: {
    async create(args: {
      data: {
        userId: string;
        timestamp?: Date | string;
      };
    }): Promise<LoginLogRecord> {
      const logs = readFile<LoginLogRecord[]>(LOGIN_LOGS_FILE, []);
      const nowStr = args.data.timestamp
        ? typeof args.data.timestamp === 'string'
          ? args.data.timestamp
          : args.data.timestamp.toISOString()
        : new Date().toISOString();

      const newLog: LoginLogRecord = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: args.data.userId,
        timestamp: nowStr,
        createdAt: nowStr,
      };

      logs.unshift(newLog);
      writeFile(LOGIN_LOGS_FILE, logs);

      // Update user lastSeen in USERS_FILE
      const users = readFile<UserRecord[]>(USERS_FILE, []);
      const uIdx = users.findIndex((u) => u.id === args.data.userId || u.phone === args.data.userId);
      if (uIdx >= 0) {
        users[uIdx].lastSeen = nowStr;
        writeFile(USERS_FILE, users);
      }

      console.log(`[UserTracking] Login log created: userId=${args.data.userId}, time=${nowStr}`);
      return newLog;
    },

    async findMany(args?: {
      where?: { userId?: string };
      orderBy?: { timestamp?: 'asc' | 'desc' };
    }): Promise<LoginLogRecord[]> {
      const logs = readFile<LoginLogRecord[]>(LOGIN_LOGS_FILE, []);
      if (!args?.where?.userId) return logs;
      return logs.filter((l) => l.userId === args.where!.userId);
    },
  },

  notification: {
    async findMany(args?: {
      where?: { userId?: string; isRead?: boolean };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    }): Promise<NotificationRecord[]> {
      const notifs = readFile<NotificationRecord[]>(NOTIFICATIONS_FILE, []);
      let filtered = notifs;
      if (args?.where) {
        if (args.where.userId) {
          filtered = filtered.filter(
            (n) => n.userId === args.where!.userId || n.userId === 'all'
          );
        }
        if (args.where.isRead !== undefined) {
          filtered = filtered.filter((n) => n.isRead === args.where!.isRead);
        }
      }
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return filtered;
    },

    async create(args: {
      data: {
        id?: string;
        userId?: string;
        title: string;
        message: string;
        isRead?: boolean;
        createdAt?: Date | string;
        actionUrl?: string;
        type?: 'update' | 'reminder' | 'whatsapp';
      };
    }): Promise<NotificationRecord> {
      const notifs = readFile<NotificationRecord[]>(NOTIFICATIONS_FILE, []);
      const newNotif: NotificationRecord = {
        id: args.data.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: args.data.userId || 'all',
        title: args.data.title,
        message: args.data.message,
        isRead: args.data.isRead ?? false,
        createdAt:
          typeof args.data.createdAt === 'string'
            ? args.data.createdAt
            : args.data.createdAt
            ? args.data.createdAt.toISOString()
            : new Date().toISOString(),
        actionUrl: args.data.actionUrl,
        type: args.data.type || 'update',
      };
      notifs.unshift(newNotif);
      writeFile(NOTIFICATIONS_FILE, notifs);
      return newNotif;
    },

    async update(args: {
      where: { id: string };
      data: { isRead?: boolean; title?: string; message?: string };
    }): Promise<NotificationRecord | null> {
      const notifs = readFile<NotificationRecord[]>(NOTIFICATIONS_FILE, []);
      const idx = notifs.findIndex((n) => n.id === args.where.id);
      if (idx === -1) return null;
      notifs[idx] = { ...notifs[idx], ...args.data };
      writeFile(NOTIFICATIONS_FILE, notifs);
      return notifs[idx];
    },

    async markAllAsRead(userId?: string): Promise<{ count: number }> {
      const notifs = readFile<NotificationRecord[]>(NOTIFICATIONS_FILE, []);
      let count = 0;
      const updated = notifs.map((n) => {
        if (!userId || n.userId === userId || n.userId === 'all') {
          if (!n.isRead) count++;
          return { ...n, isRead: true };
        }
        return n;
      });
      writeFile(NOTIFICATIONS_FILE, updated);
      return { count };
    },
  },
};

// Also export prisma alias
export const prisma = db;
