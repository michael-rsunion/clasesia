"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Predictor de la siguiente palabra, animado y en código.
 * Se construye una frase paso a paso: en cada hueco aparecen 3 candidatas
 * con su probabilidad (barra animada). Eliges una y se añade; la de mayor
 * probabilidad va marcada como "más probable" para enseñar cómo decide la IA.
 */

const BASE = "Por la mañana me tomo un";

interface Option {
  w: string;
  p: number;
}

const STEPS: Option[][] = [
  [
    { w: "café", p: 72 },
    { w: "té", p: 20 },
    { w: "zumo", p: 8 },
  ],
  [
    { w: "bien", p: 66 },
    { w: "muy", p: 24 },
    { w: "siempre", p: 10 },
  ],
  [
    { w: "caliente", p: 76 },
    { w: "cargado", p: 16 },
    { w: "frío", p: 8 },
  ],
];

export function Predictor({ onDone }: { onDone?: () => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const step = chosen.length;
  const done = step >= STEPS.length;

  function pick(word: string) {
    if (done) return;
    const next = [...chosen, word];
    setChosen(next);
    if (next.length >= STEPS.length) {
      window.setTimeout(() => onDone?.(), 1300);
    }
  }

  const options = done ? [] : [...STEPS[step]].sort((a, b) => b.p - a.p);
  const maxP = options.length ? options[0].p : 0;

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      {/* Frase que se construye */}
      <div className="mb-4 text-center text-[17px] leading-relaxed">
        <span className="text-ink-soft">{BASE} </span>
        {chosen.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="font-semibold text-ink"
          >
            {w}{" "}
          </motion.span>
        ))}
        {done ? (
          <span className="font-semibold text-ink">.</span>
        ) : (
          <span className="inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-ink align-middle" />
        )}
      </div>

      {done ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-ink-mute"
        >
          ✓ Así, un hueco tras otro, se construye la frase. En cada paso yo elijo
          la palabra <b className="text-ink">más probable</b>.
        </motion.p>
      ) : (
        <>
          <div className="mb-2.5 text-center text-xs text-ink-mute">
            Elige la siguiente palabra —{" "}
            <b className="text-ink">yo elegiría la más probable</b>:
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-2 sm:grid-cols-3"
            >
              {options.map((o) => {
                const best = o.p === maxP;
                return (
                  <button
                    key={o.w}
                    onClick={() => pick(o.w)}
                    className={`rounded-xl border p-3 text-left transition-colors hover:bg-muted ${
                      best ? "border-ink" : "border-line"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">{o.w}</span>
                      <span className="font-mono text-xs text-ink-mute">
                        {o.p}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line-strong">
                      <motion.div
                        className="h-full bg-ink"
                        initial={{ width: 0 }}
                        animate={{ width: `${o.p}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                    <div className="mt-1 h-3 text-[10px] text-ink-mute">
                      {best ? "★ más probable" : ""}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
