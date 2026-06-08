# 🚀 Backend CodetLab - API Rest Multi-Tenant

Backend modular construido con **Express.js**, **TypeScript** y **PostgreSQL** para gestionar usuarios, autenticación, correos y cursos en un ambiente SaaS multi-tenant.

## 📋 Resumen Ejecutivo

| Aspecto | Detalles |
|--------|----------|
| **Framework** | Express.js 5.2.1 |
| **Lenguaje** | TypeScript 5.9.3 |
| **Base de Datos** | PostgreSQL con Drizzle ORM |
| **Autenticación** | JWT + bcrypt |
| **Email** | Resend + Nodemailer |
| **Validación** | Zod |
| **Tipo de Arquitectura** | MVC + Multi-Tenancia |

## 🎯 Características Principales

- ✅ **Autenticación segura** con JWT y bcrypt
- ✅ **Multi-tenancia** - Una BD para múltiples aplicaciones
- ✅ **Gestión de usuarios y roles** por aplicación
- ✅ **Sistema de emails** con cola de procesamiento
- ✅ **Gestión de cursos y lecciones**
- ✅ **API keys por aplicación**
- ✅ **Preferencias y configuración de usuarios**
- ✅ **Type-safe** en toda la aplicación

## 📦 Stack Tecnológico Completo

### Dependencias de Producción
```json
{
  "bcrypt": "^6.0.0",           // Hashing de contraseñas
  "cors": "^2.8.6",             // Control de CORS
  "dotenv": "^17.3.1",          // Variables de entorno
  "drizzle-orm": "^0.45.1",     // ORM type-safe
  "express": "^5.2.1",          // Framework web
  "jsonwebtoken": "^9.0.3",     // Tokens JWT
  "nodemailer": "^8.0.4",       // Envío de emails
  "pg": "^8.20.0",              // Driver PostgreSQL
  "resend": "^6.12.3",          // Proveedor de emails
  "zod": "^4.3.6"               // Validación de esquemas
}
```

### Dependencias de Desarrollo
```json
{
  "typescript": "^5.9.3",          // Type checking
  "ts-node-dev": "^2.0.0",         // Hot reload en desarrollo
  "drizzle-kit": "^0.31.10",       // Herramientas Drizzle
  "@types/*": "latest"             // Tipos TypeScript
}
```

## 🏗️ Estructura de Directorios

```
src/
├── app.ts                      # Instancia de Express
├── server.ts                   # Punto de entrada
├── core/                       # Funcionalidad compartida
│   ├── config/
│   │   └── env.ts             # Variables de entorno
│   ├── db/
│   │   ├── index.ts           # Conexión PostgreSQL
│   │   └── schema.ts          # Tablas (Drizzle)
│   ├── middlewares/
│   │   ├── auth.middleware.ts # Validación JWT
│   │   └── resolve-app.ts     # Resolución de app
│   └── types/
│       └── request.ts         # Tipos personalizados
├── modules/                    # Módulos de negocio
│   ├── auth/                  # Autenticación
│   ├── mailer/                # Envío de emails
│   ├── courses/               # Gestión de cursos
│   └── contact/               # Contactos
├── router/
│   └── index.ts               # Rutas principales
└── types/
    ├── auth-request.ts
    └── express/
```

## 🚀 Quick Start

### 1. Instalación
```bash
npm install
```

### 2. Variables de Entorno
```bash
cat > .env << EOF
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/backend
JWT_SECRET=tu-clave-secreta-aqui
CONTACT_EMAIL=contacto@tudominio.com
RESEND_API_KEY=re_xxxxx
EOF
```

### 3. Base de Datos
```bash
# Crear base de datos
createdb backend

# Ejecutar migraciones
npm run db:migrate
```

### 4. Desarrollo
```bash
npm run dev
# http://localhost:5000
```

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/register        # Crear usuario
POST   /api/auth/login           # Iniciar sesión
```

### Cursos
```
GET    /api/courses              # Listar cursos
POST   /api/courses              # Crear curso
```

### Email
```
POST   /api/send                 # Enviar email (requiere API key)
```

### Contacto
```
POST   /api/contact              # Enviar formulario
```

### Salud
```
GET    /api/health               # Estado del servidor
GET    /api/private              # Ruta protegida (requiere JWT)
```

## 📊 Modelo de Datos

### Tablas Principales

**users** - Registro de usuarios
```
id (PK) | name | email (UNIQUE) | password | created_at
```

**apps** - Aplicaciones / Tenants
```
id (PK) | name | slug (UNIQUE) | created_at
```

**user_apps** - Relación usuario-app
```
id (PK) | user_id (FK) | app_id (FK) | role | created_at
```

**user_settings** - Configuración de usuario
```
id (PK) | user_id (FK) | theme | language | shortcuts (JSONB) | preferences (JSONB) | created_at
```

**api_keys** - Claves de API por aplicación
```
id (PK) | app_id (FK) | key (UNIQUE) | name | active | created_at
```

**emails** - Historial de correos
```
id (PK) | app_id (FK) | to | subject | body | status | error | created_at
```

**courses** - Cursos educativos
```
id (PK) | app_id (FK) | title | description | created_at
```

**lessons** - Lecciones de cursos
```
id (PK) | course_id (FK) | title | content | created_at
```

## 🔐 Seguridad

### Autenticación JWT
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Keys
```bash
X-API-Key: sk_test_123abc456def
```

### Encriptación
- ✅ Contraseñas con bcrypt (10 salt rounds)
- ✅ JWT con SECRET_KEY
- ✅ CORS configurado
- ✅ Validación de entrada con Zod

## 🔄 Patrones de Arquitectura

### MVC Pattern
```
Route → Controller → Service → Database
```

### Middleware Pattern
```
Request → [authMiddleware, resolveApp] → Handler → Response
```

### Service Layer Pattern
```
// Lógica de negocio centralizada
export const registerUser = async (email, password, appSlug) => {
  // Validaciones
  // Transformaciones
  // Query a DB
  return user;
};
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Hot reload

# Build
npm run build                  # Compilar TypeScript
npm start                      # Ejecutar en producción

# Base de datos
npm run db:generate           # Generar migraciones
npm run db:migrate            # Ejecutar migraciones
npm run db:studio             # GUI de Drizzle

# Limpieza
rm -rf dist node_modules      # Limpiar
npm install                   # Reinstalar
```

## 📝 Ejemplos de Uso

### 1. Registro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "appSlug": "mi-app"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "appSlug": "mi-app"
  }'
```

### 3. Enviar Email
```bash
curl -X POST http://localhost:5000/api/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_test_123abc" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Asunto",
    "body": "<h1>Mensaje HTML</h1>"
  }'
```

## 🆕 Agregar un Nuevo Módulo

### Paso 1: Crear estructura
```bash
mkdir -p src/modules/nuevo-modulo
```

### Paso 2: Crear archivos
- `nuevo-modulo.controller.ts` - Controladores HTTP
- `nuevo-modulo.service.ts` - Lógica de negocio
- `nuevo-modulo.routes.ts` - Definición de rutas
- `nuevo-modulo.types.ts` - Tipos TypeScript

### Paso 3: Registrar en router
```typescript
// src/router/index.ts
import nuevoModuloRoutes from "../modules/nuevo-modulo/nuevo-modulo.routes";
router.use("/nuevo-modulo", nuevoModuloRoutes);
```

### Paso 4: Agregar tabla a schema
```typescript
// src/core/db/schema.ts
export const nuevoModulo = pgTable("nuevo_modulo", {
  id: serial("id").primaryKey(),
  // campos...
});
```

## 🧪 Testing

Para probar los endpoints, usa:

```bash
# Herramientas recomendadas
- curl (CLI)
- Postman (GUI)
- Insomnia (GUI)
- Thunder Client (VSCode extension)
```

## 🤝 Contribuciones

1. Fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar X funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📚 Documentación Adicional

Ver documentación completa en: `BACKEND_DOCUMENTATION.md`

Incluye:
- Guía detallada de arquitectura
- Explicación de cada módulo
- Ejemplos avanzados
- FAQ
- Guía de onboarding

## 🐛 Troubleshooting

### Error: Cannot find module 'drizzle-orm'
```bash
npm install drizzle-orm drizzle-kit
```

### Error: CONNECTION REFUSED
```bash
# Verificar PostgreSQL está corriendo
psql -U postgres -l

# Verificar DATABASE_URL en .env
```

### Error: Migration not found
```bash
npm run db:generate    # Generar migraciones faltantes
npm run db:migrate     # Ejecutar todas
```

## 📞 Soporte

- 📧 Email: reach.codetlab@gmail.com
- 🐛 Issues: Abre un issue en GitHub
- 💬 Discussions: Usa GitHub Discussions

## 📄 Licencia

ISC

---

**Last Updated**: Jun 2026
**Version**: 1.0.0
**Maintainer**: CodetLab Team
