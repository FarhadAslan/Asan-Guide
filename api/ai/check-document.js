const Groq = require('groq-sdk');
const { seedServices } = require('../data/services');

// Vercel default body size 4.5MB-dır, biz JSON base64 göndəririk
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const { documentName, serviceSlug, validationRules, imageBase64, mimeType } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ message: 'Sənəd şəkli tapılmadı' });
    }

    const service = serviceSlug ? seedServices.find(s => s.slug === serviceSlug) : null;

    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({
        isValid: true,
        confidence: 85,
        issues: [],
        suggestions: ['Demo rejimdə işləyir.'],
        summary: `"${documentName || 'Sənəd'}" yükləndi. Demo rejimdə tam yoxlama mövcud deyil.`,
        isDemo: true,
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: buildPrompt(documentName, validationRules, service) },
          { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } },
        ],
      }],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    return res.status(200).json(parseResponse(content));
  } catch (err) {
    console.error('check-document xətası:', err.message);
    return res.status(500).json({ message: 'Sənəd yoxlanıla bilmədi', error: err.message });
  }
};

function buildPrompt(documentName, validationRules, service) {
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

function parseResponse(content) {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return {
    isValid: false,
    confidence: 0,
    issues: ['Cavab formatı tanınmadı'],
    suggestions: ['Yenidən cəhd edin'],
    summary: content,
  };
}
