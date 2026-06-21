import express from 'express';
import { seedServices } from '../data/seedData.js';

const router = express.Router();

// GET /api/services — bütün aktiv xidmətlər (statik)
router.get('/', (req, res) => {
  const services = seedServices.filter(s => s.isActive !== false);
  res.json(services);
});

// GET /api/services/:slug — tək xidmət (statik)
router.get('/:slug', (req, res) => {
  const service = seedServices.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).json({ message: 'Xidmət tapılmadı' });
  res.json(service);
});

export default router;
