import express from 'express';
import multer from 'multer';
import path from 'path';
import Groq from 'groq-sdk';
import { seedServices } from '../data/seedData.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('Yalnız şəkil faylları (JPG, PNG) qəbul edilir'));
  },
});

function getGroq() {
  if (!process.env.GROQ_API_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function findService(slug) {
  return seedServices.find(s => s.slug === slug) || null;
}

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { message, serviceSlug } = req.body;
  if (!message) return res.status(400).json({ message: 'Mesaj boşdur' });

  const groq = getGroq();
  if (!groq) {
    const service = serviceSlug ? findService(serviceSlug) : null;
    return res.json({ reply: getDemoReply(message, service), isDemo: true });
  }

  try {
    const service = serviceSlug ? findService(serviceSlug) : null;
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt(service) },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('Groq xətası:', err.message);
    res.status(500).json({ message: 'AI cavab verə bilmədi', error: err.message });
  }
});

// POST /api/ai/check-document
router.post('/check-document', upload.single('document'), async (req, res) => {
  const { documentName, serviceSlug, validationRules } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Sənəd şəkli tapılmadı' });

  const groq = getGroq();
  if (!groq) {
    return res.json({
      isValid: true,
      confidence: 85,
      issues: [],
      suggestions: ['Demo rejimdə işləyir. Groq API açarı əlavə edin.'],
      summary: `"${documentName || 'Sənəd'}" yükləndi. Demo rejimdə tam yoxlama mövcud deyil.`,
      isDemo: true,
    });
  }

  try {
    const service = serviceSlug ? findService(serviceSlug) : null;
    const base64Image = req.file.buffer.toString('base64');

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: buildDocumentCheckPrompt(documentName, validationRules, service) },
          { type: 'image_url', image_url: { url: `data:${req.file.mimetype};base64,${base64Image}` } },
        ],
      }],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    res.json(parseDocumentCheckResponse(content));
  } catch (err) {
    console.error('Groq Vision xətası:', err.message);
    res.status(500).json({ message: 'Sənəd yoxlanıla bilmədi', error: err.message });
  }
});

function buildSystemPrompt(service) {
  let prompt = `Sən ASAN Xidmət mərkəzinin köməkçi AI assistentisən.
Vətəndaşlara Azərbaycan dilində məlumat verirsən.
Həmişə xeyirxah, aydın və qısa cavablar ver.
Yalnız ASAN Xidmət, dövlət xidmətləri və sənədlər mövzusunda kömək et.`;

  if (service) {
    prompt += `\n\nHazırda vətəndaş "${service.name}" xidməti haqqında soruşur.
- Açıqlama: ${service.description}
- Müddət: ${service.duration || 'məlum deyil'}
- Haqq: ${service.fee || 'məlum deyil'}
- Yer: ${service.location || 'ASAN Xidmət mərkəzləri'}
${service.aiContext ? `- Qeyd: ${service.aiContext}` : ''}

Tələb olunan sənədlər:
${service.requiredDocuments?.map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? ' (məcburi)' : ' (könüllü)'}: ${d.description || ''}`).join('\n') || 'Məlumat yoxdur'}`;
  }
  return prompt;
}

function buildDocumentCheckPrompt(documentName, validationRules, service) {
  return `Sən ASAN Xidmət üçün sənəd yoxlama sistemisin.
Bu şəkildə "${documentName || 'sənəd'}" göstərilir.
${validationRules ? `Yoxlama qaydaları: ${validationRules}` : ''}
${service ? `Xidmət: ${service.name}` : ''}

Cavabı MÜTLƏQ bu JSON formatında ver (başqa heç nə yazma):
{
  "isValid": true/false,
  "confidence": 0-100,
  "issues": ["problem 1"],
  "suggestions": ["tövsiyə 1"],
  "summary": "ümumi qiymətləndirmə"
}`;
}

function parseDocumentCheckResponse(content) {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return { isValid: false, confidence: 0, issues: ['Cavab formatı tanınmadı'], suggestions: ['Yenidən cəhd edin'], summary: content };
}

function getDemoReply(message, service) {
  const msg = message.toLowerCase();
  if (service) {
    if (msg.includes('sənəd') || msg.includes('lazım') || msg.includes('hansı')) {
      const docs = service.requiredDocuments?.map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? '' : ' (könüllü)'}`).join('\n');
      return `"${service.name}" üçün lazım olan sənədlər:\n\n${docs || 'Məlumat yoxdur'}`;
    }
    if (msg.includes('müddət')) return `Müddət: ${service.duration || 'məlum deyil'}`;
    if (msg.includes('haqq') || msg.includes('pul')) return `Dövlət rüsumu: ${service.fee || 'Ödənişsiz'}`;
  }
  if (msg.includes('salam')) return 'Salam! ASAN Xidmət köməkçisinə xoş gəldiniz. Hansı xidmət barədə məlumat almaq istəyirsiniz?';
  return 'Kömək etmək üçün hazıram. Xidmət seçin və sualınızı verin.';
}

export default router;
