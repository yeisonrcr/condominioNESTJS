/**
 * AUTH SERVICE - Lógica de autenticación con JWT, 2FA y seguridad completa
 */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { SECURITY_CONSTANTS } from '@/config';
import { LoginDto, RegisterDto, Enable2FADto, ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // REGISTER - Crear nuevo usuario
  async register(dto: RegisterDto, role: string = 'oficial') {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    if (dto.houseId) {
      const house = await this.prisma.house.findUnique({
        where: { id: dto.houseId },
      });
      if (!house) {
        throw new BadRequestException('Casa no encontrada');
      }
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      SECURITY_CONSTANTS.BCRYPT_ROUNDS,
    );

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: role as any,
        houseId: dto.houseId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        houseId: true,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);
    await this.createAuditLog(user.id, 'user.register', 'User', user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // LOGIN - Autenticar usuario con bloqueo y 2FA
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.isLocked && user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Cuenta bloqueada. Intenta en ${minutesLeft} minutos`,
      );
    }

    if (user.isLocked && user.lockedUntil && user.lockedUntil <= new Date()) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false, failedAttempts: 0, lockedUntil: null },
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      const failedAttempts = user.failedAttempts + 1;
      const shouldLock = failedAttempts >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts,
          isLocked: shouldLock,
          lockedUntil: shouldLock
            ? new Date(
                Date.now() +
                  SECURITY_CONSTANTS.LOCK_TIME_MINUTES * 60 * 1000,
              )
            : null,
        },
      });

      if (shouldLock) {
        throw new UnauthorizedException(
          `Cuenta bloqueada por ${SECURITY_CONSTANTS.LOCK_TIME_MINUTES} minutos debido a múltiples intentos fallidos`,
        );
      }

      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta inactiva');
    }

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          requires2FA: true,
          tempToken: this.generateTempToken(user.id),
        };
      }

      if (!user.twoFactorSecret) {
        throw new UnauthorizedException('2FA mal configurado');
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: dto.twoFactorCode,
        window: 2,
      });

      if (!isValid) {
        throw new UnauthorizedException('Código 2FA inválido');
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lastLogin: new Date(),
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user, true);
    await this.createSession(user.id, refreshToken, ipAddress, userAgent);
    await this.createAuditLog(user.id, 'user.login', 'User', user.id, ipAddress);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        houseId: user.houseId,
      },
      accessToken,
      refreshToken,
    };
  }

  // REFRESH TOKEN - Generar nuevo access token con rotación
  async refreshToken(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (session.isRevoked) {
      throw new UnauthorizedException('Sesión revocada');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    if (!session.user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(session.user, session.user.twoFactorEnabled);

    await this.createSession(
      session.user.id,
      newRefreshToken,
      session.ipAddress,
      session.userAgent,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // LOGOUT - Revocar sesión actual
  async logout(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await this.prisma.session.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });

    return { message: 'Sesión cerrada correctamente' };
  }

  // ENABLE 2FA - Generar QR code para autenticación de dos factores
  async enable2FA(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA ya está habilitado');
    }

    const secret = speakeasy.generateSecret({
      name: `Rosedal II (${user.email})`,
      issuer: 'Rosedal II',
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    if (!secret.otpauth_url) {
      throw new Error('Error generando código 2FA');
    }

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  // VERIFY 2FA - Verificar código y activar 2FA
  async verify2FA(userId: string, dto: Enable2FADto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('Primero debes generar el código QR');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.twoFactorCode,
      window: 2,
    });

    if (!isValid) {
      throw new BadRequestException('Código inválido');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    await this.createAuditLog(userId, '2fa.enabled', 'User', userId);

    return { message: '2FA activado correctamente' };
  }

  // DISABLE 2FA - Desactivar autenticación de dos factores
  async disable2FA(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    await this.createAuditLog(userId, '2fa.disabled', 'User', userId);

    return { message: '2FA desactivado correctamente' };
  }

  // CHANGE PASSWORD - Cambiar contraseña y revocar sesiones
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const newPasswordHash = await bcrypt.hash(
      dto.newPassword,
      SECURITY_CONSTANTS.BCRYPT_ROUNDS,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    await this.prisma.session.updateMany({
      where: {
        userId,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    await this.createAuditLog(userId, 'password.changed', 'User', userId);

    return { message: 'Contraseña cambiada correctamente' };
  }

  // HELPERS PRIVADOS
  private async generateTokens(user: any, twoFactorVerified: boolean = false) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      twoFactorVerified,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return { accessToken, refreshToken };
  }

  private generateTempToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId, temp: true },
      { expiresIn: '5m' },
    );
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    ipAddress?: string | null,
    userAgent?: string | null,
  ) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.session.create({
      data: {
        userId,
        tokenHash,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        expiresAt,
      },
    });
  }

  private async createAuditLog(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    ipAddress?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        ipAddress,
      },
    });
  }
}