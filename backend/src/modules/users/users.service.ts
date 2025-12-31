/**
 * USERS SERVICE
 * Lógica de negocio para gestión de usuarios
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto';
import * as bcrypt from 'bcrypt';
import { SECURITY_CONSTANTS } from '@/config';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE - Crear usuario (solo admin)
  // ============================================
  async create(dto: CreateUserDto, creatorId: string) {
    // Verificar email único
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar casa si se especifica
    if (dto.houseId) {
      const house = await this.prisma.house.findUnique({
        where: { id: dto.houseId },
      });
      if (!house) {
        throw new BadRequestException('Casa no encontrada');
      }
    }

    // Hash contraseña
    const passwordHash = await bcrypt.hash(
      dto.password,
      SECURITY_CONSTANTS.BCRYPT_ROUNDS,
    );

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role as any,
        houseId: dto.houseId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        houseId: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log auditoría
    await this.createAuditLog(creatorId, 'user.create', user.id);

    return user;
  }

  // ============================================
  // FIND ALL - Listar usuarios con filtros
  // ============================================
  async findAll(query: QueryUsersDto) {
    const { role, houseId, isActive, page = 1, limit = 10, search } = query;

    const where: any = {};

    if (role) where.role = role;
    if (houseId !== undefined) where.houseId = houseId;
    if (isActive !== undefined) where.isActive = isActive;

    // Búsqueda por nombre o email
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          houseId: true,
          isActive: true,
          twoFactorEnabled: true,
          lastLogin: true,
          createdAt: true,
          house: {
            select: {
              houseNumber: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // FIND ONE - Obtener usuario por ID
  // ============================================
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        houseId: true,
        isActive: true,
        twoFactorEnabled: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        house: {
          select: {
            id: true,
            houseNumber: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // ============================================
  // UPDATE - Actualizar usuario
  // ============================================
  async update(id: string, dto: UpdateUserDto, updaterId: string) {
    // Verificar que existe
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si cambia email, verificar que no exista
    if (dto.email && dto.email !== exists.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Si cambia houseId, verificar que existe
    if (dto.houseId) {
      const house = await this.prisma.house.findUnique({
        where: { id: dto.houseId },
      });
      if (!house) {
        throw new BadRequestException('Casa no encontrada');
      }
    }

    // Si se envía contraseña, hashear
    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(
        dto.password,
        SECURITY_CONSTANTS.BCRYPT_ROUNDS,
      );
    }

    // Actualizar
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role as any,
        houseId: dto.houseId,
        isActive: dto.isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        houseId: true,
        isActive: true,
      },
    });

    // Log auditoría
    await this.createAuditLog(updaterId, 'user.update', id);

    return user;
  }

  // ============================================
  // SOFT DELETE - Desactivar usuario
  // ============================================
  async remove(id: string, removerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Revocar todas las sesiones
    await this.prisma.session.updateMany({
      where: { userId: id },
      data: { isRevoked: true },
    });

    // Log auditoría
    await this.createAuditLog(removerId, 'user.delete', id);

    return { message: 'Usuario desactivado correctamente' };
  }

  // ============================================
  // REACTIVATE - Reactivar usuario
  // ============================================
  async reactivate(id: string, reactivatorId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        isLocked: false,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    // Log auditoría
    await this.createAuditLog(reactivatorId, 'user.reactivate', id);

    return { message: 'Usuario reactivado correctamente' };
  }

  // ============================================
  // HELPER - Log de auditoría
  // ============================================
  private async createAuditLog(userId: string, action: string, entityId: string) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: 'User',
        entityId,
      },
    });
  }
}