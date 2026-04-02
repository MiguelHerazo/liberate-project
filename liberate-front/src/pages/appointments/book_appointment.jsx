/**
 * BookAppointment.jsx
 * -------------------------------------------------
 * HU-07: Reservar una cita con un psicólogo
 *
 * Criterios de aceptación:
 *   Escenario 1 - Selección de horario disponible:
 *     Dado que existen horarios habilitados por el psicólogo,
 *     Cuando el empleado selecciona fecha y hora disponible,
 *     Entonces el sistema registra la cita correctamente.
 *
 *   Escenario 2 - Horario no disponible:
 *     Dado que el horario ya fue reservado,
 *     Cuando el empleado intenta seleccionarlo,
 *     Entonces el sistema muestra que el horario no está disponible.
 *     (Los slots ocupados aparecen tachados y no son seleccionables)
 *
 *   Escenario 3 - Confirmación de cita:
 *     Dado que el empleado agenda exitosamente,
 *     Cuando finaliza la reserva,
 *     Entonces el sistema muestra confirmación y envía notificación.
 *
 * Flujo:
 *   1. El empleado selecciona una fecha en el calendario
 *   2. Selecciona un psicólogo disponible
 *   3. Selecciona un slot de hora disponible
 *   4. Confirma la cita — aparece mensaje de confirmación
 *
 * TODO para el backend (Daniel):
 *   Endpoint 1: GET /api/psychologists
 *     - Respuesta: [{ id, name, specialty, initials }]
 *     - Devuelve la lista de psicólogos registrados en el sistema
 *
 *   Endpoint 2: GET /api/appointments/slots?date=YYYY-MM-DD&psychologistId=ID
 *     - Respuesta: { available: ["09:00","10:00",...], taken: ["11:00",...] }
 *     - Devuelve los slots del día para ese psicólogo
 *     - IMPORTANTE: manejar concurrencia — si dos usuarios piden el mismo
 *       slot al mismo tiempo, solo uno debe poder reservarlo (usar
 *       transacción o lock en la base de datos)
 *
 *   Endpoint 3: POST /api/appointments
 *     - Requiere token JWT: Authorization: Bearer <token>
 *     - Body: { psychologistId, date, time }
 *     - Respuesta exitosa (201): { id, psychologistName, date, time, status }
 *     - Respuesta error (409): { error: "El horario ya no está disponible" }
 *       (puede pasar si alguien reservó mientras el usuario confirmaba)
 * -------------------------------------------------
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Horarios disponibles en el día ─────────────────────────────────────────
// TODO: estos slots deben venir del backend (GET /api/appointments/slots)
const ALL_SLOTS = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"];

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const toDateStr = (date) => date.toISOString().split("T")[0];
const todayStr = toDateStr(new Date());

export default function BookAppointment() {
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPsych, setSelectedPsych] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [psychologists, setPsychologists] = useState([]);
  const [takenSlots, setTakenSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [slotError, setSlotError] = useState("");

  /**
   * Carga la lista de psicólogos al montar el componente.
   * TODO: GET /api/psychologists
   */
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        // TODO: const res = await axios.get("/api/psychologists");
        // setPsychologists(res.data);
        setPsychologists([
          { id: 1, name: "Dra. Laura Gómez", specialty: "Estrés y ansiedad laboral", initials: "LG" },
          { id: 2, name: "Dr. Carlos Ruiz", specialty: "Salud mental organizacional", initials: "CR" },
          { id: 3, name: "Dra. Ana Martínez", specialty: "Burnout y bienestar", initials: "AM" },
        ]);
      } catch (err) {
        console.error("Error cargando psicólogos:", err);
      }
    };
    fetchPsychologists();
  }, []);

  /**
   * Carga slots ocupados cuando cambia fecha o psicólogo.
   * TODO: GET /api/appointments/slots?date=YYYY-MM-DD&psychologistId=ID
   */
  useEffect(() => {
    if (!selectedDate || !selectedPsych) return;
    const fetchSlots = async () => {
      try {
        // TODO:
        // const res = await axios.get(
        //   `/api/appointments/slots?date=${selectedDate}&psychologistId=${selectedPsych}`
        // );
        // setTakenSlots(res.data.taken);

        // Simulación temporal:
        const mockTaken = {
          "2026-04-07": ["09:00","11:00"],
          "2026-04-08": ["10:00","14:00"],
          "2026-04-09": ["09:00","15:00"],
        };
        setTakenSlots(mockTaken[selectedDate] || []);
      } catch (err) {
        console.error("Error cargando slots:", err);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedPsych]);

  /**
   * handleConfirm
   * Envía la reserva al backend.
   * Maneja concurrencia: si el slot fue tomado justo antes, muestra error.
   * TODO: POST /api/appointments
   */
  const handleConfirm = async () => {
    if (!selectedDate || !selectedPsych || !selectedSlot) return;
    setLoading(true);
    setSlotError("");
    try {
      // TODO:
      // await axios.post(
      //   "/api/appointments",
      //   { psychologistId: selectedPsych, date: selectedDate, time: selectedSlot },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      await new Promise((r) => setTimeout(r, 800));
      setConfirmed(true);
    } catch (err) {
      // Error 409: horario tomado por otro usuario (concurrencia)
      if (err.response?.status === 409) {
        setSlotError("Este horario ya no está disponible. Por favor elegí otro.");
        setTakenSlots((prev) => [...prev, selectedSlot]);
        setSelectedSlot(null);
      } else {
        setSlotError("Ocurrió un error al agendar. Intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Lógica del calendario ────────────────────────────────────────────────
  const firstDayOfMonth = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();

  const isDayDisabled = (d) => {
    const dateObj = new Date(calDate.getFullYear(), calDate.getMonth(), d);
    const dateStr = toDateStr(dateObj);
    return dateObj.getDay() === 0 || dateObj.getDay() === 6 || dateStr < todayStr;
  };

  const psych = psychologists.find((p) => p.id === selectedPsych);
  const canConfirm = selectedDate && selectedPsych && selectedSlot && !confirmed;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
          <circle cx="10" cy="10" r="7" stroke="#3B6D11" strokeWidth="1.5" />
          <path d="M7 10.5c1-1.5 5-1.5 6 0" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="7.5" r="1" fill="#3B6D11" />
        </svg>
        <span className="text-[#3B6D11] text-sm font-medium tracking-widest">LIBERATE</span>
        <span className="text-gray-400 text-sm">— Agendar cita</span>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Calendario ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-[#3B6D11] uppercase tracking-wide mb-4">
            Seleccioná una fecha
          </p>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}
              className="text-[#3B6D11] text-lg px-2 hover:bg-[#EAF3DE] rounded transition-colors"
            >‹</button>
            <span className="text-sm font-medium text-gray-800">
              {MONTHS[calDate.getMonth()]} {calDate.getFullYear()}
            </span>
            <button
              onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}
              className="text-[#3B6D11] text-lg px-2 hover:bg-[#EAF3DE] rounded transition-colors"
            >›</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const dateStr = toDateStr(new Date(calDate.getFullYear(), calDate.getMonth(), d));
              const disabled = isDayDisabled(d);
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;
              return (
                <button
                  key={d}
                  disabled={disabled}
                  onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); setSlotError(""); }}
                  className={`text-xs py-1.5 rounded-md transition-colors border ${
                    isSelected ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                    : disabled ? "text-gray-200 border-transparent cursor-default"
                    : isToday ? "text-[#3B6D11] font-medium border-transparent hover:border-[#3B6D11]"
                    : "text-gray-600 border-transparent hover:border-[#3B6D11] hover:text-[#3B6D11]"
                  }`}
                >{d}</button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-[#3B6D11]" />
              <span className="text-xs text-gray-400">Seleccionado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-gray-200" />
              <span className="text-xs text-gray-400">No disponible</span>
            </div>
          </div>
        </div>

        {/* ── Lista de psicólogos ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-[#3B6D11] uppercase tracking-wide mb-4">
            Selecciona un psicólogo
          </p>
          <div className="flex flex-col gap-2">
            {psychologists.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPsych(p.id); setSelectedSlot(null); }}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  selectedPsych === p.id
                    ? "bg-[#EAF3DE] border-[#3B6D11]"
                    : "border-gray-200 hover:border-[#3B6D11]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#EAF3DE] flex items-center justify-center text-xs font-medium text-[#27500A] flex-shrink-0">
                  {p.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.specialty}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Slots de horario ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2">
          <p className="text-xs font-medium text-[#3B6D11] uppercase tracking-wide mb-4">
            Horarios disponibles
          </p>
          {(!selectedDate || !selectedPsych) ? (
            <p className="text-sm text-gray-400">
              Selecciona una fecha y un psicólogo para ver los horarios.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ALL_SLOTS.map((slot) => {
                  const isTaken = takenSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isTaken}
                      onClick={() => { setSelectedSlot(slot); setSlotError(""); }}
                      className={`py-2 text-xs rounded-md border transition-colors ${
                        isTaken
                          ? "bg-gray-50 text-gray-300 border-gray-100 line-through cursor-default"
                          : isSelected
                          ? "bg-[#EAF3DE] border-[#3B6D11] text-[#27500A] font-medium"
                          : "border-gray-200 text-gray-500 hover:border-[#3B6D11] hover:text-[#3B6D11]"
                      }`}
                    >{slot}</button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Los horarios tachados ya fueron reservados.
              </p>
            </>
          )}
        </div>

        {/* ── Resumen y botón de confirmación ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-6 flex-wrap">
              <div className="text-sm text-gray-500">
                Fecha: <span className="text-gray-900 font-medium">{selectedDate || "—"}</span>
              </div>
              <div className="text-sm text-gray-500">
                Psicólogo: <span className="text-gray-900 font-medium">{psych?.name || "—"}</span>
              </div>
              <div className="text-sm text-gray-500">
                Hora: <span className="text-gray-900 font-medium">{selectedSlot || "—"}</span>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || loading}
              className="px-6 py-2.5 bg-[#3B6D11] text-[#EAF3DE] text-sm font-medium rounded-lg hover:bg-[#27500A] transition-colors disabled:opacity-40 disabled:cursor-default"
            >
              {loading ? "Agendando..." : "Confirmar cita"}
            </button>
          </div>
          {/* Error de concurrencia — Escenario 2 */}
          {slotError && (
            <p className="text-xs text-red-500 mt-3">{slotError}</p>
          )}
        </div>

        {/* ── Confirmación exitosa — Escenario 3 ── */}
        {confirmed && (
          <div className="bg-[#EAF3DE] border border-[#97C459] rounded-xl p-5 md:col-span-2">
            <div className="flex gap-3 items-start">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="10" cy="10" r="8" stroke="#3B6D11" strokeWidth="1.5" />
                <path d="M6.5 10.5l2.5 2.5 4.5-4.5" stroke="#3B6D11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[#27500A] mb-1">
                  ¡Cita agendada exitosamente!
                </p>
                <p className="text-xs text-[#3B6D11] leading-relaxed">
                  Tu cita con <strong>{psych?.name}</strong> fue registrada para el{" "}
                  <strong>{selectedDate}</strong> a las <strong>{selectedSlot}</strong>.
                  Vas a recibir una notificación de confirmación.
                  {/* TODO: el backend debe enviar correo/notificación al empleado */}
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block mt-3 text-xs text-[#3B6D11] font-medium underline"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}