import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || 'b4eeea32-69c4-4ef9-a0d4-d6a8bbc8cde0';

import { db } from './src/db/userTrackingDb';

// OneSignal Push Notification REST API endpoint
app.post('/api/send-notification', async (req: Request, res: Response) => {
  try {
    const { title, message, actionUrl } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required',
      });
    }

    // Always store the announcement in database so it appears in /notifications
    const savedNotification = await db.notification.create({
      data: {
        userId: 'all',
        title,
        message,
        actionUrl: actionUrl || undefined,
        type: 'update',
      },
    });

    const payload: Record<string, any> = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: {
        en: title,
        ar: title,
      },
      contents: {
        en: message,
        ar: message,
      },
    };

    if (actionUrl && typeof actionUrl === 'string' && actionUrl.trim()) {
      payload.url = actionUrl.trim();
    }

    // Retrieve OneSignal App REST API key from environment
    const apiKey = (process.env.ONESIGNAL_REST_API_KEY || process.env.ONESIGNAL_API_KEY || '').trim();
    if (!apiKey) {
      // Still return 200 since notification was saved in database
      return res.status(200).json({
        success: true,
        notification: savedNotification,
        message: 'تم حفظ الإشعار في المنصة بنجاح وسيظهر لجميع الطلاب (تنبيه: مفتاح OneSignal غير مضبوط للإرسال الخارجي)',
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Key ${apiKey}`,
    };

    console.log(`[OneSignal] Dispatching real notification to app_id: ${ONESIGNAL_APP_ID}, included_segments: All`);

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.warn(`[OneSignal] Dispatch returned status ${response.status}:`, data);
      return res.status(200).json({
        success: true,
        notification: savedNotification,
        warning: data?.errors || `OneSignal error (${response.status})`,
        onesignal: data,
        message: 'تم حفظ الإشعار في المنصة بنجاح وسيظهر للطلاب في قائمة الإشعارات',
      });
    }

    console.log('[OneSignal] Notification successfully sent for real:', data);

    return res.status(200).json({
      success: true,
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      notification_id: data?.id,
      notification: savedNotification,
      onesignal: data,
      message: 'تم إرسال الإشعار بنجاح وحفظه في المنصة لجميع الطلاب!',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error while processing notification',
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
    });
  }
});

// Notifications Database Endpoints
app.get('/api/notifications', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'all';
    const notifications = await db.notification.findMany({
      where: userId !== 'all' ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch notifications',
    });
  }
});

app.post('/api/notifications', async (req: Request, res: Response) => {
  try {
    const { title, message, userId = 'all', actionUrl, type = 'update' } = req.body || {};

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required',
      });
    }

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        message,
        actionUrl,
        type,
      },
    });

    return res.status(201).json({
      success: true,
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create notification',
    });
  }
});

app.all('/api/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.status(200).json({
      success: true,
      notification: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to update notification',
    });
  }
});

app.post('/api/notifications/read-all', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body || {};
    const result = await db.notification.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      count: result.count,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to mark all as read',
    });
  }
});

// Real Student Tracking & Admin APIs
app.get('/api/admin/users', async (_req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      include: { enrollments: true },
    });
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch registered students',
    });
  }
});

app.get('/api/admin/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: { id },
      include: { enrollments: true, loginLogs: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'الطالب غير موجود' });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: id },
    });

    const loginLogs = await db.loginLog.findMany({
      where: { userId: id },
    });

    // Fallback log if empty as requested: "لو مش موجود اعمل console.log لوقت الدخول"
    if (!loginLogs || loginLogs.length === 0) {
      console.log(`[StudentTracking] User ${id} login time fallback:`, new Date().toISOString());
    }

    return res.status(200).json({
      success: true,
      user,
      enrollments,
      loginLogs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch student details',
    });
  }
});

// Real auth tracking: login and register logging
app.post(['/api/auth/login', '/api/auth/register', '/api/auth/log'], async (req: Request, res: Response) => {
  try {
    const { id, name, phone, email, stage, role, avatarUrl } = req.body || {};

    if (!name && !phone) {
      return res.status(400).json({ success: false, error: 'User details required' });
    }

    const user = await db.user.create({
      data: {
        id,
        name: name || 'طالب جديد',
        phone,
        email,
        stage,
        role: role || 'student',
        avatarUrl,
        lastSeen: new Date(),
      },
    });

    // Real tracking: await db.loginLog.create({ data: { userId: user.id, timestamp: new Date() } })
    const loginLog = await db.loginLog.create({
      data: {
        userId: user.id,
        timestamp: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      user,
      loginLog,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to log user login',
    });
  }
});

// Real enrollment API
app.post('/api/enroll', async (req: Request, res: Response) => {
  try {
    const { userId, courseId, courseName, track } = req.body || {};
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, error: 'userId and courseId are required' });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        courseName,
        track,
      },
    });

    return res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to enroll in course',
    });
  }
});

// Direct APK attachment download
app.get(['/EduZone.apk', '/eduzone.apk'], (_req: Request, res: Response) => {
  const apkPath = path.resolve(__dirname, 'public/EduZone.apk');
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="EduZone.apk"');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    return fs.createReadStream(apkPath).pipe(res);
  }
  res.status(404).send('APK file not found');
});

// Direct Service Worker script serving with strict JavaScript MIME type
app.get(
  ['/sw.js', '/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'],
  (req: Request, res: Response) => {
    const fileName = req.path.replace('/', '');
    const possiblePaths = [
      path.resolve(__dirname, 'public', fileName),
      path.resolve(__dirname, 'dist', fileName),
    ];
    for (const swPath of possiblePaths) {
      if (fs.existsSync(swPath)) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Service-Worker-Allowed', '/');
        return fs.createReadStream(swPath).pipe(res);
      }
    }
    res.status(404).send('Service worker script not found');
  }
);

// Configure Vite in development or static in production
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
