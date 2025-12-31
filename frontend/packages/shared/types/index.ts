/**
 * TIPOS TYPESCRIPT COMPARTIDOS
 */

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'filial' | 'oficial';
  houseId?: number;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// House types
export interface House {
  id: number;
  houseNumber: number;
  status: 'active' | 'obsolete';
  createdAt: string;
  updatedAt: string;
}

// Person types
export interface Person {
  id: number;
  houseId: number;
  type: 'owner' | 'resident' | 'authorized' | 'domestic_service' | 'emergency_contact';
  firstName: string;
  lastName: string;
  cedula?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vehicle types
export interface Vehicle {
  id: number;
  houseId: number;
  type: 'car' | 'motorcycle' | 'truck' | 'suv';
  brand: string;
  model: string;
  color: string;
  licensePlate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pet types
export interface Pet {
  id: number;
  houseId: number;
  name: string;
  species: string;
  breed?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Visit types
export interface Visit {
  id: number;
  houseId: number;
  visitorName: string;
  visitorCedula?: string;
  visitorPhone?: string;
  vehiclePlate?: string;
  entryTime: string;
  exitTime?: string;
  entryOficialId: string;
  exitOficialId?: string;
  observations?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  house?: {
    houseNumber: number;
  };
}

// Chat message types
export interface ChatMessage {
  id: string;
  message: string;
  room: string;
  type: 'text' | 'image' | 'file' | 'system';
  sender: {
    id: string;
    name: string;
    role: string;
  };
  isRead: boolean;
  createdAt: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  houseId?: number;
}