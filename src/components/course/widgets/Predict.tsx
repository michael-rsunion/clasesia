"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface Props {
  sentence: string;
  options: string[];
  answer: number;
  onDone?: () => void;
}

export function Predict({ sentence, options, answer, onDone }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const solved = picked === answer;

  function choose(i: number) {
    if (solved) return;
    setPicked(i);
    if (i === answer) window.setTimeout(() => onDone?.(), 1100);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <p className="mb-4 text-center text-lg leading-relaxed">
        <span className="text-ink-soft">“{sentence} </span>
        <motion.span
          animate={solved ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="mx-1 inline-block min-w-[2ch] border-b-2 border-dashed border-ink px-2 font-semibold text-ink"
        >
          {solved ? options[answer] : "___"}
        </motion.span>
        <span className="text-ink-soft">”</span>
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showRight = picked !== null && i === answer;
          const showWrong = isPicked && i !== answer;
          return (
            <button
              key={opt}
              onClick={() => choose(i)}
              disabled={solved}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                showRight
                  ? "border-ink bg-ink text-background"
                  : showWrong
                    ? "border-line-strong bg-muted/60 text-ink-mute line-through"
                    : "border-line bg-muted/40 text-ink-soft hover:border-line-strong hover:bg-muted"
              }`}
            >
              {opt}
              {showRight && " ✓"}
              {showWrong && " ✗"}
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-[1.25rem] text-center text-xs">
        {solved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-ink"
          >
            Exacto: la palabra más probable. Eso mismo hago yo, a gran escala.
          </motion.span>
        )}
        {picked !== null && !solved && (
          <span className="text-ink-mute">Poco probable. Prueba otra opción.</span>
        )}
      </div>
    </div>
  );
}
