/**
 * DASHBOARD LAYOUT
 * Layout para todas las páginas del dashboard
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { Sidebar } from '@rosedal2/shared/components/Sidebar';
import {
  Home,
  Users,
  Car,
  Dog,
  ClipboardList,
  MessageSquare,
  LogOut,
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
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    {
      label: 'Inicio',
      href: '/dashboard',
      icon: <Home size={20} />,
    },
    {
      label: 'Visitas',
      href: '/dashboard/visitas',
      icon: <ClipboardList size={20} />,
    },
    {
      label: 'Personas',
      href: '/dashboard/personas',
      icon: <Users size={20} />,
    },
    {
      label: 'Vehículos',
      href: '/dashboard/vehiculos',
      icon: <Car size={20} />,
    },
    {
      label: 'Mascotas',
      href: '/dashboard/mascotas',
      icon: <Dog size={20} />,
    },
    {
      label: 'Chat',
      href: '/dashboard/chat',
      icon: <MessageSquare size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        header={
          <div>
            <h2 className="text-xl font-bold text-blue-600">Rosedal II</h2>
            <p className="text-sm text-gray-600">Residentes</p>
          </div>
        }
        footer={
          <div className="space-y-2">
            <div className="px-4 py-2 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-600">{user.email}</p>
              {user.houseId && (
                <p className="text-xs text-blue-600 mt-1">Casa {user.houseId}</p>
              )}
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}