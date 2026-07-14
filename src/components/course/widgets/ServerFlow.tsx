"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * De dónde sale la respuesta: el viaje al servidor.
 *
 * Enseña el modelo mental correcto de "cómo funciono por dentro":
 *   - No vivo en tu dispositivo; me ejecuto en un servidor.
 *   - Cada vez que escribes, tu mensaje + TODA la conversación viajan al
 *     servidor. Allí me ejecuto, leo todo el contexto y genero la respuesta.
 *   - La respuesta viaja de vuelta. El servidor no guarda nada.
 *   - Por eso, en el siguiente mensaje, TODO vuelve a viajar (cada vez más).
 *
 * Es interactivo: la persona pulsa "enviar" y ve el paquete viajar de ida
 * (mensaje + contexto) y de vuelta (respuesta), y cómo el servidor lo olvida.
 */

type Phase = "idle" | "up" | "think" | "down" | "forget";

const TOTAL = 2; // viajes antes de continuar

export function ServerFlow({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [turn, setTurn] = useState(0);
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function send() {
    if (phase !== "idle" || done) return;
    setPhase("up");
    window.setTimeout(() => setPhase("think"), 1200);
    window.setTimeout(() => setPhase("down"), 2500);
    window.setTimeout(() => setPhase("forget"), 3700);
    window.setTimeout(() => {
      setPhase("idle");
      setTurn((t) => {
        const n = t + 1;
        if (n >= TOTAL) {
          setDone(true);
          window.setTimeout(() => onDone?.(), 1600);
        }
        return n;
      });
    }, 4600);
  }

  const thinking = phase === "think";
  const forgetting = phase === "forget";

  const caption = done
    ? "Aunque parezca que te recuerdo, en realidad releo todo cada vez. Eso que viaja y releo es el contexto."
    : phase === "up"
      ? "Tu mensaje y TODA la conversación viajan al servidor…"
      : phase === "think"
        ? "Aquí me ejecuto: leo todo el contexto de una vez y genero la respuesta."
        : phase === "down"
          ? "La respuesta viaja de vuelta a tu pantalla."
          : phase === "forget"
            ? "El servidor no guarda nada: al terminar, me apago y lo olvido todo."
            : turn === 0
              ? "Yo no vivo en tu dispositivo: me ejecuto en un servidor. Envía y míralo."
              : "Otra vez: fíjate que vuelve a viajar TODA la conversación (cada vez más larga).";

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      {/* Escenario: dispositivo — track — servidor */}
      <div className="flex items-stretch gap-2 sm:gap-3">
        {/* Dispositivo */}
        <Node icon="💻" label="Tú" sub="tu dispositivo" />

        {/* Track con el paquete viajando */}
        <div className="relative flex-1">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-line-strong" />
          <AnimatePresence>
            {phase === "up" && (
              <Packet key="up" from="4%" to="82%" label="📦" />
            )}
            {phase === "down" && (
              <Packet key="down" from="82%" to="4%" label="💬" />
            )}
          </AnimatePresence>
          {/* etiqueta de dirección */}
          <div className="absolute inset-x-0 top-0 text-center text-[10px] text-ink-faint">
            {phase === "up"
              ? "mensaje + contexto →"
              : phase === "down"
                ? "← respuesta"
                : ""}
          </div>
        </div>

        {/* Servidor */}
        <Node
          icon="🖥️"
          label="Servidor"
          sub={
            forgetting
              ? "🗑️ lo olvida"
              : thinking
                ? "ejecutando…"
                : "aquí me ejecuto"
          }
          active={thinking}
          spark
        />
      </div>

      {/* Estado dentro del servidor cuando piensa */}
      <div className="mt-3 min-h-[1.5rem] text-center">
        <AnimatePresence mode="wait">
          {thinking && (
            <motion.span
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-muted/60 px-3 py-1 text-[11px] text-ink"
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1 rounded-full bg-ink"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
                  />
                ))}
              </span>
              leo el contexto → genero
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Narración */}
      <p className="mt-1 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft">
        {caption}
      </p>

      {/* Acción */}
      {!done && (
        <button
          onClick={send}
          disabled={phase !== "idle"}
          className="mx-auto mt-1 block rounded-xl border border-ink bg-ink px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {phase !== "idle"
            ? "Viajando…"
            : turn === 0
              ? "▷ Enviar mensaje"
              : "▷ Enviar otro mensaje"}
        </button>
      )}
    </div>
  );
}

function Node({
  icon,
  label,
  sub,
  active,
  spark,
}: {
  icon: string;
  label: string;
  sub: string;
  active?: boolean;
  spark?: boolean;
}) {
  return (
    <div
      className={`flex w-20 shrink-0 flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors sm:w-24 ${
        active ? "border-ink bg-muted/60" : "border-line bg-background/40"
      }`}
    >
      <motion.span
        className="text-2xl"
        animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={active ? { repeat: Infinity, duration: 1 } : undefined}
      >
        {icon}
      </motion.span>
      <span className="text-[11px] font-semibold text-ink">
        {label}
        {spark && " ✦"}
      </span>
      <span className="text-[9px] leading-tight text-ink-mute">{sub}</span>
    </div>
  );
}

function Packet({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ left: from, opacity: 0, scale: 0.7 }}
      animate={{ left: to, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 1.1, ease: "easeInOut" }}
      className="absolute top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-ink bg-background text-sm shadow-sm"
    >
      {label}
    </motion.div>
  );
}
