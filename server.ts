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

const ONESIGNAL_APP_ID = '89883b4e-3e4e-4f53-92e8-8e20fc1fdc66';

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
      return res.status(500).json({
        success: false,
        error: 'ONESIGNAL_REST_API_KEY is not configured in environment variables',
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
      return res.status(response.status).json({
        success: false,
        error: data?.errors || `OneSignal error (${response.status})`,
        onesignal: data,
        app_id: ONESIGNAL_APP_ID,
      });
    }

    console.log('[OneSignal] Notification successfully sent for real:', data);

    return res.status(200).json({
      success: true,
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      notification_id: data?.id,
      onesignal: data,
      message: 'تم إرسال الإشعار بنجاح عبر OneSignal لجميع المشتركين!',
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
app.get('/sw.js', (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(__dirname, 'public/sw.js'),
    path.resolve(__dirname, 'dist/sw.js'),
  ];
  for (const swPath of possiblePaths) {
    if (fs.existsSync(swPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      return fs.createReadStream(swPath).pipe(res);
    }
  }
  res.status(404).send('Service worker script not found');
});

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
