import fs from 'fs';
import path from 'path';

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
const DATA_FILE = path.join(DATA_DIR, 'notifications.json');

const INITIAL_SERVER_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'تحديث جداول امتحانات الثانوية العامة 2026',
    message: 'تم إضافة مذكرات المراجعة النهائية لكافة المواد في منصة EduZone.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'update',
  },
  {
    id: 'notif-2',
    userId: 'all',
    title: 'تذكير: مؤقت المذاكرة اليومي (بومودورو)',
    message: 'حافظ على تركيزك اليومي بإنهاء 4 جلسات مذاكرة واحصل على +40 XP.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'reminder',
  },
  {
    id: 'notif-3',
    userId: 'all',
    title: 'انضم لجروب التليجرام الرسمي',
    message: 'تابع كبسولات وملفات الأوائل والأسئلة الوزارية اليومية مع نخبة المدرسين.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'whatsapp',
  },
];

function ensureStorage(): NotificationRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SERVER_NOTIFICATIONS, null, 2), 'utf-8');
      return INITIAL_SERVER_NOTIFICATIONS;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : INITIAL_SERVER_NOTIFICATIONS;
  } catch (err) {
    console.error('Failed to read notifications storage:', err);
    return INITIAL_SERVER_NOTIFICATIONS;
  }
}

function saveStorage(items: NotificationRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save notifications storage:', err);
  }
}

export const db = {
  notification: {
    async findMany(args?: {
      where?: { userId?: string; isRead?: boolean };
      orderBy?: { createdAt?: 'asc' | 'desc' };
    }): Promise<NotificationRecord[]> {
      const items = ensureStorage();
      let filtered = items;

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

      // Sort newest to oldest by default
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

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
      const items = ensureStorage();
      const newRecord: NotificationRecord = {
        id: args.data.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

      const updated = [newRecord, ...items];
      saveStorage(updated);
      return newRecord;
    },

    async update(args: {
      where: { id: string };
      data: { isRead?: boolean; title?: string; message?: string };
    }): Promise<NotificationRecord | null> {
      const items = ensureStorage();
      let updatedRecord: NotificationRecord | null = null;

      const updated = items.map((item) => {
        if (item.id === args.where.id) {
          updatedRecord = { ...item, ...args.data };
          return updatedRecord;
        }
        return item;
      });

      if (updatedRecord) {
        saveStorage(updated);
      }
      return updatedRecord;
    },

    async markAllAsRead(userId?: string): Promise<{ count: number }> {
      const items = ensureStorage();
      const updated = items.map((item) => {
        if (!userId || item.userId === userId || item.userId === 'all') {
          return { ...item, isRead: true };
        }
        return item;
      });
      saveStorage(updated);
      return { count: updated.filter((i) => i.isRead).length };
    },
  },
};
