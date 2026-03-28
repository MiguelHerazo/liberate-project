import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      // TODO: reemplazar con la URL real del backend cuando esté lista
      // const response = await axios.post("/api/auth/login", { email, password });
      // guardar token, redirigir al dashboard
      console.log("Login con:", email, password);
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
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

        {/* Texto */}
        <h1 className="text-[#EAF3DE] text-3xl font-medium leading-relaxed mb-4">
          Bienestar mental para tu equipo de trabajo
        </h1>
        <p className="text-[#97C459] text-sm leading-relaxed">
          Monitorea el estado emocional de tus colaboradores, detecta riesgos a tiempo
          y conectalos con apoyo profesional.
        </p>

        {/* Indicadores */}
        <div className="flex gap-2 mt-12">
          <div className="h-2 w-6 rounded-full bg-[#97C459]" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 items-center justify-center px-8 py-16 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-medium text-gray-900 mb-1">Bienvenido de nuevo</h2>
          <p className="text-sm text-gray-500 mb-8">Ingresa con tu correo corporativo</p>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Correo */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Correo corporativo</label>
            <input
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-2">
            <label className="block text-xs text-gray-500 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-[#3B6D11] transition-colors"
            />
          </div>

          {/* Olvidaste contraseña */}
          <div className="text-right mb-6">
            <a href="/forgot-password" className="text-xs text-[#3B6D11] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">¿No tienes una cuenta?</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Registro */}
          <p className="text-center text-sm text-gray-500">
            ¿Eres una empresa?{" "}
            <a href="/register" className="text-[#3B6D11] font-medium hover:underline">
              Registra tu organización
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}