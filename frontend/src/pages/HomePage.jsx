import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Shield, Clock, FileCheck,
  ArrowRight, ChevronRight, MessageSquare,
  CheckCircle, Star, Users, Award, ExternalLink
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import ChatBot from '../components/ChatBot';
import { getServices } from '../api';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => { setServices(res.data); setFiltered(res.data); })
      .catch(() => setError('Xidmətlər yüklənə bilmədi.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    ));
  }, [query, services]);

  return (
    <div className="min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative bg-asan-blue overflow-hidden">
        {/* Arxa fon dekorasiyası */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-asan-gold/10" />
          {/* Nöqtə şəbəkəsi */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Sol tərəf — mətn */}
            <div className="flex-1 text-center md:text-left animate-fadeInUp">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                              rounded-full px-4 py-1.5 text-sm text-blue-100 mb-6 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-asan-gold animate-pulse" />
                Rəsmi ASAN Xidmət Bələdçisi
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                Dövlət Xidmətlərini
                <span className="block text-asan-gold mt-1">Asanlaşdırırıq</span>
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                ASAN Xidmət mərkəzinə gəlmədən xidmətlər barədə məlumat alın,
                sənədlərinizi yoxladın və AI köməkçi ilə hazırlığınızı tamamlayın.
              </p>

              {/* Axtarış */}
              <div className="relative max-w-lg">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Xidmət axtar... (şəxsiyyət, arayış, pasport...)"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-900 text-sm
                             focus:outline-none focus:ring-2 focus:ring-asan-gold shadow-xl"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Statistika */}
              <div className="flex flex-wrap gap-6 mt-8 justify-center md:justify-start">
                {[
                  { icon: <Users size={16}/>, label: 'Xidmət', value: `${services.length || 2}` },
                  { icon: <Star size={16}/>, label: 'Onlayn Növbə', value: '✓' },
                  { icon: <Award size={16}/>, label: 'AI Dəstəyi', value: '24/7' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-blue-100">
                    <span className="text-asan-gold">{s.icon}</span>
                    <span className="font-bold text-white">{s.value}</span>
                    <span className="text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ tərəf — ən çox axtarılan xidmətlər */}
            <div className="hidden md:flex flex-col gap-2.5 w-72 flex-shrink-0 animate-slideIn">

              {/* Başlıq */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <Star size={13} className="text-asan-gold" />
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Ən çox axtarılan</p>
              </div>

              {/* 3 populyar xidmət */}
              <Link to="/xidmet/sexsiyyet-vesiqesi"
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5
                           flex items-center gap-3 hover:bg-white/20 transition-all group"
              >
                <span className="text-2xl flex-shrink-0">🪪</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">Şəxsiyyət Vəsiqəsi</p>
                  <p className="text-blue-300 text-xs mt-0.5">Yeniləmə · 3 iş günü · Ödənişsiz</p>
                </div>
                <ChevronRight size={14} className="text-blue-300 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>

              <a href="https://asan.gov.az/service/asan-xidmetler/uemumvetendas-pasportlarinin-verilmesi-ve-deyisdirilmesi"
                target="_blank" rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5
                           flex items-center gap-3 hover:bg-white/20 transition-all group"
              >
                <span className="text-2xl flex-shrink-0">🛂</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">Pasport Xidmətləri</p>
                  <p className="text-blue-300 text-xs mt-0.5">Ümumvətəndaş pasportu · asan.gov.az</p>
                </div>
                <ExternalLink size={13} className="text-blue-300 group-hover:text-asan-gold transition-all flex-shrink-0" />
              </a>

              <Link to="/xidmet/arxiv-arayisi"
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5
                           flex items-center gap-3 hover:bg-white/20 transition-all group"
              >
                <span className="text-2xl flex-shrink-0">📋</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight">Arxiv Arayışı</p>
                  <p className="text-blue-300 text-xs mt-0.5">Doğum, nikah, ölüm · 5 AZN</p>
                </div>
                <ChevronRight size={14} className="text-blue-300 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>

              {/* Ayırıcı xətt */}
              <div className="border-t border-white/10 my-0.5" />

              {/* Daha çox xidmət */}
              <a
                href="https://asan.gov.az/category/asan-xidmetler"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 bg-asan-gold/15 hover:bg-asan-gold/25
                           border border-asan-gold/30 rounded-2xl px-4 py-3 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-asan-gold" />
                  <span className="text-asan-gold text-sm font-semibold">Daha çox xidmət</span>
                </div>
                <ExternalLink size={13} className="text-asan-gold/70 group-hover:text-asan-gold group-hover:translate-x-0.5 transition-all" />
              </a>

            </div>
          </div>
        </div>

        {/* Alt dalğa */}
        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,40 L1440,40 L1440,10 Q1080,40 720,10 Q360,-20 0,10 Z" fill="#F4F6F9"/>
          </svg>
        </div>
      </section>

      {/* ===== XÜSUSİYYƏTLƏR ===== */}
      <section className="py-10 px-4 bg-asan-gray">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <FileCheck size={22} className="text-asan-blue" />,
                title: 'Sənəd Siyahısı',
                desc: 'Hər xidmət üçün lazım olan sənədlərin tam siyahısı',
                bg: 'bg-asan-sky',
              },
              {
                icon: <Shield size={22} className="text-asan-blue" />,
                title: 'AI Sənəd Yoxlama',
                desc: 'Sənədinizin şəklini yükləyin, AI düzgünlüyünü yoxlasın',
                bg: 'bg-asan-sky',
              },
              {
                icon: <Clock size={22} className="text-asan-blue" />,
                title: 'Vaxta Qənaət',
                desc: 'Mərkəzə gəlmədən hazırlığınızı tamamlayın',
                bg: 'bg-asan-sky',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-card border border-gray-100/80">
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== XİDMƏTLƏR ===== */}
      <section id="xidmetler" className="py-12 px-4 bg-asan-gray">
        <div className="max-w-6xl mx-auto">

          {/* Başlıq */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-asan-blue text-xs font-semibold uppercase tracking-widest mb-1">Kataloq</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Bütün Xidmətlər</h2>
            </div>
            {filtered.length > 0 && (
              <span className="text-sm text-gray-400 hidden sm:block">
                {filtered.length} xidmət tapıldı
              </span>
            )}
          </div>

          {/* Yüklənir */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-card animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Xəta */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <p className="text-gray-400 text-xs mt-2">Backend serverinin işlədiyini yoxlayın.</p>
            </div>
          )}

          {/* Nəticə yoxdur */}
          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg font-medium">"{query}" üzrə xidmət tapılmadı</p>
              <button onClick={() => setQuery('')} className="mt-4 btn-secondary">
                Axarışı Sıfırla
              </button>
            </div>
          )}

          {/* Kartlar */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(service => (
                <ServiceCard key={service._id || service.slug} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 px-4 bg-asan-blue relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-asan-gold/10" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Sualınız var?
          </h2>
          <p className="text-blue-200 mb-8 text-base">
            AI köməkçimiz xidmətlər, sənədlər və prosedurlar haqqında istənilən sualınıza cavab verməyə hazırdır.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => document.querySelector('[aria-label="AI Köməkçi"]')?.click()}
              className="inline-flex items-center justify-center gap-2 bg-asan-gold hover:bg-yellow-500
                         text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <MessageSquare size={18} /> AI ilə Danış
            </button>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20
                         text-white border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Rəsmi Sayta Get <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <ChatBot />
    </div>
  );
}
