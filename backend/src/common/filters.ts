/**
 * EXCEPTION FILTERS
 * Manejo centralizado de errores con formato consistente
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

// ============================================
// HTTP EXCEPTION FILTER
// ============================================
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Error desconocido',
    };

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }
}

// ============================================
// PRISMA EXCEPTION FILTER
// Maneja errores específicos de base de datos
// ============================================
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error en la base de datos';

    // Manejar errores específicos de Prisma
    switch (exception.code) {
      case 'P2002':
        // Violación de unique constraint
        status = HttpStatus.CONFLICT;
        message = `Ya existe un registro con ese valor único`;
        break;
      case 'P2025':
        // Registro no encontrado
        status = HttpStatus.NOT_FOUND;
        message = 'Registro no encontrado';
        break;
      case 'P2003':
        // Violación de foreign key
        status = HttpStatus.BAD_REQUEST;
        message = 'Referencia inválida a otro registro';
        break;
      case 'P2014':
        // Violación de relación requerida
        status = HttpStatus.BAD_REQUEST;
        message = 'Faltan datos relacionados requeridos';
        break;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      code: exception.code,
    };

    // Log del error
    this.logger.error(
      `Prisma Error ${exception.code}: ${message} - ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}

// ============================================
// ALL EXCEPTIONS FILTER
// Captura cualquier error no manejado
// ============================================
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Error interno del servidor';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    // Log completo del error
    this.logger.error(
      `Unhandled Exception: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }
}