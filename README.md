# ASAN Xidmət Bələdçi Portalı

Vətəndaşların ASAN Xidmət mərkəzinə gəlmədən:
- Xidmətlər haqqında məlumat alması
- Lazımi sənədlər siyahısını öyrənməsi
- Sənədlərini AI ilə yoxlaması

## Texnologiyalar

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Verilənlər bazası:** MongoDB (istəyə bağlı)
- **AI:** OpenAI GPT-4o (Vision + Chat)

## Qurulum

### 1. Backend

```bash
cd asan-xidmet/backend
npm install
# .env faylında OPENAI_API_KEY əlavə edin
npm run dev
```

### 2. Frontend

```bash
cd asan-xidmet/frontend
npm install
npm run dev
```

### 3. Brauzerdə aç

- **İctimai sayt:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login

## Admin Giriş

- İstifadəçi adı: `admin`
- Şifrə: `admin123`

## OpenAI API Açarı

`backend/.env` faylında:
```
OPENAI_API_KEY=sk-...
```

Açarsız da işləyir — **demo rejim** aktivdir.

## Xidmətlər

Başlanğıc olaraq 2 xidmət mövcuddur:
1. Şəxsiyyət Vəsiqəsinin Yenilənməsi
2. Arxiv Arayışı

Admin paneldən istənilən qədər xidmət əlavə etmək olar.
