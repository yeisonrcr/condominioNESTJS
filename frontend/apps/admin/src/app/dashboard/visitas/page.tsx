/**
 * VISITAS PAGE - ADMIN
 */

'use client';

import { useState } from 'react';
import { useVisits } from '@rosedal2/shared/hooks/useApi';
import { Table } from '@rosedal2/shared/components/Table';
import { formatDateTime, getVisitStatusLabel, getVisitStatusColor } from '@rosedal2/shared/lib/utils';

export default function VisitasPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const query = statusFilter ? `status=${statusFilter}` : '';
  const { data, isLoading } = useVisits(query);

  const columns = [
    {
      key: 'visitorName',
      label: 'Visitante',
      render: (visit: any) => (
        <div>
          <p className="font-medium">{visit.visitorName}</p>
          {visit.visitorCedula && <p className="text-sm text-gray-500">CC: {visit.visitorCedula}</p>}
        </div>
      ),
    },
    {
      key: 'house',
      label: 'Casa',
      render: (visit: any) => `Casa ${visit.house?.houseNumber || visit.houseId}`,
    },
    {
      key: 'entryTime',
      label: 'Entrada',
      render: (visit: any) => formatDateTime(visit.entryTime),
    },
    {
      key: 'exitTime',
      label: 'Salida',
      render: (visit: any) => (visit.exitTime ? formatDateTime(visit.exitTime) : '-'),
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisitStatusColor(visit.status)}`}>
          {getVisitStatusLabel(visit.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visitas</h1>
        <p className="text-gray-600 mt-2">Historial completo de visitas</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos</option>
          <option value="active">Activas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table data={data?.data || []} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
}