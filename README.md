# 🏘️ Condominio II - Sistema de Gestión de Condominio

Sistema completo de gestión para condominios con control de visitas, autenticación avanzada, y comunicación en tiempo real.

## 🚀 Tecnologías

### Backend
- **NestJS** - Framework Node.js
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **Redis** - Caché y sesiones
- **Socket.io** - WebSocket para chat
- **JWT + 2FA** - Autenticación segura
- **bcrypt** - Encriptación de contraseñas
- **AES-256-GCM** - Cifrado de firmas digitales

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **React Query** - Gestión de estado servidor
- **Zustand** - Estado global
- **Socket.io-client** - WebSocket cliente

## 📁 Estructura del Proyecto
```
Condominio2/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── modules/      # Módulos (auth, users, houses, visits)
│   │   ├── common/       # Guards, decorators, filters
│   │   ├── config/       # Configuración
│   │   └── prisma/       # Prisma service
│   ├── prisma/           # Schema y migraciones
│   └── package.json
│
├── frontend/             # Monorepo Next.js
│   ├── apps/
│   │   ├── cliente/      # App residentes (puerto 3000)
│   │   ├── oficial/      # App seguridad (puerto 3002)
│   │   └── admin/        # App administración (puerto 3003)
│   └── packages/
│       └── shared/       # Componentes compartidos
│
└── docker-compose.yml    # PostgreSQL + Redis
```

## ⚙️ Instalación

### Requisitos previos
- Node.js 20+
- pnpm 8+
- Docker Desktop

### 1️⃣ Clonar repositorio
```bash
git clone https://github.com/TU_USUARIO/Condominio2.git
cd Condominio2
```

### 2️⃣ Configurar Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tus valores
pnpm install
```

### 3️⃣ Configurar Frontend
```bash
cd ../frontend
pnpm install
```

### 4️⃣ Iniciar servicios Docker
```bash
cd ..
docker-compose up -d
```

### 5️⃣ Configurar Base de Datos
```bash
cd backend
pnpm prisma:migrate
pnpm prisma:seed
```

### 6️⃣ Iniciar aplicaciones
```bash
# Terminal 1 - Backend
cd backend
pnpm start:dev

# Terminal 2 - Cliente
cd frontend
pnpm dev:cliente

# Terminal 3 - Oficial
pnpm dev:oficial

# Terminal 4 - Admin
pnpm dev:admin
```

## 🔐 Usuarios de Prueba

Después del seed:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@Condominio2.com | Admin123456789 |
| Oficial | oficial@Condominio2.com | Oficial123456789 |
| Residente | filial@Condominio2.com | Filial123456789 |

## 🌐 URLs

- **Cliente (Residentes):** http://localhost:3000
- **Oficial (Seguridad):** http://localhost:3002
- **Admin (Administración):** http://localhost:3003
- **API Backend:** http://localhost:3001/api

## 📦 Scripts Disponibles

### Backend
```bash
pnpm start:dev          # Modo desarrollo
pnpm build              # Build producción
pnpm prisma:generate    # Generar Prisma Client
pnpm prisma:migrate     # Ejecutar migraciones
pnpm prisma:seed        # Poblar BD
pnpm prisma:studio      # Prisma Studio GUI
```

### Frontend
```bash
pnpm dev                # Todas las apps
pnpm dev:cliente        # Solo cliente
pnpm dev:oficial        # Solo oficial
pnpm dev:admin          # Solo admin
pnpm build              # Build todas
pnpm lint               # Linter
```

## 🔧 Características

- ✅ Autenticación JWT con refresh tokens
- ✅ 2FA (Two-Factor Authentication)
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Registro de visitas con firmas digitales cifradas
- ✅ Chat en tiempo real con WebSocket
- ✅ Gestión de usuarios, casas, vehículos, mascotas
- ✅ Audit logs de todas las acciones
- ✅ Rate limiting y seguridad con Helmet
- ✅ Soft deletes
- ✅ Validación con class-validator
- ✅ TypeScript en todo el stack

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado por Yeison
