"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

interface Side {
  prompt: string;
  answer: string;
}

export function Compare({
  bad,
  good,
  onDone,
}: {
  bad: Side;
  good: Side;
  onDone?: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => onDone?.(), 1400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        { label: "Prompt flojo", data: bad, good: false, icon: "😕" },
        { label: "Prompt bueno", data: good, good: true, icon: "🤩" },
      ].map((col, idx) => (
        <motion.div
          key={col.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + idx * 0.4 }}
          className={`flex flex-col rounded-2xl border bg-surface/60 p-4 ${
            col.good ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-dashed border-line-strong"
          }`}
        >
          <div
            className={`mb-2 flex items-center gap-1.5 text-xs font-semibold ${
              col.good ? "text-ink" : "text-ink-mute"
            }`}
          >
            <span>{col.icon}</span>
            {col.label}
          </div>
          <div className="rounded-lg bg-muted/60 p-2.5 font-mono text-[13px] text-ink-soft">
            {col.data.prompt}
          </div>
          <div className="mt-2 text-[11px] text-ink-faint">↓ te respondo</div>
          <div
            className={`mt-1 whitespace-pre-line rounded-lg p-2.5 text-[13px] leading-relaxed ${
              col.good ? "bg-ink/[0.06] text-ink" : "bg-muted/60 text-ink-mute"
            }`}
          >
            {col.data.answer}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
