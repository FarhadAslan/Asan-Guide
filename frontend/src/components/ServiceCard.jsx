import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CreditCard, ArrowRight, FileText } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/xidmet/${service.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-card
                 hover:shadow-card-hover hover:border-asan-blue/20
                 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Üst rəngli zolaq */}
      <div className="h-1 bg-gradient-to-r from-asan-blue to-asan-lightblue
                      group-hover:from-asan-gold group-hover:to-asan-blue transition-all duration-300" />

      <div className="p-5 flex flex-col flex-1">
        {/* İkon + kateqoriya */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-asan-sky rounded-xl flex items-center justify-center text-2xl
                          group-hover:bg-asan-blue/10 transition-colors">
            {service.icon || '📄'}
          </div>
          <span className="badge bg-asan-sky text-asan-blue text-[11px] font-semibold border border-asan-blue/10">
            {service.category}
          </span>
        </div>

        {/* Ad & açıqlama */}
        <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-asan-blue transition-colors leading-snug">
          {service.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          {service.duration && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} className="text-asan-blue flex-shrink-0" />
              <span>{service.duration}</span>
            </div>
          )}
          {service.fee && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CreditCard size={12} className="text-asan-blue flex-shrink-0" />
              <span>{service.fee}</span>
            </div>
          )}
          {service.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={12} className="text-asan-blue flex-shrink-0" />
              <span>{service.location}</span>
            </div>
          )}
        </div>

        {/* Alt hissə */}
        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <FileText size={12} />
            <span>{service.requiredDocuments?.length || 0} sənəd</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-asan-blue
                           group-hover:gap-2 transition-all">
            Ətraflı <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
