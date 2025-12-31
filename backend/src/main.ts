/**
 * MAIN - BOOTSTRAP DE LA APLICACIÓN
 * Configuración de seguridad, CORS, validación y Swagger
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { validateEnv, corsConfig } from './config';


import helmet from 'helmet';



import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Validar variables de entorno al inicio
  try {
    validateEnv();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  // Crear aplicación
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // ============================================
  // SEGURIDAD
  // ============================================

  // Helmet - Headers de seguridad
  app.use(helmet());

  // CORS configurado
  app.enableCors(corsConfig);

  // Cookie parser
  app.use(cookieParser());

  // ============================================
  // VALIDACIÓN
  // ============================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Error si hay propiedades extra
      transform: true, // Transformar tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============================================
  // PREFIX GLOBAL
  // ============================================
  app.setGlobalPrefix('api');

  // ============================================
  // PUERTO
  // ============================================
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('\n');
  console.log('🚀 ========================================');
  console.log('🚀  ROSEDAL II - BACKEND API');
  console.log('🚀 ========================================');
  console.log(`🌐  API corriendo en: http://localhost:${port}/api`);
  console.log(`🔒  Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊  Base de datos: Conectada`);
  console.log(`🔴  Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  console.log('🚀 ========================================\n');
}

bootstrap();