/**
 * VISITS CONTROLLER
 * Endpoints para gestión de visitas
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { Roles, CurrentUser } from '@/common/decorators';
import { CreateVisitDto, ExitVisitDto, QueryVisitsDto } from './dto';

@Controller('visits')
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private visitsService: VisitsService) {}

  // ============================================
  // CREATE - Registrar entrada de visita
  // ============================================
  @Post()
  @UseGuards(RolesGuard)
  @Roles('oficial', 'admin')
  async create(
    @Body() dto: CreateVisitDto,
    @CurrentUser('id') oficialId: string,
  ) {
    return this.visitsService.create(dto, oficialId);
  }

  // ============================================
  // EXIT - Registrar salida de visita
  // ============================================
  @Put(':id/exit')
  @UseGuards(RolesGuard)
  @Roles('oficial', 'admin')
  async exit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExitVisitDto,
    @CurrentUser('id') oficialId: string,
  ) {
    return this.visitsService.exit(id, dto, oficialId);
  }

  // ============================================
  // GET ALL - Listar visitas con filtros
  // ============================================
  @Get()
  async findAll(@Query() query: QueryVisitsDto) {
    return this.visitsService.findAll(query);
  }

  // ============================================
  // GET ONE - Obtener visita por ID
  // ============================================
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.findOne(id);
  }

  // ============================================
  // GET SIGNATURE - Ver firma descifrada (solo admin)
  // ============================================
  @Get(':id/signature/:type')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getSignature(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: 'entry' | 'exit',
  ) {
    return this.visitsService.getSignature(id, type);
  }

  // ============================================
  // CANCEL - Cancelar visita activa
  // ============================================
  @Put(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('oficial', 'admin')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @CurrentUser('id') oficialId: string,
  ) {
    return this.visitsService.cancel(id, oficialId, reason);
  }

  // ============================================
  // STATISTICS - Estadísticas de visitas
  // ============================================
  @Get('stats/summary')
  async getStatistics(@Query('houseId', ParseIntPipe) houseId?: number) {
    return this.visitsService.getStatistics(houseId);
  }
}