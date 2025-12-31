/**
 * VISITS SERVICE
 * Lógica para gestión de visitas con firmas cifradas
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Encryption } from '@/config';
import { CreateVisitDto, ExitVisitDto, QueryVisitsDto } from './dto';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE VISIT - Registrar entrada
  // ============================================
  async create(dto: CreateVisitDto, oficialId: string) {
    // Verificar que la casa existe
    const house = await this.prisma.house.findUnique({
      where: { id: dto.houseId },
    });

    if (!house) {
      throw new NotFoundException('Casa no encontrada');
    }

    // Cifrar firma de entrada
    const encryptedSignature = Encryption.encrypt(dto.entrySignature);

    // Crear visita
    const visit = await this.prisma.visit.create({
      data: {
        houseId: dto.houseId,
        visitorName: dto.visitorName,
        visitorCedula: dto.visitorCedula,
        visitorPhone: dto.visitorPhone,
        vehiclePlate: dto.vehiclePlate,
        observations: dto.observations,
        entryOficialId: oficialId,
        entrySignature: encryptedSignature,
        status: 'active',
      },
      include: {
        house: {
          select: {
            houseNumber: true,
          },
        },
      },
    });

    // Log de auditoría
    await this.createAuditLog(
      oficialId,
      'visit.create',
      visit.id.toString(),
      `Visita a casa ${house.houseNumber}`,
    );

    return {
      ...visit,
      entrySignature: undefined, // No devolver firma cifrada
    };
  }

  // ============================================
  // EXIT VISIT - Registrar salida
  // ============================================
  async exit(id: number, dto: ExitVisitDto, oficialId: string) {
    // Buscar visita
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: { house: true },
    });

    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }

    if (visit.status !== 'active') {
      throw new BadRequestException('La visita ya fue cerrada');
    }

    // Cifrar firma de salida
    const encryptedSignature = Encryption.encrypt(dto.exitSignature);

    // Actualizar visita
    const updated = await this.prisma.visit.update({
      where: { id },
      data: {
        exitTime: new Date(),
        exitOficialId: oficialId,
        exitSignature: encryptedSignature,
        observations: dto.observations || visit.observations,
        status: 'completed',
      },
      include: {
        house: {
          select: {
            houseNumber: true,
          },
        },
      },
    });

    // Log de auditoría
    await this.createAuditLog(
      oficialId,
      'visit.exit',
      id.toString(),
      `Salida de casa ${visit.house.houseNumber}`,
    );

    return {
      ...updated,
      entrySignature: undefined,
      exitSignature: undefined,
    };
  }

  // ============================================
  // FIND ALL - Listar visitas con filtros
  // ============================================
  async findAll(query: QueryVisitsDto) {
    const {
      houseId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      search,
    } = query;

    const where: any = {};

    if (houseId) where.houseId = houseId;
    if (status) where.status = status;

    // Filtro por fechas
    if (startDate || endDate) {
      where.entryTime = {};
      if (startDate) where.entryTime.gte = new Date(startDate);
      if (endDate) where.entryTime.lte = new Date(endDate);
    }

    // Búsqueda por nombre o placa
    if (search) {
      where.OR = [
        { visitorName: { contains: search, mode: 'insensitive' } },
        { visitorCedula: { contains: search, mode: 'insensitive' } },
        { vehiclePlate: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        include: {
          house: {
            select: {
              houseNumber: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { entryTime: 'desc' },
      }),
      this.prisma.visit.count({ where }),
    ]);

    // Remover firmas cifradas de la respuesta
    const sanitized = visits.map((v) => ({
      ...v,
      entrySignature: undefined,
      exitSignature: undefined,
    }));

    return {
      data: sanitized,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // FIND ONE - Obtener visita por ID
  // ============================================
  async findOne(id: number) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        house: {
          select: {
            id: true,
            houseNumber: true,
          },
        },
      },
    });

    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }

    return {
      ...visit,
      entrySignature: undefined,
      exitSignature: undefined,
    };
  }

  // ============================================
  // GET SIGNATURE - Obtener firma descifrada
  // Solo admin puede ver firmas
  // ============================================
  async getSignature(id: number, type: 'entry' | 'exit') {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      select: {
        id: true,
        entrySignature: true,
        exitSignature: true,
      },
    });

    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }

    const encryptedSignature =
      type === 'entry' ? visit.entrySignature : visit.exitSignature;

    if (!encryptedSignature) {
      throw new NotFoundException(`Firma de ${type === 'entry' ? 'entrada' : 'salida'} no encontrada`);
    }

    // Descifrar firma
    const decryptedSignature = Encryption.decrypt(encryptedSignature);

    return {
      signature: decryptedSignature,
      type,
    };
  }

  // ============================================
  // CANCEL VISIT
  // ============================================
  async cancel(id: number, oficialId: string, reason: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
    });

    if (!visit) {
      throw new NotFoundException('Visita no encontrada');
    }

    if (visit.status !== 'active') {
      throw new BadRequestException('Solo se pueden cancelar visitas activas');
    }

    await this.prisma.visit.update({
      where: { id },
      data: {
        status: 'cancelled',
        observations: `${visit.observations || ''}\nCANCELADA: ${reason}`,
      },
    });

    await this.createAuditLog(
      oficialId,
      'visit.cancel',
      id.toString(),
      reason,
    );

    return { message: 'Visita cancelada' };
  }

  // ============================================
  // STATISTICS - Estadísticas de visitas
  // ============================================
  async getStatistics(houseId?: number) {
    const where: any = {};
    if (houseId) where.houseId = houseId;

    const [total, active, completed, today] = await Promise.all([
      this.prisma.visit.count({ where }),
      this.prisma.visit.count({ where: { ...where, status: 'active' } }),
      this.prisma.visit.count({ where: { ...where, status: 'completed' } }),
      this.prisma.visit.count({
        where: {
          ...where,
          entryTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      total,
      active,
      completed,
      today,
    };
  }

  // ============================================
  // HELPER
  // ============================================
  private async createAuditLog(
    userId: string,
    action: string,
    entityId: string,
    details?: string,
  ) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: 'Visit',
        entityId,
        details,
      },
    });
  }
}