/**
 * ForgotPassword.jsx
 * -------------------------------------------------
 * HU-05: Recuperar contraseña
 *
 * Criterios de aceptación (del backlog):
 *   Escenario 1 - Solicitud de recuperación:
 *     Dado que el empleado olvidó su contraseña,
 *     Cuando selecciona recuperar contraseña,
 *     Entonces el sistema solicita el correo corporativo.
 *
 *   Escenario 2 - Enlace enviado:
 *     Dado que el empleado ingresa su correo,
 *     Cuando confirma la solicitud,
 *     Entonces el sistema envía un enlace de recuperación.
 *
 *   Escenario 3 - Correo inválido:
 *     Dado que el empleado ingresa un correo incorrecto,
 *     Cuando envía la solicitud,
 *     Entonces el sistema muestra un mensaje indicando correo inválido.
 *
 * Flujo de pantalla:
 *   Estado 1 (sent = false): formulario para ingresar el correo
 *   Estado 2 (sent = true):  confirmación de envío del enlace
 *
 * TODO para el backend (Daniel):
 *   - Endpoint: POST /api/auth/forgot-password
 *   - Body: { email: string }
 *   - Respuesta exitosa (200): { message: "Enlace enviado" }
 *   - Respuesta error (404): { error: "Correo no encontrado" }
 *   - Nota: por seguridad, si el correo no existe el back igual
 *     puede responder 200 para no revelar qué correos están registrados.
 *     El front muestra el mismo mensaje de éxito en ambos casos.
 * -------------------------------------------------
 */

import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  // Estado principal: controla si ya se envió el enlace
  const [sent, setSent] = useState(false);

  // Correo ingresado por el usuario
  const [email, setEmail] = useState("");

  // Mensaje de error visible en pantalla
  const [error, setError] = useState("");

  // Controla el estado de carga del botón
  const [loading, setLoading] = useState(false);

  /**
   * handleSubmit
   * Valida el correo y llama al endpoint del backend.
   * Si el backend responde OK, cambia al estado de confirmación.
   */
  const handleSubmit = async () => {
    setError("");

    // Validación básica: campo vacío
    if (!email) {
      setError("Por favor ingresa tu correo corporativo.");
      return;
    }

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El formato del correo no es válido.");
      return;
    }

    setLoading(true);
    try {
      // TODO: reemplazar con la llamada real al backend
      // const response = await axios.post("/api/auth/forgot-password", { email });
      // Si el back responde 200, mostramos la pantalla de confirmación

      // Simulación temporal hasta que el back esté listo:
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch (err) {
      // El back puede devolver 404 si el correo no existe
      // o 400 si el formato es inválido
      setError("No encontramos una cuenta con ese correo.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleResend
   * Permite al usuario reenviar el enlace desde la pantalla de confirmación.
   * Vuelve al formulario para que ingrese el correo de nuevo.
   *
   * TODO para el backend: mismo endpoint POST /api/auth/forgot-password
   */
  const handleResend = () => {
    setSent(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Panel izquierdo — visual de marca ── */}
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
          Recupera el acceso a tu cuenta
        </h1>
        <p className="text-[#97C459] text-sm leading-relaxed">
          Te enviamos un enlace a tu correo corporativo para restablecer tu contraseña de forma segura.
        </p>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="flex flex-1 items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-sm">

          {/* Ícono de correo */}
          <div className="w-13 h-13 rounded-full bg-[#EAF3DE] flex items-center justify-center mb-6 w-14 h-14">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="#3B6D11" strokeWidth="1.5" />
              <path d="M3 9l9 5 9-5" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* ── ESTADO 1: Formulario de solicitud ── */}
          {!sent && (
            <>
              <h2 className="text-xl font-medium text-gray-900 mb-1">Recuperar contraseña</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Ingresa tu correo corporativo y te enviamos un enlace para restablecer tu contraseña.
              </p>

              {/* Mensaje de error — Escenario 3 */}
              {error && (
                <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              {/* Campo de correo */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">Correo corporativo</label>
                <input
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Permite enviar con Enter para mejor UX
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
                />
              </div>

              {/* Botón de envío — Escenario 2 */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>

              {/* Link de regreso al login */}
              <p className="text-center text-sm text-gray-500 mt-4">
                ¿Recordaste tu contraseña?{" "}
                <Link to="/login" className="text-[#3B6D11] font-medium hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}

          {/* ── ESTADO 2: Confirmación de envío — Escenario 2 ── */}
          {sent && (
            <>
              <h2 className="text-xl font-medium text-gray-900 mb-1">Revisa tu correo</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Si el correo existe en el sistema, recibirás un enlace en los proximos momentos.
              </p>

              {/* Confirmación visual */}
              <div className="bg-[#EAF3DE] rounded-lg px-4 py-3 mb-6">
                <p className="text-sm font-medium text-[#27500A] mb-1">Enlace enviado</p>
                <p className="text-xs text-[#3B6D11] leading-relaxed">
                  Revisa tu bandeja de entrada y sigue las instrucciones del correo.
                </p>
              </div>

              {/* Opción de reenvío */}
              <button
                onClick={handleResend}
                className="w-full py-2.5 border border-[#3B6D11] text-[#3B6D11] text-sm font-medium rounded-lg hover:bg-[#EAF3DE] transition-colors"
              >
                Reenviar enlace
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Volver a{" "}
                <Link to="/login" className="text-[#3B6D11] font-medium hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}