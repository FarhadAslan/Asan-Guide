import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, MapPin, CreditCard,
  FileText, CheckCircle, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { getService } from '../api';
import DocumentChecker from '../components/DocumentChecker';
import ChatBot from '../components/ChatBot';

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'documents'

  useEffect(() => {
    setIsLoading(true);
    getService(slug)
      .then((res) => setService(res.data))
      .catch(() => setError('Xidmət tapılmadı'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg mb-4">Xidmət tapılmadı</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Ana Səhifə
        </Link>
      </div>
    );
  }

  const requiredDocs = service.requiredDocuments?.filter((d) => d.isRequired) || [];
  const optionalDocs = service.requiredDocuments?.filter((d) => !d.isRequired) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Geri düyməsi */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-asan-blue
                   transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Bütün xidmətlər
      </Link>

      {/* Başlıq */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
            {service.icon || '📄'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="badge bg-blue-50 text-asan-blue">{service.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
            <p className="text-gray-600 leading-relaxed">
              {service.fullDescription || service.description}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          {service.duration && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-asan-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Müddət</p>
                <p className="text-sm font-medium text-gray-900">{service.duration}</p>
              </div>
            </div>
          )}
          {service.fee && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard size={16} className="text-asan-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Dövlət rüsumu</p>
                <p className="text-sm font-medium text-gray-900">{service.fee}</p>
              </div>
            </div>
          )}
          {service.location && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-asan-blue" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Yer</p>
                <p className="text-sm font-medium text-gray-900">{service.location}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab seçici */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 shadow-sm">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'info'
              ? 'bg-asan-blue text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Info size={15} /> Məlumat
          </span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'documents'
              ? 'bg-asan-blue text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <FileText size={15} /> Sənəd Yoxlama
          </span>
        </button>
      </div>

      {/* --- Məlumat tab --- */}
      {activeTab === 'info' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Məcburi sənədlər */}
          {requiredDocs.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-asan-blue" />
                Məcburi Sənədlər
                <span className="badge bg-red-50 text-red-600">{requiredDocs.length}</span>
              </h2>
              <div className="space-y-3">
                {requiredDocs.map((doc, i) => (
                  <DocAccordion
                    key={i}
                    doc={doc}
                    index={i}
                    expanded={expandedDoc === `req-${i}`}
                    onToggle={() =>
                      setExpandedDoc(expandedDoc === `req-${i}` ? null : `req-${i}`)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Könüllü sənədlər */}
          {optionalDocs.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                Könüllü Sənədlər
                <span className="badge bg-gray-100 text-gray-500">{optionalDocs.length}</span>
              </h2>
              <div className="space-y-3">
                {optionalDocs.map((doc, i) => (
                  <DocAccordion
                    key={i}
                    doc={doc}
                    index={i}
                    expanded={expandedDoc === `opt-${i}`}
                    onToggle={() =>
                      setExpandedDoc(expandedDoc === `opt-${i}` ? null : `opt-${i}`)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sənəd yoxlama CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-asan-blue rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Sənədlərinizi yoxladın</h3>
            <p className="text-blue-100 text-sm mb-4">
              AI texnologiyası ilə sənədlərinizin düzgünlüyünü mərkəzə gəlmədən müəyyən edin
            </p>
            <button
              onClick={() => setActiveTab('documents')}
              className="bg-white text-asan-blue px-5 py-2 rounded-lg text-sm font-medium
                         hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              <CheckCircle size={15} /> Sənədi Yoxla
            </button>
          </div>
        </div>
      )}

      {/* --- Sənəd Yoxlama tab --- */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700 flex items-start gap-2">
              <Info size={15} className="mt-0.5 flex-shrink-0" />
              Sənədin şəklini yükləyin. AI sistemi sənədin düzgünlüyünü, oxunaqlığını
              və tələblərə uyğunluğunu yoxlayacaq.
            </p>
          </div>

          {service.requiredDocuments?.map((doc, i) => (
            <div key={i} className="card">
              <DocumentChecker
                document={doc}
                serviceSlug={service.slug}
              />
            </div>
          ))}

          {(!service.requiredDocuments || service.requiredDocuments.length === 0) && (
            <div className="card text-center py-10 text-gray-400">
              Bu xidmət üçün sənəd tələbi müəyyən edilməyib
            </div>
          )}
        </div>
      )}

      <ChatBot serviceSlug={service.slug} serviceName={service.name} />
    </div>
  );
}

// Accordion komponenti
function DocAccordion({ doc, index, expanded, onToggle }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-asan-blue text-white flex items-center
                        justify-center text-xs font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
          {doc.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {doc.isRequired ? (
            <span className="badge bg-red-50 text-red-600 hidden sm:inline-flex">Məcburi</span>
          ) : (
            <span className="badge bg-gray-100 text-gray-500 hidden sm:inline-flex">Könüllü</span>
          )}
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-fadeIn">
          {doc.description && (
            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
          )}
          {doc.validationRules && (
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-xs font-semibold text-asan-blue mb-1">Tələblər:</p>
              <p className="text-xs text-blue-700">{doc.validationRules}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
