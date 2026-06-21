import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, MapPin, CreditCard,
  FileText, CheckCircle, ChevronDown, ChevronUp,
  Info, Shield, Layers
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
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    setIsLoading(true);
    getService(slug)
      .then(res => setService(res.data))
      .catch(() => setError('Xidmət tapılmadı'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-36 mb-8" />
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <p className="text-gray-500 text-lg font-medium mb-6">Xidmət tapılmadı</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Ana Səhifəyə Qayıt
        </Link>
      </div>
    );
  }

  const requiredDocs = service.requiredDocuments?.filter(d => d.isRequired) || [];
  const optionalDocs = service.requiredDocuments?.filter(d => !d.isRequired) || [];

  const tabs = [
    { id: 'info',      icon: <Info size={15}/>,      label: 'Məlumat' },
    { id: 'documents', icon: <Shield size={15}/>,    label: 'Sənəd Yoxlama' },
  ];

  return (
    <div className="bg-asan-gray min-h-screen">

      {/* Hero başlıq */}
      <div className="bg-asan-blue">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm
                       transition-colors mb-6"
          >
            <ArrowLeft size={15} /> Bütün xidmətlər
          </Link>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl
                            flex items-center justify-center text-4xl flex-shrink-0 border border-white/20">
              {service.icon || '📄'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block badge bg-asan-gold/20 text-asan-gold border border-asan-gold/30 mb-2">
                {service.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{service.name}</h1>
              <p className="text-blue-200 text-sm leading-relaxed">
                {service.fullDescription || service.description}
              </p>
            </div>
          </div>

          {/* Meta məlumatlar */}
          {(service.duration || service.fee || service.location) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {service.duration && (
                <MetaBadge icon={<Clock size={13}/>} label="Müddət" value={service.duration} />
              )}
              {service.fee && (
                <MetaBadge icon={<CreditCard size={13}/>} label="Dövlət rüsumu" value={service.fee} />
              )}
              {service.location && (
                <MetaBadge icon={<MapPin size={13}/>} label="Yer" value={service.location} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tab seçici */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-asan-blue text-asan-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab məzmunu */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== Məlumat tab ===== */}
        {activeTab === 'info' && (
          <div className="space-y-5 animate-fadeIn">

            {/* Məcburi sənədlər */}
            {requiredDocs.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <FileText size={17} className="text-red-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">Məcburi Sənədlər</h2>
                    <p className="text-xs text-gray-400">{requiredDocs.length} sənəd tələb olunur</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {requiredDocs.map((doc, i) => (
                    <DocAccordion
                      key={i} doc={doc} index={i}
                      expanded={expandedDoc === `req-${i}`}
                      onToggle={() => setExpandedDoc(expandedDoc === `req-${i}` ? null : `req-${i}`)}
                      required
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Könüllü sənədlər */}
            {optionalDocs.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Layers size={17} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">Könüllü Sənədlər</h2>
                    <p className="text-xs text-gray-400">{optionalDocs.length} əlavə sənəd</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {optionalDocs.map((doc, i) => (
                    <DocAccordion
                      key={i} doc={doc} index={i}
                      expanded={expandedDoc === `opt-${i}`}
                      onToggle={() => setExpandedDoc(expandedDoc === `opt-${i}` ? null : `opt-${i}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sənəd yoxlama CTA */}
            <div className="relative bg-gradient-to-br from-asan-blue to-asan-lightblue rounded-2xl p-6 text-white overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">AI ilə Sənəd Yoxlaması</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      Sənədlərinizin şəklini yükləyin, AI sistemi anında yoxlasın.
                    </p>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="inline-flex items-center gap-2 bg-white text-asan-blue
                                 px-5 py-2.5 rounded-xl text-sm font-semibold
                                 hover:bg-blue-50 transition-colors"
                    >
                      <CheckCircle size={15} /> Sənədi Yoxla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Sənəd Yoxlama tab ===== */}
        {activeTab === 'documents' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-asan-sky border border-asan-blue/15 rounded-2xl p-4 flex items-start gap-3">
              <Info size={16} className="text-asan-blue mt-0.5 flex-shrink-0" />
              <p className="text-sm text-asan-blue">
                Sənədin aydın şəklini yükləyin. AI sistemi sənədin düzgünlüyünü,
                oxunaqlığını və tələblərə uyğunluğunu yoxlayacaq.
              </p>
            </div>

            {service.requiredDocuments?.map((doc, i) => (
              <div key={i} className="card">
                <DocumentChecker document={doc} serviceSlug={service.slug} />
              </div>
            ))}

            {(!service.requiredDocuments || service.requiredDocuments.length === 0) && (
              <div className="card text-center py-14 text-gray-400">
                Bu xidmət üçün sənəd tələbi müəyyən edilməyib
              </div>
            )}
          </div>
        )}
      </div>

      <ChatBot serviceSlug={service.slug} serviceName={service.name} />
    </div>
  );
}

function MetaBadge({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15
                    rounded-xl px-3 py-2 text-sm text-white">
      <span className="text-blue-200">{icon}</span>
      <span className="text-blue-200 text-xs">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function DocAccordion({ doc, index, expanded, onToggle, required }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${
      expanded ? 'border-asan-blue/30 bg-asan-sky/50' : 'border-gray-100 hover:border-gray-200'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          required ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
        }`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{doc.name}</p>
          {doc.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {required
            ? <span className="badge bg-red-50 text-red-500 text-[10px] hidden sm:inline-flex">Məcburi</span>
            : <span className="badge bg-gray-100 text-gray-400 text-[10px] hidden sm:inline-flex">Könüllü</span>
          }
          {expanded
            ? <ChevronUp size={15} className="text-asan-blue" />
            : <ChevronDown size={15} className="text-gray-400" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 animate-fadeIn">
          {doc.description && (
            <p className="text-sm text-gray-600 mt-3 mb-2">{doc.description}</p>
          )}
          {doc.validationRules && (
            <div className="bg-asan-blue/5 border border-asan-blue/10 rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-asan-blue mb-1">📋 Tələblər:</p>
              <p className="text-xs text-asan-blue/80">{doc.validationRules}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
