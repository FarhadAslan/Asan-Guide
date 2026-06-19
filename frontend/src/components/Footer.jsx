import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-asan-blue text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & açıqlama */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-asan-blue font-bold text-lg">A</span>
              </div>
              <div>
                <p className="font-bold text-lg">ASAN Xidmət</p>
                <p className="text-blue-200 text-xs">Bələdçi Portalı</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Mərkəzə gəlmədən xidmətlər haqqında məlumat alın, sənədlərinizi yoxladın.
            </p>
          </div>

          {/* Sürətli keçidlər */}
          <div>
            <h3 className="font-semibold text-asan-gold mb-4">Sürətli Keçidlər</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Səhifə</Link></li>
              <li><Link to="/#xidmetler" className="hover:text-white transition-colors">Xidmətlər</Link></li>
              <li>
                <a href="https://asan.gov.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors">
                  Rəsmi ASAN Saytı
                </a>
              </li>
            </ul>
          </div>

          {/* Əlaqə */}
          <div>
            <h3 className="font-semibold text-asan-gold mb-4">Əlaqə</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <Phone size={15} />
                <span>*8880</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} />
                <span>info@asan.gov.az</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span>Bakı, Azərbaycan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-6 flex flex-col md:flex-row justify-between
                        items-center gap-3 text-xs text-blue-300">
          <p>© 2024 ASAN Xidmət Bələdçi Portalı. Bütün hüquqlar qorunur.</p>
          <p>Bu portal məlumat xarakteri daşıyır</p>
        </div>
      </div>
    </footer>
  );
}
