import { playNotificationChime } from './notificationAudio';

export interface EducationalNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'update' | 'reminder' | 'whatsapp';
  actionUrl?: string;
}

const STORAGE_KEY = 'edu_notifications';
const CHANNEL_NAME = 'eduzone_notifications_channel';

export const INITIAL_NOTIFICATIONS: EducationalNotification[] = [
  {
    id: 'notif-1',
    title: 'تحديث جداول امتحانات الثانوية العامة 2026',
    message: 'تم إضافة مذكرات المراجعة النهائية لكافة المواد في منصة EduZone.',
    time: 'منذ 10 دقائق',
    read: false,
    type: 'update',
  },
  {
    id: 'notif-2',
    title: 'تذكير: مؤقت المذاكرة اليومي (بومودورو)',
    message: 'حافظ على تركيزك اليومي بإنهاء 4 جلسات مذاكرة واحصل على +40 XP.',
    time: 'منذ ساعة',
    read: false,
    type: 'reminder',
  },
  {
    id: 'notif-3',
    title: 'انضم لجروب التليجرام الرسمي',
    message: 'تابع كبسولات وملفات الأوائل والأسئلة الوزارية اليومية مع نخبة المدرسين.',
    time: 'اليوم',
    read: false,
    type: 'whatsapp',
  },
];

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch (err) {
    console.error('BroadcastChannel initialization error:', err);
  }
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return registration;
  } catch (err: any) {
    console.warn('[ServiceWorker] Registration notice:', err?.message || err);
    return null;
  }
}

// Request browser notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await showPushNotification({
        id: `perm-granted-${Date.now()}`,
        title: 'منصة EduZone التعليمية',
        message: 'تم تفعيل الإشعارات الفورية بنجاح! ستصلك التنبيهات حتى خارج الموقع.',
        time: 'الآن',
        read: false,
        type: 'update',
      });
    }
    return permission;
  } catch (err) {
    console.error('Permission request failed:', err);
    return 'denied';
  }
}

// Show native push notification (system level, works outside browser)
export async function showPushNotification(notif: EducationalNotification) {
  if (typeof window === 'undefined') return;

  // 1. Play sound chime
  playNotificationChime();

  // 2. Try Service Worker showNotification first (best for background/standalone/mobile)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(notif.title, {
          body: notif.message,
          icon: '/images/eduzone_logo.jpg',
          badge: '/images/eduzone_logo.jpg',
          vibrate: [200, 100, 200],
          data: {
            url: notif.actionUrl || '/',
          },
          tag: notif.id,
          renotify: true,
        } as any);
        return;
      }
    } catch {
      // Fallback to standard Notification API
    }
  }

  // 3. Fallback to window.Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(notif.title, {
        body: notif.message,
        icon: '/images/eduzone_logo.jpg',
      });
    } catch (err) {
      console.warn('Native notification failed:', err);
    }
  }
}

// Get all notifications from storage
export function getStoredNotifications(): EducationalNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

// Save notifications to storage and notify
export function saveStoredNotifications(list: EducationalNotification[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(
      new CustomEvent('eduzone_notifications_updated', { detail: list })
    );
  } catch (err) {
    console.error(err);
  }
}

// Broadcast new notification across all users, open tabs, and trigger push notification
export function broadcastNotification(newNotif: EducationalNotification) {
  if (typeof window === 'undefined') return;

  // 1. Update storage
  const existing = getStoredNotifications();
  const updated = [newNotif, ...existing];
  saveStoredNotifications(updated);

  // 2. Broadcast via BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'NEW_NOTIFICATION',
        notification: newNotif,
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 3. Dispatch window event
  window.dispatchEvent(
    new CustomEvent('eduzone_new_notification', { detail: newNotif })
  );

  // 4. Trigger system push notification (visible outside browser)
  showPushNotification(newNotif);
}

// Subscribe to broadcasts
export function subscribeToNotificationBroadcast(
  onNewNotification: (notif: EducationalNotification) => void,
  onListUpdated: (list: EducationalNotification[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleChannelMessage = (event: MessageEvent) => {
    if (event.data?.type === 'NEW_NOTIFICATION' && event.data.notification) {
      onNewNotification(event.data.notification);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        onListUpdated(parsed);
      } catch {}
    }
  };

  const handleCustomNew = (e: any) => {
    if (e.detail) {
      onNewNotification(e.detail);
    }
  };

  const handleCustomUpdated = (e: any) => {
    if (e.detail) {
      onListUpdated(e.detail);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleChannelMessage);
  }
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('eduzone_new_notification', handleCustomNew);
  window.addEventListener('eduzone_notifications_updated', handleCustomUpdated);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleChannelMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('eduzone_new_notification', handleCustomNew);
    window.removeEventListener('eduzone_notifications_updated', handleCustomUpdated);
  };
}
