/**
 * CASAS PAGE - ADMIN
 */

'use client';

import { useHouses } from '@rosedal2/shared/hooks/useApi';
import { Table } from '@rosedal2/shared/components/Table';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function CasasPage() {
  const router = useRouter();
  const { data: houses, isLoading } = useHouses();

  const columns = [
    {
      key: 'houseNumber',
      label: 'Número',
      render: (house: any) => (
        <span className="font-semibold text-lg">Casa {house.houseNumber}</span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (house: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            house.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {house.status === 'active' ? 'Activa' : 'Obsoleta'}
        </span>
      ),
    },
    {
      key: 'users',
      label: 'Usuarios',
      render: (house: any) => house._count?.users || 0,
    },
    {
      key: 'persons',
      label: 'Personas',
      render: (house: any) => house._count?.persons || 0,
    },
    {
      key: 'vehicles',
      label: 'Vehículos',
      render: (house: any) => house._count?.vehicles || 0,
    },
    {
      key: 'pets',
      label: 'Mascotas',
      render: (house: any) => house._count?.pets || 0,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (house: any) => (
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Casas</h1>
        <p className="text-gray-600 mt-2">56 casas del condominio</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table data={houses || []} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
}