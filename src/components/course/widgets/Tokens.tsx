"use client";

import { useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { tokenize } from "@/lib/tokenize";

// Tonos de tinta (monocromo). Alternamos la intensidad del fondo para
// que se distinga cada token, sin salir del blanco y negro.
const INK_LEVELS = [7, 12, 17, 9, 14, 19];

export function Tokens({ text, onDone }: { text: string; onDone?: () => void }) {
  const reduce = useReducedMotion();
  const tokens = useMemo(() => tokenize(text), [text]);

  useEffect(() => {
    const total = reduce ? 300 : 500 + tokens.length * 45;
    const t = window.setTimeout(() => onDone?.(), total);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-ink-mute">
        <span className="rounded-full bg-muted/60 px-2.5 py-1 font-mono">
          tu prompt
        </span>
        <span>→ lo troceo en</span>
        <span className="font-semibold text-ink">{tokens.length} tokens</span>
      </div>

      <div className="flex flex-wrap gap-1.5 font-mono text-sm leading-relaxed">
        {tokens.map((tok, i) => {
          const level = INK_LEVELS[tok.hue];
          return (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduce ? 0 : 0.5 + i * 0.045, duration: 0.25 }}
              className="rounded-md border border-line-strong px-1.5 py-1 whitespace-pre text-ink"
              style={{
                background: `color-mix(in oklab, var(--color-foreground) ${level}%, transparent)`,
              }}
            >
              {tok.text.replace(/ /g, "·")}
            </motion.span>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { k: text.length, l: "caracteres" },
          { k: tokens.length, l: "tokens" },
          { k: text.trim().split(/\s+/).filter(Boolean).length, l: "palabras" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-muted/60 py-2">
            <div className="text-lg font-semibold text-ink">{s.k}</div>
            <div className="text-[11px] text-ink-mute">{s.l}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-faint">
        El “·” marca el espacio: la IA también lo cuenta como parte del token.
      </p>
    </div>
  );
}
