import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-asan-dark text-white">
      {/* Əsas footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & açıqlama */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-asan-blue rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                  <path d="M20 6L32 28H8L20 6Z" fill="none" stroke="white" strokeWidth="2"/>
                  <path d="M13 22H27" stroke="white" strokeWidth="2"/>
                  <circle cx="20" cy="15" r="2.5" fill="#F5A623"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-base leading-tight">ASAN Bələdçi</p>
                <p className="text-blue-300 text-[10px] uppercase tracking-wider">Xidmət Portalı</p>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Vətəndaşların ASAN Xidmət mərkəzinə gəlmədən xidmətlər haqqında məlumat alması üçün rəsmi bələdçi portal.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/asanxidmat" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 bg-white/10 hover:bg-asan-blue rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={14} />
              </a>
              <a href="https://youtube.com/user/asanxidmat" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Xidmətlər */}
          <div>
            <h3 className="font-semibold text-asan-gold text-sm mb-4 uppercase tracking-wider">Xidmətlər</h3>
            <ul className="space-y-2.5 text-sm text-blue-300">
              <li><Link to="/" className="hover:text-white transition-colors">Ana Səhifə</Link></li>
              <li><Link to="/#xidmetler" className="hover:text-white transition-colors">Bütün Xidmətlər</Link></li>
              <li>
                <a href="https://enovbe.asan.gov.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors flex items-center gap-1">
                  Onlayn Növbə <ExternalLink size={11}/>
                </a>
              </li>
              <li>
                <a href="https://asanpay.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors flex items-center gap-1">
                  ASAN Ödəniş <ExternalLink size={11}/>
                </a>
              </li>
            </ul>
          </div>

          {/* Faydalı keçidlər */}
          <div>
            <h3 className="font-semibold text-asan-gold text-sm mb-4 uppercase tracking-wider">Faydalı Keçidlər</h3>
            <ul className="space-y-2.5 text-sm text-blue-300">
              <li>
                <a href="https://asan.gov.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors flex items-center gap-1">
                  Rəsmi ASAN Saytı <ExternalLink size={11}/>
                </a>
              </li>
              <li>
                <a href="https://asan.gov.az/faq" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors">Tez-tez Verilən Suallar</a>
              </li>
              <li>
                <a href="https://opendata.vxsida.gov.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors flex items-center gap-1">
                  Açıq Data Portalı <ExternalLink size={11}/>
                </a>
              </li>
              <li>
                <a href="https://www.e-gov.az" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors flex items-center gap-1">
                  e-Gov.az <ExternalLink size={11}/>
                </a>
              </li>
            </ul>
          </div>

          {/* Əlaqə */}
          <div>
            <h3 className="font-semibold text-asan-gold text-sm mb-4 uppercase tracking-wider">Əlaqə</h3>
            <ul className="space-y-3 text-sm text-blue-300">
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={13} className="text-asan-gold" />
                </div>
                <span>*8880 (Çağrı Mərkəzi)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={13} className="text-asan-gold" />
                </div>
                <span>info@asan.gov.az</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-asan-gold" />
                </div>
                <span>Bakı, Azərbaycan Respublikası</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alt çubuq */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-400">
            © {new Date().getFullYear()} ASAN Xidmət Bələdçi Portalı. Bu portal məlumat xarakteri daşıyır.
          </p>
          <div className="flex items-center gap-1 text-xs text-blue-400">
            <span>Azərbaycan Respublikasının Prezidenti yanında</span>
            <a href="https://asan.gov.az" target="_blank" rel="noopener noreferrer"
               className="text-asan-gold hover:text-yellow-300 transition-colors">VXSIDA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
