"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Las Skills (habilidades): paquetes de instrucciones + recursos que me
 * enseñan a hacer una tarea concreta a tu manera. La persona pide una tarea
 * y ve cómo se "carga" sola la habilidad que encaja.
 */

interface Skill {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

const SKILLS: Skill[] = [
  { id: "xls", icon: "📊", name: "Hojas de cálculo", desc: "Crear y editar Excel" },
  { id: "doc", icon: "📄", name: "Documentos", desc: "Word y PDF con formato" },
  { id: "brand", icon: "🎨", name: "Estilo de tu marca", desc: "Tu tono y tus normas" },
  { id: "report", icon: "📑", name: "Tus informes", desc: "Tu plantilla exacta" },
];

const TASK = "Prepárame el resumen de ventas en una hoja de cálculo.";
const MATCH = "xls";

type Phase = "idle" | "ask" | "load" | "done";

export function Skills({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "done" : "idle");

  useEffect(() => {
    if (reduce) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    if (phase !== "idle") return;
    setPhase("ask");
    window.setTimeout(() => setPhase("load"), 1100);
    window.setTimeout(() => setPhase("done"), 2600);
    window.setTimeout(() => onDone?.(), 4000);
  }

  const active = phase === "load" || phase === "done";

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <div className="mb-3 text-center text-xs text-ink-mute">
        Mis habilidades disponibles
      </div>

      {/* Rejilla de habilidades */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SKILLS.map((s) => {
          const lit = active && s.id === MATCH;
          return (
            <div
              key={s.id}
              className={`rounded-xl border p-2.5 text-center transition-all ${
                lit
                  ? "border-ink bg-muted/70 shadow-[0_0_0_1px_var(--color-ink)]"
                  : active
                    ? "border-line opacity-45"
                    : "border-line"
              }`}
            >
              <div className="text-xl">{s.icon}</div>
              <div className="mt-1 text-[11px] font-semibold leading-tight text-ink">
                {s.name}
              </div>
              <div className="mt-0.5 text-[9px] leading-tight text-ink-mute">
                {s.desc}
              </div>
              {lit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-[9px] font-semibold text-ink"
                >
                  {phase === "load" ? "cargando…" : "✓ activa"}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tarea que entra */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 ml-auto w-fit max-w-[90%] rounded-xl bg-ink px-3 py-2 text-sm text-background"
          >
            👤 {TASK}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narración / acción */}
      <div className="mt-4">
        {phase === "done" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs leading-relaxed text-ink-mute"
          >
            La tarea encajaba con una habilidad, así que la{" "}
            <b className="text-ink">cargué sola</b> y la seguí al pie de la letra
            — sin que tú expliques nada cada vez.
          </motion.p>
        ) : phase === "idle" ? (
          <button
            onClick={run}
            className="mx-auto block rounded-xl border border-ink bg-ink px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            ▷ Pedirme una tarea
          </button>
        ) : (
          <p className="text-center text-xs text-ink-mute">
            {phase === "ask"
              ? "Busco si alguna habilidad encaja…"
              : "Cargo la habilidad que corresponde."}
          </p>
        )}
      </div>
    </div>
  );
}
