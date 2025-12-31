/**
 * USERS DTOs - Validación de datos para gestión de usuarios con roles y casas
 */

import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// CREATE USER DTO
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(['admin', 'filial', 'oficial'])
  role: string;

  @IsOptional()
  @IsInt()
  houseId?: number;
}

// UPDATE USER DTO - Hereda todos los campos opcionales de CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// QUERY USERS DTO - Filtros para listado de usuarios
export class QueryUsersDto {
  @IsOptional()
  @IsEnum(['admin', 'filial', 'oficial'])
  role?: string;

  @IsOptional()
  @IsInt()
  houseId?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}