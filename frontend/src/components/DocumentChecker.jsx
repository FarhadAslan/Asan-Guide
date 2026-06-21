import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, CheckCircle, XCircle, AlertCircle,
  Loader2, FileImage, RotateCcw, Info, Sparkles
} from 'lucide-react';
import { checkDocument } from '../api';
import toast from 'react-hot-toast';

export default function DocumentChecker({ document, serviceSlug }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Yalnız JPG, PNG fayllar qəbul edilir (max 4MB)');
      return;
    }
    const f = accepted[0];
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
  });

  const handleCheck = async () => {
    if (!file) return;
    setIsChecking(true);
    try {
      const res = await checkDocument(file, document.name, serviceSlug, document.validationRules);
      setResult(res.data);
    } catch {
      toast.error('Sənəd yoxlanıla bilmədi.');
    } finally {
      setIsChecking(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); };

  const statusConfig = () => {
    if (!result) return null;
    if (result.isValid && result.confidence >= 70)
      return { color: 'border-green-200 bg-green-50', icon: <CheckCircle size={20} className="text-green-500"/>, label: 'Qəbul edilə bilər', labelColor: 'text-green-700' };
    if (!result.isValid || result.confidence < 50)
      return { color: 'border-red-200 bg-red-50', icon: <XCircle size={20} className="text-red-500"/>, label: 'Problemlər var', labelColor: 'text-red-700' };
    return { color: 'border-yellow-200 bg-yellow-50', icon: <AlertCircle size={20} className="text-yellow-500"/>, label: 'Diqqət tələb edir', labelColor: 'text-yellow-700' };
  };

  const status = statusConfig();

  return (
    <div className="space-y-4">
      {/* Başlıq */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          document.isRequired ? 'bg-red-50' : 'bg-gray-100'
        }`}>
          <FileImage size={16} className={document.isRequired ? 'text-red-400' : 'text-gray-400'} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 text-sm">{document.name}</h4>
            {document.isRequired
              ? <span className="badge bg-red-50 text-red-500 text-[10px]">Məcburi</span>
              : <span className="badge bg-gray-100 text-gray-400 text-[10px]">Könüllü</span>
            }
          </div>
          {document.description && (
            <p className="text-xs text-gray-400 mt-0.5">{document.description}</p>
          )}
        </div>
      </div>

      {/* Upload zonası */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-asan-blue bg-asan-sky scale-[1.01]'
              : 'border-gray-200 hover:border-asan-blue hover:bg-asan-sky/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors ${
            isDragActive ? 'bg-asan-blue' : 'bg-gray-100'
          }`}>
            <Upload size={22} className={isDragActive ? 'text-white' : 'text-gray-400'} />
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {isDragActive ? 'Buraxın...' : 'Şəkli bura sürükləyin'}
          </p>
          <p className="text-xs text-gray-400">və ya seçmək üçün klikləyin</p>
          <p className="text-[10px] text-gray-300 mt-2">JPG, PNG — maksimum 4MB</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
            <img src={preview} alt="Önizləmə" className="w-full max-h-52 object-contain p-3" />
            <button
              onClick={reset}
              className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-xl shadow-sm
                         flex items-center justify-center hover:bg-red-50 hover:text-red-500
                         text-gray-400 transition-colors border border-gray-100"
              title="Sil"
            >
              <RotateCcw size={13} />
            </button>
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5
                            bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-gray-100">
              <FileImage size={11} className="text-gray-400" />
              <span className="text-[10px] text-gray-600 max-w-[160px] truncate">{file.name}</span>
              <span className="text-[10px] text-gray-400">· {(file.size/1024).toFixed(0)}KB</span>
            </div>
          </div>

          {/* Yoxla düyməsi */}
          {!result && (
            <button
              onClick={handleCheck}
              disabled={isChecking}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <><Loader2 size={15} className="animate-spin" /> AI yoxlayır...</>
              ) : (
                <><Sparkles size={15} /> Sənədi Yoxla</>
              )}
            </button>
          )}
        </div>
      )}

      {/* Nəticə */}
      {result && status && (
        <div className={`rounded-2xl border p-4 space-y-3 animate-fadeIn ${status.color}`}>
          {/* Status */}
          <div className="flex items-center gap-3">
            {status.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-bold text-sm ${status.labelColor}`}>{status.label}</p>
                {result.isDemo && (
                  <span className="badge bg-yellow-100 text-yellow-600 text-[10px]">Demo</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{result.summary}</p>
            </div>
            {/* Confidence göstərici */}
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-extrabold text-gray-700">{result.confidence}%</p>
              <p className="text-[10px] text-gray-400">etibarlılıq</p>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                result.confidence >= 70 ? 'bg-green-500' :
                result.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>

          {/* Problemlər */}
          {result.issues?.length > 0 && (
            <div className="bg-white/60 rounded-xl p-3">
              <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                <XCircle size={12} /> Problemlər
              </p>
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                    <span className="text-red-300 mt-0.5 flex-shrink-0">•</span> {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tövsiyələr */}
          {result.suggestions?.length > 0 && (
            <div className="bg-white/60 rounded-xl p-3">
              <p className="text-xs font-bold text-asan-blue mb-2 flex items-center gap-1">
                <Info size={12} /> Tövsiyələr
              </p>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-asan-blue flex items-start gap-1.5">
                    <span className="text-asan-blue/40 mt-0.5 flex-shrink-0">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={11} /> Yenidən yoxla
          </button>
        </div>
      )}
    </div>
  );
}
