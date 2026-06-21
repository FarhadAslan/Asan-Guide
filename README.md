# ASAN Xidmət Bələdçi Portalı

Vətəndaşların ASAN Xidmət mərkəzinə gəlmədən:
- Xidmətlər haqqında məlumat alması
- Lazımi sənədlər siyahısını öyrənməsi
- Sənədlərini AI ilə yoxlaması

> ⚠️ Bu sayt irəli sürülən ideya üçün bir prototipdir.

## Texnologiyalar

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Groq API — Llama 3.3 70B + Llama 4 Scout (Vision)

## Vercel Deploy

### 1. Repo-nu Vercel-ə qoş

[vercel.com](https://vercel.com) → "New Project" → GitHub repo-nu seç

### 2. Environment Variables əlavə et

Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `gsk_...` |

### 3. Deploy et

Vercel avtomatik `vercel.json`-u oxuyub deploy edəcək.

## Lokal İnkişaf

### Backend (Express)
```bash
cd backend
npm install
npm run dev        # http://localhost:5000
```

### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## Layihə Strukturu

```
/
├── api/                    # Vercel Serverless Functions
│   ├── data/services.js    # Statik xidmət datası
│   ├── services.js         # GET /api/services
│   ├── services/[slug].js  # GET /api/services/:slug
│   └── ai/
│       ├── chat.js         # POST /api/ai/chat
│       └── check-document.js # POST /api/ai/check-document
├── frontend/               # React + Vite app
│   └── src/
├── backend/                # Lokal dev üçün Express server
├── vercel.json             # Vercel konfiqurasiyası
└── package.json            # Root dependencies
```

## Groq API Key

[console.groq.com](https://console.groq.com) → API Keys → Create API Key

Pulsuz tier: 1,000 sorğu/gün, kredit kartı tələb olunmur.
