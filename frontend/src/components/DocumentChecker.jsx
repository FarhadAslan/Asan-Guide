import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, CheckCircle, XCircle, AlertCircle,
  Loader2, FileImage, RotateCcw, Info
} from 'lucide-react';
import { checkDocument } from '../api';
import toast from 'react-hot-toast';

export default function DocumentChecker({ document, serviceSlug }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Yalnız JPG, PNG fayllar qəbul edilir (max 10MB)');
      return;
    }
    const f = acceptedFiles[0];
    setFile(f);
    setResult(null);
    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleCheck = async () => {
    if (!file) return;
    setIsChecking(true);
    try {
      const res = await checkDocument(
        file,
        document.name,
        serviceSlug,
        document.validationRules
      );
      setResult(res.data);
    } catch (err) {
      toast.error('Sənəd yoxlanıla bilmədi. Backend-in işlədiyini yoxlayın.');
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const getStatusColor = () => {
    if (!result) return '';
    if (result.isValid && result.confidence >= 70) return 'border-green-200 bg-green-50';
    if (!result.isValid || result.confidence < 50) return 'border-red-200 bg-red-50';
    return 'border-yellow-200 bg-yellow-50';
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.isValid && result.confidence >= 70)
      return <CheckCircle size={22} className="text-green-500" />;
    if (!result.isValid || result.confidence < 50)
      return <XCircle size={22} className="text-red-500" />;
    return <AlertCircle size={22} className="text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Sənəd başlığı */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{document.name}</h4>
            {document.isRequired ? (
              <span className="badge bg-red-50 text-red-600">Məcburi</span>
            ) : (
              <span className="badge bg-gray-100 text-gray-500">Könüllü</span>
            )}
          </div>
          {document.description && (
            <p className="text-sm text-gray-500 mt-0.5">{document.description}</p>
          )}
        </div>
      </div>

      {/* Yükləmə zonası */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-asan-blue bg-blue-50'
              : 'border-gray-200 hover:border-asan-blue hover:bg-blue-50/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium text-gray-600">
            {isDragActive ? 'Buraxın...' : 'Şəkli bura sürükləyin'}
          </p>
          <p className="text-xs text-gray-400 mt-1">və ya klikləyin</p>
          <p className="text-xs text-gray-300 mt-2">JPG, PNG — max 10MB</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={preview}
              alt="Sənəd önizləməsi"
              className="w-full max-h-48 object-contain p-2"
            />
            <button
              onClick={reset}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm
                         hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
              title="Sil"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileImage size={15} />
            <span className="truncate">{file.name}</span>
            <span className="text-gray-300 flex-shrink-0">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </div>

          {/* Yoxla düyməsi */}
          {!result && (
            <button
              onClick={handleCheck}
              disabled={isChecking}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  AI yoxlayır...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Sənədi Yoxla
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Nəticə */}
      {result && (
        <div className={`rounded-xl border p-4 space-y-3 animate-fadeIn ${getStatusColor()}`}>
          {/* Başlıq */}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{result.summary}</p>
              <p className="text-xs text-gray-500">
                Etibarlılıq: {result.confidence}%
              </p>
            </div>
            {result.isDemo && (
              <span className="badge bg-yellow-100 text-yellow-700">Demo</span>
            )}
          </div>

          {/* Problemlər */}
          {result.issues?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                <XCircle size={12} /> Problemlər:
              </p>
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span> {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tövsiyələr */}
          {result.suggestions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                <Info size={12} /> Tövsiyələr:
              </p>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-blue-600 flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={reset}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RotateCcw size={12} /> Yenidən yoxla
          </button>
        </div>
      )}
    </div>
  );
}
