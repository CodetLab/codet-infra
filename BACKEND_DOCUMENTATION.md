# 📚 Documentación de Estructura Backend - Guía Completa para Onboarding

## 🎯 Descripción General

Este es un backend modular construido con **Express.js** y **TypeScript**, diseñado para soportar aplicaciones multi-tenant (SaaS) con arquitectura escalable. El sistema maneja usuarios, aplicaciones, autenticación, correos electrónicos y cursos educativos en un contexto de multi-tenancia.

### ¿Por qué esta estructura?

- **Modularidad**: Cada módulo es independiente y reutilizable
- **Escalabilidad**: Fácil de agregar nuevos módulos sin afectar existentes
- **Mantenibilidad**: Separación clara de responsabilidades (Controllers → Services → Database)
- **Seguridad**: Autenticación JWT, encriptación de contraseñas, validación de API keys
- **Type Safety**: TypeScript para prevenir errores en tiempo de desarrollo

---

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── app.ts                          # Punto de entrada de Express
│   ├── server.ts                       # Servidor Node.js
│   ├── router/
│   │   └── index.ts                   # Definición de rutas principales
│   │
│   ├── core/                          # Funcionalidad compartida
│   │   ├── config/
│   │   │   └── env.ts                # Variables de entorno
│   │   ├── db/
│   │   │   ├── index.ts              # Conexión a base de datos
│   │   │   └── schema.ts             # Definición de tablas (Drizzle ORM)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts    # Validación de JWT
│   │   │   └── resolve-app.ts        # Resolución de app por API key
│   │   └── types/
│   │       └── request.ts            # Tipos de solicitud personalizados
│   │
│   ├── modules/                       # Módulos de negocio
│   │   ├── auth/                     # Autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.middleware.ts
│   │   │   └── auth.types.ts
│   │   ├── mailer/                   # Sistema de correos
│   │   │   ├── mailer.service.ts
│   │   │   ├── resend.provider.ts
│   │   │   ├── sendMail.controller.ts
│   │   │   └── queue/
│   │   │       ├── queue.ts          # Cola de trabajos
│   │   │       └── worker.ts         # Worker de procesamiento
│   │   ├── courses/                  # Gestión de cursos
│   │   │   ├── courses.controller.ts
│   │   │   ├── courses.routes.ts
│   │   │   └── courses.service.ts
│   │   └── contact/                  # Formulario de contacto
│   │       ├── contact.controller.ts
│   │       └── contact.routes.ts
│   │
│   └── types/
│       ├── auth-request.ts           # Tipos para solicitud autenticada
│       └── express/
│           └── express.d.ts          # Extensiones de tipos Express
│
├── drizzle/                           # Migraciones de base de datos
│   ├── 0000_*.sql
│   ├── 0001_*.sql
│   └── meta/
│
├── package.json                       # Dependencias
├── tsconfig.json                      # Configuración TypeScript
└── drizzle.config.ts                  # Configuración de ORM
```

---

## 🛠️ Tecnología Utilizada

### Stack Principal
| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | LTS | Runtime de JavaScript |
| **TypeScript** | ^5.9.3 | Type safety y mejor experiencia de desarrollo |
| **Express.js** | ^5.2.1 | Framework web HTTP |
| **PostgreSQL** | - | Base de datos relacional |

### ORM y Base de Datos
| Librería | Versión | Propósito |
|---|---|---|
| **Drizzle ORM** | ^0.45.1 | ORM type-safe, migraciones |
| **Drizzle Kit** | ^0.31.10 | Herramientas CLI para Drizzle |
| **pg** | ^8.20.0 | Driver PostgreSQL |

### Autenticación y Seguridad
| Librería | Versión | Propósito |
|---|---|---|
| **bcrypt** | ^6.0.0 | Hashing seguro de contraseñas |
| **jsonwebtoken** | ^9.0.3 | Generación y validación de JWT |
| **cors** | ^2.8.6 | Control de origen cruzado |

### Email y Notificaciones
| Librería | Versión | Propósito |
|---|---|---|
| **resend** | ^6.12.3 | Proveedor de correos transaccionales |
| **nodemailer** | ^8.0.4 | Soporte alternativo para correos |

### Validación y Configuración
| Librería | Versión | Propósito |
|---|---|---|
| **zod** | ^4.3.6 | Validación de esquemas en runtime |
| **dotenv** | ^17.3.1 | Gestión de variables de entorno |

### Herramientas de Desarrollo
| Herramienta | Versión | Propósito |
|---|---|---|
| **ts-node-dev** | ^2.0.0 | Desarrollo con hot reload |
| **@types/\*** | - | Tipos TypeScript para librerías |

---

## 📦 Módulos Existentes

### 1. **Auth Module** (`src/modules/auth/`)
**Responsabilidad**: Gestión de autenticación y autorización

#### Archivos
- `auth.controller.ts` - Controladores de login/register
- `auth.service.ts` - Lógica de negocio (hash, JWT)
- `auth.routes.ts` - Rutas HTTP
- `auth.middleware.ts` - Validaciones personalizadas
- `auth.types.ts` - Tipos TypeScript

#### Endpoints
```typescript
POST /api/auth/register
// Body: { email, password, appSlug }
// Retorna: { id, email, name, createdAt, token? }

POST /api/auth/login
// Body: { email, password, appSlug }
// Retorna: { token, user: { id, email, name } }
```

#### Ejemplo de Uso
```bash
# Registrar nuevo usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123","appSlug":"my-app"}'

# Response:
# {
#   "id": 1,
#   "email": "user@example.com",
#   "name": "default",
#   "createdAt": "2024-01-15T10:30:00Z"
# }
```

---

### 2. **Mailer Module** (`src/modules/mailer/`)
**Responsabilidad**: Sistema de envío de correos electrónicos

#### Archivos
- `mailer.service.ts` - Lógica de creación y envío de emails
- `resend.provider.ts` - Proveedor de email (Resend)
- `sendMail.controller.ts` - Controlador HTTP
- `queue/` - Sistema de cola de trabajos

#### Flujo de Email
```
1. Cliente solicita envío de email
   ↓
2. Service guarda email como "pending" en DB
   ↓
3. Intenta enviar a través de Resend
   ↓
4. Si éxito: actualiza estado a "sent"
   Si error: actualiza estado a "failed" con detalles del error
```

#### Ejemplo de Uso
```bash
curl -X POST http://localhost:5000/api/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "to":"recipient@example.com",
    "subject":"Bienvenido",
    "body":"<h1>Hola!</h1>"
  }'
```

---

### 3. **Courses Module** (`src/modules/courses/`)
**Responsabilidad**: Gestión de cursos y lecciones educativas

#### Archivos
- `courses.controller.ts` - Controladores (get, create)
- `courses.service.ts` - Lógica de negocio
- `courses.routes.ts` - Rutas HTTP

#### Endpoints
```typescript
GET /api/courses
// Retorna: Array de cursos

POST /api/courses
// Body: { title, description, appSlug }
// Retorna: { id, title, description, createdAt }
```

#### Ejemplo de Uso
```bash
curl http://localhost:5000/api/courses

# Response:
# [
#   {
#     "id": 1,
#     "title": "Introducción a TypeScript",
#     "description": "Aprende TypeScript desde cero",
#     "appId": 1,
#     "createdAt": "2024-01-15T10:30:00Z"
#   }
# ]
```

---

### 4. **Contact Module** (`src/modules/contact/`)
**Responsabilidad**: Gestión de formularios de contacto

#### Archivos
- `contact.controller.ts` - Controlador del formulario
- `contact.routes.ts` - Rutas HTTP

#### Endpoints
```typescript
POST /api/contact
// Body: { name, email, message }
// Integración: Envía email automáticamente via mailer.service
```

#### Ejemplo de Uso
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Juan Pérez",
    "email":"juan@example.com",
    "message":"Tengo una pregunta sobre su servicio"
  }'
```

---

## 🔐 Esquema de Base de Datos

### Tabla: `users`
```sql
id (PK)           → Identificador único
name              → Nombre del usuario
email (UNIQUE)    → Email único
password          → Contraseña hasheada
created_at        → Timestamp de creación
```

### Tabla: `apps` (Tenants)
```sql
id (PK)           → Identificador único
name              → Nombre de la aplicación
slug (UNIQUE)     → Identificador amigable (ej: "my-app")
created_at        → Timestamp de creación
```

### Tabla: `user_apps` (Relación N:M)
```sql
id (PK)           → Identificador único
user_id (FK)      → Referencia a usuario
app_id (FK)       → Referencia a aplicación
role              → Rol del usuario (admin, user, etc)
created_at        → Timestamp de creación
```

### Tabla: `user_settings`
```sql
id (PK)           → Identificador único
user_id (FK)      → Referencia a usuario
theme             → Tema (light/dark)
language          → Idioma (es/en)
shortcuts (JSONB) → Accesos directos personalizados
preferences (JSONB) → Preferencias adicionales
two_factor_enabled → 2FA habilitado
created_at        → Timestamp de creación
```

### Tabla: `api_keys`
```sql
id (PK)           → Identificador único
app_id (FK)       → Referencia a aplicación
key (UNIQUE)      → Clave API
name              → Nombre descriptivo
active            → Estado de la clave
created_at        → Timestamp de creación
```

### Tabla: `emails`
```sql
id (PK)           → Identificador único
app_id (FK)       → Referencia a aplicación
to                → Destinatario
subject           → Asunto
body              → Cuerpo del email
status            → Estado (pending/sent/failed)
error             → Mensaje de error (si aplica)
created_at        → Timestamp de creación
```

### Tabla: `courses`
```sql
id (PK)           → Identificador único
app_id (FK)       → Referencia a aplicación
title             → Título del curso
description       → Descripción
created_at        → Timestamp de creación
```

### Tabla: `lessons`
```sql
id (PK)           → Identificador único
course_id (FK)    → Referencia a curso
title             → Título de la lección
content           → Contenido de la lección
created_at        → Timestamp de creación
```

---

## 🔄 Patrones de Arquitectura

### Patrón MVC (Controller → Service → Database)

```
HTTP Request
    ↓
Route Handler
    ↓
Controller (Validación básica, parseo)
    ↓
Service (Lógica de negocio)
    ↓
Database (Drizzle ORM)
    ↓
Response JSON
```

**Ejemplo en auth.routes.ts:**
```typescript
router.post("/register", register);  // ← Route
```

**Ejemplo en auth.controller.ts:**
```typescript
export const register = async (req: Request, res: Response) => {
  const { email, password, appSlug } = req.body;  // ← Parsing
  const user = await registerUser(email, password, appSlug);  // ← Service call
  res.json(user);
};
```

**Ejemplo en auth.service.ts:**
```typescript
export const registerUser = async (email, password, appSlug) => {
  const hashed = await bcrypt.hash(password, 10);  // ← Business logic
  const result = await db.insert(users).values({...});  // ← DB query
  return result[0];
};
```

### Patrón Middleware

```typescript
// auth.middleware.ts - Validar JWT
export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) res.status(401).json({ error: "Unauthorized" });
  next();
};

// resolve-app.ts - Resolver app por API key
export const resolveApp = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const key = await db.query.apiKeys.findFirst({...});
  req.context = { appId: key.appId };
  next();
};

// En router:
router.post("/send", resolveApp, sendMailController);  // ← Middleware aplicado
```

---

## 📋 Variables de Entorno Requeridas

```bash
# .env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/backend_db
JWT_SECRET=your-super-secret-key-change-in-production
CONTACT_EMAIL=contacto@tudominio.com
RESEND_API_KEY=your-resend-api-key
```

---

## 🚀 Setup e Instalación

### 1. Clonar repositorio
```bash
git clone <repo-url>
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
```

### 4. Configurar base de datos
```bash
# Crear base de datos PostgreSQL
createdb backend_db

# Ejecutar migraciones
npm run db:migrate
```

### 5. Iniciar en desarrollo
```bash
npm run dev
# El servidor inicia en http://localhost:5000
```

### 6. Build para producción
```bash
npm run build
npm start
```

---

## 🔌 Cómo Agregar un Nuevo Módulo

### Paso 1: Crear estructura del módulo
```
src/modules/mi-modulo/
├── mi-modulo.controller.ts
├── mi-modulo.service.ts
├── mi-modulo.routes.ts
├── mi-modulo.types.ts
└── mi-modulo.middleware.ts (opcional)
```

### Paso 2: Definir tipos (mi-modulo.types.ts)
```typescript
export interface MiModuloData {
  id: number;
  nombre: string;
  appId: number;
  createdAt: Date;
}

export interface CreateMiModuloInput {
  nombre: string;
  appId: number;
}
```

### Paso 3: Crear service (mi-modulo.service.ts)
```typescript
import { db } from "../../core/db";
import { miModuloTable } from "../../core/db/schema";

export const miModuloService = {
  async getAll() {
    return await db.select().from(miModuloTable);
  },
  
  async create(data: CreateMiModuloInput) {
    const [result] = await db
      .insert(miModuloTable)
      .values(data)
      .returning();
    return result;
  }
};
```

### Paso 4: Crear controller (mi-modulo.controller.ts)
```typescript
import { Request, Response } from "express";
import { miModuloService } from "./mi-modulo.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const data = await miModuloService.getAll();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
```

### Paso 5: Crear rutas (mi-modulo.routes.ts)
```typescript
import { Router } from "express";
import { getAll } from "./mi-modulo.controller";

const router = Router();
router.get("/", getAll);

export default router;
```

### Paso 6: Registrar en router principal (src/router/index.ts)
```typescript
import miModuloRoutes from "../modules/mi-modulo/mi-modulo.routes";

router.use("/mi-modulo", miModuloRoutes);
```

### Paso 7: Agregar tabla a schema (src/core/db/schema.ts)
```typescript
export const miModuloTable = pgTable("mi_modulo", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  appId: integer("app_id").notNull().references(() => apps.id),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Paso 8: Crear migración
```bash
npm run db:generate  # Genera migración automáticamente
npm run db:migrate   # Ejecuta la migración
```

---

## 🧪 Ejemplos de Solicitudes HTTP

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@codetlab.com",
    "password": "SecurePass123!",
    "appSlug": "main-app"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@codetlab.com",
    "password": "SecurePass123!",
    "appSlug": "main-app"
  }'
```

### 3. Enviar Email (requiere API key)
```bash
curl -X POST http://localhost:5000/api/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_test_xyz123" \
  -d '{
    "to": "usuario@example.com",
    "subject": "Bienvenido a CodeTLab",
    "body": "<h1>¡Hola!</h1><p>Gracias por registrarte</p>"
  }'
```

### 4. Obtener Cursos
```bash
curl http://localhost:5000/api/courses
```

### 5. Crear Contacto
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos López",
    "email": "carlos@example.com",
    "message": "Me gustaría saber más sobre sus servicios"
  }'
```

### 6. Health Check
```bash
curl http://localhost:5000/api/health
# Response: { "status": "ok" }
```

---

## 🔒 Sistema de Seguridad

### 1. **Autenticación JWT**
- Tokens JWT en cada solicitud protegida
- Header: `Authorization: Bearer <token>`
- Validado en `auth.middleware.ts`

### 2. **Validación de API Keys**
- Claves API por aplicación
- Header: `X-API-Key: <key>`
- Validado en `resolve-app.ts`

### 3. **Encriptación de Contraseñas**
- bcrypt con salt rounds: 10
- Nunca se envía la contraseña en respuestas

### 4. **CORS**
- Configurado en `app.ts`
- Permite solicitudes desde cualquier origen (ajustar en producción)

---

## 📊 Multi-Tenancia

El sistema soporta múltiples aplicaciones (tenants) compartiendo una base de datos:

```
Una Aplicación (App) = Un Tenant
    ├── Múltiples Usuarios
    ├── Propia configuración
    ├── Propios cursos
    └── Propias API keys
```

**Flujo Multi-Tenancia:**
```
Cliente solicita acceso
    ↓
Proporciona: email + appSlug (en auth)
           O: X-API-Key (en requests)
    ↓
Sistema verifica app existe
    ↓
Sistema crea context con appId
    ↓
Todas las operaciones filtran por appId
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con hot reload

# Build
npm run build            # Compila TypeScript a JavaScript

# Producción
npm start                # Inicia servidor compilado

# Base de datos
npm run db:generate      # Genera migraciones
npm run db:migrate       # Ejecuta migraciones
npm run db:studio        # Abre Drizzle Studio (GUI)
```

---

## ❓ Preguntas Frecuentes

### P: ¿Cómo agrego autenticación a una ruta nueva?
**R:** Importa `authMiddleware` y úsalo en tu ruta:
```typescript
router.get("/private", authMiddleware, miControlador);
```

### P: ¿Cómo accedo al contexto de la app en un middleware?
**R:** El `resolveApp` middleware agrega `req.context.appId`:
```typescript
const appId = (req as any).context?.appId;
```

### P: ¿Cómo manejo errores globalmente?
**R:** En el `service`, lanza `throw new Error()` y en el `controller` capture:
```typescript
catch (err: any) {
  res.status(400).json({ error: err.message });
}
```

### P: ¿Cómo agrego validación con Zod?
**R:** Define un schema y úsalo en el controller:
```typescript
const schema = z.object({ email: z.string().email() });
const { email } = schema.parse(req.body);
```

---

## 🤝 Contribuciones

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de cambios: `git commit -am 'Agregar nueva funcionalidad'`
3. Haz push: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 📝 Licencia

ISC

---

## 👥 Soporte y Contacto

Para preguntas o problemas, contacta al equipo de desarrollo o abre un issue en el repositorio.

---

**Última actualización**: Junio 2026
**Versión de Documentación**: 1.0.0
