# 🏗️ Arquitectura Backend - Decisiones y Justificación

## 1. Visión General de la Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                     Cliente HTTP                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
         ┌───────────────────────┐
         │   Express.js Server   │
         │  (Puerto 5000)        │
         └──────────┬────────────┘
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   ┌────────┐  ┌────────┐  ┌────────┐
   │ Authen │  │ Mailer │  │Courses │
   │ Module │  │ Module │  │ Module │
   └────┬───┘  └────┬───┘  └────┬───┘
        │           │           │
        └───────────┼───────────┘
                    ↓
            ┌─────────────────┐
            │  Service Layer  │
            │  (Lógica)       │
            └────────┬────────┘
                     ↓
            ┌─────────────────────┐
            │   Drizzle ORM       │
            │  (Query Builder)    │
            └────────┬────────────┘
                     ↓
            ┌─────────────────────┐
            │   PostgreSQL DB     │
            │  (Persistencia)     │
            └─────────────────────┘
```

---

## 2. ¿Por Qué Esta Estructura?

### 2.1 Express.js como Framework

#### ✅ Ventajas
- **Minimalista**: No impone demasiadas reglas, flexible
- **Comunidad**: Enorme ecosistema de middleware
- **Performance**: Muy rápido y ligero
- **Madurez**: Probado en producción por miles de empresas
- **Fácil de aprender**: Curva de aprendizaje muy baja

#### ❌ Alternativas consideradas
- **NestJS**: Muy pesado para este caso, overhead innecesario
- **Fastify**: Bueno pero menos comunidad que Express
- **Hono**: Moderno pero comunidad muy pequeña

#### 📌 Conclusión
Express.js es el estándar de facto para APIs REST en Node.js. Ideal para MVPs y aplicaciones medianas.

---

### 2.2 TypeScript para Type Safety

#### ✅ Ventajas
- **Errores en tiempo de compilación**: Atrapa bugs antes de producción
- **Autocompletado**: IDE proporciona sugerencias precisas
- **Documentación viva**: Los tipos sirven como documentación
- **Refactorización segura**: Cambiar código sin quebrar todo
- **Mejor experiencia de equipo**: Menos sorpresas en PRs

#### Ejemplo de protección
```typescript
// SIN TypeScript - Bug invisible
const user = await db.query("SELECT * FROM users");
console.log(user.nombre); // ¿Existe? ¿Cuál es el nombre?

// CON TypeScript - Error en compilación
const user: User = await userService.getById(1);
console.log(user.name); // ✅ IDE sabe exactamente qué es
```

#### 📌 Conclusión
TypeScript previene una clase entera de bugs en equipos grandes. Mejora mantenibilidad a largo plazo.

---

### 2.3 PostgreSQL como Base de Datos

#### ✅ Ventajas
- **ACID Compliance**: Garantías de consistencia
- **Relaciones complejas**: Soporta N:M, jerarquías, etc.
- **Tipos de datos avanzados**: JSON, Arrays, UUID, etc.
- **Full-text search**: Búsqueda integrada
- **Extensiones**: PostGIS, UUID, etc.
- **Open Source**: Sin licencias costosas
- **Escalabilidad**: Replica, particionamiento

#### ❌ Alternativas
- **MySQL**: Más simple pero menos características
- **MongoDB**: Flexible pero sin transacciones ACID
- **DynamoDB**: Serverless pero vendor lock-in

#### 📌 Conclusión
Para aplicaciones con datos relacionados y requisitos de consistencia, PostgreSQL es superior. Mejor inversión a largo plazo.

---

### 2.4 Drizzle ORM - Type-Safe

#### ✅ Ventajas
- **Type-safe queries**: Validación de tipos en queries
- **SQL legible**: Genera SQL limpio y eficiente
- **Migraciones**: Versionado de esquema
- **Sin decoradores**: Menos "magia", más transparencia
- **Lightweight**: Mucho más pequeño que Prisma/TypeORM

```typescript
// Drizzle - Type-safe
const users = await db
  .select()
  .from(users)
  .where(eq(users.email, email));
// ✅ TypeScript sabe qué columnas existen

// Prisma - Type-safe pero con decoradores
@Entity()
class User {
  @Column()
  email: string;
}
```

#### ❌ Alternativas
- **Prisma**: Más popular pero más overhead
- **TypeORM**: Muy complejo, muchas decoradores
- **Sequelize**: Sin type-safety real

#### 📌 Conclusión
Drizzle es la mejor opción para nuevos proyectos con TypeScript. Mejor balance entre potencia y simplicidad.

---

### 2.5 Arquitectura MVC + Service Layer

#### Por qué 3 capas?

```
┌─────────────────┐
│  CONTROLLER     │  ← HTTP, Parseo de parámetros
│  (Thin)         │     Delegación al service
├─────────────────┤
│  SERVICE        │  ← Lógica de negocio
│  (Fat)          │     Validaciones complejas
│                 │     Transacciones
├─────────────────┤
│  REPOSITORY     │  ← Acceso a datos
│  (Thin)         │     Queries SQL
└─────────────────┘
```

#### ✅ Ventajas de esta separación

1. **Testabilidad**: Cada layer se prueba independiente
   ```typescript
   // Probar service sin HTTP
   const user = await registerUser("email", "pass", "app");
   expect(user.id).toBeDefined();
   ```

2. **Reutilización**: Un service puede ser usado por múltiples controllers
   ```typescript
   // Email service usado por: auth, contact, admin
   await mailerService.create({...});
   ```

3. **Mantenibilidad**: Cambios en DB no afectan HTTP
4. **Escalabilidad**: Fácil agregar caché, queues, etc.

#### 📌 Conclusión
MVC es el patrón más probado en web. El Service Layer adicional es clave para código mantenible.

---

### 2.6 Multi-Tenancia en Una Base de Datos

#### Diseño actual: Base de datos compartida

```sql
-- Una DB para todas las apps
users (id, email, password, ...)
apps (id, name, slug)  ← Identificador del tenant
user_apps (user_id, app_id)  ← Nexo
courses (id, app_id, ...)  ← Todas referencian app_id
emails (id, app_id, ...)
```

#### ✅ Ventajas
- **Costo**: Una sola DB reducida
- **Mantenimiento**: Actualizar schema una sola vez
- **Datos compartidos**: Reportes cross-tenant
- **Respaldo**: Una sola política de backup

#### ❌ Desventajas
- **Queries complejas**: Siempre filtrar por app_id
- **Seguridad**: Riesgo de data leaks si falla autorización
- **Performance**: Menos optimización que DB por tenant

#### ¿Por qué este diseño?

```typescript
// Cada query automáticamente filtra por app
const courses = await db
  .select()
  .from(courses)
  .where(eq(courses.appId, req.context.appId))  // ← SIEMPRE

// Si olvidas esto... data leak
// Pero con TypeScript/arquitectura es difícil olvidar
```

#### 📌 Conclusión
Para MVP/startups, una DB compartida es pragmática. Cuando crecimiento justifique, migrar a DB-per-tenant es posible.

---

## 3. Decisiones Clave de Diseño

### 3.1 Autenticación: JWT vs Sessions

#### Elegido: JWT (JSON Web Tokens)

```typescript
// Flujo JWT
1. Cliente hace login
   → Server genera token + envía al cliente
   → Cliente almacena token (localStorage, cookie)
   → Cliente incluye token en cada request
   → Server valida token sin consultar DB
```

#### ✅ Ventajas de JWT
- **Stateless**: No necesitas session storage
- **Escalable**: Múltiples servidores, sin sincronizar
- **Mobile-friendly**: Funciona con apps nativas
- **CORS-friendly**: No hay problemas de cookies

#### ❌ Desventajas
- **Revocación**: No puedes revocar un token antes de expiry
- **Payload**: Token viaja en cada request

#### Comparación
| Feature | JWT | Sessions |
|---------|-----|----------|
| Stateless | ✅ | ❌ |
| Escalable | ✅ | ❌ |
| Almacenamiento | ❌ | ✅ |
| Revocación | ❌ | ✅ |

#### 📌 Conclusión
Para API REST moderna, JWT es estándar. Sessions son para MVC tradicional.

---

### 3.2 Contraseñas: bcrypt vs scrypt vs argon2

#### Elegido: bcrypt

```typescript
const hashed = await bcrypt.hash(password, 10);
// 10 = salt rounds = tiempo de cálculo
```

#### ✅ Ventajas
- **Estándar**: Usado en casi todo lado
- **Lento**: Resiste fuerza bruta (intencionalmente)
- **Adecuado**: Para contraseñas, no requiere hardware especial

#### Comparación
| Algoritmo | Velocidad | Adopción | Uso |
|-----------|-----------|----------|-----|
| bcrypt | Lento ✅ | Altísima ✅ | Contraseñas |
| scrypt | Lento ✅ | Alta | Derivación clave |
| argon2 | Muy lento | Media | Criptografía seria |

#### 📌 Conclusión
bcrypt es suficiente y está probado. No hay razón para algo más complejo en este proyecto.

---

### 3.3 Validación: Zod vs Yup vs Joi

#### Elegido: Zod

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const validated = schema.parse(req.body);
// ✅ TypeScript sabe el tipo de 'validated'
```

#### ✅ Ventajas de Zod
- **Type-safe**: Validación y tipos juntos
- **Sincrónico**: Más rápido que Joi/Yup
- **Composable**: Schemas reutilizables
- **DX**: Mejor experiencia de desarrollo

#### 📌 Conclusión
Zod es la mejor opción para TypeScript moderno.

---

### 3.4 Email: Resend vs Nodemailer vs SendGrid

#### Elegido: Resend (primario) + Nodemailer (fallback)

```typescript
// mailer.service.ts
try {
  await sendEmail({...});  // Resend
  status = "sent";
} catch {
  // Fallback a Nodemailer
  await nodemailer.send({...});
}
```

#### ✅ Ventajas
- **Resend**: Moderno, excelente DX, gratis primeros emails
- **Nodemailer**: Fallback local (testing, desarrollo)

#### 📌 Conclusión
Combinación pragmática: Resend para producción, Nodemailer para desarrollo/pruebas.

---

## 4. Patrones de Implementación

### 4.1 Patrón: Middleware para Contexto

```typescript
// resolve-app.ts - Middleware que enriquece request
export const resolveApp = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const key = await db.query.apiKeys.findFirst({...});
  
  req.context = { appId: key.appId };  // ← Enriquecimiento
  next();
};

// En rutas
router.post("/send", resolveApp, sendMailController);
//                   ↑ Middleware
//                               ↑ Ahora req.context.appId existe
```

#### ✅ Ventajas
- **DRY**: No repetir lógica de resolución
- **Centralizado**: Un lugar para cambiar
- **Composable**: Múltiples middlewares en cadena

---

### 4.2 Patrón: Service Layer Transaccional

```typescript
export const mailerService = {
  async create(data) {
    // 1. Guardar como pending
    const email = await db.insert(emails).values({...});
    
    try {
      // 2. Intentar enviar
      await sendEmail({...});
      
      // 3. Actualizar estado
      await db.update(emails).set({ status: "sent" });
      return email;
      
    } catch (err) {
      // 4. Guardar fallo
      await db.update(emails).set({ status: "failed", error: err.message });
      throw err;
    }
  }
};
```

#### ✅ Ventajas
- **Audit trail**: Todos los intentos guardados
- **Recuperable**: Reintentación de fallos fácil
- **Observable**: Reportes de email

---

### 4.3 Patrón: Context Pattern para Multi-Tenancia

```typescript
// Middleware enriquece request
req.context = { appId: 123 };

// Todos los services acceden a context
const courses = await db.select()
  .from(courses)
  .where(eq(courses.appId, req.context.appId));
```

#### ✅ Ventajas
- **Seguridad**: Imposible olvidar el filtro
- **Coherencia**: Un solo lugar define app actual
- **Testing**: Fácil mockear context

---

## 5. Decisiones de Seguridad

### 5.1 Hasheo de Contraseñas

```typescript
// ✅ CORRECTO
const hashed = await bcrypt.hash(password, 10);
await db.insert(users).values({ password: hashed });

// ❌ INCORRECTO (Nunca hagas esto)
await db.insert(users).values({ password: password });
```

### 5.2 API Keys vs JWT

| Caso de Uso | Método |
|---|---|
| Usuario en frontend | JWT (stateless, CORS) |
| Servidor a servidor | API Key (identificación) |
| Admin en backend | JWT (con roles) |

```typescript
// Frontend: JWT
fetch("/api/courses", {
  headers: { "Authorization": "Bearer " + token }
});

// Server: API Key
fetch("/api/send", {
  headers: { "X-API-Key": apiKey }
});
```

### 5.3 CORS Configuration

```typescript
// app.ts
app.use(cors());  // ← Permite CUALQUIER origen

// Producción: Restringir
app.use(cors({
  origin: ["https://example.com", "https://app.example.com"]
}));
```

---

## 6. Escalabilidad Futura

### 6.1 Cuando agregar caché

```typescript
// Hoy: Query a DB
const courses = await db.select().from(courses);

// Mañana: Redis
const courses = await cache.get("courses:app:123") 
  || await db.select().from(courses);
```

### 6.2 Cuando agregar queues

```typescript
// Hoy: Síncrono
await mailerService.create({...});

// Mañana: Cola (Bull/BullMQ)
await emailQueue.add({ to, subject, body });
```

### 6.3 Cuando agregar microservicios

```typescript
// Hoy: Monolito
- auth module
- mailer module
- courses module

// Mañana: Microservicios
- auth-service (puerto 3001)
- mailer-service (puerto 3002)
- courses-service (puerto 3003)
```

---

## 7. Comparativa: Por Qué NO Otras Alternativas

### 7.1 NestJS

```typescript
// NestJS = Over-engineered para este caso
@Controller('auth')
@Injectable()
export class AuthController {
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}

// EXPRESS = Simple y directo
router.post('/register', register);
```

**Veredicto**: NestJS es overkill. Express es suficiente.

### 7.2 GraphQL vs REST

```typescript
// GraphQL
{
  user(id: 123) {
    name
    email
    courses { title }
  }
}

// REST
GET /api/users/123
GET /api/users/123/courses
```

**Veredicto**: REST es estándar, más simple de mantener. GraphQL para consultas complejas después.

### 7.3 Serverless (AWS Lambda, Vercel)

**Ventajas**:
- Sin gestión de servidores
- Auto-scaling
- Pay per use

**Desventajas**:
- Cold starts (latencia inicial)
- Vendor lock-in
- Debugging más difícil
- Costo impredecible

**Veredicto**: Para MVP/pequeño, Express es más sencillo. Serverless después si lo necesitas.

---

## 8. Hoja de Ruta Técnica

### Fase 1: MVP (Actual)
- ✅ Express + TypeScript
- ✅ PostgreSQL + Drizzle
- ✅ JWT + bcrypt
- ✅ Multi-tenancia simple

### Fase 2: Crecimiento (Próximos 6 meses)
- 🔜 Redis caché
- 🔜 Bull queues
- 🔜 Logging centralizado (Winston/Pino)
- 🔜 Trazabilidad distribuida (OpenTelemetry)

### Fase 3: Escala (1-2 años)
- 🔜 Microservicios
- 🔜 GraphQL optativo
- 🔜 Event streaming (Kafka)
- 🔜 DB sharding

---

## 📚 Referencias y Recursos

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [JWT vs Sessions](https://tools.ietf.org/html/rfc7519)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [12 Factor App](https://12factor.net/)

---

**Versión**: 1.0.0
**Última actualización**: Enero 2024
**Autor**: CodetLab Team
