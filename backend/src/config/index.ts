/**
 * CONFIGURACIÓN CENTRAL - Todas las configs en un solo lugar con validación de ENV
 */

import { ConfigModuleOptions } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import * as crypto from 'crypto';

export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'SIGNATURE_ENCRYPTION_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variables de entorno faltantes: ${missing.join(', ')}\n` +
        'Copia .env.example a .env y completa los valores',
    );
  }

  const jwtSecret = process.env.JWT_SECRET!;
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET debe tener mínimo 32 caracteres');
  }

  const encryptionKey = process.env.SIGNATURE_ENCRYPTION_KEY!;
  if (encryptionKey.length !== 64) {
    throw new Error(
      'SIGNATURE_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres)',
    );
  }

  console.log('✅ Variables de entorno validadas correctamente');
}

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
};

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET!,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
};

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    },
  ],
};

export const corsConfig = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400,
};

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

// CLASE DE CIFRADO - Ahora obtiene la clave dinámicamente
export class Encryption {
  private static algorithm = 'aes-256-gcm';

  // Método helper para obtener la clave (se ejecuta cuando se llama, no cuando se carga el módulo)
  private static getKey(): Buffer {
    const key = process.env.SIGNATURE_ENCRYPTION_KEY;
    if (!key) {
      throw new Error('SIGNATURE_ENCRYPTION_KEY no está definida');
    }
    return Buffer.from(key, 'hex');
  }

  static encrypt(text: string): string {
    const key = this.getKey(); // Obtener clave dinámicamente
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedData: string): string {
    const key = this.getKey(); // Obtener clave dinámicamente
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

export const SECURITY_CONSTANTS = {
  BCRYPT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME_MINUTES: 15,
  SESSION_TIMEOUT_MINUTES: 30,
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_PATTERN:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
};