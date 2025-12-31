/**
 * SEED - POBLACIÓN INICIAL DE BASE DE DATOS
 * Crea:
 * - 56 casas del condominio
 * - Usuario admin inicial
 * - Datos de prueba (opcional)
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  // ============================================
  // 1. CREAR 56 CASAS
  // ============================================
  console.log('📦 Creando 56 casas...');

  for (let i = 1; i <= 56; i++) {
    await prisma.house.upsert({
      where: { houseNumber: i },
      update: {},
      create: {
        houseNumber: i,
        status: 'active',
      },
    });
  }

  console.log('✅ 56 casas creadas\n');

  // ============================================
  // 2. CREAR USUARIO ADMIN
  // ============================================
  console.log('👤 Creando usuario administrador...');

  const adminPassword = 'Admin123!@#';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rosedal2.com' },
    update: {},
    create: {
      email: 'admin@rosedal2.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'Rosedal II',
      phone: '3001234567',
      role: 'admin',
      isActive: true,
    },
  });

  console.log('✅ Admin creado:');
  console.log(`   Email: admin@rosedal2.com`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ⚠️  CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN\n`);

  // ============================================
  // 3. CREAR OFICIAL DE SEGURIDAD DE PRUEBA
  // ============================================
  console.log('🛡️  Creando oficial de seguridad...');

  const oficialPassword = 'Oficial123!@#';
  const oficialPasswordHash = await bcrypt.hash(oficialPassword, 12);

  await prisma.user.upsert({
    where: { email: 'oficial@rosedal2.com' },
    update: {},
    create: {
      email: 'oficial@rosedal2.com',
      passwordHash: oficialPasswordHash,
      firstName: 'Oficial',
      lastName: 'Seguridad',
      phone: '3009876543',
      role: 'oficial',
      isActive: true,
    },
  });

  console.log('✅ Oficial creado:');
  console.log(`   Email: oficial@rosedal2.com`);
  console.log(`   Password: ${oficialPassword}\n`);

  // ============================================
  // 4. CREAR USUARIO FILIAL DE PRUEBA (Casa 1)
  // ============================================
  console.log('🏠 Creando usuario filial...');

  const filialPassword = 'Filial123!@#';
  const filialPasswordHash = await bcrypt.hash(filialPassword, 12);

  await prisma.user.upsert({
    where: { email: 'filial@rosedal2.com' },
    update: {},
    create: {
      email: 'filial@rosedal2.com',
      passwordHash: filialPasswordHash,
      firstName: 'Residente',
      lastName: 'Casa 1',
      phone: '3005555555',
      role: 'filial',
      houseId: 1,
      isActive: true,
    },
  });

  console.log('✅ Filial creado:');
  console.log(`   Email: filial@rosedal2.com`);
  console.log(`   Password: ${filialPassword}`);
  console.log(`   Casa: 1\n`);

  // ============================================
  // 5. DATOS DE PRUEBA (OPCIONAL)
  // ============================================
  console.log('🧪 Creando datos de prueba...');

  // Personas de la casa 1
  await prisma.person.createMany({
    data: [
      {
        houseId: 1,
        type: 'owner',
        firstName: 'Juan',
        lastName: 'Pérez',
        cedula: '1234567890',
        phone: '3001111111',
      },
      {
        houseId: 1,
        type: 'resident',
        firstName: 'María',
        lastName: 'Pérez',
        phone: '3002222222',
      },
    ],
    skipDuplicates: true,
  });

  // Vehículos de la casa 1
  await prisma.vehicle.createMany({
    data: [
      {
        houseId: 1,
        type: 'car',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Blanco',
        licensePlate: 'ABC123',
      },
      {
        houseId: 1,
        type: 'motorcycle',
        brand: 'Yamaha',
        model: 'FZ',
        color: 'Negro',
        licensePlate: 'XYZ789',
      },
    ],
    skipDuplicates: true,
  });

  // Mascota de la casa 1
  await prisma.pet.create({
    data: {
      houseId: 1,
      name: 'Max',
      species: 'Perro',
      breed: 'Labrador',
    },
  });

  console.log('✅ Datos de prueba creados\n');

  // ============================================
  // RESUMEN FINAL
  // ============================================
  console.log('✅ ========================================');
  console.log('✅  SEED COMPLETADO');
  console.log('✅ ========================================');
  console.log('📊 Casas creadas: 56');
  console.log('👥 Usuarios creados: 3');
  console.log('   - Admin: admin@rosedal2.com');
  console.log('   - Oficial: oficial@rosedal2.com');
  console.log('   - Filial: filial@rosedal2.com');
  console.log('🏠 Casa 1 con datos de prueba');
  console.log('✅ ========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });