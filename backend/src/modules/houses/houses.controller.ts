/**
 * HOUSES CONTROLLER
 * Gestión de casas y sus entidades relacionadas
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
  ParseIntPipe,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';
import { Roles, CurrentUser } from '@/common/decorators';
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

@Controller('houses')
@UseGuards(JwtAuthGuard)
export class HousesController {
  constructor(private housesService: HousesService) {}

  // ============================================
  // HOUSES ENDPOINTS
  // ============================================

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async createHouse(
    @Body() dto: CreateHouseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.createHouse(dto, userId);
  }

  @Get()
  async findAllHouses(@Query('status') status?: string) {
    return this.housesService.findAllHouses(status);
  }

  @Get(':id')
  async findOneHouse(@Param('id', ParseIntPipe) id: number) {
    return this.housesService.findOneHouse(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateHouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHouseDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.updateHouse(id, dto, userId);
  }

  // ============================================
  // PERSONS ENDPOINTS
  // ============================================

  @Post('persons')
  async createPerson(
    @Body() dto: CreatePersonDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.createPerson(dto, userId);
  }

  @Get(':houseId/persons')
  async findPersonsByHouse(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.housesService.findPersonsByHouse(houseId);
  }

  @Put('persons/:id')
  async updatePerson(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.updatePerson(id, dto, userId);
  }

  @Delete('persons/:id')
  async deletePerson(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.deletePerson(id, userId);
  }

  // ============================================
  // VEHICLES ENDPOINTS
  // ============================================

  @Post('vehicles')
  async createVehicle(
    @Body() dto: CreateVehicleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.createVehicle(dto, userId);
  }

  @Get(':houseId/vehicles')
  async findVehiclesByHouse(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.housesService.findVehiclesByHouse(houseId);
  }

  @Put('vehicles/:id')
  async updateVehicle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.updateVehicle(id, dto, userId);
  }

  @Delete('vehicles/:id')
  async deleteVehicle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.deleteVehicle(id, userId);
  }

  // ============================================
  // PETS ENDPOINTS
  // ============================================

  @Post('pets')
  async createPet(
    @Body() dto: CreatePetDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.createPet(dto, userId);
  }

  @Get(':houseId/pets')
  async findPetsByHouse(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.housesService.findPetsByHouse(houseId);
  }

  @Put('pets/:id')
  async updatePet(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePetDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.updatePet(id, dto, userId);
  }

  @Delete('pets/:id')
  async deletePet(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: string,
  ) {
    return this.housesService.deletePet(id, userId);
  }
}