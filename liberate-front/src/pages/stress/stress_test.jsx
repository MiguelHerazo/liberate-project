/**
 * StressTest.jsx
 * -------------------------------------------------
 * HU-06: Llenar test de evaluación de estrés
 *
 * Criterios de aceptación:
 *   Escenario 1 - Test completado correctamente:
 *     Dado que el empleado accede al módulo de evaluación emocional,
 *     Cuando responde todas las preguntas y presiona enviar,
 *     Entonces el sistema calcula y muestra el nivel de estrés obtenido.
 *
 *   Escenario 2 - Test incompleto:
 *     Dado que el empleado deja preguntas sin responder,
 *     Cuando intenta enviar el test,
 *     Entonces el sistema muestra un mensaje indicando que debe
 *     completar todas las preguntas.
 *
 *   Escenario 3 - Resultado almacenado:
 *     Dado que el empleado finaliza el test correctamente,
 *     Cuando se genera el resultado,
 *     Entonces el sistema guarda el resultado en su historial emocional.
 *
 * Lógica de puntaje:
 *   - Cada pregunta tiene valor de 1 a 5
 *   - Puntaje total: 6 (mínimo) a 30 (máximo)
 *   - Porcentaje: ((score - 6) / 24) * 100
 *   - 0-30%  → Nivel bajo
 *   - 31-60% → Nivel moderado
 *   - 61-100% → Nivel alto
 *
 * TODO para el backend (compañero):
 *   - Endpoint: POST /api/stress-test/submit
 *   - Requiere token JWT en el header: Authorization: Bearer <token>
 *   - Body: {
 *       answers: { q1: number, q2: number, ... q6: number },
 *       score: number,
 *       percentage: number,
 *       level: "bajo" | "moderado" | "alto"
 *     }
 *   - Respuesta exitosa (201): { id, score, level, createdAt }
 *   - El back debe guardar el resultado en el historial del empleado
 *     vinculado al userId del token.
 * -------------------------------------------------
 */

import { useState } from "react";
import { Link } from "react-router-dom";

// ─── Preguntas del test agrupadas por sección ───────────────────────────────
// Opciones: cada pregunta tiene sus propias opciones con valor numérico.
// Valor 1 = menor estrés, valor 5 = mayor estrés.
// En preguntas invertidas (ej: "¿podés desconectarte?") el orden es inverso.
const SECTIONS = [
  {
    id: "seccion-1",
    title: "Carga y ritmo de trabajo",
    questions: [
      {
        id: "q1",
        text: "¿Con qué frecuencia sientes que tienes demasiado trabajo para el tiempo disponible?",
        options: [
          { label: "Nunca", value: 1 },
          { label: "Rara vez", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Frecuentemente", value: 4 },
          { label: "Siempre", value: 5 },
        ],
      },
      {
        id: "q2",
        text: "¿Puedes desconectarte del trabajo fuera del horario laboral?",
        // Pregunta invertida: "Siempre" = menos estrés = valor 1
        options: [
          { label: "Siempre", value: 1 },
          { label: "Frecuentemente", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Rara vez", value: 4 },
          { label: "Nunca", value: 5 },
        ],
      },
    ],
  },
  {
    id: "seccion-2",
    title: "Estado emocional",
    questions: [
      {
        id: "q3",
        text: "¿Con qué frecuencia te sientes agotado/a emocionalmente al terminar tu jornada?",
        options: [
          { label: "Nunca", value: 1 },
          { label: "Rara vez", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Frecuentemente", value: 4 },
          { label: "Siempre", value: 5 },
        ],
      },
      {
        id: "q4",
        text: "¿Sientes que tu trabajo afecta negativamente tu estado de ánimo general?",
        options: [
          { label: "Nunca", value: 1 },
          { label: "Rara vez", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Frecuentemente", value: 4 },
          { label: "Siempre", value: 5 },
        ],
      },
    ],
  },
  {
    id: "seccion-3",
    title: "Relaciones y entorno",
    questions: [
      {
        id: "q5",
        text: "¿Sientes que tenés apoyo de tu equipo o superiores cuando lo necesitás?",
        // Pregunta invertida: "Siempre" = menos estrés = valor 1
        options: [
          { label: "Siempre", value: 1 },
          { label: "Frecuentemente", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Rara vez", value: 4 },
          { label: "Nunca", value: 5 },
        ],
      },
      {
        id: "q6",
        text: "¿Con qué frecuencia experimentas conflictos o tensión con compañeros o jefes?",
        options: [
          { label: "Nunca", value: 1 },
          { label: "Rara vez", value: 2 },
          { label: "A veces", value: 3 },
          { label: "Frecuentemente", value: 4 },
          { label: "Siempre", value: 5 },
        ],
      },
    ],
  },
];

// Total de preguntas — se usa para calcular el progreso
const TOTAL_QUESTIONS = SECTIONS.reduce((acc, s) => acc + s.questions.length, 0);

// ─── Lógica de nivel según puntaje ──────────────────────────────────────────
const getLevel = (score) => {
  const pct = Math.round(((score - TOTAL_QUESTIONS) / (TOTAL_QUESTIONS * 4)) * 100);
  if (pct <= 30) return {
    label: "Nivel bajo de estrés",
    key: "bajo",
    color: "#3B6D11",
    bgColor: "#EAF3DE",
    textColor: "#27500A",
    desc: "Tu estado emocional es estable. Sigue manteniendo hábitos saludables y espacios de descanso.",
  };
  if (pct <= 60) return {
    label: "Nivel moderado de estrés",
    key: "moderado",
    color: "#854F0B",
    bgColor: "#FAEEDA",
    textColor: "#633806",
    desc: "Estás experimentando niveles de estrés moderados. Puede ser útil hablar con alguien de confianza o agendar una cita con un psicólogo.",
  };
  return {
    label: "Nivel alto de estrés",
    key: "alto",
    color: "#A32D2D",
    bgColor: "#FCEBEB",
    textColor: "#791F1F",
    desc: "Tu nivel de estrés es elevado. Te recomendamos agendar una cita con un psicólogo lo antes posible.",
  };
};

export default function StressTest() {
  // Respuestas: { q1: 3, q2: 1, ... }
  const [answers, setAnswers] = useState({});

  // Preguntas con error (sin responder al intentar enviar)
  const [errors, setErrors] = useState({});

  // Resultado calculado — null mientras no se envía
  const [result, setResult] = useState(null);

  // Estado de carga al enviar
  const [loading, setLoading] = useState(false);

  // Cantidad de preguntas respondidas para la barra de progreso
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  // Selecciona una opción para una pregunta
  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  /**
   * handleSubmit
   * Valida que todas las preguntas estén respondidas.
   * Calcula el puntaje, determina el nivel y llama al backend.
   * Escenario 1 y 3 del criterio de aceptación.
   */
  const handleSubmit = async () => {
    // Validación: detectar preguntas sin responder — Escenario 2
    const allQuestionIds = SECTIONS.flatMap((s) => s.questions.map((q) => q.id));
    const newErrors = {};
    let hasErrors = false;

    allQuestionIds.forEach((id) => {
      if (answers[id] === undefined) {
        newErrors[id] = true;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      // Scroll al primer error
      const firstError = document.querySelector(".question-error");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Calcular puntaje total
    const score = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const pct = Math.round(((score - TOTAL_QUESTIONS) / (TOTAL_QUESTIONS * 4)) * 100);
    const level = getLevel(score);

    setLoading(true);
    try {
      // TODO: reemplazar con la llamada real al backend
      // const response = await axios.post(
      //   "/api/stress-test/submit",
      //   { answers, score, percentage: pct, level: level.key },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // El back guarda el resultado en el historial del empleado

      // Simulación temporal:
      await new Promise((r) => setTimeout(r, 800));
      setResult({ score, pct, level });
    } catch (err) {
      console.error("Error al guardar el resultado:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reinicia el test
  const handleReset = () => {
    setAnswers({});
    setErrors({});
    setResult(null);
  };

  // ─── Vista de resultado ────────────────────────────────────────────────────
  if (result) {
    const { score, pct, level } = result;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full text-center">

          {/* Ícono de nivel */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: level.bgColor }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={level.color} strokeWidth="1.5" />
              {pct <= 30 ? (
                <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" stroke={level.color} strokeWidth="1.5" strokeLinecap="round" />
              ) : pct <= 60 ? (
                <path d="M9 15h6" stroke={level.color} strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M9 15s1-1.5 3-1.5 3 1.5 3 1.5" stroke={level.color} strokeWidth="1.5" strokeLinecap="round" />
              )}
              <circle cx="9" cy="10" r="1" fill={level.color} />
              <circle cx="15" cy="10" r="1" fill={level.color} />
            </svg>
          </div>

          {/* Nivel */}
          <h2 className="text-xl font-medium mb-1" style={{ color: level.color }}>
            {level.label}
          </h2>

          {/* Barra de progreso del resultado */}
          <div className="bg-gray-100 rounded-full h-2.5 my-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: level.color }}
            />
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Puntaje: {score} / {TOTAL_QUESTIONS * 5} ({pct}%)
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">{level.desc}</p>

          {/* Acción sugerida según nivel */}
          {(level.key === "moderado" || level.key === "alto") && (
            <Link
              to="/appointments"
              className="block w-full py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors mb-3"
            >
              Agendar cita con psicólogo
            </Link>
          )}

          <button
            onClick={handleReset}
            className="w-full py-2.5 border border-[#3B6D11] text-[#3B6D11] text-sm rounded-lg hover:bg-[#EAF3DE] transition-colors"
          >
            Hacer el test de nuevo
          </button>
        </div>
      </div>
    );
  }

  // ─── Vista del test ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      {/* Header con progreso */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <circle cx="10" cy="10" r="7" stroke="#3B6D11" strokeWidth="1.5" />
              <path d="M7 10.5c1-1.5 5-1.5 6 0" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="7.5" r="1" fill="#3B6D11" />
            </svg>
            <span className="text-[#3B6D11] text-sm font-medium tracking-widest">LIBERATE</span>
          </div>
          <span className="text-xs text-gray-400">
            {answeredCount} de {TOTAL_QUESTIONS} respondidas
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3B6D11] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Secciones de preguntas */}
      {SECTIONS.map((section, sIdx) => (
        <div
          key={section.id}
          className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto mb-4"
        >
          {/* Título de sección */}
          <div className="flex items-center gap-2 mb-5">
            <span className="bg-[#EAF3DE] text-[#27500A] text-xs font-medium px-2 py-1 rounded">
              Sección {sIdx + 1}
            </span>
            <span className="text-sm font-medium text-[#3B6D11]">{section.title}</span>
          </div>

          {/* Preguntas */}
          {section.questions.map((question, qIdx) => (
            <div
              key={question.id}
              className={`${qIdx < section.questions.length - 1 ? "mb-5 pb-5 border-b border-gray-100" : ""} ${errors[question.id] ? "question-error" : ""}`}
            >
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {question.text}
              </p>

              {/* Opciones de respuesta */}
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleSelect(question.id, option.value)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      answers[question.id] === option.value
                        ? "bg-[#EAF3DE] border-[#3B6D11] text-[#27500A] font-medium"
                        : "border-gray-200 text-gray-500 hover:border-[#3B6D11] hover:text-[#3B6D11]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Error si no respondió — Escenario 2 */}
              {errors[question.id] && (
                <p className="text-xs text-red-500 mt-2">
                  Por favor responde esta pregunta.
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Botón de envío */}
      <div className="max-w-2xl mx-auto flex justify-end pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors disabled:opacity-60"
        >
          {loading ? "Calculando..." : "Ver mi resultado"}
        </button>
      </div>
    </div>
  );
}
