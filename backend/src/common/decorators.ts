/**
 * DECORADORES PERSONALIZADOS
 * Simplifican el acceso a datos en controllers
 */

import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

// ============================================
// @Public() - Marca rutas como públicas (sin JWT)
// ============================================
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// ============================================
// @Roles(...roles) - Define roles permitidos
// ============================================
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ============================================
// @Requires2FA() - Requiere verificación 2FA
// ============================================
export const REQUIRES_2FA_KEY = 'requires2FA';
export const Requires2FA = () => SetMetadata(REQUIRES_2FA_KEY, true);

// ============================================
// @CurrentUser() - Obtiene usuario actual del request
// Uso: async getProfile(@CurrentUser() user) { ... }
// ============================================
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si se especifica una propiedad, devolver solo esa
    return data ? user?.[data] : user;
  },
);

// ============================================
// @IpAddress() - Obtiene IP del request
// ============================================
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress;
  },
);

// ============================================
// @UserAgent() - Obtiene User Agent del request
// ============================================
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);