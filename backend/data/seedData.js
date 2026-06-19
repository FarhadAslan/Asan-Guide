export const seedServices = [
  {
    _id: '1',
    name: 'Şəxsiyyət Vəsiqəsinin Yenilənməsi',
    slug: 'sexsiyyet-vesiqesi',
    category: 'Şəxsi Sənədlər',
    icon: '🪪',
    description: 'Müddəti bitmiş və ya itmiş şəxsiyyət vəsiqəsinin yenilənməsi xidməti.',
    fullDescription:
      'Bu xidmət vasitəsilə siz müddəti dolmuş, itmiş və ya zədələnmiş şəxsiyyət vəsiqənizi yeniləyə bilərsiniz. Xidmət bütün ASAN Xidmət mərkəzlərində mövcuddur.',
    duration: '3 iş günü',
    fee: 'Ödənişsiz (ilk dəfə), 15 AZN (itirilmiş halda)',
    location: 'Bütün ASAN Xidmət mərkəzləri',
    aiContext:
      'Şəxsiyyət vəsiqəsi yeniləmə üçün müraciətçinin şəxsən gəlməsi tələb olunur. 18 yaşdan aşağı uşaqlar üçün valideyn/qəyyum da gəlməlidir.',
    isActive: true,
    requiredDocuments: [
      {
        name: 'Köhnə şəxsiyyət vəsiqəsi',
        description: 'Müddəti bitmiş və ya zədələnmiş köhnə vəsiqə',
        isRequired: true,
        validationRules:
          'Azərbaycan Respublikasının şəxsiyyət vəsiqəsi olmalıdır. Ad, soyad, ata adı, doğum tarixi, seriya nömrəsi aydın görünməlidir.',
      },
      {
        name: 'Doğum haqqında şəhadətnamə',
        description: 'Orijinal doğum şəhadətnaməsi',
        isRequired: true,
        validationRules:
          'Azərbaycan Respublikasının DSMF tərəfindən verilmiş doğum şəhadətnaməsi. Ad, soyad, doğum tarixi, DSMF möhürü görünməlidir.',
      },
      {
        name: '3x4 foto şəkil',
        description: '2 ədəd rəngli foto şəkil (son 6 ay ərzində çəkilmiş)',
        isRequired: true,
        validationRules:
          'Ağ fonda, 3x4 sm ölçüdə, son 6 ay ərzində çəkilmiş foto. Üz aydın görünməli, gözlük olmamalıdır.',
      },
      {
        name: 'Propiska arayışı',
        description: 'Yaşayış yerindən arayış (DSMF)',
        isRequired: false,
        validationRules: 'DSMF tərəfindən verilmiş propiska arayışı. Ünvan, tarix, möhür görünməlidir.',
      },
    ],
  },
  {
    _id: '2',
    name: 'Arxiv Arayışı',
    slug: 'arxiv-arayisi',
    category: 'Arayışlar',
    icon: '📋',
    description: 'Dövlət arxivlərindən müxtəlif arayışların alınması xidməti.',
    fullDescription:
      'Bu xidmət vasitəsilə siz dövlət arxivlərindən doğum, nikah, boşanma, ölüm və digər qeydiyyat aktlarına dair arayışlar ala bilərsiniz.',
    duration: '5 iş günü',
    fee: '5 AZN',
    location: 'Seçilmiş ASAN Xidmət mərkəzləri',
    aiContext:
      'Arxiv arayışı almaq üçün arayışın hansı il üçün tələb olunduğunu bilmək vacibdir. Çox köhnə tarixlər (1920-ci ildən əvvəl) üçün Milli Arxivə müraciət lazım ola bilər.',
    isActive: true,
    requiredDocuments: [
      {
        name: 'Şəxsiyyət vəsiqəsi',
        description: 'Müraciətçinin şəxsiyyət vəsiqəsi',
        isRequired: true,
        validationRules:
          'Azərbaycan Respublikasının etibarlı şəxsiyyət vəsiqəsi. Müddəti bitməmiş olmalıdır. Ad, soyad, FİN kodu aydın görünməlidir.',
      },
      {
        name: 'Ərizə',
        description: 'Müəyyən formada doldurulmuş ərizə',
        isRequired: true,
        validationRules:
          'ASAN Xidmət tərəfindən təqdim olunan forma üzrə doldurulmuş ərizə. İmza və tarix olmalıdır.',
      },
      {
        name: 'Ödəniş qəbzi',
        description: '5 AZN dövlət rüsumu ödəniş qəbzi',
        isRequired: true,
        validationRules:
          'Bank və ya ASAN Ödəniş terminalı vasitəsilə ödənilmiş 5 AZN məbləğli qəbz. Tarix, məbləğ, xidmət kodu görünməlidir.',
      },
      {
        name: 'Vəkil etibarnaməsi',
        description: 'Başqası adından müraciət edildikdə notariat təsdiqlənmiş etibarnamə',
        isRequired: false,
        validationRules:
          'Notariat tərəfindən təsdiqlənmiş etibarnamə. Notarius möhürü, tarix, tərəflərin adları görünməlidir.',
      },
    ],
  },
];
