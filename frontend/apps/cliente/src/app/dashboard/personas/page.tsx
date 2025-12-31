/**
 * PERSONAS PAGE
 * Gestión de personas autorizadas de la casa
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import {
  usePersonsByHouse,
  useCreatePerson,
  useUpdatePerson,
  useDeletePerson,
} from '@rosedal2/shared/hooks/useApi';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import { Modal } from '@rosedal2/shared/components/Modal';
import { Table } from '@rosedal2/shared/components/Table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonForm {
  id?: number;
  type: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string;
}

export default function PersonasPage() {
  const { user } = useAuth();
  const { data: persons, isLoading } = usePersonsByHouse(user?.houseId || 0);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson(0);
  const deletePerson = useDeletePerson(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonForm | null>(null);
  const [formData, setFormData] = useState<PersonForm>({
    type: 'authorized',
    firstName: '',
    lastName: '',
    cedula: '',
    phone: '',
  });

  const handleOpenModal = (person?: any) => {
    if (person) {
      setEditingPerson(person);
      setFormData({
        id: person.id,
        type: person.type,
        firstName: person.firstName,
        lastName: person.lastName,
        cedula: person.cedula || '',
        phone: person.phone || '',
      });
    } else {
      setEditingPerson(null);
      setFormData({
        type: 'authorized',
        firstName: '',
        lastName: '',
        cedula: '',
        phone: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        houseId: user?.houseId,
      };

      if (editingPerson) {
        await updatePerson.mutateAsync({ id: editingPerson.id, ...data } as any);
        toast.success('Persona actualizada correctamente');
      } else {
        await createPerson.mutateAsync(data as any);
        toast.success('Persona agregada correctamente');
      }

      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return;

    try {
      await deletePerson.mutateAsync(id as any);
      toast.success('Persona eliminada correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      owner: 'Propietario',
      resident: 'Residente',
      authorized: 'Autorizado',
      domestic_service: 'Servicio Doméstico',
      emergency_contact: 'Contacto de Emergencia',
    };
    return types[type] || type;
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (person: any) => (
        <div>
          <p className="font-medium">
            {person.firstName} {person.lastName}
          </p>
          <p className="text-sm text-gray-500">{getTypeLabel(person.type)}</p>
        </div>
      ),
    },
    {
      key: 'cedula',
      label: 'Cédula',
      render: (person: any) => person.cedula || '-',
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (person: any) => person.phone || '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (person: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(person)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(person.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Personas Autorizadas</h1>
          <p className="text-gray-600 mt-2">Gestiona las personas con acceso a tu casa</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={20} className="mr-2" />
          Agregar Persona
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={persons || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No hay personas registradas"
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPerson ? 'Editar Persona' : 'Agregar Persona'}
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
              <option value="authorized">Autorizado</option>
              <option value="resident">Residente</option>
              <option value="domestic_service">Servicio Doméstico</option>
              <option value="emergency_contact">Contacto de Emergencia</option>
            </select>
          </div>

          <Input
            label="Nombre"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />

          <Input
            label="Apellido"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />

          <Input
            label="Cédula"
            value={formData.cedula}
            onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
          />

          <Input
            label="Teléfono"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createPerson.isPending || updatePerson.isPending}
            >
              {editingPerson ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}