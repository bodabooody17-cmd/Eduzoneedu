import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'download-attachment-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && (req.url.startsWith('/eduzone.zip') || req.url.startsWith('/eduzone-final.zip'))) {
              res.setHeader('Content-Disposition', 'attachment; filename="eduzone.zip"');
              res.setHeader('Content-Type', 'application/zip');
            }
            if (req.url && (req.url.startsWith('/EduZone.apk') || req.url.startsWith('/eduzone.apk'))) {
              const apkFilePath = path.resolve(__dirname, 'public/EduZone.apk');
              if (fs.existsSync(apkFilePath)) {
                res.setHeader('Content-Disposition', 'attachment; filename="EduZone.apk"');
                res.setHeader('Content-Type', 'application/vnd.android.package-archive');
                return fs.createReadStream(apkFilePath).pipe(res);
              }
            }
            if (
              req.url &&
              (req.url === '/sw.js' ||
                req.url.startsWith('/sw.js') ||
                req.url === '/OneSignalSDKWorker.js' ||
                req.url.startsWith('/OneSignalSDKWorker.js') ||
                req.url === '/OneSignalSDKUpdaterWorker.js' ||
                req.url.startsWith('/OneSignalSDKUpdaterWorker.js'))
            ) {
              const fileName = req.url.split('?')[0].replace('/', '');
              const swFilePath = path.resolve(__dirname, 'public', fileName);
              if (fs.existsSync(swFilePath)) {
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                res.setHeader('Service-Worker-Allowed', '/');
                return fs.createReadStream(swFilePath).pipe(res);
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
