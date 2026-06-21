import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToServices = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Ana səhifəyə keçiddən sonra scroll et
      setTimeout(() => {
        document.getElementById('xidmetler')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('xidmetler')?.scrollIntoView({ behavior: 'smooth' });
    }
  };;

  return (
    <nav
      className={`bg-asan-blue sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      {/* Üst çubuq — rəsmi ASAN saytına keçid */}
      <div className="bg-asan-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs text-blue-200">
            <span>Azərbaycan Respublikasının Prezidenti yanında Vətəndaşlara Xidmət və Sosial İnnovasiyalar üzrə Dövlət Agentliyi</span>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
            >
              asan.gov.az <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Əsas navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* ASAN logo şəkli */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                {/* ASAN "A" logo */}
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                  <rect width="40" height="40" rx="8" fill="#003F87"/>
                  <path d="M20 8L32 30H8L20 8Z" fill="white" fillOpacity="0.15"/>
                  <path d="M20 10L30 28H10L20 10Z" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M14 24H26" stroke="white" strokeWidth="1.5"/>
                  <circle cx="20" cy="18" r="2" fill="#F5A623"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight tracking-wide">ASAN Bələdçi</p>
                <p className="text-blue-200 text-[10px] leading-none tracking-wider uppercase">Xidmət Portalı</p>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={location.pathname === '/'}>Ana Səhifə</NavLink>
            <a
              href="#xidmetler"
              onClick={scrollToServices}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-blue-100 hover:text-white hover:bg-white/10"
            >
              Xidmətlər
            </a>
            <a
              href="https://enovbe.asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-100 hover:text-white px-4 py-2
                         rounded-lg hover:bg-white/10 text-sm font-medium transition-all"
            >
              Onlayn Növbə <ExternalLink size={12} />
            </a>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-1.5 bg-asan-gold/90 hover:bg-asan-gold
                         text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              ASAN.gov.az <ExternalLink size={12} />
            </a>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menyu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-asan-dark border-t border-white/10 animate-fadeIn">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Ana Səhifə</MobileNavLink>
            <a
              href="#xidmetler"
              onClick={scrollToServices}
              className="block text-blue-100 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 text-sm font-medium"
            >
              Xidmətlər
            </a>
            <a
              href="https://enovbe.asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-200 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 text-sm"
            >
              Onlayn Növbə
            </a>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-asan-gold hover:text-yellow-300 py-2.5 px-3 rounded-lg hover:bg-white/10 text-sm font-semibold"
            >
              ASAN.gov.az →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'text-white bg-white/20'
          : 'text-blue-100 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-blue-100 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 text-sm font-medium"
    >
      {children}
    </Link>
  );
}
