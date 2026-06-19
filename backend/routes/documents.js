import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer konfiqurasiyası — yüklənən fayllar
const storage = multer.memoryStorage(); // RAM-da saxlayırıq, diska yazmırıq
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Yalnız JPG, PNG və PDF fayllar qəbul edilir'));
  },
});

// POST /api/documents/upload — sənəd yüklə (AI analiz üçün /api/ai/check istifadə et)
router.post('/upload', upload.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Fayl tapılmadı' });

  res.json({
    message: 'Fayl uğurla yükləndi',
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    // base64 string AI route-a göndərmək üçün
    base64: req.file.buffer.toString('base64'),
  });
});

export default router;
