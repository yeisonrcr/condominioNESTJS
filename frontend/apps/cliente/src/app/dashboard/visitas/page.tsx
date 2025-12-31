/**
 * VISITAS PAGE
 * Listado de visitas de la casa
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import { useVisits } from '@rosedal2/shared/hooks/useApi';
import { Table } from '@rosedal2/shared/components/Table';
import { formatDateTime, getVisitStatusLabel, getVisitStatusColor } from '@rosedal2/shared/lib/utils';
import { Search, Filter } from 'lucide-react';

export default function VisitasPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const query = new URLSearchParams({
    ...(user?.houseId && { houseId: user.houseId.toString() }),
    ...(statusFilter && { status: statusFilter }),
  }).toString();

  const { data, isLoading } = useVisits(query);

  const columns = [
    {
      key: 'visitorName',
      label: 'Visitante',
      render: (visit: any) => (
        <div>
          <p className="font-medium">{visit.visitorName}</p>
          {visit.visitorCedula && (
            <p className="text-sm text-gray-500">CC: {visit.visitorCedula}</p>
          )}
        </div>
      ),
    },
    {
      key: 'entryTime',
      label: 'Entrada',
      render: (visit: any) => formatDateTime(visit.entryTime),
    },
    {
      key: 'exitTime',
      label: 'Salida',
      render: (visit: any) =>
        visit.exitTime ? formatDateTime(visit.exitTime) : 'En curso',
    },
    {
      key: 'vehiclePlate',
      label: 'Vehículo',
      render: (visit: any) => visit.vehiclePlate || '-',
    },
    {
      key: 'status',
      label: 'Estado',
      render: (visit: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitStatusColor(
            visit.status
          )}`}
        >
          {getVisitStatusLabel(visit.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visitas</h1>
          <p className="text-gray-600 mt-2">
            Historial de visitas a tu casa
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No hay visitas registradas"
        />
      </div>
    </div>
  );
}