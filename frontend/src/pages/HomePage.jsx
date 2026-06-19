import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, FileCheck, ArrowRight, CheckCircle } from 'lucide-react';
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
      .then((res) => {
        setServices(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError('Xidmətlər yüklənə bilmədi. Backend-in işlədiyini yoxlayın.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    );
  }, [query, services]);

  const features = [
    {
      icon: <FileCheck size={22} className="text-asan-blue" />,
      title: 'Sənəd Siyahısı',
      desc: 'Hər xidmət üçün lazım olan sənədlərin tam siyahısı',
    },
    {
      icon: <Shield size={22} className="text-asan-blue" />,
      title: 'AI Yoxlama',
      desc: 'Sənədinizin şəklini yükləyin, AI düzgünlüyünü yoxlasın',
    },
    {
      icon: <Clock size={22} className="text-asan-blue" />,
      title: 'Vaxta Qənaət',
      desc: 'Mərkəzə gəlmədən hazırlığınızı tamamlayın',
    },
  ];

  return (
    <div>
      {/* Hero bölmə */}
      <section className="bg-gradient-to-br from-asan-blue to-blue-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <CheckCircle size={15} className="text-asan-gold" />
            Mərkəzə gəlmədən hazırlığınızı tamamlayın
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            ASAN Xidmət
            <span className="text-asan-gold"> Bələdçisi</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            İstədiyiniz xidmət barədə məlumat alın, lazımi sənədləri öyrənin
            və sənədlərinizi AI ilə yoxladın.
          </p>

          {/* Axtarış */}
          <div className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Xidmət axtar... (şəxsiyyət, arayış...)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-gray-900 text-sm
                         focus:outline-none focus:ring-2 focus:ring-asan-gold shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Xüsusiyyətlər */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Xidmətlər */}
      <section id="xidmetler" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Xidmətlər</h2>
              <p className="text-gray-500 text-sm mt-1">
                {filtered.length} xidmət mövcuddur
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-gray-400 text-xs mt-2">
                Backend-i işə salın: <code className="bg-red-100 px-1 rounded">cd asan-xidmet/backend && npm run dev</code>
              </p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">"{query}" üzrə xidmət tapılmadı</p>
              <button
                onClick={() => setQuery('')}
                className="mt-3 text-sm text-asan-blue hover:underline"
              >
                Axarışı təmizlə
              </button>
            </div>
          )}

          {!isLoading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service) => (
                <ServiceCard key={service._id || service.slug} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-asan-blue text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Sualınız var?</h2>
          <p className="text-blue-200 mb-6">
            AI köməkçimiz istənilən sualınıza cavab verməyə hazırdır
          </p>
          <button
            onClick={() => document.querySelector('[aria-label="AI Köməkçi"]')?.click()}
            className="inline-flex items-center gap-2 bg-asan-gold text-white px-6 py-3
                       rounded-xl font-medium hover:bg-yellow-500 transition-colors"
          >
            AI ilə Danış <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <ChatBot />
    </div>
  );
}
