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
  const revealed = picked !== null;
  const correct = picked === answer;

  function choose(i: number) {
    if (revealed) return;
    setPicked(i);
    // Se acertara o no, revelamos la correcta y explicamos. Luego avanzamos.
    window.setTimeout(() => onDone?.(), 2600);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      <p className="mb-4 text-center text-base leading-relaxed sm:text-lg">
        <span className="text-ink-soft">“{sentence} </span>
        <motion.span
          animate={revealed ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="mx-1 inline-block min-w-[2ch] border-b-2 border-dashed border-ink px-2 font-semibold text-ink"
        >
          {revealed ? options[answer] : "___"}
        </motion.span>
        <span className="text-ink-soft">”</span>
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const showRight = revealed && i === answer; // la correcta SIEMPRE se marca
          const showWrong = isPicked && i !== answer;
          return (
            <button
              key={opt}
              onClick={() => choose(i)}
              disabled={revealed}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                showRight
                  ? "border-ink bg-ink text-background"
                  : showWrong
                    ? "border-line-strong bg-muted/60 text-ink-mute line-through"
                    : revealed
                      ? "border-line bg-muted/40 text-ink-faint opacity-60"
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

      <div className="mt-3.5 min-h-[2.5rem] text-center text-xs leading-relaxed">
        {revealed &&
          (correct ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-ink-soft"
            >
              Exacto: <b className="text-ink">«{options[answer]}»</b> es la más
              probable. Eso mismo hago yo, calculado a gran escala.
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-ink-soft"
            >
              La más probable era <b className="text-ink">«{options[answer]}»</b>.
              No importa si acertaste: lo clave es que una opción encaja mucho
              mejor que las otras — y esa es justo la que yo elijo.
            </motion.span>
          ))}
      </div>
    </div>
  );
}
