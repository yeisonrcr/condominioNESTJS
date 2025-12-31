/**
 * USUARIOS PAGE - ADMIN
 */

'use client';

import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@rosedal2/shared/hooks/useApi';
import { Button } from '@rosedal2/shared/components/Button';
import { Modal } from '@rosedal2/shared/components/Modal';
import { Table } from '@rosedal2/shared/components/Table';
import { UserForm } from '@/components/UserForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getRoleLabel, getRoleColor } from '@rosedal2/shared/lib/utils';
import toast from 'react-hot-toast';

export default function UsuariosPage() {
  const { data, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser('');
  const deleteUser = useDeleteUser('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleOpenModal = (user?: any) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({ id: editingUser.id, ...data } as any);
        toast.success('Usuario actualizado');
      } else {
        await createUser.mutateAsync(data);
        toast.success('Usuario creado');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de desactivar este usuario?')) return;

    try {
      await deleteUser.mutateAsync(id as any);
      toast.success('Usuario desactivado');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Usuario',
      render: (user: any) => (
        <div>
          <p className="font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rol',
      render: (user: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      ),
    },
    {
      key: 'house',
      label: 'Casa',
      render: (user: any) => user.house?.houseNumber || '-',
    },
    {
      key: 'status',
      label: 'Estado',
      render: (user: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (user: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={20} className="mr-2" />
          Crear Usuario
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table data={data?.data || []} columns={columns} isLoading={isLoading} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuario' : 'Crear Usuario'}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createUser.isPending || updateUser.isPending}
        />
      </Modal>
    </div>
  );
}