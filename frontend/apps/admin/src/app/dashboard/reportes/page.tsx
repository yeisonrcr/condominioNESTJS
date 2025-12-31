/**
 * REPORTES PAGE - ADMIN
 */

'use client';

import { useVisitStats, useUsers, useHouses } from '@rosedal2/shared/hooks/useApi';
import { Download, BarChart, TrendingUp } from 'lucide-react';
import { Button } from '@rosedal2/shared/components/Button';

export default function ReportesPage() {
  const { data: visitStats } = useVisitStats();
  const { data: users } = useUsers();
  const { data: houses } = useHouses();

  const stats = [
    { label: 'Total Visitas', value: visitStats?.total || 0, color: 'blue' },
    { label: 'Visitas Hoy', value: visitStats?.today || 0, color: 'green' },
    { label: 'Usuarios Activos', value: users?.meta?.total || 0, color: 'purple' },
    { label: 'Casas Activas', value: houses?.filter((h: any) => h.status === 'active').length || 0, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600 mt-2">Estadísticas y análisis del sistema</p>
        </div>
        <Button variant="primary">
          <Download size={20} className="mr-2" />
          Exportar Reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Gráficos</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center text-gray-500">
            <BarChart size={48} className="mx-auto mb-2 opacity-50" />
            <p>Gráficos disponibles próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}