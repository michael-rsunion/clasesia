"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { tokenize } from "@/lib/tokenize";

export function Generate({ text, onDone }: { text: string; onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [tokens] = useState(() => tokenize(text));
  const [shown, setShown] = useState(reduce ? tokens.length : 0);

  useEffect(() => {
    if (reduce) {
      onDone?.();
      return;
    }
    if (shown >= tokens.length) {
      const t = window.setTimeout(() => onDone?.(), 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), 70);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  const done = shown >= tokens.length;

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono ${
            done ? "bg-ink/10 text-ink" : "bg-muted text-ink-mute"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              done ? "bg-ink" : "animate-pulse bg-ink-mute"
            }`}
          />
          {done ? "respuesta completa" : "prediciendo siguiente token…"}
        </span>
        <span className="text-ink-faint">{shown}/{tokens.length}</span>
      </div>

      <p className="font-mono text-[15px] leading-relaxed text-ink">
        {tokens.slice(0, shown).map((t, i) => (
          <span key={i}>{t.text}</span>
        ))}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 rounded-sm bg-ink"
          />
        )}
      </p>
    </div>
  );
}
