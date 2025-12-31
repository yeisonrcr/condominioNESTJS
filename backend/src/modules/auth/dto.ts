/**
 * DTOs DE AUTENTICACIÓN
 * Validación de datos de entrada con class-validator
 */

import { IsEmail, IsString, Matches, MinLength, IsOptional, IsInt } from 'class-validator';
import { SECURITY_CONSTANTS } from '@/config';

// ============================================
// LOGIN DTO
// ============================================
export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Contraseña requerida' })
  password: string;

  @IsOptional()
  @IsString()
  twoFactorCode?: string; // Código 2FA (si está habilitado)
}

// ============================================
// REGISTER DTO
// ============================================
export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(SECURITY_CONSTANTS.PASSWORD_MIN_LENGTH, {
    message: `Contraseña debe tener mínimo ${SECURITY_CONSTANTS.PASSWORD_MIN_LENGTH} caracteres`,
  })
  @Matches(SECURITY_CONSTANTS.PASSWORD_PATTERN, {
    message:
      'Contraseña debe incluir: mayúsculas, minúsculas, números y símbolos (@$!%*?&)',
  })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Nombre debe tener mínimo 2 caracteres' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Apellido debe tener mínimo 2 caracteres' })
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  houseId?: number; // Solo para residentes/filiales
}

// ============================================
// REFRESH TOKEN DTO
// ============================================
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

// ============================================
// ENABLE 2FA DTO
// ============================================
export class Enable2FADto {
  @IsString()
  twoFactorCode: string; // Código del QR para verificar
}

// ============================================
// VERIFY 2FA DTO
// ============================================
export class Verify2FADto {
  @IsString()
  twoFactorCode: string;
}

// ============================================
// CHANGE PASSWORD DTO
// ============================================
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(SECURITY_CONSTANTS.PASSWORD_MIN_LENGTH)
  @Matches(SECURITY_CONSTANTS.PASSWORD_PATTERN, {
    message: 'Nueva contraseña no cumple requisitos de seguridad',
  })
  newPassword: string;
}