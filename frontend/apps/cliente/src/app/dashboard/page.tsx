/**
 * DASHBOARD HOME PAGE
 * Página principal del dashboard con resumen
 */

'use client';

import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useVisitStats } from '@rosedal2/shared/hooks/useApi';
import { Home, Users, Car, ClipboardList } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useVisitStats(user?.houseId);

  const cards = [
    {
      title: 'Visitas Hoy',
      value: stats?.today || 0,
      icon: <ClipboardList className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Visitas Activas',
      value: stats?.active || 0,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Visitas',
      value: stats?.total || 0,
      icon: <Home className="w-8 h-8" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-gray-600 mt-2">
          Casa {user?.houseId || 'N/A'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                )}
              </div>
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
            href="/dashboard/visitas"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Ver Visitas</p>
              <p className="text-sm text-gray-600">Historial de visitantes</p>
            </div>
          </a>

          
            href="/dashboard/personas"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Personas Autorizadas</p>
              <p className="text-sm text-gray-600">Gestionar accesos</p>
            </div>
          </a>

          
            href="/dashboard/vehiculos"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <div className="bg-purple-100 p-3 rounded-lg">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Mis Vehículos</p>
              <p className="text-sm text-gray-600">Administrar vehículos</p>
            </div>
          </a>

          
            href="/dashboard/chat"
            className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div className="bg-orange-100 p-3 rounded-lg">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Chat</p>
              <p className="text-sm text-gray-600">Comunicación en vivo</p>
            </div>
          </a>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Información</h3>
          <p className="text-sm text-blue-800">
            Mantén actualizada tu información de personas autorizadas y vehículos
            para agilizar el ingreso de visitas.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">💬 ¿Necesitas ayuda?</h3>
          <p className="text-sm text-green-800">
            Usa el chat para comunicarte con seguridad o la administración en
            tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
}