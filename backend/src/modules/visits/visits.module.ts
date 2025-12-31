/**
 * VISITS MODULE
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { VisitsGateway } from './visits.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { jwtConfig } from '@/config';

@Module({
  imports: [JwtModule.register(jwtConfig)],
  controllers: [VisitsController],
  providers: [VisitsService, VisitsGateway, PrismaService],
  exports: [VisitsService, VisitsGateway],
})
export class VisitsModule {}