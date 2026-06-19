import express from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import path from 'path';
import { seedServices } from '../data/seedData.js';
import Service from '../models/Service.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('Yalnız şəkil faylları (JPG, PNG) qəbul edilir'));
  },
});

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Xidməti tap
async function findService(slug) {
  try {
    const s = await Service.findOne({ slug });
    if (s) return s;
  } catch {}
  return seedServices.find((s) => s.slug === slug) || null;
}

// POST /api/ai/chat — xidmət haqqında sual-cavab
router.post('/chat', async (req, res) => {
  const { message, serviceSlug } = req.body;

  if (!message) return res.status(400).json({ message: 'Mesaj boşdur' });

  const openai = getOpenAI();

  // OpenAI açarı yoxdursa — demo cavab
  if (!openai) {
    const service = serviceSlug ? await findService(serviceSlug) : null;
    return res.json({
      reply: getDemoReply(message, service),
      isDemo: true,
    });
  }

  try {
    const service = serviceSlug ? await findService(serviceSlug) : null;

    const systemPrompt = buildSystemPrompt(service);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI xətası:', err.message);
    res.status(500).json({ message: 'AI cavab verə bilmədi', error: err.message });
  }
});

// POST /api/ai/check-document — sənəd yoxlama (şəkil + sənəd növü)
router.post('/check-document', upload.single('document'), async (req, res) => {
  const { documentName, serviceSlug, validationRules } = req.body;

  if (!req.file) return res.status(400).json({ message: 'Sənəd şəkli tapılmadı' });

  const openai = getOpenAI();

  // Demo rejim
  if (!openai) {
    return res.json({
      isValid: true,
      confidence: 85,
      issues: [],
      suggestions: ['Demo rejimdə işləyir. OpenAI açarı əlavə edin.'],
      summary: `"${documentName || 'Sənəd'}" yükləndi. Demo rejimdə tam yoxlama mövcud deyil.`,
      isDemo: true,
    });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const service = serviceSlug ? await findService(serviceSlug) : null;

    const prompt = buildDocumentCheckPrompt(documentName, validationRules, service);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    const result = parseDocumentCheckResponse(content);

    res.json(result);
  } catch (err) {
    console.error('OpenAI Vision xətası:', err.message);
    res.status(500).json({ message: 'Sənəd yoxlanıla bilmədi', error: err.message });
  }
});

// --- Köməkçi funksiyalar ---

function buildSystemPrompt(service) {
  let prompt = `Sən ASAN Xidmət mərkəzinin köməkçi AI assistentisən. 
Vətəndaşlara Azərbaycan dilində məlumat verirsən.
Həmişə xeyirxah, aydın və qısa cavablar ver.
Yalnız ASAN Xidmət, dövlət xidmətləri və sənədlər mövzusunda kömək et.`;

  if (service) {
    prompt += `\n\nHazırda vətəndaş "${service.name}" xidməti haqqında soruşur.
Xidmət haqqında məlumat:
- Açıqlama: ${service.description}
- Müddət: ${service.duration || 'məlum deyil'}
- Haqq: ${service.fee || 'məlum deyil'}
- Yer: ${service.location || 'ASAN Xidmət mərkəzləri'}
${service.aiContext ? `- Əlavə məlumat: ${service.aiContext}` : ''}

Tələb olunan sənədlər:
${service.requiredDocuments?.map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? ' (məcburi)' : ' (könüllü)'}: ${d.description || ''}`).join('\n') || 'Məlumat yoxdur'}`;
  }

  return prompt;
}

function buildDocumentCheckPrompt(documentName, validationRules, service) {
  return `Sən ASAN Xidmət üçün sənəd yoxlama sistemisin.
Bu şəkildə "${documentName || 'sənəd'}" göstərilir.

Aşağıdakıları yoxla və JSON formatında cavab ver:
${validationRules ? `Yoxlama qaydaları: ${validationRules}` : ''}
${service ? `Xidmət: ${service.name}` : ''}

Cavabı MÜTLƏQ bu JSON formatında ver:
{
  "isValid": true/false,
  "confidence": 0-100 (faiz),
  "issues": ["problem 1", "problem 2"],
  "suggestions": ["tövsiyə 1", "tövsiyə 2"],
  "summary": "ümumi qiymətləndirmə"
}

Yoxla:
1. Sənəd oxunaqlıdır?
2. Sənədin tipi düzgündür? (${documentName})
3. Sənəddə əsas məlumatlar var?
4. Sənədin etibarlılıq müddəti bitib?
5. Şəkil keyfiyyəti kifayət qədər yaxşıdır?`;
}

function parseDocumentCheckResponse(content) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return {
    isValid: false,
    confidence: 0,
    issues: ['Cavab formatı tanınmadı'],
    suggestions: ['Sənədi yenidən yükləyin'],
    summary: content,
  };
}

function getDemoReply(message, service) {
  const msg = message.toLowerCase();

  if (service) {
    if (msg.includes('sənəd') || msg.includes('lazım') || msg.includes('hansı')) {
      const docs = service.requiredDocuments
        ?.map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? '' : ' (könüllü)'}`)
        .join('\n');
      return `"${service.name}" xidməti üçün aşağıdakı sənədlər lazımdır:\n\n${docs || 'Məlumat yoxdur'}`;
    }
    if (msg.includes('müddət') || msg.includes('nə qədər')) {
      return `"${service.name}" xidmətinin müddəti: ${service.duration || 'məlum deyil'}`;
    }
    if (msg.includes('pul') || msg.includes('haqq') || msg.includes('ödən')) {
      return `"${service.name}" xidməti: ${service.fee || 'Ödənişsiz'}`;
    }
    return `"${service.name}" xidməti haqqında sualınızı dəqiqləşdirə bilərsinizmi? Sənədlər, müddət və ya haqq barədə soruşa bilərsiniz.`;
  }

  if (msg.includes('salam') || msg.includes('xeyr')) {
    return 'Salam! ASAN Xidmət köməkçisinə xoş gəldiniz. Hansı xidmət barədə məlumat almaq istəyirsiniz?';
  }

  return 'Kömək etmək üçün hazıram. Xidmət seçin və sualınızı verin. Demo rejimdə işləyirəm — tam funksionallıq üçün OpenAI açarı lazımdır.';
}

export default router;
