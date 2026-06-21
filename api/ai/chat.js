const Groq = require('groq-sdk');
const { seedServices } = require('../data/services');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { message, serviceSlug } = req.body || {};
  if (!message) return res.status(400).json({ message: 'Mesaj boşdur' });

  const service = serviceSlug ? seedServices.find(s => s.slug === serviceSlug) : null;

  if (!process.env.GROQ_API_KEY) {
    return res.status(200).json({ reply: getDemoReply(message, service), isDemo: true });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt(service) },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });
    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('Groq xətası:', err.message);
    return res.status(500).json({ message: 'AI cavab verə bilmədi', error: err.message });
  }
};

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
${(service.requiredDocuments || []).map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? ' (məcburi)' : ' (könüllü)'}`).join('\n') || 'Məlumat yoxdur'}`;
  }
  return prompt;
}

function getDemoReply(message, service) {
  const msg = message.toLowerCase();
  if (service) {
    if (msg.includes('sənəd') || msg.includes('lazım') || msg.includes('hansı')) {
      const docs = (service.requiredDocuments || []).map((d, i) => `${i + 1}. ${d.name}${d.isRequired ? '' : ' (könüllü)'}`).join('\n');
      return `"${service.name}" üçün lazım olan sənədlər:\n\n${docs || 'Məlumat yoxdur'}`;
    }
    if (msg.includes('müddət')) return `Müddət: ${service.duration || 'məlum deyil'}`;
    if (msg.includes('haqq') || msg.includes('pul')) return `Dövlət rüsumu: ${service.fee || 'Ödənişsiz'}`;
  }
  if (msg.includes('salam')) return 'Salam! ASAN Xidmət köməkçisinə xoş gəldiniz.';
  return 'Kömək etmək üçün hazıram. Xidmət seçin və sualınızı verin.';
}
