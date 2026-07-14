"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Cómo se le añaden herramientas a Claude en la práctica: los "conectores".
 *
 * Panel interactivo tipo ajustes de Claude. La persona activa un conector y ve
 * que pasa de "Conectar" a "Conectado". Enseña que MCP no es teoría: se activa
 * con un clic (los oficiales) o añadiendo un servidor propio por URL.
 */

interface Connector {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

const CONNECTORS: Connector[] = [
  { id: "cal", icon: "📅", name: "Calendario", desc: "Ver y crear eventos" },
  { id: "drive", icon: "📁", name: "Google Drive", desc: "Leer tus documentos" },
  { id: "mail", icon: "✉️", name: "Gmail", desc: "Buscar y redactar correos" },
  { id: "web", icon: "🌐", name: "Buscar en internet", desc: "Datos al día" },
  { id: "db", icon: "🗄️", name: "Base de datos", desc: "Consultar tus datos" },
];

export function Connectors({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState<Set<string>>(
    () => new Set(reduce ? ["cal"] : []),
  );
  const [done, setDone] = useState(false);

  function toggle(id: string) {
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // En cuanto conecta el primero, damos un momento y avanzamos.
  useEffect(() => {
    if (on.size > 0 && !done) {
      setDone(true);
      const t = window.setTimeout(() => onDone?.(), reduce ? 0 : 1600);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on.size]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
      {/* Cabecera tipo panel de ajustes */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="grid size-6 place-items-center rounded-md bg-ink text-xs text-background">
          ⚙️
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-ink">Conectores</div>
          <div className="text-[11px] text-ink-mute">
            Claude · Ajustes → Conectores
          </div>
        </div>
        <span className="ml-auto shrink-0 font-mono text-[11px] text-ink-mute">
          {on.size} activo{on.size === 1 ? "" : "s"}
        </span>
      </div>

      {/* Lista */}
      <ul className="divide-y divide-line">
        {CONNECTORS.map((c) => {
          const active = on.has(c.id);
          return (
            <li key={c.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-base">
                {c.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">
                  {c.name}
                </div>
                <div className="truncate text-[11px] text-ink-mute">
                  {c.desc}
                </div>
              </div>
              <button
                onClick={() => toggle(c.id)}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-background"
                    : "border-line-strong text-ink-soft hover:bg-muted"
                }`}
                aria-pressed={active}
              >
                {active ? "✓ Conectado" : "Conectar"}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Pie: añadir uno propio + confirmación */}
      <div className="border-t border-line px-4 py-3">
        <AnimatePresence mode="wait">
          {on.size > 0 ? (
            <motion.p
              key="ok"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] leading-relaxed text-ink-soft"
            >
              Listo. Desde ahora puedo usar{" "}
              <b className="text-ink">
                {CONNECTORS.filter((c) => on.has(c.id))
                  .map((c) => c.name)
                  .join(", ")}
              </b>{" "}
              dentro de la conversación, sin salir de aquí.
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[12px] leading-relaxed text-ink-mute"
            >
              Pulsa <b className="text-ink">Conectar</b> en el que quieras. Y si
              tu equipo tiene una herramienta propia, se añade pegando la
              dirección de su <span className="font-mono">servidor MCP</span>.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
