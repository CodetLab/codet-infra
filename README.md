# 🚀 CodetLab Backend - Documentación Completa

Backend modular y escalable para gestionar aplicaciones SaaS multi-tenant con soporte para usuarios, autenticación, correos y cursos.

---

## 📚 Documentación del Proyecto

### 📖 **Para Nuevos Integrantes** ⭐ COMIENZA AQUÍ
👉 **[ONBOARDING.md](./backend/ONBOARDING.md)** - Guía paso a paso (2-3 horas)
- Setup inicial
- Ejecución de ejemplos
- Primer cambio de código
- Troubleshooting

### 📋 **Documentación General**
👉 **[backend/README.md](./backend/README.md)** - Resumen ejecutivo
- Stack tecnológico
- Estructura de directorios
- Endpoints principales
- Quick start

### 🏗️ **Arquitectura Técnica**
👉 **[backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md)** - Decisiones de diseño
- Por qué Express.js
- Por qué PostgreSQL
- Por qué Drizzle ORM
- Patrones implementados
- Escalabilidad futura

### 📖 **Guía Completa de Desarrollo**
👉 **[BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)** - Documentación exhaustiva
- Descripción detallada de cada módulo
- Schema de base de datos
- Ejemplos HTTP completos
- Cómo agregar nuevos módulos
- FAQ

---

## 🎯 Acceso Rápido por Rol

### 👨‍💻 **Developer Junior**
1. Lee [ONBOARDING.md](./backend/ONBOARDING.md) (Paso 1-4)
2. Ejecuta [ejemplos prácticos](./backend/ONBOARDING.md#paso-3-ejecutar-ejemplos-prácticos-30-min)
3. Haz tu [primer cambio](./backend/ONBOARDING.md#paso-5-tu-primer-cambio-de-código-30-min)
4. Consulta [troubleshooting](./backend/ONBOARDING.md#paso-7-debugging-y-troubleshooting-20-min)

### 👨‍💼 **Developer Senior / Tech Lead**
1. Lee [ARCHITECTURE.md](./backend/ARCHITECTURE.md) (decisiones técnicas)
2. Revisa [Hoja de ruta técnica](./backend/ARCHITECTURE.md#8-hoja-de-ruta-técnica)
3. Consulta [escalabilidad futura](./backend/ARCHITECTURE.md#6-escalabilidad-futura)

### 📊 **Product Manager**
1. Lee [Resumen ejecutivo](./backend/README.md#-resumen-ejecutivo)
2. Entiende [características principales](./backend/README.md#-características-principales)
3. Revisa [hoja de ruta](./backend/ARCHITECTURE.md#8-hoja-de-ruta-técnica)

### 🏢 **Líder de Organización**
1. Lee este archivo (README.md) - 5 min
2. Comparte [backend/ONBOARDING.md](./backend/ONBOARDING.md) con nuevos desarrolladores
3. Implementa [patrones de ARCHITECTURE.md](./backend/ARCHITECTURE.md) en otros equipos

---

## 🛠️ Stack Tecnológico

```
Frontend Layer
    ↓
Express.js (Framework HTTP)
TypeScript (Type Safety)
    ↓
PostgreSQL (Base de Datos)
Drizzle ORM (Query Builder Type-Safe)
    ↓
Security: JWT + bcrypt + API Keys
Validation: Zod
Email: Resend + Nodemailer
```

---

## 📊 Módulos Existentes

| Módulo | Responsabilidad | Endpoints |
|--------|-----------------|-----------|
| **Auth** | Autenticación y autorización | POST /auth/register, POST /auth/login |
| **Mailer** | Envío de correos | POST /send |
| **Courses** | Gestión de cursos | GET /courses, POST /courses |
| **Contact** | Formulario de contacto | POST /contact |

---

## 🔄 Flujo de Solicitud

```
HTTP Request
    ↓
1️⃣ Router (mapea URL a handler)
    ↓
2️⃣ Middleware (valida, enriquece)
    ↓
3️⃣ Controller (parsea parámetros)
    ↓
4️⃣ Service (lógica de negocio)
    ↓
5️⃣ Database (Drizzle ORM)
    ↓
HTTP Response
```

**Ejemplo**: POST /api/auth/register
- Router detecta ruta
- Controller extrae email, password, appSlug
- authService.registerUser() valida y hashea
- DB inserta nuevo usuario
- Response con usuario creado

---

## ✨ Características Principales

✅ **Multi-Tenancia**: Una DB para múltiples aplicaciones  
✅ **Seguridad**: JWT + bcrypt + API Keys + CORS  
✅ **Type-Safe**: TypeScript + Drizzle + Zod  
✅ **Escalable**: Fácil agregar módulos nuevos  
✅ **Observable**: Logs de emails, audit trail  
✅ **Testeable**: Service layer separada  

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar
git clone <repo> && cd backend

# 2. Instalar
npm install

# 3. Configurar
cp .env.example .env

# 4. Base de datos
createdb backend_dev
npm run db:migrate

# 5. Iniciar
npm run dev
```

**Verificar**: http://localhost:5000/api/health

---

## 📊 Esquema de Base de Datos

```
users ──────→ user_apps ←─────── apps
   ↓                               ↓
user_settings                   api_keys
                                courses ──→ lessons
                                emails
```

**8 tablas** bien relacionadas con Foreign Keys y constraints.

---

## 🔐 Seguridad Implementada

| Aspecto | Método |
|--------|--------|
| Autenticación | JWT (JSON Web Tokens) |
| Contraseñas | bcrypt (10 salt rounds) |
| API access | API Keys (X-API-Key header) |
| Validación | Zod schemas |
| CORS | Configurado en app.ts |
| Multi-tenancia | Filtro por app_id en todas queries |

---

## 📚 Documentación por Secciones

### Para Entender el Proyecto
```
BACKEND_DOCUMENTATION.md
├── Stack tecnológico completo
├── Descripción de 4 módulos
├── Schema de 8 tablas
├── 30+ ejemplos HTTP
└── Cómo agregar módulos nuevos
```

### Para Contribuir Código
```
backend/ONBOARDING.md
├── Setup en 15 min
├── 5 ejemplos prácticos
├── Tu primer endpoint
├── Debugging y troubleshooting
└── Checklist de comprensión
```

### Para Decisiones Técnicas
```
backend/ARCHITECTURE.md
├── Por qué cada tecnología
├── Patrones de implementación
├── Comparativa con alternativas
├── Hoja de ruta técnica
└── Referencias
```

### Para Quick Reference
```
backend/README.md
├── Resumen ejecutivo
├── Stack de dependencias
├── Endpoints principales
└── Comandos útiles
```

---

## 🎓 Flujo de Onboarding Recomendado

### **Día 1 (2-3 horas)**
- [ ] Leer este README
- [ ] Ejecutar [Paso 1 del Onboarding](./backend/ONBOARDING.md#-paso-1-setup-inicial-15-min)
- [ ] Ejecutar [Paso 2 y 3](./backend/ONBOARDING.md#-paso-2-entender-la-arquitectura-30-min)

### **Día 2 (2 horas)**
- [ ] Ejecutar [Paso 3 - Ejemplos](./backend/ONBOARDING.md#-paso-3-ejecutar-ejemplos-prácticos-30-min)
- [ ] Explorar [Paso 4 - Código](./backend/ONBOARDING.md#-paso-4-explorar-código-fuente-45-min)

### **Día 3 (1-2 horas)**
- [ ] Completar [Paso 5 - Primer cambio](./backend/ONBOARDING.md#-paso-5-tu-primer-cambio-de-código-30-min)
- [ ] Resolver [Paso 8 - Checklist](./backend/ONBOARDING.md#-paso-8-checklist-de-comprensión)

**Resultado**: Desarrollador autosuficiente listo para contribuir 🎉

---

## 🤝 Cómo Usar Esta Documentación

### ❓ "¿Cómo inicio?"
→ Lee [ONBOARDING.md](./backend/ONBOARDING.md)

### ❓ "¿Por qué usamos Express?"
→ Lee [ARCHITECTURE.md](./backend/ARCHITECTURE.md)

### ❓ "¿Cómo funciona el módulo X?"
→ Lee [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

### ❓ "¿Cuál es el endpoint para...?"
→ Lee [backend/README.md](./backend/README.md) o busca en [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

### ❓ "¿Cómo agrego un nuevo módulo?"
→ Sección "Agregar nuevo módulo" en [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

### ❓ "¿Cómo debuggeo?"
→ Lee [Paso 7 de ONBOARDING.md](./backend/ONBOARDING.md#-paso-7-debugging-y-troubleshooting-20-min)

---

## 📞 Contacto y Soporte

- **Issues técnicos**: GitHub Issues
- **Preguntas generales**: GitHub Discussions  
- **Onboarding**: Tag `onboarding` en issues
- **Email**: dev@codetlab.com

---

## 📋 Estructura de Archivos de Documentación

```
.
├── README.md (este archivo)          ← Punto de entrada
├── BACKEND_DOCUMENTATION.md          ← Guía exhaustiva (20KB)
└── backend/
    ├── README.md                     ← Quick reference (9KB)
    ├── ARCHITECTURE.md               ← Decisiones técnicas (15KB)
    ├── ONBOARDING.md                 ← Guía paso a paso (13KB)
    ├── package.json                  ← Dependencias
    ├── tsconfig.json                 ← Config TypeScript
    └── src/
        ├── app.ts                    ← Express instance
        ├── server.ts                 ← Entry point
        ├── router/index.ts           ← Rutas principales
        ├── core/                     ← Compartido
        │   ├── config/env.ts
        │   ├── db/index.ts
        │   ├── db/schema.ts
        │   └── middlewares/
        └── modules/                  ← Módulos
            ├── auth/
            ├── mailer/
            ├── courses/
            └── contact/
```

---

## 🎯 Próximos Pasos para tu Organización

### Implementación en otros equipos

1. **Compartir documentación**
   ```bash
   # Copiar documentos a equipo/proyecto nuevo
   cp -r backend/README.md /nuevo-proyecto/
   cp -r BACKEND_DOCUMENTATION.md /nuevo-proyecto/
   cp -r backend/ARCHITECTURE.md /nuevo-proyecto/
   cp -r backend/ONBOARDING.md /nuevo-proyecto/
   ```

2. **Adaptar a tu contexto**
   - Cambiar nombres de empresas
   - Actualizar emails de contacto
   - Agregar logos/branding

3. **Distribuir a nuevos desarrolladores**
   - Dar acceso a repositorio
   - Enviar link a ONBOARDING.md
   - Asignar mentor

---

## 📈 Métricas de Éxito del Onboarding

✅ Después de 3 días, nuevo dev debería:
- [ ] Setup completo y funcionando
- [ ] Entender flujo MVC
- [ ] Ejecutar ejemplos HTTP exitosamente  
- [ ] Hacer un pequeño cambio de código
- [ ] Pasar quiz de conceptos

---

## 📝 Versiones de Documentación

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | Junio 2026 | Release inicial |
| 1.1.0 | [Próximo] | TBD |

---

## 📄 Licencia

ISC

---

**¡Listo para comenzar tu viaje con el backend de CodetLab? 🚀**

**Próximo paso**: Lee [ONBOARDING.md](./backend/ONBOARDING.md)

---

**Última actualización**: Junio 2026  
**Mantenedor**: CodetLab Team  
**URL del repositorio**: https://github.com/codetlab/backend