"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

const USES = [
  { icon: "📚", title: "Estudiar", ex: "“Explícame la fotosíntesis como si tuviera 12 años, con un ejemplo.”" },
  { icon: "💼", title: "Trabajo", ex: "“Resume este correo en 3 puntos y redacta una respuesta educada diciendo que no.”" },
  { icon: "🎨", title: "Crear", ex: "“Genera 5 ideas de logo para una cafetería vegana y descríbelas.”" },
  { icon: "💻", title: "Programar", ex: "“Escríbeme una función en Python que valide un email y explícala.”" },
  { icon: "🗂️", title: "Organizar", ex: "“Convierte esta lluvia de ideas en un plan semanal con prioridades.”" },
  { icon: "🌍", title: "Idiomas", ex: "“Corrige mi texto en inglés y dime por qué, en español.”" },
];

export function Uses({ onDone }: { onDone?: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(() => onDone?.(), 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {USES.map((u, i) => (
        <motion.div
          key={u.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-line bg-surface/60 p-4 transition-colors hover:border-line-strong"
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-muted/60 text-lg">
              {u.icon}
            </span>
            <span className="font-semibold text-ink">{u.title}</span>
          </div>
          <p className="font-mono text-[12.5px] leading-relaxed text-ink-mute">
            {u.ex}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
