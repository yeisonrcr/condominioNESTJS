/**
 * JWT STRATEGY
 * Estrategia de Passport para validar tokens JWT
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Payload contiene: { sub: userId, email, role }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        houseId: true,
        isActive: true,
        isLocked: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (user.isLocked) {
      throw new UnauthorizedException('Cuenta bloqueada. Contacta al administrador');
    }

    // Agregar flag de 2FA verificado (viene en el payload)
    return {
      ...user,
      twoFactorVerified: payload.twoFactorVerified || false,
    };
  }
}