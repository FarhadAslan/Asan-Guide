import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serviceRoutes from './routes/services.js';
import documentRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/services', serviceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Asan Xidmət API işləyir' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});

export default app;
