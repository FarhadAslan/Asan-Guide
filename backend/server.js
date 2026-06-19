import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import serviceRoutes from './routes/services.js';
import documentRoutes from './routes/documents.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Asan Xidmət API işləyir' });
});

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asan-xidmet')
  .then(() => {
    console.log('MongoDB bağlandı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda işləyir`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı xətası:', err);
    // MongoDB olmasa da server işləsin (demo üçün)
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda işləyir (MongoDB olmadan)`);
    });
  });

export default app;
