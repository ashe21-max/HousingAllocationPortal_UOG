import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadsRoot = path.resolve(process.cwd(), 'uploads', 'lecturer-documents');
fs.mkdirSync(uploadsRoot, { recursive: true });

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeExt = ext.toLowerCase().replace(/[^.a-z0-9]/g, '');
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    cb(null, `${base}${safeExt}`);
  },
});

export const uploadLecturerDocument = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error('Unsupported file type'));
      return;
    }
    cb(null, true);
  },
});
