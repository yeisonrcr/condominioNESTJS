/**
 * DASHBOARD HOME PAGE - ADMIN
 */

'use client';

import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useVisitStats, useUsers, useHouses } from '@rosedal2/shared/hooks/useApi';
import {
  Users,
  Home,
  ClipboardList,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: visitStats } = useVisitStats();
  const { data: usersData } = useUsers();
  const { data: houses } = useHouses();

  const stats = [
    {
      title: 'Visitas Activas',
      value: visitStats?.active || 0,
      icon: <Activity className="w-8 h-8" />,
      color: 'bg-green-500',
      trend: '+12%',
    },
    {
      title: 'Visitas Hoy',
      value: visitStats?.today || 0,
      icon: <ClipboardList className="w-8 h-8" />,
      color: 'bg-blue-500',
      trend: '+8%',
    },
    {
      title: 'Usuarios Activos',
      value: usersData?.meta?.total || 0,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      trend: '+3',
    },
    {
      title: 'Total Casas',
      value: houses?.length || 0,
      icon: <Home className="w-8 h-8" />,
      color: 'bg-orange-500',
      trend: '56',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Control
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.firstName}. Aquí tienes un resumen del sistema.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            
              href="/dashboard/usuarios"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                <p className="text-sm text-gray-600">Crear, editar o desactivar</p>
              </div>
            </a>

            
              href="/dashboard/casas"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="bg-green-100 p-2 rounded">
                <Home className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gestionar Casas</p>
                <p className="text-sm text-gray-600">Ver detalles y configurar</p>
              </div>
            </a>

            
              href="/dashboard/visitas"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <div className="bg-purple-100 p-2 rounded">
                <ClipboardList className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ver Visitas</p>
                <p className="text-sm text-gray-600">Historial completo</p>
              </div>
            </a>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Estado del Sistema
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="bg-green-100 p-2 rounded mt-0.5">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Sistema Operativo</p>
                <p className="text-sm text-green-700">
                  Todos los servicios funcionando correctamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="bg-blue-100 p-2 rounded mt-0.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Base de Datos</p>
                <p className="text-sm text-blue-700">
                  Conectada - {visitStats?.total || 0} registros totales
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="bg-purple-100 p-2 rounded mt-0.5">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Usuarios Conectados</p>
                <p className="text-sm text-purple-700">
                  {usersData?.data?.filter((u: any) => u.isActive).length || 0} usuarios activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="font-semibold mb-2">📊 Reportes</h3>
          <p className="text-sm text-blue-100">
            Genera reportes detallados del sistema y exporta datos
          </p>
          
            href="/dashboard/reportes"
            className="inline-block mt-3 text-sm font-medium hover:underline"
          >
            Ver reportes →
          </a>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="font-semibold mb-2">🔍 Auditoría</h3>
          <p className="text-sm text-purple-100">
            Revisa logs de actividad y cambios en el sistema
          </p>
          
            href="/dashboard/auditoria"
            className="inline-block mt-3 text-sm font-medium hover:underline"
          >
            Ver logs →
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <h3 className="font-semibold mb-2">⚡ Rendimiento</h3>
          <p className="text-sm text-green-100">
            Sistema operando al 100% de capacidad
          </p>
          <span className="inline-block mt-3 text-sm font-medium">
            Estado: Óptimo ✓
          </span>
        </div>
      </div>
    </div>
  );
}