import express from 'express';
import jwt from 'jsonwebtoken';
import Service from '../models/Service.js';
import Admin from '../models/Admin.js';
import { verifyToken } from '../middleware/auth.js';
import { seedServices } from '../data/seedData.js';

const router = express.Router();

// In-memory fallback
let inMemoryServices = null;

function getMemoryServices() {
  if (!inMemoryServices) inMemoryServices = JSON.parse(JSON.stringify(seedServices));
  return inMemoryServices;
}

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Demo giriş (MongoDB olmadıqda)
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { id: 'demo', username: 'admin' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    return res.json({ token, username: 'admin' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'İstifadəçi adı və ya şifrə yanlışdır' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'İstifadəçi adı və ya şifrə yanlışdır' });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: 'Giriş xətası', error: err.message });
  }
});

// GET /api/admin/services — admin üçün bütün xidmətlər
router.get('/services', verifyToken, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch {
    res.json(getMemoryServices());
  }
});

// POST /api/admin/services — yeni xidmət əlavə et
router.post('/services', verifyToken, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch {
    const services = getMemoryServices();
    const newService = {
      ...req.body,
      _id: Date.now().toString(),
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
    };
    services.push(newService);
    inMemoryServices = services;
    res.status(201).json(newService);
  }
});

// PUT /api/admin/services/:id — xidməti yenilə
router.put('/services/:id', verifyToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Tapılmadı' });
    res.json(service);
  } catch {
    const services = getMemoryServices();
    const idx = services.findIndex((s) => s._id === req.params.id || s.slug === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Tapılmadı' });
    services[idx] = { ...services[idx], ...req.body };
    inMemoryServices = services;
    res.json(services[idx]);
  }
});

// DELETE /api/admin/services/:id — xidməti sil
router.delete('/services/:id', verifyToken, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Silindi' });
  } catch {
    const services = getMemoryServices();
    inMemoryServices = services.filter((s) => s._id !== req.params.id);
    res.json({ message: 'Silindi' });
  }
});

export default router;
