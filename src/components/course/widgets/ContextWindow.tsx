"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * La ventana de contexto, explicada de verdad y paso a paso.
 *
 * Enseña tres ideas, en este orden:
 *   1. No tengo memoria: cada vez que escribes, releo TODA la conversación
 *      desde cero (una versión "recién encendida" que luego olvida).
 *   2. Ese texto que puedo leer a la vez tiene un tamaño máximo, en tokens,
 *      y cada modelo tiene el suyo.
 *   3. Cuando la charla supera ese tamaño, lo más antiguo se cae de la
 *      ventana. Si preguntas por algo que ya se cayó, me lo invento.
 *
 * Es interactiva: la persona pulsa "enviar" y ve el barrido de relectura,
 * el medidor de tokens llenándose y cómo lo viejo se descarta.
 */

interface Msg {
  who: "you" | "ai";
  text: string;
  tokens: number;
}

// La conversación que la persona irá enviando, mensaje a mensaje.
const CONVO: Msg[] = [
  { who: "you", text: "Me llamo Marta", tokens: 12 },
  { who: "you", text: "Vivo en Cádiz", tokens: 11 },
  { who: "you", text: "Tengo un perro que se llama Rún", tokens: 16 },
  { who: "you", text: "Trabajo de noche en un hospital", tokens: 15 },
  { who: "you", text: "Odio el café pero me encanta el té", tokens: 16 },
  { who: "you", text: "¿Te acuerdas de cómo me llamo?", tokens: 14 },
];

// Respuesta final: el dato "Me llamo Marta" ya se cayó → se lo inventa.
const HALLUCINATION = "Mmm… ¿te llamas Lucía?";

const CAPACITY = 52; // tokens que caben a la vez en esta "ventana"

type Phase = "idle" | "reading" | "settled";

export function ContextWindow({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  // cuántos mensajes de CONVO se han enviado ya
  const [sent, setSent] = useState(reduce ? CONVO.length : 0);
  const [phase, setPhase] = useState<Phase>(reduce ? "settled" : "idle");
  const [done, setDone] = useState(reduce);

  // Ventana actual: los últimos mensajes que caben en CAPACITY tokens.
  const { inWindow, dropped, used } = useMemo(() => {
    const all = CONVO.slice(0, sent);
    const keep: Msg[] = [];
    let sum = 0;
    for (let i = all.length - 1; i >= 0; i--) {
      if (sum + all[i].tokens > CAPACITY) break;
      sum += all[i].tokens;
      keep.unshift(all[i]);
    }
    const drop = all.slice(0, all.length - keep.length);
    return { inWindow: keep, dropped: drop, used: sum };
  }, [sent]);

  // Sin animación (accesibilidad): mostramos el estado final y avanzamos.
  useEffect(() => {
    if (reduce) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLast = sent >= CONVO.length;
  const nextMsg = CONVO[sent];
  const pct = Math.min(100, Math.round((used / CAPACITY) * 100));

  function send() {
    if (phase === "reading" || isLast) return;
    // Fase 1: barrido de relectura sobre todo lo que hay en la ventana.
    setPhase("reading");
    window.setTimeout(() => {
      setSent((v) => v + 1);
      setPhase("settled");
      if (sent + 1 >= CONVO.length) {
        window.setTimeout(() => {
          setDone(true);
          // Ya terminó: avisamos al motor para que siga con la explicación.
          window.setTimeout(() => onDone?.(), 2400);
        }, 900);
      }
    }, 1100);
  }

  // Aviso de que "Me llamo Marta" cayó, para conectar con la respuesta final.
  const nameDropped = dropped.some((m) => m.text === "Me llamo Marta");

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      {/* Medidor de tokens */}
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-ink-mute">Ventana de contexto</span>
        <span className="font-mono text-ink-mute">
          {used} / {CAPACITY} tokens
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-line-strong">
        <motion.div
          className={`h-full ${pct >= 100 ? "bg-ink" : "bg-ink/70"}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* La "máquina recién encendida" que relee todo */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-background/40 p-3">
        <AnimatePresence>
          {phase === "reading" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-10"
            >
              <motion.div
                className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-ink/10 to-transparent"
                initial={{ top: "-20%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1, ease: "linear" }}
              />
              <div className="absolute left-2 top-2 rounded-md bg-ink px-2 py-0.5 text-[10px] font-medium text-background">
                releyendo todo desde el principio…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {inWindow.length === 0 ? (
          <p className="py-6 text-center text-xs text-ink-faint">
            La conversación está vacía. Envía el primer mensaje 👇
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <AnimatePresence initial={false} mode="popLayout">
              {inWindow.map((m) => {
                const hallucinated = m.who === "ai";
                return (
                  <motion.div
                    key={m.text}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -24, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`max-w-[85%] rounded-lg px-3 py-1.5 text-sm ${
                      m.who === "you"
                        ? "self-end bg-ink text-background"
                        : hallucinated
                          ? "self-start border border-dashed border-line-strong bg-muted/60 text-ink-soft"
                          : "self-start bg-muted text-ink"
                    }`}
                  >
                    {m.text}
                    {hallucinated && (
                      <span className="ml-1 align-middle text-[10px] text-ink-faint">
                        (inventado)
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lo que se cayó de la ventana */}
      <AnimatePresence>
        {dropped.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 rounded-xl border border-dashed border-red-500/50 bg-red-500/5 p-3"
          >
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
              <span className="grid size-4 place-items-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                ✕
              </span>
              Se salió de la ventana — lo olvidé:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dropped.map((m) => (
                <span
                  key={m.text}
                  className="flex items-center gap-1.5 rounded-md border border-red-500/50 bg-red-500/10 px-2 py-1 text-xs"
                >
                  <span className="text-red-600 dark:text-red-400">✕</span>
                  <span className="text-red-700 line-through decoration-red-500/60 dark:text-red-300">
                    {m.text}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zona de acción / narración */}
      <div className="mt-4">
        {done ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {/* respuesta final inventada */}
            <div className="rounded-xl border border-dashed border-line-strong bg-muted/50 p-3 text-sm text-ink-soft">
              <span className="mr-1 font-semibold text-ink">Yo:</span>
              «{HALLUCINATION}»
            </div>
            <p className="text-center text-xs leading-relaxed text-ink-mute">
              {nameDropped ? (
                <>
                  Preguntaste tu nombre, pero{" "}
                  <b className="text-ink">«Me llamo Marta»</b> ya se había caído
                  de la ventana. No lo tenía delante… así que me lo inventé. Eso
                  es una <b className="text-ink">alucinación</b>.
                </>
              ) : (
                <>Fíjate: cada mensaje me obligó a releer todo otra vez.</>
              )}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={send}
              disabled={phase === "reading"}
              className="rounded-xl border border-ink bg-ink px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {phase === "reading"
                ? "Releyendo…"
                : sent === 0
                  ? "▷ Enviar primer mensaje"
                  : `▷ Enviar: «${nextMsg?.text}»`}
            </button>
            <p className="max-w-md text-center text-[11px] leading-relaxed text-ink-mute">
              {sent === 0
                ? "No tengo memoria: cada mensaje lo responde una versión mía recién encendida que relee toda la conversación desde cero."
                : dropped.length > 0
                  ? "La ventana está llena. Para que quepa lo nuevo, lo más antiguo se cae."
                  : "Cada vez que escribes, vuelvo a leer todo lo anterior antes de responder."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
