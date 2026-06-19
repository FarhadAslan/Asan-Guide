import express from 'express';
import Service from '../models/Service.js';
import { seedServices } from '../data/seedData.js';

const router = express.Router();

// In-memory fallback (MongoDB olmadıqda)
let inMemoryServices = null;

async function getServices() {
  try {
    const services = await Service.find({ isActive: true });
    return services;
  } catch {
    if (!inMemoryServices) {
      inMemoryServices = seedServices;
    }
    return inMemoryServices;
  }
}

async function getServiceBySlug(slug) {
  try {
    return await Service.findOne({ slug, isActive: true });
  } catch {
    if (!inMemoryServices) inMemoryServices = seedServices;
    return inMemoryServices.find((s) => s.slug === slug) || null;
  }
}

// GET /api/services — bütün xidmətlər
router.get('/', async (req, res) => {
  try {
    const services = await getServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Xidmətlər yüklənmədi', error: err.message });
  }
});

// GET /api/services/:slug — tək xidmət
router.get('/:slug', async (req, res) => {
  try {
    const service = await getServiceBySlug(req.params.slug);
    if (!service) return res.status(404).json({ message: 'Xidmət tapılmadı' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Xidmət yüklənmədi', error: err.message });
  }
});

export default router;
