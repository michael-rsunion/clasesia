"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Las alucinaciones, en código.
 *
 * La persona hace una pregunta sobre algo que NO existe. La IA, como siempre
 * genera lo más probable, responde con un dato concreto y muy seguro… que se
 * ha inventado. Un medidor muestra "seguridad que aparento" subiendo al 96 %,
 * y al comprobarlo se revela que nada de eso es real. Moraleja: seguridad
 * no es lo mismo que verdad. Verifica.
 */

const QUESTION = "¿Quién dirige el Museo de Arqueología de Nívoli y desde qué año?";
const ANSWER = "Lo dirige la Dra. Elena Vidal desde 2016, según la reseña oficial del museo.";
const WORDS = ANSWER.split(" ");

type Phase = "idle" | "typing" | "typed" | "checked";

export function Hallucination({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "checked" : "idle");
  const [shown, setShown] = useState(reduce ? WORDS.length : 0);
  const [conf, setConf] = useState(reduce ? 96 : 0);

  // Escritura palabra a palabra + la "seguridad" subiendo a la vez.
  useEffect(() => {
    if (phase !== "typing") return;
    if (shown >= WORDS.length) {
      setPhase("typed");
      return;
    }
    const t = window.setTimeout(() => {
      setShown((s) => s + 1);
      setConf((c) => Math.min(96, c + Math.round(96 / WORDS.length)));
    }, 130);
    return () => window.clearTimeout(t);
  }, [phase, shown]);

  useEffect(() => {
    if (reduce) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function check() {
    setPhase("checked");
    window.setTimeout(() => onDone?.(), 1200);
  }

  const checked = phase === "checked";

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      {/* pregunta del usuario */}
      <div className="mb-3 ml-auto w-fit max-w-[85%] rounded-xl bg-ink px-3 py-2 text-sm text-background">
        {QUESTION}
      </div>

      {/* respuesta */}
      <div className="relative rounded-xl border border-line bg-background/40 p-3">
        {phase === "idle" ? (
          <p className="py-3 text-center text-xs text-ink-faint">
            Pregunté por un museo que <b className="text-ink-mute">no existe</b>.
            Mira qué respondo 👇
          </p>
        ) : (
          <p
            className={`text-[15px] leading-relaxed transition-colors ${
              checked ? "text-ink-faint line-through" : "text-ink"
            }`}
          >
            {WORDS.slice(0, shown).map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  !checked && /Vidal|2016|oficial/.test(w) ? "font-semibold" : ""
                }
              >
                {w}{" "}
              </motion.span>
            ))}
            {phase === "typing" && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 rounded-sm bg-ink"
              />
            )}
          </p>
        )}

        {/* sello INVENTADO al comprobar */}
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, scale: 1.3, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border-2 border-ink px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-ink"
            >
              Inventado
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* medidor: seguridad aparente vs. verdad */}
      {phase !== "idle" && (
        <div className="mt-3 space-y-2">
          <div>
            <div className="mb-1 flex items-baseline justify-between text-[11px]">
              <span className="text-ink-mute">Seguridad que aparento</span>
              <span className="font-mono text-ink">{conf}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line-strong">
              <motion.div
                className="h-full bg-ink"
                animate={{ width: `${conf}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
          {checked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-1 flex items-baseline justify-between text-[11px]">
                <span className="text-ink-mute">¿Es verdad?</span>
                <span className="font-mono text-ink">0%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-line-strong">
                <div className="h-full w-0 bg-ink" />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* acción / veredicto */}
      <div className="mt-4">
        {phase === "idle" && (
          <button
            onClick={() => setPhase("typing")}
            className="mx-auto block rounded-xl border border-ink bg-ink px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            ▷ Preguntar
          </button>
        )}
        {phase === "typed" && (
          <button
            onClick={check}
            className="mx-auto block rounded-xl border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-muted"
          >
            🔍 Comprobar si es cierto
          </button>
        )}
        {checked && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs leading-relaxed text-ink-mute"
          >
            Nada de eso existe: ni el museo, ni la directora, ni el año, ni la
            reseña. Sonó seguro… pero me lo <b className="text-ink">inventé</b>.
            A eso se le llama <b className="text-ink">alucinación</b> — por eso
            conviene <b className="text-ink">verificar siempre</b> datos, cifras
            y fuentes.
          </motion.p>
        )}
      </div>
    </div>
  );
}
