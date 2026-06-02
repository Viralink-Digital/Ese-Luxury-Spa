// src/routes/upload.routes.js
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// Ensure upload dirs exist
await fs.mkdir(path.join(UPLOAD_DIR, 'products'), { recursive: true });
await fs.mkdir(path.join(UPLOAD_DIR, 'avatars'), { recursive: true });
await fs.mkdir(path.join(UPLOAD_DIR, 'banners'), { recursive: true });
await fs.mkdir(path.join(UPLOAD_DIR, 'logos'), { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new AppError('Only images are allowed.', 400), false);
  },
});

const router = Router();
router.use(authenticate);

// Process and save image
async function processImage(buffer, folder, sizes) {
  const filename = uuidv4();
  const results = {};

  for (const [key, { width, height, quality }] of Object.entries(sizes)) {
    const outPath = path.join(UPLOAD_DIR, folder, `${filename}-${key}.webp`);
    await sharp(buffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .webp({ quality: quality || 85 })
      .toFile(outPath);
    results[key] = `/uploads/${folder}/${filename}-${key}.webp`;
  }

  return results;
}

// Product images (admin only)
router.post('/product', requireAdmin, upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new AppError('No images uploaded.', 400);

  const results = await Promise.all(req.files.map((file) =>
    processImage(file.buffer, 'products', {
      original: { width: 800, height: 800, quality: 90 },
      thumbnail: { width: 300, height: 300, quality: 80 },
    })
  ));

  res.json({
    success: true,
    message: `${results.length} image(s) uploaded.`,
    data: { images: results.map((r) => ({ url: r.original, thumbnail: r.thumbnail })) },
  });
}));

// Avatar
router.post('/avatar', upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No image uploaded.', 400);
  const result = await processImage(req.file.buffer, 'avatars', {
    avatar: { width: 200, height: 200, quality: 85 },
  });
  res.json({ success: true, data: { url: result.avatar } });
}));

// Logo (admin only)
router.post('/logo', requireAdmin, upload.single('logo'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No image uploaded.', 400);
  const result = await processImage(req.file.buffer, 'logos', {
    logo: { width: 1200, height: 800, quality: 92 },
  });
  res.json({ success: true, data: { url: result.logo } });
}));

// Banner (admin only)
router.post('/banner', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No image uploaded.', 400);
  const result = await processImage(req.file.buffer, 'banners', {
    banner: { width: 1200, height: 500, quality: 90 },
    mobile: { width: 600, height: 400, quality: 85 },
  });
  res.json({ success: true, data: { url: result.banner, mobileUrl: result.mobile } });
}));

export default router;
