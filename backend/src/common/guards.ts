/**
 * GUARDS DE SEGURIDAD
 * - JwtAuthGuard: Verifica token JWT válido
 * - RolesGuard: Verifica roles permitidos
 * - TwoFactorGuard: Verifica 2FA completado
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// ============================================
// JWT AUTH GUARD
// ============================================
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Token inválido o expirado')
      );
    }
    return user;
  }
}

// ============================================
// ROLES GUARD
// ============================================
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles permitidos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Sin restricción de roles
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Se requiere rol: ${requiredRoles.join(' o ')}`,
      );
    }

    return true;
  }
}

// ============================================
// TWO FACTOR GUARD
// ============================================
@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si la ruta requiere 2FA
    const requires2FA = this.reflector.getAllAndOverride<boolean>(
      'requires2FA',
      [context.getHandler(), context.getClass()],
    );

    if (!requires2FA) {
      return true; // No requiere 2FA
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Si el usuario tiene 2FA habilitado pero no lo ha verificado en esta sesión
    if (user.twoFactorEnabled && !user.twoFactorVerified) {
      throw new UnauthorizedException(
        'Debes completar la verificación 2FA',
      );
    }

    return true;
  }
}