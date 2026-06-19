import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { adminLogin } from '../api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('İstifadəçi adı və şifrəni daxil edin');
      return;
    }
    setIsLoading(true);
    try {
      const res = await adminLogin(form);
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', res.data.username);
      toast.success('Giriş uğurludur');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş xətası baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-asan-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-asan-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">ASAN Xidmət Bələdçisi</p>
        </div>

        {/* Kart */}
        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                İstifadəçi adı
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:border-asan-blue focus:ring-1 focus:ring-asan-blue
                             transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Şifrə
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                             focus:outline-none focus:border-asan-blue focus:ring-1 focus:ring-asan-blue
                             transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Giriş edilir...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Daxil Ol
                </>
              )}
            </button>
          </form>

          {/* Demo məlumat */}
          <div className="mt-5 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">Demo giriş məlumatları:</p>
            <p className="text-xs text-blue-500 mt-0.5">
              İstifadəçi adı: <code className="bg-blue-100 px-1 rounded">admin</code> |{' '}
              Şifrə: <code className="bg-blue-100 px-1 rounded">admin123</code>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-asan-blue transition-colors"
          >
            ← Ana səhifəyə qayıt
          </a>
        </p>
      </div>
    </div>
  );
}
