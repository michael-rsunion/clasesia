"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

const MODELS = [
  {
    name: "Claude Opus 4.8",
    tag: "El más capaz",
    icon: "🧠",
    desc: "Para lo más difícil: código complejo, análisis a fondo y razonamiento largo.",
  },
  {
    name: "Claude Sonnet 5",
    tag: "El equilibrio",
    icon: "⚖️",
    desc: "Muy capaz y más rápido. El ideal para el día a día y la mayoría de tareas.",
  },
  {
    name: "Claude Haiku 4.5",
    tag: "El más rápido",
    icon: "⚡",
    desc: "Veloz y económico. Para tareas sencillas y de mucho volumen.",
  },
];

export function Models({ onDone }: { onDone?: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(() => onDone?.(), 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      {MODELS.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          className="flex items-start gap-3 rounded-2xl border border-line bg-surface/60 p-4 transition-colors hover:border-line-strong"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-xl">
            {m.icon}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink">{m.name}</span>
              <span className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-ink-mute">
                {m.tag}
              </span>
            </div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
              {m.desc}
            </p>
          </div>
        </motion.div>
      ))}
      <p className="px-1 text-center text-[11px] text-ink-faint">
        Los tres entienden texto e imágenes (multimodal).
      </p>
    </div>
  );
}
