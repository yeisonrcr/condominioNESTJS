/**
 * VISITS DTOs
 * Validación para visitas y firmas digitales
 */

import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// ============================================
// CREATE VISIT DTO
// ============================================
export class CreateVisitDto {
  @IsInt()
  houseId: number;

  @IsString()
  @MinLength(3)
  visitorName: string;

  @IsOptional()
  @IsString()
  visitorCedula?: string;

  @IsOptional()
  @IsString()
  visitorPhone?: string;

  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsString()
  entrySignature: string; // Base64 de la firma
}

// ============================================
// EXIT VISIT DTO
// ============================================
export class ExitVisitDto {
  @IsString()
  exitSignature: string; // Base64 de la firma

  @IsOptional()
  @IsString()
  observations?: string;
}

// ============================================
// QUERY VISITS DTO
// ============================================
export class QueryVisitsDto {
  @IsOptional()
  @IsInt()
  houseId?: number;

  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string; // Buscar por nombre o placa
}

// ============================================
// CHAT MESSAGE DTO
// ============================================
export class SendMessageDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsString()
  room: string; // "admin", "security", "house:1"

  @IsOptional()
  @IsEnum(['text', 'image', 'file', 'system'])
  type?: string;
}