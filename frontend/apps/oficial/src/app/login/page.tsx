/**
 * LOGIN PAGE - OFICIAL
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      // Verificar que sea oficial
      if (result.user.role !== 'oficial') {
        toast.error('Solo oficiales de seguridad pueden acceder');
        await useAuth.getState().logout();
        return;
      }

      toast.success('Bienvenido al sistema de control');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-600 rounded-full mb-4">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Rosedal II</h1>
            <p className="text-gray-600 mt-2">Control de Seguridad</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="oficial@rosedal2.com"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
              <ShieldCheck size={16} />
              <span>Sistema de control de acceso</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Turno actual: {new Date().toLocaleDateString('es-CO', { weekday: 'long' })}
          </p>
          <p className="text-sm text-gray-500">
            Versión 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}