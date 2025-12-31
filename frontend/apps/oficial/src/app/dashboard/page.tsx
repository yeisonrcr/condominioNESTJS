/**
 * DASHBOARD HOME PAGE - OFICIAL
 */

'use client';

import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useVisitStats, useVisits } from '@rosedal2/shared/hooks/useApi';
import { Activity, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@rosedal2/shared/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats } = useVisitStats();
  const { data: recentVisits } = useVisits('status=active&limit=5');

  const cards = [
    {
      title: 'Visitas Activas',
      value: stats?.active || 0,
      icon: <Activity className="w-8 h-8" />,
      color: 'bg-green-500',
    },
    {
      title: 'Visitas Hoy',
      value: stats?.today || 0,
      icon: <ClipboardList className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Completadas',
      value: stats?.completed || 0,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Control de Seguridad
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.firstName}. Turno actual en curso.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
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
          
            href="/dashboard/registro"
            className="flex items-center gap-4 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Registrar Visita</p>
              <p className="text-sm text-gray-600">Nueva entrada al condominio</p>
            </div>
          </a>

          
            href="/dashboard/activas"
            className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Visitas Activas</p>
              <p className="text-sm text-gray-600">Ver visitas en el condominio</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Visits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Visitas Recientes
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentVisits?.data?.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay visitas activas
            </div>
          ) : (
            recentVisits?.data?.slice(0, 5).map((visit: any) => (
              <div key={visit.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{visit.visitorName}</p>
                    <p className="text-sm text-gray-600">
                      Casa {visit.house?.houseNumber || visit.houseId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {formatDateTime(visit.entryTime)}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full mt-1">
                      Activa
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}