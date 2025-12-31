/**
 * VISITAS ACTIVAS PAGE - OFICIAL
 */

'use client';

import { useVisits, useExitVisit } from '@rosedal2/shared/hooks/useApi';
import { Table } from '@rosedal2/shared/components/Table';
import { Button } from '@rosedal2/shared/components/Button';
import { formatDateTime } from '@rosedal2/shared/lib/utils';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ActivasPage() {
  const router = useRouter();
  const { data, isLoading } = useVisits('status=active');

  const handleExit = (visit: any) => {
    router.push(`/dashboard/registro`);
  };

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
      key: 'vehiclePlate',
      label: 'Vehículo',
      render: (visit: any) => visit.vehiclePlate || '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (visit: any) => (
        <Button variant="danger" size="sm" onClick={() => handleExit(visit)}>
          <LogOut size={16} className="mr-1" />
          Registrar Salida
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visitas Activas</h1>
        <p className="text-gray-600 mt-2">Visitas actualmente en el condominio</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No hay visitas activas"
        />
      </div>
    </div>
  );
}