/**
 * AUTH CONTROLLER
 * Endpoints de autenticación y gestión de sesiones
 * 
 * Endpoints:
 * - POST /auth/register - Registro de usuarios
 * - POST /auth/login - Login con rate limiting
 * - POST /auth/refresh - Renovar access token
 * - POST /auth/logout - Cerrar sesión
 * - GET /auth/2fa/generate - Generar QR para 2FA
 * - POST /auth/2fa/verify - Activar 2FA
 * - DELETE /auth/2fa - Desactivar 2FA
 * - PUT /auth/password - Cambiar contraseña
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '@/common/guards';
import { Public, CurrentUser, IpAddress, UserAgent } from '@/common/decorators';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  Enable2FADto,
  ChangePasswordDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================
  // REGISTER - Crear nuevo usuario
  // Rate limit: 3 registros por hora por IP
  // ============================================
  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 por hora
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ============================================
  // LOGIN - Autenticación
  // Rate limit: 5 intentos por minuto por IP
  // ============================================
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 por minuto
  async login(
    @Body() dto: LoginDto,
    @IpAddress() ip: string,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.login(dto, ip, userAgent);
  }

  // ============================================
  // REFRESH TOKEN - Renovar access token
  // Rate limit: 10 por minuto por usuario
  // ============================================
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  // ============================================
  // LOGOUT - Cerrar sesión (revocar refresh token)
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  // ============================================
  // GENERAR QR PARA 2FA
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async generate2FA(@CurrentUser('id') userId: string) {
    return this.authService.enable2FA(userId);
  }

  // ============================================
  // VERIFICAR Y ACTIVAR 2FA
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  async verify2FA(
    @CurrentUser('id') userId: string,
    @Body() dto: Enable2FADto,
  ) {
    return this.authService.verify2FA(userId, dto);
  }

  // ============================================
  // DESACTIVAR 2FA
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Delete('2fa')
  async disable2FA(
    @CurrentUser('id') userId: string,
    @Body('password') password: string,
  ) {
    return this.authService.disable2FA(userId, password);
  }

  // ============================================
  // CAMBIAR CONTRASEÑA
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Put('password')
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  // ============================================
  // OBTENER PERFIL ACTUAL
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      houseId: user.houseId,
      twoFactorEnabled: user.twoFactorEnabled,
    };
  }
}