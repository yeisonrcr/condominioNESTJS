/**
 * APP MODULE
 * Módulo raíz de la aplicación
 * Configura todos los módulos, guards y providers globales
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { configOptions, throttlerConfig } from './config';

// Módulos
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HousesModule } from './modules/houses/houses.module';
import { VisitsModule } from './modules/visits/visits.module';
import { PrismaService } from './prisma/prisma.service';

// Guards y Filters
import { JwtAuthGuard } from './common/guards';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  AllExceptionsFilter,
} from './common/filters';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot(configOptions),

    // Rate limiting global
    ThrottlerModule.forRoot(throttlerConfig),

    // Módulos de negocio
    AuthModule,
    UsersModule,
    HousesModule,
    VisitsModule,
  ],
  providers: [
    PrismaService,

    // Guard global de rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // Guard global de JWT (se desactiva con @Public())
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Exception filters globales
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}