/**
 * HOUSES DTOs
 * Validación para casas, personas, vehículos y mascotas
 */

import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
  Min,
  Max,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// ============================================
// HOUSE DTOs
// ============================================
export class CreateHouseDto {
  @IsInt()
  @Min(1)
  @Max(56)
  houseNumber: number;
}

export class UpdateHouseDto {
  @IsOptional()
  @IsEnum(['active', 'obsolete'])
  status?: string;
}

// ============================================
// PERSON DTOs
// ============================================
export class CreatePersonDto {
  @IsInt()
  houseId: number;

  @IsEnum(['owner', 'resident', 'authorized', 'domestic_service', 'emergency_contact'])
  type: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// VEHICLE DTOs
// ============================================
export class CreateVehicleDto {
  @IsInt()
  houseId: number;

  @IsEnum(['car', 'motorcycle', 'truck', 'suv'])
  type: string;

  @IsString()
  @MinLength(2)
  brand: string;

  @IsString()
  @MinLength(2)
  model: string;

  @IsString()
  color: string;

  @IsString()
  @MinLength(3)
  licensePlate: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============================================
// PET DTOs
// ============================================
export class CreatePetDto {
  @IsInt()
  houseId: number;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  species: string; // perro, gato, etc

  @IsOptional()
  @IsString()
  breed?: string;
}

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}