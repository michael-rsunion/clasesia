"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const POINTS = [
  {
    year: "1950",
    title: "La pregunta",
    detail:
      "Un matemático se plantea algo audaz: ¿podría una máquina llegar a pensar? Propone una prueba: si al conversar no distingues si hay una persona o una máquina al otro lado, algo interesante está pasando. La idea nace décadas antes de poder cumplirse.",
    emoji: "🤔",
  },
  {
    year: "1956",
    title: "Un nombre y una promesa",
    detail:
      "Un grupo de investigadores se reúne y bautiza el campo: “inteligencia artificial”. Durante años se intenta a base de reglas escritas a mano: si ocurre esto, haz aquello. Funciona para problemas pequeños, pero no para entender el mundo real.",
    emoji: "📐",
  },
  {
    year: "1958",
    title: "La primera que aprendía",
    detail:
      "Aparece un programa que, en lugar de seguir reglas fijas, se ajusta solo a partir de ejemplos. Es tosco y muy limitado, pero planta la semilla de la idea que lo cambiaría todo: aprender de los datos en vez de programar cada respuesta.",
    emoji: "🌱",
  },
  {
    year: "1966",
    title: "La primera conversación",
    detail:
      "Se crea el primer programa con el que se podía “conversar”: respondía reformulando lo que escribías, como un eco con forma de pregunta. No entendía nada, pero muchos sintieron que sí. Fue la primera pista de lo potente que sería hablarle a una máquina.",
    emoji: "💬",
  },
  {
    year: "2012",
    title: "Aprender de verdad",
    detail:
      "Con muchísimos más datos y ordenadores mucho más potentes, los sistemas que aprenden de ejemplos empiezan a superar a todo lo anterior en reconocer imágenes y sonidos. El enfoque de “aprender de los datos” gana la partida de forma definitiva.",
    emoji: "📈",
  },
  {
    year: "2017",
    title: "El gran salto",
    detail:
      "Aparece un nuevo diseño interno que permite entender el lenguaje mirando todas las palabras de una frase a la vez y captando cómo se relacionan. Es la base técnica sobre la que se construyen todos los modelos de lenguaje actuales.",
    emoji: "⚙️",
  },
  {
    year: "2022",
    title: "Hablar con una IA se vuelve normal",
    detail:
      "Un asistente entrenado para conversar se abre al público. De repente, millones de personas escriben a una IA y reciben respuestas útiles al instante. Deja de ser cosa de laboratorios: empieza la etapa que estás viviendo ahora.",
    emoji: "🚀",
  },
  {
    year: "hoy",
    title: "Ver, oír y actuar",
    detail:
      "Ya no solo escribo: entiendo imágenes, audio y vídeo, y me conecto a herramientas para buscar, organizar y hacer tareas por ti. A todo esto llegaremos en la última parte del curso.",
    emoji: "🤖",
  },
];

export function Timeline({ onDone }: { onDone?: () => void }) {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    if (visited.size >= POINTS.length) {
      const t = window.setTimeout(() => onDone?.(), 500);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited]);

  function open(i: number) {
    setActive(i);
    setVisited((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }

  const remaining = POINTS.length - visited.size;

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-3 sm:p-5">
      {/* ---------- MÓVIL: lista vertical (acordeón) ---------- */}
      <ul className="flex flex-col gap-1 sm:hidden">
        {POINTS.map((p, i) => {
          const seen = visited.has(i);
          const isActive = i === active;
          return (
            <li key={p.year}>
              <button
                onClick={() => open(i)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                  isActive ? "bg-muted/70" : "hover:bg-muted/40"
                }`}
                aria-expanded={isActive}
              >
                <span
                  className={`relative grid size-10 shrink-0 place-items-center rounded-full border text-lg transition-all ${
                    isActive
                      ? "border-ink bg-ink text-background"
                      : seen
                        ? "border-ink bg-surface text-ink"
                        : "border-dashed border-line-strong bg-surface text-ink-faint"
                  }`}
                >
                  {p.emoji}
                  {seen && !isActive && (
                    <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-ink text-[9px] font-bold text-background">
                      ✓
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-[11px] text-ink-faint">
                    {p.year}
                  </span>
                  <span
                    className={`block text-sm font-semibold ${
                      isActive || seen ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {p.title}
                  </span>
                </span>
                <span className="grid size-6 shrink-0 place-items-center text-lg text-ink-mute">
                  {isActive ? "–" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-3 pl-[3.25rem] pr-2 pt-1 text-sm leading-relaxed text-ink-soft">
                      {p.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* ---------- ESCRITORIO: raíl horizontal + detalle ---------- */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between gap-1">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-line-strong" />
          {POINTS.map((p, i) => {
            const seen = visited.has(i);
            const isActive = i === active;
            return (
              <button
                key={p.year}
                onClick={() => open(i)}
                className="group relative z-10 flex flex-col items-center gap-1.5"
                aria-label={`${p.year}: ${p.title}${seen ? " (visto)" : " (pendiente)"}`}
              >
                <span
                  className={`relative grid size-9 place-items-center rounded-full border text-sm transition-all ${
                    isActive
                      ? "scale-110 border-ink bg-ink text-background"
                      : seen
                        ? "border-ink bg-surface text-ink"
                        : "border-dashed border-line-strong bg-transparent text-ink-faint opacity-70 group-hover:opacity-100"
                  }`}
                >
                  {p.emoji}
                  {seen && !isActive && (
                    <span className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-ink text-[8px] font-bold text-background">
                      ✓
                    </span>
                  )}
                </span>
                <span
                  className={`font-mono text-[11px] transition-colors ${
                    isActive ? "text-ink" : seen ? "text-ink-mute" : "text-ink-faint"
                  }`}
                >
                  {p.year}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 rounded-xl bg-muted/60 p-4"
          >
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-base font-semibold text-ink">
                {POINTS[active].title}
              </span>
              <span className="font-mono text-xs text-ink-faint">
                {POINTS[active].year}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              {POINTS[active].detail}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progreso obligatorio (compartido) */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
        {remaining > 0 ? (
          <span className="text-ink-mute">
            Explora los {POINTS.length} momentos para continuar —{" "}
            <span className="font-semibold text-ink">
              te faltan {remaining}
            </span>
          </span>
        ) : (
          <span className="text-ink-mute">✓ Recorriste toda la historia</span>
        )}
      </div>
    </div>
  );
}
