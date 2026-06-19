import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, LogOut, ChevronDown, ChevronUp,
  Save, X, Loader2, LayoutDashboard, FileText, Settings
} from 'lucide-react';
import {
  getAdminServices, createService, updateService, deleteService
} from '../api';
import toast from 'react-hot-toast';

const emptyDoc = {
  name: '', description: '', isRequired: true, validationRules: ''
};

const emptyService = {
  name: '', slug: '', category: '', icon: '📄',
  description: '', fullDescription: '', duration: '',
  fee: '', location: '', aiContext: '', requiredDocuments: []
};

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser') || 'admin';

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminServices();
      setServices(res.data);
    } catch {
      toast.error('Xidmətlər yüklənə bilmədi');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingService(null);
    setForm({ ...emptyService, requiredDocuments: [] });
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setForm({ ...service });
    setModalOpen(true);
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`"${service.name}" xidmətini silmək istəyirsiniz?`)) return;
    try {
      await deleteService(service._id);
      toast.success('Xidmət silindi');
      loadServices();
    } catch {
      toast.error('Silinə bilmədi');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description) {
      toast.error('Ad və açıqlama mütləqdir');
      return;
    }
    if (!form.slug) {
      form.slug = form.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    setIsSaving(true);
    try {
      if (editingService) {
        await updateService(editingService._id, form);
        toast.success('Xidmət yeniləndi');
      } else {
        await createService(form);
        toast.success('Xidmət əlavə edildi');
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Sənəd idarəsi
  const addDoc = () => setForm({ ...form, requiredDocuments: [...form.requiredDocuments, { ...emptyDoc }] });
  const removeDoc = (i) => setForm({
    ...form,
    requiredDocuments: form.requiredDocuments.filter((_, idx) => idx !== i)
  });
  const updateDoc = (i, field, value) => {
    const docs = [...form.requiredDocuments];
    docs[i] = { ...docs[i], [field]: value };
    setForm({ ...form, requiredDocuments: docs });
  };

  return (
    <div className="min-h-screen bg-asan-gray">
      {/* Sidebar + Header */}
      <div className="bg-asan-blue text-white px-4 sm:px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-asan-blue font-bold">A</span>
          </div>
          <div>
            <p className="font-bold text-sm">ASAN Xidmət</p>
            <p className="text-blue-200 text-xs">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-sm hidden sm:block">{adminUser}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white
                       bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={15} /> Çıxış
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Başlıq */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xidmətlər</h1>
            <p className="text-gray-500 text-sm">{services.length} xidmət</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={17} /> Yeni Xidmət
          </button>
        </div>

        {/* Cədvəl */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-asan-blue" />
          </div>
        ) : services.length === 0 ? (
          <div className="card text-center py-16">
            <FileText size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-4">Hələ xidmət əlavə edilməyib</p>
            <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> İlk xidməti əlavə et
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service._id} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {service.icon || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <span className="badge bg-blue-50 text-asan-blue">{service.category}</span>
                    {service.isActive === false && (
                      <span className="badge bg-red-50 text-red-500">Deaktiv</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{service.description}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {service.requiredDocuments?.length || 0} sənəd · {service.duration || '—'} · {service.fee || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 text-gray-400 hover:text-asan-blue hover:bg-blue-50 rounded-lg transition-colors"
                    title="Redaktə et"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 animate-fadeIn">
            {/* Modal başlığı */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingService ? 'Xidməti Redaktə Et' : 'Yeni Xidmət'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Forma */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Əsas məlumatlar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Xidmət adı *" className="sm:col-span-2">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Şəxsiyyət Vəsiqəsinin Yenilənməsi"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Slug (URL)">
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="sexsiyyet-vesiqesi"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Kateqoriya">
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Şəxsi Sənədlər"
                    className="form-input"
                  />
                </FormField>
                <FormField label="İkon (emoji)">
                  <input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🪪"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Müddət">
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="3 iş günü"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Dövlət rüsumu">
                  <input
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    placeholder="Ödənişsiz"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Yer" className="sm:col-span-2">
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Bütün ASAN Xidmət mərkəzləri"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Qısa açıqlama *" className="sm:col-span-2">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="Xidmətin qısa açıqlaması"
                    className="form-input resize-none"
                  />
                </FormField>
                <FormField label="Geniş açıqlama" className="sm:col-span-2">
                  <textarea
                    value={form.fullDescription}
                    onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                    rows={3}
                    placeholder="Xidmətin ətraflı açıqlaması"
                    className="form-input resize-none"
                  />
                </FormField>
                <FormField label="AI konteksti" className="sm:col-span-2">
                  <textarea
                    value={form.aiContext}
                    onChange={(e) => setForm({ ...form, aiContext: e.target.value })}
                    rows={2}
                    placeholder="AI-ə verilən əlavə məlumat (xüsusi tələblər, qeydlər)"
                    className="form-input resize-none"
                  />
                </FormField>
              </div>

              {/* Sənədlər */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-asan-blue" />
                    Tələb olunan sənədlər
                  </h3>
                  <button
                    onClick={addDoc}
                    className="flex items-center gap-1 text-sm text-asan-blue hover:text-blue-700
                               bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={14} /> Sənəd əlavə et
                  </button>
                </div>

                <div className="space-y-3">
                  {form.requiredDocuments.map((doc, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Sənəd #{i + 1}</span>
                        <button
                          onClick={() => removeDoc(i)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          value={doc.name}
                          onChange={(e) => updateDoc(i, 'name', e.target.value)}
                          placeholder="Sənədin adı"
                          className="form-input text-sm"
                        />
                        <input
                          value={doc.description}
                          onChange={(e) => updateDoc(i, 'description', e.target.value)}
                          placeholder="Qısa açıqlama"
                          className="form-input text-sm"
                        />
                      </div>
                      <textarea
                        value={doc.validationRules}
                        onChange={(e) => updateDoc(i, 'validationRules', e.target.value)}
                        placeholder="AI yoxlama qaydaları (hansı məlumatlar görünməlidir, şərt nədir)"
                        rows={2}
                        className="form-input text-sm resize-none w-full"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={doc.isRequired}
                          onChange={(e) => updateDoc(i, 'isRequired', e.target.checked)}
                          className="w-4 h-4 accent-asan-blue"
                        />
                        <span className="text-sm text-gray-600">Məcburi sənəd</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="btn-secondary"
              >
                Ləğv et
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <><Loader2 size={16} className="animate-spin" /> Saxlanır...</>
                ) : (
                  <><Save size={16} /> Saxla</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
