/**
 * HOOK PARA LLAMADAS API
 * Wrapper de React Query para simplificar llamadas
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { AxiosError } from 'axios';

// Hook genérico para GET
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
  }
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: options?.enabled,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
  });
}

// Hook genérico para POST/PUT/DELETE
export function useApiMutation<TData = any, TVariables = any>(
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: AxiosError) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const response = await apiClient({
        method,
        url,
        data: variables,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// Hooks específicos para entidades comunes

// Users
export function useUsers(query?: string) {
  return useApiQuery<any>(['users', query || ''], `/users${query ? `?${query}` : ''}`);
}

export function useUser(id: string) {
  return useApiQuery<any>(['user', id], `/users/${id}`, {
    enabled: !!id,
  });
}

export function useCreateUser() {
  return useApiMutation('POST', '/users', {
    invalidateQueries: [['users']],
  });
}

export function useUpdateUser(id: string) {
  return useApiMutation('PUT', `/users/${id}`, {
    invalidateQueries: [['users'], ['user', id]],
  });
}

export function useDeleteUser(id: string) {
  return useApiMutation('DELETE', `/users/${id}`, {
    invalidateQueries: [['users']],
  });
}

// Houses
export function useHouses(status?: string) {
  return useApiQuery<any>(['houses', status || ''], `/houses${status ? `?status=${status}` : ''}`);
}

export function useHouse(id: number) {
  return useApiQuery<any>(['house', id], `/houses/${id}`, {
    enabled: !!id,
  });
}

export function useCreateHouse() {
  return useApiMutation('POST', '/houses', {
    invalidateQueries: [['houses']],
  });
}

// Persons
export function usePersonsByHouse(houseId: number) {
  return useApiQuery<any>(['persons', houseId], `/houses/${houseId}/persons`, {
    enabled: !!houseId,
  });
}

export function useCreatePerson() {
  return useApiMutation('POST', '/houses/persons', {
    invalidateQueries: [['persons']],
  });
}

export function useUpdatePerson(id: number) {
  return useApiMutation('PUT', `/houses/persons/${id}`, {
    invalidateQueries: [['persons']],
  });
}

export function useDeletePerson(id: number) {
  return useApiMutation('DELETE', `/houses/persons/${id}`, {
    invalidateQueries: [['persons']],
  });
}

// Vehicles
export function useVehiclesByHouse(houseId: number) {
  return useApiQuery<any>(['vehicles', houseId], `/houses/${houseId}/vehicles`, {
    enabled: !!houseId,
  });
}

export function useCreateVehicle() {
  return useApiMutation('POST', '/houses/vehicles', {
    invalidateQueries: [['vehicles']],
  });
}

export function useUpdateVehicle(id: number) {
  return useApiMutation('PUT', `/houses/vehicles/${id}`, {
    invalidateQueries: [['vehicles']],
  });
}

export function useDeleteVehicle(id: number) {
  return useApiMutation('DELETE', `/houses/vehicles/${id}`, {
    invalidateQueries: [['vehicles']],
  });
}

// Pets
export function usePetsByHouse(houseId: number) {
  return useApiQuery<any>(['pets', houseId], `/houses/${houseId}/pets`, {
    enabled: !!houseId,
  });
}

export function useCreatePet() {
  return useApiMutation('POST', '/houses/pets', {
    invalidateQueries: [['pets']],
  });
}

export function useUpdatePet(id: number) {
  return useApiMutation('PUT', `/houses/pets/${id}`, {
    invalidateQueries: [['pets']],
  });
}

export function useDeletePet(id: number) {
  return useApiMutation('DELETE', `/houses/pets/${id}`, {
    invalidateQueries: [['pets']],
  });
}

// Visits
export function useVisits(query?: string) {
  return useApiQuery<any>(['visits', query || ''], `/visits${query ? `?${query}` : ''}`);
}

export function useVisit(id: number) {
  return useApiQuery<any>(['visit', id], `/visits/${id}`, {
    enabled: !!id,
  });
}

export function useCreateVisit() {
  return useApiMutation('POST', '/visits', {
    invalidateQueries: [['visits']],
  });
}

export function useExitVisit(id: number) {
  return useApiMutation('PUT', `/visits/${id}/exit`, {
    invalidateQueries: [['visits'], ['visit', id]],
  });
}

export function useCancelVisit(id: number) {
  return useApiMutation('PUT', `/visits/${id}/cancel`, {
    invalidateQueries: [['visits'], ['visit', id]],
  });
}

export function useVisitStats(houseId?: number) {
  return useApiQuery<any>(
    ['visit-stats', houseId?.toString() || ''],
    `/visits/stats/summary${houseId ? `?houseId=${houseId}` : ''}`
  );
}