/**
 * HOUSES MODULE
 */

import { Module } from '@nestjs/common';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [HousesController],
  providers: [HousesService, PrismaService],
  exports: [HousesService],
})
export class HousesModule {}