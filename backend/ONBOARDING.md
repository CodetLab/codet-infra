# 🎓 Guía de Onboarding para Nuevos Desarrolladores

Bienvenido al equipo de CodetLab Backend! Esta guía te llevará de 0 a 100 en nuestro backend en **2-3 horas**.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

```bash
# Verificar versiones requeridas
node --version     # v18+ 
npm --version      # v8+
git --version      # último
postgres --version # v12+
```

### Instalación rápida (si falta algo)

**Windows**:
```powershell
# Usar Chocolatey
choco install node postgresql
```

**macOS**:
```bash
brew install node postgresql
```

**Linux**:
```bash
sudo apt-get install node.js postgresql postgresql-contrib
```

---

## 🚀 Paso 1: Setup Inicial (15 min)

### 1.1 Clonar repositorio

```bash
git clone https://github.com/codetlab/backend.git
cd backend
```

### 1.2 Instalar dependencias

```bash
npm install
# Esperar hasta que termine (puede tomar 1-2 min)
```

### 1.3 Configurar variables de entorno

```bash
# Crear archivo .env desde template
cp .env.example .env

# Editar .env con tus valores
nano .env  # O tu editor favorito
```

**Valores esenciales para desarrollo**:
```bash
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/backend_dev
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
CONTACT_EMAIL=dev@localhost.com
RESEND_API_KEY=test_key  # Para testing
```

### 1.4 Configurar base de datos

```bash
# Crear base de datos local
createdb backend_dev

# Ejecutar migraciones
npm run db:migrate

# Verificar que funcionó
npm run db:studio
# Se abre GUI en http://localhost:5555
```

### 1.5 Iniciar servidor en desarrollo

```bash
npm run dev

# Deberías ver:
# ✓ Server running on port 5000
# ✓ Connected to database
```

### ✅ Checkpoint
```bash
curl http://localhost:5000/api/health
# Respuesta esperada: {"status":"ok"}
```

---

## 🧠 Paso 2: Entender la Arquitectura (30 min)

### 2.1 Leer documentación esencial

En este orden:
1. **README.md** (este directorio) - 5 min
2. **ARCHITECTURE.md** - Decisiones técnicas - 10 min
3. **BACKEND_DOCUMENTATION.md** - Guía completa - 15 min

### 2.2 Mapa mental rápido

```
Tu Request
    ↓
Express Router detecta ruta
    ↓
Middleware (auth, cors, etc)
    ↓
Controller (parsea y valida)
    ↓
Service (lógica de negocio)
    ↓
Database (Drizzle ORM)
    ↓
Response JSON
```

### 2.3 Directorio de código

```
backend/
├── src/app.ts              ← Crear app Express
├── src/server.ts           ← Iniciar servidor
├── src/router/index.ts     ← Definir rutas
│
├── src/core/
│   ├── config/env.ts       ← Variables de entorno
│   ├── db/
│   │   ├── index.ts        ← Conexión a DB
│   │   └── schema.ts       ← Definir tablas
│   └── middlewares/        ← Autenticación, etc
│
└── src/modules/            ← Módulos (auth, mailer, etc)
    ├── auth/               ← Routes → Controller → Service
    ├── mailer/
    ├── courses/
    └── contact/
```

---

## 💻 Paso 3: Ejecutar Ejemplos Prácticos (30 min)

### 3.1 Prueba de Health Check

```bash
curl http://localhost:5000/api/health
```

**Respuesta esperada**:
```json
{"status":"ok"}
```

### 3.2 Registrar un usuario

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miusuario@test.com",
    "password": "MiPassword123!",
    "appSlug": "mi-app"
  }'
```

**Respuesta esperada**:
```json
{
  "id": 1,
  "email": "miusuario@test.com",
  "name": "default",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 3.3 Hacer login

```bash
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "miusuario@test.com",
    "password": "MiPassword123!",
    "appSlug": "mi-app"
  }')

echo $RESPONSE
```

**Respuesta esperada**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "miusuario@test.com",
    "name": "default"
  }
}
```

### 3.4 Obtener cursos

```bash
curl http://localhost:5000/api/courses
```

**Respuesta esperada**:
```json
[
  {
    "id": 1,
    "title": "Intro a TypeScript",
    "description": "...",
    "appId": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### 3.5 Contacto

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Nombre",
    "email": "midirección@example.com",
    "message": "Hola, tengo una pregunta"
  }'
```

**Respuesta esperada**:
```json
{"success": true}
```

---

## 🔍 Paso 4: Explorar Código Fuente (45 min)

### 4.1 Entender un módulo completo: AUTH

Abre estos archivos en este orden:

#### Archivo 1: `src/modules/auth/auth.types.ts`
```typescript
// Define los tipos/interfaces
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}
```

**Objetivo**: Entender la estructura de datos

#### Archivo 2: `src/modules/auth/auth.routes.ts`
```typescript
// Define las rutas HTTP
router.post("/register", register);
router.post("/login", login);
```

**Objetivo**: Ver qué endpoints existen

#### Archivo 3: `src/modules/auth/auth.controller.ts`
```typescript
// Controller recibe request del HTTP
export const register = async (req: Request, res: Response) => {
  const { email, password, appSlug } = req.body;  // ← Parsear input
  const user = await registerUser(email, password, appSlug);  // ← Delegar
  res.json(user);  // ← Responder
};
```

**Objetivo**: Ver cómo Controller parsea y delega

#### Archivo 4: `src/modules/auth/auth.service.ts`
```typescript
// Service hace la lógica pesada
export const registerUser = async (
  email: string,
  password: string,
  appSlug: string
) => {
  // 1. Buscar app
  const app = await db.select().from(apps).where(eq(apps.slug, appSlug));
  
  // 2. Hash password
  const hashed = await bcrypt.hash(password, 10);
  
  // 3. Guardar usuario
  const [user] = await db
    .insert(users)
    .values({ email, password: hashed, name: "default" })
    .returning();
    
  return user;
};
```

**Objetivo**: Ver la lógica central de negocio

### 4.2 Entender el flujo completo

```
POST /api/auth/register
  ↓ Router llama
  ↓
auth.controller.ts::register()
  ├─ Valida que existan email, password, appSlug
  ├─ Llama a auth.service.ts::registerUser()
  └─ Retorna respuesta
  ↓
auth.service.ts::registerUser()
  ├─ Busca app por slug
  ├─ Hashea contraseña con bcrypt
  ├─ Inserta en table users
  └─ Retorna usuario creado
  ↓
Respuesta JSON al cliente
```

### 4.3 Ejercicio: Trazar otro módulo

Ahora, haz lo mismo con **MAILER** o **COURSES**:

1. Lee `*.types.ts`
2. Lee `*.routes.ts`
3. Lee `*.controller.ts`
4. Lee `*.service.ts`
5. Dibuja el flujo en tu cuaderno

---

## 🛠️ Paso 5: Tu Primer Cambio de Código (30 min)

### Ejercicio: Agregar un endpoint GET para obtener un usuario por ID

#### Paso 5.1: Agregar ruta

**Archivo**: `src/modules/auth/auth.routes.ts`

```typescript
// Agregar esta línea
router.get("/:id", getUser);
```

#### Paso 5.2: Agregar controller

**Archivo**: `src/modules/auth/auth.controller.ts`

```typescript
// Agregar esta función
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(parseInt(id));
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
```

#### Paso 5.3: Agregar service

**Archivo**: `src/modules/auth/auth.service.ts`

```typescript
// Agregar esta función
export const getUserById = async (id: number) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
    
  if (!user) throw new Error("User not found");
  return user;
};
```

#### Paso 5.4: Probar tu cambio

```bash
# Reinicia servidor (hot reload debería hacerlo automático)
curl http://localhost:5000/api/auth/1

# Respuesta esperada:
# {"id":1,"email":"test@test.com","name":"default","createdAt":"..."}
```

✅ **¡Lo lograste!** Acabas de agregar un endpoint completo.

---

## 📚 Paso 6: Conceptos Clave Explicados (30 min)

### 6.1 ¿Qué es Express?

Express es un framework web que mapea URLs a funciones:

```typescript
app.get("/ruta", (req, res) => {
  // req = información de la solicitud
  // res = objeto para enviar respuesta
});
```

### 6.2 ¿Qué es TypeScript?

TypeScript agrega tipos a JavaScript:

```typescript
// Sin tipos (JavaScript puro)
function add(a, b) {
  return a + b;
}
add("hola", 5);  // ¡Resultado inesperado!

// Con tipos (TypeScript)
function add(a: number, b: number): number {
  return a + b;
}
add("hola", 5);  // ❌ ERROR EN COMPILACIÓN
```

### 6.3 ¿Qué es Drizzle?

Drizzle es una librería para construir queries SQL con seguridad de tipos:

```typescript
// Sin Drizzle (SQL string, unsafe)
db.query("SELECT * FROM users WHERE email = $1", [email]);

// Con Drizzle (type-safe)
db.select().from(users).where(eq(users.email, email));
// ✅ TypeScript sabe que 'users.email' existe
```

### 6.4 ¿Qué es Multi-Tenancia?

Múltiples "aplicaciones" comparten la misma DB:

```
App 1 (usuario@gmail.com) → DB
App 2 (otro@gmail.com)    → DB
App 3 (tercero@gmail.com) → DB

Todas en la misma tabla "users"
pero filtradas por app_id
```

### 6.5 ¿Qué es JWT?

Un token que identifica un usuario sin guardar sesión:

```
Flujo:
1. Usuario hace login
   → Server crea token JWT
   → Cliente almacena token
   
2. Usuario hace request
   → Incluye token en header
   → Server valida token sin DB
   ✅ Sin estado (stateless)
```

---

## 🐛 Paso 7: Debugging y Troubleshooting (20 min)

### 7.1 Problema: Puerto 5000 en uso

```bash
# Encontrar proceso usando puerto 5000
lsof -i :5000

# Matar proceso (macOS/Linux)
kill -9 <PID>

# O usar puerto diferente
PORT=5001 npm run dev
```

### 7.2 Problema: Error de conexión a DB

```bash
# Verificar que PostgreSQL está corriendo
psql -U postgres -l

# Verificar DATABASE_URL en .env
echo $DATABASE_URL

# Si la URL es incorrecta, actualizar .env y reiniciar
```

### 7.3 Problema: "Tipo no existe"

```bash
# Ejecutar migraciones faltantes
npm run db:generate
npm run db:migrate

# O ver cambios pendientes
npm run db:studio
```

### 7.4 Agregar logs para debugging

```typescript
// En controller o service, agrega console.log
console.log("Email recibido:", email);
console.log("Password hasheado:", hashed);
console.log("Usuario guardado:", user);
```

**Ver logs en terminal donde corre `npm run dev`**

### 7.5 Usar Drizzle Studio

```bash
npm run db:studio
# Abre http://localhost:5555
# GUI para ver tablas y datos en tiempo real
```

---

## ✅ Paso 8: Checklist de Comprensión

Después de completar los pasos anteriores, responde estas preguntas:

- [ ] ¿Puedo iniciar el servidor y acceder a http://localhost:5000/api/health?
- [ ] ¿Entiendo el flujo: Route → Controller → Service → DB?
- [ ] ¿Puedo explicar qué es un middleware?
- [ ] ¿Sé cómo agregar un nuevo endpoint?
- [ ] ¿Entiendo por qué usamos TypeScript?
- [ ] ¿Sé cómo hacer un query a la DB con Drizzle?
- [ ] ¿Entiendo cómo funciona la autenticación JWT?
- [ ] ¿Puedo hacer cambios sin que explote el código?

**Si respondiste SÍ a todas**: ¡Estás listo para contribuir! 🎉

---

## 📖 Recursos Continuos

### Documentación Importante

- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

### Videos Recomendados (30 min cada)

1. Express.js Crash Course
2. TypeScript Basics
3. JWT Authentication
4. Database Design Basics

### Comunidades

- Stack Overflow (tag: express.js, typescript)
- GitHub Discussions (en nuestro repo)
- Slack #backend-dev

---

## 🎯 Siguientes Pasos

### Corto Plazo (Esta Semana)
1. Completar este onboarding
2. Hacer un PR pequeño (mejorar comentario, typo, etc)
3. Revisar PR de otros

### Mediano Plazo (Este Mes)
1. Implementar un módulo nuevo simple
2. Escribir tus primeras pruebas unitarias
3. Participar en code reviews

### Largo Plazo (Trimestre)
1. Entender toda la arquitectura
2. Optimizar performance
3. Proponer mejoras técnicas

---

## 🤝 ¿Necesitas Ayuda?

- **Pregunta técnica**: Abre un issue con tag `onboarding`
- **Duda de arquitectura**: Pregunta en #backend-dev
- **Error no documentado**: Abre issue con error completo
- **Sugerencia**: Envía feedback al tech lead

---

## 📝 Registro de Aprendizaje

Completa este checklist a medida que aprendes:

```markdown
## Mi Onboarding

- [ ] Setup inicial completado (Paso 1)
- [ ] Entiendo la arquitectura (Paso 2)
- [ ] Ejecuté ejemplos (Paso 3)
- [ ] Exploré código fuente (Paso 4)
- [ ] Hice mi primer cambio (Paso 5)
- [ ] Entiendo conceptos clave (Paso 6)
- [ ] Sé debuggear problemas (Paso 7)
- [ ] Pasé el checklist (Paso 8)

Completado: [Fecha]
Mentor: [Nombre]
```

---

**¡Bienvenido al equipo! 🚀**

Recuerda: todos comenzamos sin saber. Si tienes dudas, pregunta. Si encuentras bugs, reporta. Si tienes ideas, comparte.

Estamos aquí para crecer juntos. 💪

---

**Versión**: 1.0.0
**Última actualización**: Enero 2024
**Próxima revisión**: Abril 2024
