import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-asan-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-asan-blue font-bold text-lg">A</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">ASAN Xidmət</p>
              <p className="text-blue-200 text-xs">Bələdçi Portalı</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-asan-gold'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Ana Səhifə
            </Link>
            <Link
              to="/#xidmetler"
              className="text-blue-100 hover:text-white text-sm font-medium transition-colors"
            >
              Xidmətlər
            </Link>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
            >
              ASAN.gov.az <ChevronRight size={14} />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Menyu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-700 animate-fadeIn">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-blue-100 hover:text-white py-2 text-sm font-medium"
            >
              Ana Səhifə
            </Link>
            <Link
              to="/#xidmetler"
              onClick={() => setIsOpen(false)}
              className="block text-blue-100 hover:text-white py-2 text-sm font-medium"
            >
              Xidmətlər
            </Link>
            <a
              href="https://asan.gov.az"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-100 hover:text-white py-2 text-sm font-medium"
            >
              ASAN.gov.az
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
