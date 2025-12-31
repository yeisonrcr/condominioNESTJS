/**
 * UTILIDADES GENERALES
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear fecha
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Formatear fecha y hora
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Formatear hora
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Validar email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Generar initials de nombre
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// Truncar texto
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Delay (útil para testing)
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Formatear número de teléfono
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

// Obtener rol en español
export function getRoleLabel(role: string): string {
  const roles: Record<string, string> = {
    admin: 'Administrador',
    filial: 'Residente',
    oficial: 'Oficial de Seguridad',
  };
  return roles[role] || role;
}

// Obtener color por rol
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: 'text-red-600 bg-red-100',
    filial: 'text-blue-600 bg-blue-100',
    oficial: 'text-green-600 bg-green-100',
  };
  return colors[role] || 'text-gray-600 bg-gray-100';
}

// Obtener estado de visita en español
export function getVisitStatusLabel(status: string): string {
  const statuses: Record<string, string> = {
    active: 'Activa',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };
  return statuses[status] || status;
}

// Obtener color por estado de visita
export function getVisitStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    completed: 'text-gray-600 bg-gray-100',
    cancelled: 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}