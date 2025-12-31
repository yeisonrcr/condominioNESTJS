'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { Sidebar } from '@rosedal2/shared/components/Sidebar';
import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  BarChart3,
  FileText,
  LogOut,
  Shield,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user && user.role !== 'admin' && user.role !== 'filial') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Usuarios',
      href: '/dashboard/usuarios',
      icon: <Users size={20} />,
    },
    {
      label: 'Casas',
      href: '/dashboard/casas',
      icon: <Home size={20} />,
    },
    {
      label: 'Visitas',
      href: '/dashboard/visitas',
      icon: <ClipboardList size={20} />,
    },
    {
      label: 'Reportes',
      href: '/dashboard/reportes',
      icon: <BarChart3 size={20} />,
    },
    {
      label: 'Auditoría',
      href: '/dashboard/auditoria',
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        items={navItems}
        header={
          <div>
            <h2 className="text-xl font-bold text-red-600">Rosedal II</h2>
            <p className="text-sm text-gray-600">Administración</p>
          </div>
        }
        footer={
          <div className="space-y-2">
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-red-600" />
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <p className="text-xs text-gray-600">{user.email}</p>
              <p className="text-xs text-red-600 mt-1 font-medium">
                {user.role === 'admin' ? 'Administrador' : 'Junta Directiva'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}