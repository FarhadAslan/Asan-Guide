import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CreditCard, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/xidmet/${service.slug}`}
      className="card group hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col"
    >
      {/* İkon + kateqoriya */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl
                        group-hover:bg-blue-100 transition-colors">
          {service.icon || '📄'}
        </div>
        <span className="badge bg-blue-50 text-asan-blue">{service.category}</span>
      </div>

      {/* Ad & açıqlama */}
      <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-asan-blue transition-colors">
        {service.name}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
        {service.description}
      </p>

      {/* Meta məlumatlar */}
      <div className="space-y-1.5 mb-5">
        {service.duration && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={13} className="text-asan-blue" />
            <span>{service.duration}</span>
          </div>
        )}
        {service.fee && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CreditCard size={13} className="text-asan-blue" />
            <span>{service.fee}</span>
          </div>
        )}
        {service.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-asan-blue" />
            <span>{service.location}</span>
          </div>
        )}
      </div>

      {/* Sənəd sayı */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {service.requiredDocuments?.length || 0} sənəd tələb olunur
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-asan-blue
                         group-hover:gap-2 transition-all">
          Ətraflı <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}
