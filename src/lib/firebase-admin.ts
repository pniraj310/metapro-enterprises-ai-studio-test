import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FirebaseAppletConfig {
  projectId?: string;
}

function loadFirebaseAppletConfig(): FirebaseAppletConfig {
  const candidatePaths = [
    path.resolve(__dirname, '../../firebase-applet-config.json'),
    path.resolve(process.cwd(), 'firebase-applet-config.json'),
  ];

  for (const configPath of candidatePaths) {
    try {
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(raw) as FirebaseAppletConfig;
      }
    } catch (err) {
      console.error(`Warning: Failed to parse ${configPath}:`, err);
    }
  }

  return {};
}

const firebaseConfig = loadFirebaseAppletConfig();
const resolvedProjectId =
  firebaseConfig.projectId ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  'storied-evening-9r7h4';

if (!getApps().length) {
  initializeApp({
    projectId: resolvedProjectId,
  });
}

export const adminAuth = getAuth();
