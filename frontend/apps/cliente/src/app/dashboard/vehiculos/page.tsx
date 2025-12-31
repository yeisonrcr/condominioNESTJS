/**
 * VEHICULOS PAGE
 * Gestión de vehículos de la casa
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import {
  useVehiclesByHouse,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '@rosedal2/shared/hooks/useApi';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import { Modal } from '@rosedal2/shared/components/Modal';
import { Table } from '@rosedal2/shared/components/Table';
import { Plus, Edit, Trash2, Car } from 'lucide-react';
import toast from 'react-hot-toast';

interface VehicleForm {
  id?: number;
  type: string;
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
}

export default function VehiculosPage() {
  const { user } = useAuth();
  const { data: vehicles, isLoading } = useVehiclesByHouse(user?.houseId || 0);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle(0);
  const deleteVehicle = useDeleteVehicle(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleForm | null>(null);
  const [formData, setFormData] = useState<VehicleForm>({
    type: 'car',
    brand: '',
    model: '',
    color: '',
    licensePlate: '',
  });

  const handleOpenModal = (vehicle?: any) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        id: vehicle.id,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        type: 'car',
        brand: '',
        model: '',
        color: '',
        licensePlate: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        houseId: user?.houseId,
      };

      if (editingVehicle) {
        await updateVehicle.mutateAsync({ id: editingVehicle.id, ...data } as any);
        toast.success('Vehículo actualizado correctamente');
      } else {
        await createVehicle.mutateAsync(data as any);
        toast.success('Vehículo agregado correctamente');
      }

      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

    try {
      await deleteVehicle.mutateAsync(id as any);
      toast.success('Vehículo eliminado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      car: 'Automóvil',
      motorcycle: 'Motocicleta',
      truck: 'Camioneta',
      suv: 'SUV',
    };
    return types[type] || type;
  };

  const columns = [
    {
      key: 'info',
      label: 'Vehículo',
      render: (vehicle: any) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-sm text-gray-500">{getTypeLabel(vehicle.type)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'licensePlate',
      label: 'Placa',
      render: (vehicle: any) => (
        <span className="font-mono font-semibold text-gray-900">
          {vehicle.licensePlate}
        </span>
      ),
    },
    {
      key: 'color',
      label: 'Color',
      render: (vehicle: any) => vehicle.color,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (vehicle: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(vehicle)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(vehicle.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600 mt-2">Gestiona los vehículos registrados</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={20} className="mr-2" />
          Agregar Vehículo
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={vehicles || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No hay vehículos registrados"
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="car">Automóvil</option>
              <option value="motorcycle">Motocicleta</option>
              <option value="truck">Camioneta</option>
              <option value="suv">SUV</option>
            </select>
          </div>

          <Input
            label="Marca"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            required
          />

          <Input
            label="Modelo"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            required
          />

          <Input
            label="Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            required
          />

          <Input
            label="Placa"
            value={formData.licensePlate}
            onChange={(e) =>
              setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
            }
            maxLength={10}
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createVehicle.isPending || updateVehicle.isPending}
            >
              {editingVehicle ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}