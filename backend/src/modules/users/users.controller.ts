/**
 * USERS CONTROLLER
 * Endpoints para gestión de usuarios (solo admin)
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { Roles, CurrentUser } from '@/common/decorators';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Solo administradores
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ============================================
  // CREATE - Crear usuario
  // ============================================
  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser('id') creatorId: string,
  ) {
    return this.usersService.create(dto, creatorId);
  }

  // ============================================
  // GET ALL - Listar usuarios con filtros
  // ============================================
  @Get()
  async findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  // ============================================
  // GET ONE - Obtener usuario por ID
  // ============================================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // ============================================
  // UPDATE - Actualizar usuario
  // ============================================
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') updaterId: string,
  ) {
    return this.usersService.update(id, dto, updaterId);
  }

  // ============================================
  // DELETE - Desactivar usuario (soft delete)
  // ============================================
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') removerId: string,
  ) {
    return this.usersService.remove(id, removerId);
  }

  // ============================================
  // REACTIVATE - Reactivar usuario desactivado
  // ============================================
  @Post(':id/reactivate')
  async reactivate(
    @Param('id') id: string,
    @CurrentUser('id') reactivatorId: string,
  ) {
    return this.usersService.reactivate(id, reactivatorId);
  }
}