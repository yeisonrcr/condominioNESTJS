/**
 * USER FORM COMPONENT
 * Formulario para crear/editar usuarios
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@rosedal2/shared/components/Button';
import { Input } from '@rosedal2/shared/components/Input';
import { useHouses } from '@rosedal2/shared/hooks/useApi';

interface UserFormProps {
  user?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { data: houses } = useHouses();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'filial',
    houseId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        role: user.role || 'filial',
        houseId: user.houseId?.toString() || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: formData.role,
      houseId: formData.houseId ? parseInt(formData.houseId) : undefined,
    };

    // Solo enviar password si se proporcionó
    if (formData.password) {
      data.password = formData.password;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        label={user ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={!user}
        helperText={user ? 'Mínimo 12 caracteres si deseas cambiarla' : 'Mínimo 12 caracteres'}
      />

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
        label="Teléfono"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="admin">Administrador</option>
          <option value="filial">Residente</option>
          <option value="oficial">Oficial de Seguridad</option>
        </select>
      </div>

      {formData.role === 'filial' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Casa</label>
          <select
            value={formData.houseId}
            onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin asignar</option>
            {houses?.map((house: any) => (
              <option key={house.id} value={house.id}>
                Casa {house.houseNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {user ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};