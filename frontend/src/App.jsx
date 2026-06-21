import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import { Info, X, FlaskConical } from 'lucide-react';

function DisclaimerModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Arxa fon */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-fadeInUp overflow-hidden">
        {/* Üst rəngli hissə */}
        <div className="bg-gradient-to-r from-asan-blue to-asan-lightblue px-6 pt-6 pb-8">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FlaskConical size={24} className="text-white" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white/70 hover:text-white"
              aria-label="Bağla"
            >
              <X size={18} />
            </button>
          </div>
          <h2 className="text-white font-extrabold text-xl mt-4 leading-snug">
            Prototip Xəbərdarlığı
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Bu sayta daxil olmadan əvvəl oxuyun
          </p>
        </div>

        {/* Aşağı dalğa */}
        <div className="-mt-4 relative z-10">
          <svg viewBox="0 0 400 20" className="w-full" preserveAspectRatio="none">
            <path d="M0,0 Q200,20 400,0 L400,20 L0,20 Z" fill="white"/>
          </svg>
        </div>

        {/* Məzmun */}
        <div className="px-6 pb-6 -mt-2">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <span className="font-bold">Bu sayt irəli sürülən ideya üçün bir prototipdir.</span>
                {' '}Rəsmi ASAN Xidmət portalı deyil və hər hansı hüquqi qüvvəsi yoxdur.
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {[
              'Göstərilən xidmət məlumatları yalnız nümunə xarakteri daşıyır',
              'AI sənəd yoxlaması real hüquqi qiymətləndirmə sayılmır',
              'Rəsmi müraciət üçün asan.gov.az saytına daxil olun',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-asan-sky text-asan-blue flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={onClose}
            className="w-full bg-asan-blue hover:bg-asan-lightblue text-white font-semibold
                       py-3 rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
          >
            Başa düşdüm, davam et
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Bu xəbərdarlıq yalnız bir dəfə göstərilir
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('disclaimer_seen');
    if (!seen) setShowDisclaimer(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem('disclaimer_seen', '1');
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif' },
        }}
      />

      {showDisclaimer && <DisclaimerModal onClose={handleClose} />}

      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/xidmet/:slug" element={<ServicePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
