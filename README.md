# 🧠 LIBERATE — Plataforma de bienestar mental laboral

Plataforma digital orientada al fortalecimiento del bienestar mental de los trabajadores en las organizaciones. Permite evaluar el estado emocional de los colaboradores, detectar riesgos psicosociales de forma temprana y facilitar el acceso a apoyo psicológico profesional.

> Proyecto universitario — Gestión de Proyectos Informáticos · Universidad de Medellín · 2026-1

---

## 👥 Equipo

| Integrante | Rol |
|---|---|
| Sebastián Villa Zuleta | Base de Datos |
| Daniel Henao Metaute | Backend |
| Miguel Andrés Herazo Domínguez | Frontend |

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite + Tailwind CSS 4 |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL + Prisma ORM |
| Deploy (planeado) | Vercel (front) · Railway (back + DB) |

---

## 📁 Estructura del proyecto

```
liberate-project/
├── liberate-front/          ← Frontend React
│   └── src/
│       ├── assets/          ← Imágenes, íconos
│       ├── components/
│       │   ├── ui/          ← Botones, inputs, cards reutilizables
│       │   └── layout/      ← Navbar, sidebar, footer
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── ForgotPassword.jsx
│       │   ├── dashboard/
│       │   ├── stress/
│       │   └── appointments/
│       ├── services/
│       │   └── api.js       ← Configuración de axios y llamadas al backend
│       ├── context/
│       │   └── AuthContext.jsx
│       └── routes/
│           └── AppRoutes.jsx
├── liberate-back/           ← Backend Node.js (pendiente)
└── README.md
```

---

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos
- Node.js v22.x o superior
- npm v10.x o superior

### Frontend

```bash
cd liberate-front
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

### Backend

```bash
cd liberate-back
npm install
npm run dev
```

> ⚠️ Requiere tener PostgreSQL corriendo localmente o una conexión configurada en `.env`

### Variables de entorno

Crear un archivo `.env` en `liberate-back/` con:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/liberate"
JWT_SECRET="tu_clave_secreta"
PORT=3000
```

---

## 📋 Historias de usuario — Sprint 1

| ID | Historia | Estado |
|---|---|---|
| HU-01 | Registrar organización | ✅ Frontend listo |
| HU-02 | Registrar dominio corporativo | ✅ Frontend listo |
| HU-03 | Asignar correos corporativos | ✅ Frontend listo |
| HU-04 | Iniciar sesión con correo corporativo | ✅ Frontend listo |
| HU-05 | Recuperar contraseña | ✅ Frontend listo |
| HU-06 | Llenar test de estrés | 🔄 En progreso |
| HU-07 | Agendar cita con psicólogo | 🔄 En progreso |

---

## 🔌 Endpoints esperados (backend)

El frontend ya consume o espera los siguientes endpoints. El backend debe implementarlos respetando estos contratos:

### Autenticación

| Método | Endpoint | Body | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | `{ orgName, nit, sector, adminName, adminEmail, password }` | HU-01: Registrar organización |
| POST | `/api/org/domain` | `{ domain, employeeCount }` | HU-02/03: Registrar dominio |
| POST | `/api/auth/login` | `{ email, password }` | HU-04: Iniciar sesión |
| POST | `/api/auth/forgot-password` | `{ email }` | HU-05: Recuperar contraseña |

### Respuestas esperadas

- Login exitoso → `{ token, user: { id, name, email, role } }`
- Error de credenciales → HTTP 401 `{ error: "Credenciales incorrectas" }`
- Correo no encontrado → HTTP 200 (por seguridad, no revelar si existe)

> 📌 Cada archivo `.jsx` del frontend tiene comentarios `TODO` con el detalle exacto del endpoint que necesita.

---

## 🎨 Guía de estilos

- Paleta principal: verdes suaves (`#3B6D11`, `#97C459`, `#EAF3DE`)
- Fondo general: blanco
- Tipografía: sistema por defecto (sans-serif)
- Componentes: Tailwind CSS 4 con clases utilitarias

---

## 📌 Convenciones del equipo

- Ramas: `main` (producción) · `dev` (desarrollo) · `feature/nombre-hu` (por historia)
- Commits: usar prefijos `feat:`, `fix:`, `docs:`, `style:`
- Cada componente debe tener comentarios explicando su HU, criterios de aceptación y TODOs para el backend

---

## 📄 Documentación adicional

- [Informe técnico v1.0](./docs/Informe_Técnico_Liberate.pdf)
- [Historias de usuario](./docs/Historias_de_Usuario.xlsx)
- [Plantilla de estimación Poker](./docs/Plantilla_Poker_Estructurada.xlsx)
