/**
 * HOUSES SERVICE - Gestión de casas, personas, vehículos y mascotas con auditoría
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateHouseDto,
  UpdateHouseDto,
  CreatePersonDto,
  UpdatePersonDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  CreatePetDto,
  UpdatePetDto,
} from './dto';

@Injectable()
export class HousesService {
  constructor(private prisma: PrismaService) {}

  // HOUSES - CRUD
  async createHouse(dto: CreateHouseDto, creatorId: string) {
    const exists = await this.prisma.house.findUnique({
      where: { houseNumber: dto.houseNumber },
    });

    if (exists) {
      throw new ConflictException(`La casa ${dto.houseNumber} ya existe`);
    }

    const house = await this.prisma.house.create({
      data: { houseNumber: dto.houseNumber },
    });

    await this.createAuditLog(creatorId, 'house.create', house.id.toString());

    return house;
  }

  async findAllHouses(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.house.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            persons: true,
            vehicles: true,
            pets: true,
          },
        },
      },
      orderBy: { houseNumber: 'asc' },
    });
  }

  async findOneHouse(id: number) {
    const house = await this.prisma.house.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        persons: { where: { isActive: true } },
        vehicles: { where: { isActive: true } },
        pets: { where: { isActive: true } },
      },
    });

    if (!house) {
      throw new NotFoundException('Casa no encontrada');
    }

    return house;
  }

  async updateHouse(id: number, dto: UpdateHouseDto, updaterId: string) {
    const house = await this.prisma.house.update({
      where: { id },
      data: {
        status: dto.status as any,
      },
    });

    await this.createAuditLog(updaterId, 'house.update', id.toString());

    return house;
  }

  // PERSONS - CRUD
  async createPerson(dto: CreatePersonDto, creatorId: string) {
    await this.findOneHouse(dto.houseId);

    const person = await this.prisma.person.create({
      data: dto as any,
    });

    await this.createAuditLog(creatorId, 'person.create', person.id.toString());

    return person;
  }

  async findPersonsByHouse(houseId: number) {
    return this.prisma.person.findMany({
      where: { houseId, isActive: true },
      orderBy: { type: 'asc' },
    });
  }

  async updatePerson(id: number, dto: UpdatePersonDto, updaterId: string) {
    const person = await this.prisma.person.update({
      where: { id },
      data: dto as any,
    });

    await this.createAuditLog(updaterId, 'person.update', id.toString());

    return person;
  }

  async deletePerson(id: number, deleterId: string) {
    await this.prisma.person.update({
      where: { id },
      data: { isActive: false },
    });

    await this.createAuditLog(deleterId, 'person.delete', id.toString());

    return { message: 'Persona desactivada' };
  }

  // VEHICLES - CRUD
  async createVehicle(dto: CreateVehicleDto, creatorId: string) {
    await this.findOneHouse(dto.houseId);

    const exists = await this.prisma.vehicle.findUnique({
      where: { licensePlate: dto.licensePlate },
    });

    if (exists) {
      throw new ConflictException('La placa ya está registrada');
    }

    const vehicle = await this.prisma.vehicle.create({
      data: dto as any,
    });

    await this.createAuditLog(creatorId, 'vehicle.create', vehicle.id.toString());

    return vehicle;
  }

  async findVehiclesByHouse(houseId: number) {
    return this.prisma.vehicle.findMany({
      where: { houseId, isActive: true },
    });
  }

  async updateVehicle(id: number, dto: UpdateVehicleDto, updaterId: string) {
    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: dto as any,
    });

    await this.createAuditLog(updaterId, 'vehicle.update', id.toString());

    return vehicle;
  }

  async deleteVehicle(id: number, deleterId: string) {
    await this.prisma.vehicle.update({
      where: { id },
      data: { isActive: false },
    });

    await this.createAuditLog(deleterId, 'vehicle.delete', id.toString());

    return { message: 'Vehículo desactivado' };
  }

  // PETS - CRUD
  async createPet(dto: CreatePetDto, creatorId: string) {
    await this.findOneHouse(dto.houseId);

    const pet = await this.prisma.pet.create({
      data: dto,
    });

    await this.createAuditLog(creatorId, 'pet.create', pet.id.toString());

    return pet;
  }

  async findPetsByHouse(houseId: number) {
    return this.prisma.pet.findMany({
      where: { houseId, isActive: true },
    });
  }

  async updatePet(id: number, dto: UpdatePetDto, updaterId: string) {
    const pet = await this.prisma.pet.update({
      where: { id },
      data: dto,
    });

    await this.createAuditLog(updaterId, 'pet.update', id.toString());

    return pet;
  }

  async deletePet(id: number, deleterId: string) {
    await this.prisma.pet.update({
      where: { id },
      data: { isActive: false },
    });

    await this.createAuditLog(deleterId, 'pet.delete', id.toString());

    return { message: 'Mascota desactivada' };
  }

  // HELPER - Crear log de auditoría
  private async createAuditLog(userId: string, action: string, entityId: string) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: action.split('.')[0],
        entityId,
      },
    });
  }
}