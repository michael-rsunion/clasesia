"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Phase = "ask" | "nohands" | "connecting" | "hands";

export function Mcp({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "hands" : "ask");

  useEffect(() => {
    if (reduce) {
      onDone?.();
      return;
    }
    const seq: [Phase, number][] = [
      ["nohands", 900],
      ["connecting", 2200],
      ["hands", 3600],
    ];
    const timers = seq.map(([p, t]) =>
      window.setTimeout(() => setPhase(p), t),
    );
    const end = window.setTimeout(() => onDone?.(), 4600);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reached = (p: Phase) => {
    const order: Phase[] = ["ask", "nohands", "connecting", "hands"];
    return order.indexOf(phase) >= order.indexOf(p);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-5">
      {/* pregunta */}
      <div className="mb-3 ml-auto w-fit rounded-xl bg-ink px-3 py-2 text-sm text-background">
        👤 ¿Qué reuniones tengo hoy?
      </div>

      {/* sin manos */}
      <AnimatePresence>
        {reached("nohands") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-xl border border-dashed border-line-strong bg-muted/40 p-3"
          >
            <div className="mb-1 text-[11px] font-semibold text-ink-mute">
              🤖 Sin MCP (solo sé hablar)
            </div>
            <p className="text-sm text-ink-mute">
              Lo siento, no tengo forma de ver tu calendario. Solo puedo darte
              consejos generales…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* conectando */}
      <AnimatePresence>
        {reached("connecting") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-muted/40 p-3 text-sm"
          >
            <span className="text-ink">🔌</span>
            <span className="text-ink-soft">Conectando MCP</span>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-ink">
              calendario
            </code>
            {phase === "connecting" && (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="ml-auto text-xs text-ink-mute"
              >
                leyendo agenda…
              </motion.span>
            )}
            {reached("hands") && (
              <span className="ml-auto text-xs font-semibold text-ink">✓ conectado</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* con manos */}
      <AnimatePresence>
        {reached("hands") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-ink bg-muted/40 p-3"
          >
            <div className="mb-1.5 text-[11px] font-semibold text-ink">
              🤖 Con MCP (ahora tengo manos)
            </div>
            <p className="mb-2 text-sm text-ink">Tienes 3 reuniones hoy:</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              <li>• 10:00 — Equipo de producto</li>
              <li>• 13:30 — Comida con cliente</li>
              <li>• 17:00 — Repaso semanal</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
