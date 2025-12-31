/**
 * LOGIN PAGE - ADMIN
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
  });
  const [requires2FA, setRequires2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.twoFactorCode || undefined
      );

      if (result.requires2FA) {
        setRequires2FA(true);
        toast.success('Ingresa tu código 2FA');
        return;
      }

      // Verificar que sea admin o filial
      if (result.user.role !== 'admin' && result.user.role !== 'filial') {
        toast.error('No tienes permisos para acceder al panel de administración');
        await useAuth.getState().logout();
        return;
      }

      toast.success('Bienvenido al panel de administración');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-red-600 rounded-full mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Rosedal II</h1>
            <p className="text-gray-600 mt-2">Panel de Administración</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="admin@rosedal2.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
            />

            {requires2FA && (
              <Input
                type="text"
                label="Código 2FA"
                placeholder="123456"
                value={formData.twoFactorCode}
                onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value })}
                required
                maxLength={6}
                disabled={isLoading}
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {requires2FA ? 'Verificar código' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
              <Shield size={16} />
              <span>Acceso restringido a personal autorizado</span>
            </div>
          </div>
        </div>

        {/* Versión */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Versión 1.0.0 - Sistema Seguro
        </p>
      </div>
    </div>
  );
}