/**
 * Dashboard.jsx
 * -------------------------------------------------
 * Página principal después del login.
 * Muestra una vista distinta según el rol del usuario:
 *   - "empleado": acceso a test de estrés, agendar cita e historial
 *   - "empresa":  métricas del equipo, reportes y alertas de riesgo
 *
 * El rol se determina a partir del token JWT que devuelve el backend
 * al hacer login. Por ahora se simula con un estado local.
 *
 * TODO para el backend (compañero):
 *   - El endpoint POST /api/auth/login debe devolver:
 *     { token, user: { id, name, email, role: "empleado" | "empresa" } }
 *   - El Dashboard lee el rol desde el contexto de autenticación
 *     (AuthContext) que se va a implementar cuando conectemos el back
 *
 * TODO para conectar navegación:
 *   - Las cards usan <Link to="..."> para navegar a cada sección
 *   - "Cerrar sesión" debe limpiar el token y redirigir al login
 * -------------------------------------------------
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Cards por rol ────────────────────────────────────────────────────────────

const EMPLOYEE_CARDS = [
  {
    title: "Test de estrés",
    desc: "Evalua tu estado emocional actual. Solo toma unos minutos y el resultado es confidencial.",
    action: "Iniciar test",
    to: "/stress_test",
    iconColor: "#3B6D11",
    bgColor: "#EAF3DE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#3B6D11" strokeWidth="1.5" />
        <path d="M8 13s1 1.5 3 1.5 3-1.5 3-1.5" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8.5" cy="9.5" r="1" fill="#3B6D11" />
        <circle cx="13.5" cy="9.5" r="1" fill="#3B6D11" />
      </svg>
    ),
  },
  {
    title: "Agendar cita",
    desc: "Reserva una sesión con un psicólogo certificado en el horario que más te convenga.",
    action: "Ver disponibilidad",
    to: "/book_appointment",
    iconColor: "#3B6D11",
    bgColor: "#EAF3DE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="15" rx="2" stroke="#3B6D11" strokeWidth="1.5" />
        <path d="M7 2v4M15 2v4M3 9h16" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="14" r="1.5" fill="#3B6D11" />
      </svg>
    ),
  },
  {
    title: "Mi historial",
    desc: "Revisá tus resultados anteriores y el progreso de tu bienestar emocional en el tiempo.",
    action: "Ver historial",
    to: "/history",
    iconColor: "#3B6D11",
    bgColor: "#EAF3DE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3v4M11 15v4M3 11h4M15 11h4" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="11" r="4" stroke="#3B6D11" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const COMPANY_CARDS = [
  {
    title: "Ver reportes",
    desc: "Consulta estadísticas semanales del bienestar emocional de tus colaboradores.",
    action: "Ver estadísticas",
    to: "/reports",
    iconColor: "#3B6D11",
    bgColor: "#EAF3DE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="12" width="4" height="7" rx="1" fill="#3B6D11" opacity="0.4" />
        <rect x="9" y="7" width="4" height="12" rx="1" fill="#3B6D11" opacity="0.7" />
        <rect x="15" y="3" width="4" height="16" rx="1" fill="#3B6D11" />
      </svg>
    ),
  },
  {
    title: "Gestionar empleados",
    desc: "Administra los correos corporativos y el acceso de tus colaboradores a la plataforma.",
    action: "Gestionar",
    to: "/employees",
    iconColor: "#3B6D11",
    bgColor: "#EAF3DE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9" cy="8" r="3.5" stroke="#3B6D11" strokeWidth="1.5" />
        <path d="M3 19c0-3.314 2.686-6 6-6" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="14" r="3" stroke="#3B6D11" strokeWidth="1.5" />
        <path d="M19 17l1.5 1.5" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Alertas de riesgo",
    desc: "6 empleados presentan niveles de estrés moderado o alto esta semana.",
    action: "Ver alertas",
    to: "/alerts",
    iconColor: "#854F0B",
    bgColor: "#FAEEDA",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 7v5l3 3" stroke="#854F0B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="11" r="8" stroke="#854F0B" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // TODO: reemplazar con el rol real del AuthContext cuando esté listo
  // const { user } = useContext(AuthContext);
  // const role = user?.role;
  const [role, setRole] = useState("empleado");

  // TODO: reemplazar con el nombre real del usuario logueado
  const userName = role === "empleado" ? "Miguel" : "Organización";
  const userInitials = role === "empleado" ? "MH" : "SV";

  const handleLogout = () => {
    // TODO: limpiar token del localStorage o contexto
    // localStorage.removeItem("token");
    navigate("/login");
  };

  const cards = role === "empleado" ? EMPLOYEE_CARDS : COMPANY_CARDS;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
            <circle cx="10" cy="10" r="7" stroke="#3B6D11" strokeWidth="1.5" />
            <path d="M7 10.5c1-1.5 5-1.5 6 0" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="7.5" r="1" fill="#3B6D11" />
          </svg>
          <span className="text-[#3B6D11] text-sm font-medium tracking-widest">LIBERATE</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de rol — solo para desarrollo, sacar en producción */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {["empleado", "empresa"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1 text-xs rounded-md transition-all capitalize ${
                  role === r
                    ? "bg-white text-[#3B6D11] font-medium shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Avatar del usuario */}
          <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center text-xs font-medium text-[#27500A]">
            {userInitials}
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* ── Contenido ── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900 mb-1">
            {role === "empleado" ? `Hola, ${userName} 👋` : "Panel de organización"}
          </h1>
          <p className="text-sm text-gray-400">
            {role === "empleado"
              ? "¿Cómo te sentís hoy? Estas son tus opciones disponibles."
              : "Resumen del bienestar de tu equipo esta semana."}
          </p>
        </div>

        {/* Métricas — solo vista empresa */}
        {role === "empresa" && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { val: "24", label: "Empleados activos", color: "#111" },
              { val: "6", label: "Nivel moderado-alto", color: "#854F0B" },
              { val: "12", label: "Citas agendadas", color: "#3B6D11" },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-2xl font-medium" style={{ color }}>{val}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cards de acceso directo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#3B6D11] transition-colors block relative overflow-hidden"
            >
              {/* Acento de color de fondo */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5"
                style={{ background: card.iconColor }}
              />

              {/* Ícono */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: card.bgColor }}
              >
                {card.icon}
              </div>

              <p className="text-sm font-medium text-gray-900 mb-1.5">{card.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{card.desc}</p>
              <p className="text-xs font-medium" style={{ color: card.iconColor }}>
                {card.action} →
              </p>
            </Link>
          ))}
        </div>

        {/* Estado reciente — solo vista empleado */}
        {role === "empleado" && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
              Tu estado reciente
            </p>
            {[
              { label: "Último test de estrés", badge: "Nivel moderado", badgeClass: "bg-[#FAEEDA] text-[#633806]" },
              { label: "Próxima cita", badge: "Jue 10 Abr · 10:00", badgeClass: "bg-[#EAF3DE] text-[#27500A]" },
              { label: "Test pendiente", badge: "Recomendado esta semana", badgeClass: "bg-gray-100 text-gray-500" },
            ].map(({ label, badge, badgeClass }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${badgeClass}`}>{badge}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}