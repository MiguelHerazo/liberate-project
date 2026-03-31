import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // HU-01 — datos organización
    orgName: "",
    nit: "",
    sector: "",
    adminName: "",
    adminEmail: "",
    password: "",
    // HU-02 y HU-03 — dominio y correos
    domain: "",
    employeeCount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateStep1 = () => {
    if (!form.orgName || !form.nit || !form.adminName || !form.adminEmail || !form.password) {
      setError("Por favor completá todos los campos.");
      return false;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.domain || !form.employeeCount) {
      setError("Por favor completá todos los campos.");
      return;
    }
    setLoading(true);
    try {
      // TODO: reemplazar con la URL real del backend cuando esté lista
      // Paso 1 — POST /api/auth/register con: orgName, nit, sector, adminName, adminEmail, password
      // Paso 2 — POST /api/org/domain con: domain, employeeCount
      // El back debe devolver un token y redirigir al dashboard
      console.log("Registrando organización:", form);
    } catch (err) {
      setError("Ocurrió un error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo */}
      <div className="hidden md:flex w-[42%] bg-[#3B6D11] flex-col justify-center px-12 py-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <circle cx="10" cy="10" r="7" stroke="#EAF3DE" strokeWidth="1.5" />
              <path d="M7 10.5c1-1.5 5-1.5 6 0" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="7.5" r="1" fill="#EAF3DE" />
            </svg>
          </div>
          <span className="text-[#EAF3DE] text-lg font-medium tracking-widest">LIBERATE</span>
        </div>

        <h1 className="text-[#EAF3DE] text-2xl font-medium leading-relaxed mb-4">
          Registra tu organización en minutos
        </h1>
        <p className="text-[#97C459] text-sm leading-relaxed">
          Configura el dominio corporativo y empieza a monitorear el bienestar de tu equipo.
        </p>

        {/* Indicadores de paso */}
        <div className="flex flex-col gap-4 mt-12">
          {[
            { n: 1, label: "Datos de la organización" },
            { n: 2, label: "Dominio y correos corporativos" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-colors ${
                  step >= n
                    ? "bg-[#97C459] text-[#173404]"
                    : "bg-white/15 text-[#EAF3DE]"
                }`}
              >
                {n}
              </div>
              <span
                className={`text-sm transition-colors ${
                  step === n ? "text-[#EAF3DE] font-medium" : "text-[#EAF3DE]/60"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-1 items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-md">
          {/* Barra de progreso */}
          <div className="flex gap-1.5 mb-8">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step >= n ? "bg-[#3B6D11]" : "bg-gray-100"
                }`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* ── PASO 1 — Datos de la organización ── */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-medium text-gray-900 mb-1">Datos de la organización</h2>
              <p className="text-sm text-gray-500 mb-6">Información básica de tu empresa</p>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Nombre de la organización</label>
                <input
                  type="text"
                  placeholder="Ej: Empresa S.A.S"
                  value={form.orgName}
                  onChange={handle("orgName")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">NIT / Identificación</label>
                  <input
                    type="text"
                    placeholder="900.123.456-7"
                    value={form.nit}
                    onChange={handle("nit")}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sector</label>
                  <select
                    value={form.sector}
                    onChange={handle("sector")}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                  >
                    <option value="">Seleccione</option>
                    <option>Tecnología</option>
                    <option>Salud</option>
                    <option>Educación</option>
                    <option>Finanzas</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Nombre del administrador</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={form.adminName}
                  onChange={handle("adminName")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Correo del administrador</label>
                <input
                  type="email"
                  placeholder="admin@empresa.com"
                  value={form.adminEmail}
                  onChange={handle("adminEmail")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handle("password")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors"
              >
                Continuar →
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-[#3B6D11] font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </>
          )}

          {/* ── PASO 2 — Dominio corporativo ── */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-medium text-gray-900 mb-1">Dominio corporativo</h2>
              <p className="text-sm text-gray-500 mb-6">
                Los empleados se registrarán con este dominio
              </p>

              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Dominio de correo corporativo</label>
                <input
                  type="text"
                  placeholder="empresa.com"
                  value={form.domain}
                  onChange={handle("domain")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              {/* Preview dominio */}
              <div className="flex items-center gap-2 bg-[#EAF3DE] rounded-lg px-4 py-2.5 mb-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#3B6D11" strokeWidth="1.2" />
                  <path d="M4.5 7.5l2 2 3-3" stroke="#3B6D11" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-[#27500A] font-medium">Correos válidos:</span>
                <span className="text-xs text-[#3B6D11]">
                  colaborador@{form.domain || "empresa.com"}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">Cantidad estimada de empleados</label>
                <select
                  value={form.employeeCount}
                  onChange={handle("employeeCount")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                >
                  <option value="">Seleccioná</option>
                  <option>1 - 10</option>
                  <option>11 - 50</option>
                  <option>51 - 200</option>
                  <option>200+</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 py-2.5 border border-[#3B6D11] text-[#3B6D11] text-sm rounded-lg hover:bg-[#EAF3DE] transition-colors"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors disabled:opacity-60"
                >
                  {loading ? "Registrando..." : "Registrar organización"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}