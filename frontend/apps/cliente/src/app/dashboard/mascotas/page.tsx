/**
 * MASCOTAS PAGE
 * Gestión de mascotas de la casa
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@rosedal2/shared/hooks/useAuth';
import {
  usePetsByHouse,
  useCreatePet,
  useUpdatePet,
  useDeletePet,
} from '@rosedal2/shared/hooks/useApi';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import { Modal } from '@rosedal2/shared/components/Modal';
import { Table } from '@rosedal2/shared/components/Table';
import { Plus, Edit, Trash2, Dog } from 'lucide-react';
import toast from 'react-hot-toast';

interface PetForm {
  id?: number;
  name: string;
  species: string;
  breed: string;
}

export default function MascotasPage() {
  const { user } = useAuth();
  const { data: pets, isLoading } = usePetsByHouse(user?.houseId || 0);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet(0);
  const deletePet = useDeletePet(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetForm | null>(null);
  const [formData, setFormData] = useState<PetForm>({
    name: '',
    species: '',
    breed: '',
  });

  const handleOpenModal = (pet?: any) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        species: '',
        breed: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        houseId: user?.houseId,
      };

      if (editingPet) {
        await updatePet.mutateAsync({ id: editingPet.id, ...data } as any);
        toast.success('Mascota actualizada correctamente');
      } else {
        await createPet.mutateAsync(data as any);
        toast.success('Mascota agregada correctamente');
      }

      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    try {
      await deletePet.mutateAsync(id as any);
      toast.success('Mascota eliminada correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  const columns = [
    {
      key: 'info',
      label: 'Mascota',
      render: (pet: any) => (
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Dog className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="font-medium">{pet.name}</p>
            <p className="text-sm text-gray-500">{pet.species}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'breed',
      label: 'Raza',
      render: (pet: any) => pet.breed || '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (pet: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(pet)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(pet.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Mascotas</h1>
          <p className="text-gray-600 mt-2">Gestiona las mascotas registradas</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={20} className="mr-2" />
          Agregar Mascota
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={pets || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No hay mascotas registradas"
        />
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPet ? 'Editar Mascota' : 'Agregar Mascota'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Especie"
            placeholder="Ej: Perro, Gato, Ave"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            required
          />

          <Input
            label="Raza"
            placeholder="Ej: Labrador, Siamés"
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createPet.isPending || updatePet.isPending}
            >
              {editingPet ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}