// src/routes/cms.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// ─── BANNERS ──────────────────────────────
router.get('/banners', asyncHandler(async (req, res) => {
  const { position } = req.query;
  const where = { isActive: true };
  if (position) where.position = position;
  const now = new Date();
  where.OR = [
    { startsAt: null },
    { startsAt: { lte: now } },
  ];
  const banners = await prisma.banner.findMany({ where, orderBy: { sortOrder: 'asc' } });
  res.json({ success: true, data: { banners } });
}));

router.post('/banners', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const banner = await prisma.banner.create({ data: req.body });
  res.status(201).json({ success: true, data: { banner } });
}));

router.put('/banners/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: { banner } });
}));

router.delete('/banners/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.banner.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: 'Banner hidden.' });
}));

// ─── TESTIMONIALS ─────────────────────────
router.get('/testimonials', asyncHandler(async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  res.json({ success: true, data: { testimonials } });
}));

router.post('/testimonials', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const t = await prisma.testimonial.create({ data: req.body });
  res.status(201).json({ success: true, data: { testimonial: t } });
}));

router.put('/testimonials/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: { testimonial: t } });
}));

// ─── SITE SETTINGS ────────────────────────
router.get('/settings', asyncHandler(async (req, res) => {
  const settings = await prisma.siteSettings.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  res.json({ success: true, data: { settings: map } });
}));

router.put('/settings', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { settings } = req.body; // { key: value, ... }
  const updates = Object.entries(settings).map(([key, value]) =>
    prisma.siteSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  );
  await Promise.all(updates);
  res.json({ success: true, message: 'Settings updated.' });
}));

// ─── NEWSLETTER ───────────────────────────
router.post('/newsletter/subscribe', asyncHandler(async (req, res) => {
  const { email } = req.body;
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: { isActive: true },
    create: { email },
  });
  res.json({ success: true, message: 'Subscribed successfully.' });
}));

router.get('/newsletter/subscribers', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: { subscribers, total: subscribers.length } });
}));

export default router;
