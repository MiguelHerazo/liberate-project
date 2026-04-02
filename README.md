# 🧠 LIBERATE — Plataforma de bienestar mental laboral

Plataforma digital orientada al fortalecimiento del bienestar mental de los trabajadores en las organizaciones. Permite evaluar el estado emocional de los colaboradores, detectar riesgos psicosociales de forma temprana y facilitar el acceso a apoyo psicológico profesional.

> Proyecto universitario — Gestión de Proyectos Informáticos · Universidad de Medellín · 2026-1

---

## 👥 Equipo

| Integrante | Rol |
|---|---|
| Sebastián Villa Zuleta | Base de datos |
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
├── liberate-front/               ← Frontend React
│   └── src/
│       ├── assets/               ← Imágenes, íconos
│       ├── components/
│       │   ├── ui/               ← Botones, inputs, cards reutilizables
│       │   └── layout/           ← Navbar, sidebar, footer
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx           ← HU-04
│       │   │   ├── Register.jsx        ← HU-01, HU-02, HU-03
│       │   │   └── ForgotPassword.jsx  ← HU-05
│       │   ├── dashboard/
│       │   │   └── Dashboard.jsx       ← Hub principal por rol
│       │   ├── stress/
│       │   │   └── StressTest.jsx      ← HU-06
│       │   └── appointments/
│       │       └── BookAppointment.jsx ← HU-07
│       ├── services/
│       │   └── api.js            ← Configuración de axios y llamadas al backend
│       ├── context/
│       │   └── AuthContext.jsx   ← Estado global del usuario logueado (pendiente)
│       └── routes/
│           └── AppRoutes.jsx     ← Definición de rutas con React Router
├── liberate-back/                ← Backend Node.js (en desarrollo)
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

## 🗺️ Rutas del frontend

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | — | Redirige a `/login` |
| `/login` | `Login.jsx` | Inicio de sesión con correo corporativo |
| `/register` | `Register.jsx` | Registro de organización y dominio |
| `/forgot-password` | `ForgotPassword.jsx` | Recuperación de contraseña |
| `/dashboard` | `Dashboard.jsx` | Hub principal — vista por rol |
| `/stress-test` | `StressTest.jsx` | Test de evaluación emocional |
| `/appointments` | `BookAppointment.jsx` | Agendamiento de cita con psicólogo |

---

## 📋 Historias de usuario — Sprint 1

| ID | Historia | Frontend | Backend | DB |
|---|---|---|---|---|
| HU-01 | Registrar organización | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-02 | Registrar dominio corporativo | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-03 | Asignar correos corporativos | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-04 | Iniciar sesión con correo corporativo | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-05 | Recuperar contraseña | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-06 | Llenar test de estrés | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |
| HU-07 | Agendar cita con psicólogo | ✅ Listo | ⏳ Pendiente | ⏳ Pendiente |

---

## 🔌 Endpoints esperados (backend)

El frontend ya tiene los `TODO` en cada archivo `.jsx` con el detalle exacto. Resumen:

### Autenticación

| Método | Endpoint | Body | HU |
|---|---|---|---|
| POST | `/api/auth/register` | `{ orgName, nit, sector, adminName, adminEmail, password }` | HU-01 |
| POST | `/api/org/domain` | `{ domain, employeeCount }` | HU-02/03 |
| POST | `/api/auth/login` | `{ email, password }` | HU-04 |
| POST | `/api/auth/forgot-password` | `{ email }` | HU-05 |

### Test de estrés

| Método | Endpoint | Body | HU |
|---|---|---|---|
| POST | `/api/stress-test/submit` | `{ answers, score, percentage, level }` | HU-06 |

### Citas

| Método | Endpoint | Params | HU |
|---|---|---|---|
| GET | `/api/psychologists` | — | HU-07 |
| GET | `/api/appointments/slots` | `?date=YYYY-MM-DD&psychologistId=ID` | HU-07 |
| POST | `/api/appointments` | `{ psychologistId, date, time }` | HU-07 |

### Respuestas esperadas

- Login exitoso → `{ token, user: { id, name, email, role } }`
- Error de credenciales → HTTP 401 `{ error: "Credenciales incorrectas" }`
- Slot ya reservado → HTTP 409 `{ error: "El horario ya no está disponible" }`
- Forgot password → HTTP 200 siempre (no revelar si el correo existe)

---

## 🎨 Guía de estilos

- Paleta principal: verdes suaves — `#3B6D11` (primario), `#97C459` (acento), `#EAF3DE` (fondo suave)
- Fondo de páginas: `#f9fafb` (gris muy claro)
- Fondo de cards: blanco con borde `#e5e7eb`
- Tipografía: sistema por defecto (sans-serif)
- Bordes redondeados: `rounded-xl` para cards, `rounded-lg` para inputs y botones
- Framework de estilos: Tailwind CSS 4

---

## 📌 Convenciones del equipo

- **Documentación:** cada componente tiene comentarios con la HU, criterios de aceptación y TODOs para el backend
- **TODOs:** buscar `// TODO` en cualquier archivo `.jsx` para ver qué falta conectar con el back

---
