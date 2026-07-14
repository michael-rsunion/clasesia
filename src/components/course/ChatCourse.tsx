"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ACTS,
  MODULES,
  SCRIPT,
  type Beat,
  type CardBeat,
} from "@/lib/curriculum";
import { RichText } from "@/components/RichText";
import { asset } from "@/lib/asset";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Typewriter } from "./Typewriter";
import { Tokens } from "./widgets/Tokens";
import { Timeline } from "./widgets/Timeline";
import { Predict } from "./widgets/Predict";
import { Generate } from "./widgets/Generate";
import { Predictor } from "./widgets/Predictor";
import { ContextWindow } from "./widgets/ContextWindow";
import { Hallucination } from "./widgets/Hallucination";
import { Compare } from "./widgets/Compare";
import { Multimodal } from "./widgets/Multimodal";
import { Models } from "./widgets/Models";
import { Mcp } from "./widgets/Mcp";
import { Connectors } from "./widgets/Connectors";
import { Uses } from "./widgets/Uses";

interface Item {
  key: number;
  beat: Beat;
}

type Stage = "welcome" | "running";

const STARTERS = [
  "Empecemos por el principio",
  "¿Qué es un token?",
  "¿Cómo funciona la IA?",
];

export function ChatCourse({ onRestart }: { onRestart: () => void }) {
  const [stage, setStage] = useState<Stage>("welcome");
  const [items, setItems] = useState<Item[]>([]);
  const [lastPrompt, setLastPrompt] = useState("");
  const cursorRef = useRef(0);
  const keyRef = useRef(1);
  const advancedRef = useRef<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const consumeNext = useCallback(() => {
    if (cursorRef.current >= SCRIPT.length) return;
    const beat = SCRIPT[cursorRef.current++];
    setItems((prev) => [...prev, { key: keyRef.current++, beat }]);
  }, []);

  const advanceFrom = useCallback(
    (key: number) => {
      if (advancedRef.current.has(key)) return;
      advancedRef.current.add(key);
      consumeNext();
    },
    [consumeNext],
  );

  const start = useCallback(
    (text?: string) => {
      if (stage === "running") return;
      setStage("running");
      if (text) {
        setItems([{ key: keyRef.current++, beat: { type: "you", module: "historia", text } }]);
      }
      consumeNext();
    },
    [stage, consumeNext],
  );

  const handlePromptSend = useCallback(
    (key: number, module: string, react: string, text: string) => {
      if (advancedRef.current.has(key)) return;
      advancedRef.current.add(key);
      setLastPrompt(text);
      const reactText = react.replaceAll("{prompt}", text);
      setItems((prev) => [
        ...prev,
        { key: keyRef.current++, beat: { type: "you", module, text } },
        { key: keyRef.current++, beat: { type: "say", module, text: reactText } },
      ]);
    },
    [],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, stage]);

  // Atajo de desarrollo: ?jump=<módulo> muestra ese beat aislado.
  useEffect(() => {
    if (stage !== "welcome") return;
    const jump = new URLSearchParams(window.location.search).get("jump");
    if (!jump) return;
    const idx = SCRIPT.findIndex((b) => b.type === jump || b.module === jump);
    if (idx < 0) return;
    cursorRef.current = idx;
    setStage("running");
    setItems([{ key: keyRef.current++, beat: SCRIPT[idx] }]);
    cursorRef.current = idx + 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastItem = items[items.length - 1];
  const lastKey = lastItem?.key ?? -1;
  const activeBeat = lastItem?.beat ?? null;

  const activeModule =
    [...items].reverse().find((i) => i.beat.module)?.beat.module ??
    MODULES[0].id;
  const currentIndex = Math.max(
    0,
    MODULES.findIndex((m) => m.id === activeModule),
  );

  // El composer envía al beat activo (continuar / prompt).
  function composerContinue() {
    if (activeBeat && lastItem) advanceFrom(lastItem.key);
  }
  function composerSend(text: string) {
    if (activeBeat?.type === "prompt" && lastItem) {
      handlePromptSend(lastItem.key, activeBeat.module, activeBeat.react, text);
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-6xl gap-3 p-2 sm:gap-4 sm:p-4">
      <ModuleMap currentIndex={currentIndex} started={stage === "running"} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-line bg-card/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <ChatHeader currentIndex={currentIndex} started={stage === "running"} />

        <div className="scroll-fade relative flex-1 overflow-y-auto px-3 py-6 sm:px-6">
          <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-5">
            {stage === "welcome" ? (
              <Welcome />
            ) : (
              items.map((item) => (
                <BeatView
                  key={item.key}
                  item={item}
                  active={item.key === lastKey}
                  lastPrompt={lastPrompt}
                  advance={() => advanceFrom(item.key)}
                  onRestart={onRestart}
                />
              ))
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>

        <Composer
          stage={stage}
          activeBeat={activeBeat}
          onStart={start}
          onContinue={composerContinue}
          onSend={composerSend}
          onRestart={onRestart}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Bienvenida (estado inicial)                                         */
/* ================================================================== */

function Welcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-7"
      >
        <Logo className="h-11 w-[135px]" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-balance text-3xl font-bold tracking-tight sm:text-5xl"
      >
        No te van a <span className="text-ink-mute">explicar</span> la IA.
        <br />
        La vas a <span className="text-gradient">usar</span> para entenderla.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-ink sm:text-base"
      >
        Este curso es un chat con una inteligencia artificial. Escribe abajo o
        toca una sugerencia para empezar a hablar conmigo — y de paso a entender
        qué es un prompt, un token y cómo funciono por dentro.
      </motion.p>
    </div>
  );
}

/* ================================================================== */
/* Router de beats                                                     */
/* ================================================================== */

function BeatView({
  item,
  active,
  lastPrompt,
  advance,
  onRestart,
}: {
  item: Item;
  active: boolean;
  lastPrompt: string;
  advance: () => void;
  onRestart: () => void;
}) {
  const { beat } = item;
  const done = active ? advance : undefined;

  switch (beat.type) {
    case "say":
      return <SayBubble text={beat.text} active={active} pause={beat.pause} advance={advance} />;
    case "you":
      return <YouBubble text={beat.text} />;
    case "card":
      return <ConceptCard beat={beat} active={active} advance={advance} />;
    case "tokens":
      return <Widget><Tokens text={lastPrompt || beat.fallback} onDone={done} /></Widget>;
    case "timeline":
      return <Widget><Timeline onDone={done} /></Widget>;
    case "predict":
      return <Widget><Predict sentence={beat.sentence} options={beat.options} answer={beat.answer} onDone={done} /></Widget>;
    case "generate":
      return <Widget><Generate text={beat.text} onDone={done} /></Widget>;
    case "predictor":
      return <Widget><Predictor onDone={done} /></Widget>;
    case "context":
      return <Widget><ContextWindow onDone={done} /></Widget>;
    case "hallucination":
      return <Widget><Hallucination onDone={done} /></Widget>;
    case "compare":
      return <Widget><Compare bad={beat.bad} good={beat.good} onDone={done} /></Widget>;
    case "multimodal":
      return <Widget><Multimodal onDone={done} /></Widget>;
    case "models":
      return <Widget><Models onDone={done} /></Widget>;
    case "mcp":
      return <Widget><Mcp onDone={done} /></Widget>;
    case "connectors":
      return <Widget><Connectors onDone={done} /></Widget>;
    case "uses":
      return <Widget><Uses onDone={done} /></Widget>;
    case "finish":
      return <FinishCard onRestart={onRestart} />;
    // continue y prompt los gestiona el composer de abajo
    default:
      return null;
  }
}

/* ================================================================== */
/* Piezas de chat                                                      */
/* ================================================================== */

/** Logo de RSUnion IA en monocromo: la máscara toma el color de la tinta,
 *  así es blanco en modo oscuro y negro en modo claro. */
function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="RSUNION IA"
      className={`inline-block bg-ink ${className}`}
      style={{
        WebkitMaskImage: `url(${asset("/assets/rsunion-logo.webp")})`,
        maskImage: `url(${asset("/assets/rsunion-logo.webp")})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const px = size === "lg" ? "size-14" : "size-9";
  const icon = size === "lg" ? 22 : 15;
  return (
    <span
      className={`${px} grid shrink-0 place-items-center rounded-full bg-ink text-background`}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z" />
        <circle cx="18.5" cy="17.5" r="2.2" />
        <circle cx="6" cy="16" r="1.5" />
      </svg>
    </span>
  );
}

function Widget({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      <Avatar />
      <div className="min-w-0 flex-1">{children}</div>
    </motion.div>
  );
}

function SayBubble({
  text,
  active,
  pause,
  advance,
}: {
  text: string;
  active: boolean;
  pause?: number;
  advance: () => void;
}) {
  const reduce = useReducedMotion();
  const [thinking, setThinking] = useState(active && !reduce);

  useEffect(() => {
    if (!active || reduce) {
      setThinking(false);
      return;
    }
    setThinking(true);
    const t = window.setTimeout(() => setThinking(false), 480);
    return () => window.clearTimeout(t);
  }, [active, reduce]);

  return (
    <Widget>
      <div className="inline-block max-w-full rounded-2xl rounded-tl-md border border-line bg-card px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
        {!active ? (
          <RichText text={text} />
        ) : thinking ? (
          <ThinkingDots />
        ) : (
          <Typewriter text={text} onDone={() => window.setTimeout(advance, pause ?? 250)} />
        )}
      </div>
    </Widget>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-ink-mute"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function YouBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground">
        {text}
      </div>
    </motion.div>
  );
}

function ConceptCard({
  beat,
  active,
  advance,
}: {
  beat: CardBeat;
  active: boolean;
  advance: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(advance, 700);
    return () => window.clearTimeout(t);
  }, [active, advance]);

  return (
    <Widget>
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-line-strong bg-card p-5 ring-glow"
      >
        <div className="mb-2 flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-muted text-xl">
            {beat.icon}
          </span>
          <h3 className="text-base font-semibold text-ink">{beat.title}</h3>
        </div>
        <p className="text-[14.5px] leading-relaxed text-ink-soft">
          <RichText text={beat.body} />
        </p>
      </motion.div>
    </Widget>
  );
}

function FinishCard({ onRestart }: { onRestart: () => void }) {
  return (
    <Widget>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full overflow-hidden rounded-2xl border border-line-strong bg-card p-7 text-center ring-glow"
      >
        <div className="mb-3 text-4xl">🎓</div>
        <h2 className="text-gradient mb-2 text-xl font-bold sm:text-2xl">
          Completaste el curso
        </h2>
        <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-ink-soft">
          Ya entiendes qué es un prompt, un token, cómo genero mis respuestas,
          cuándo me equivoco, qué significa multimodal y qué es un MCP.
        </p>
        <button
          onClick={onRestart}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Volver a empezar
        </button>
      </motion.div>
    </Widget>
  );
}

/* ================================================================== */
/* Composer persistente                                                */
/* ================================================================== */

function Composer({
  stage,
  activeBeat,
  onStart,
  onContinue,
  onSend,
  onRestart,
}: {
  stage: Stage;
  activeBeat: Beat | null;
  onStart: (text?: string) => void;
  onContinue: () => void;
  onSend: (text: string) => void;
  onRestart: () => void;
}) {
  const mode = useMemo<
    | "welcome"
    | "prompt"
    | "continue"
    | "predict"
    | "predictor"
    | "timeline"
    | "interact"
    | "finish"
    | "busy"
  >(() => {
    if (stage === "welcome") return "welcome";
    if (!activeBeat) return "busy";
    switch (activeBeat.type) {
      case "prompt":
        return "prompt";
      case "continue":
        return "continue";
      case "predict":
        return "predict";
      case "predictor":
        return "predictor";
      case "timeline":
        return "timeline";
      case "context":
      case "hallucination":
      case "connectors":
        return "interact";
      case "finish":
        return "finish";
      default:
        return "busy";
    }
  }, [stage, activeBeat]);

  const canType = mode === "welcome" || mode === "prompt";
  const placeholder =
    mode === "welcome"
      ? "Escribe algo para empezar…"
      : mode === "prompt" && activeBeat?.type === "prompt"
        ? activeBeat.placeholder
        : "";

  function handleSend(text: string) {
    if (mode === "welcome") onStart(text);
    else if (mode === "prompt") onSend(text);
  }

  return (
    <div className="border-t border-line bg-card/70 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
      <div className="mx-auto max-w-2xl">
        {mode === "welcome" && (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => onStart(s)}
                className="rounded-full border border-line bg-muted/50 px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {canType ? (
          <TextComposer placeholder={placeholder} onSend={handleSend} />
        ) : mode === "continue" ? (
          <button
            onClick={onContinue}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
          >
            {(activeBeat?.type === "continue" && activeBeat.label) || "Continuar"}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        ) : mode === "finish" ? (
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line-strong bg-muted/50 px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-muted"
          >
            ↺ Volver a empezar
          </button>
        ) : (
          <StatusBar mode={mode} />
        )}
      </div>
    </div>
  );
}

function StatusBar({
  mode,
}: {
  mode: "predict" | "predictor" | "timeline" | "interact" | "busy";
}) {
  const label =
    mode === "predict"
      ? "Elige una opción en el mensaje de arriba ☝️"
      : mode === "predictor"
        ? "Construye la frase: elige cada palabra ☝️"
        : mode === "timeline"
          ? "Explora la línea de tiempo para continuar ☝️"
          : mode === "interact"
            ? "Prueba el ejercicio de arriba para seguir ☝️"
            : "La IA está escribiendo…";
  return (
    <div className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-muted/30 px-4">
      {mode === "busy" && (
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-ink-mute"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
            />
          ))}
        </span>
      )}
      <span className={mode === "busy" ? "shimmer-text text-sm" : "text-sm text-ink-mute"}>
        {label}
      </span>
    </div>
  );
}

function TextComposer({
  placeholder,
  onSend,
}: {
  placeholder: string;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  function submit() {
    const text = value.trim();
    if (!text) return;
    setValue("");
    if (ref.current) ref.current.style.height = "auto";
    onSend(text);
  }

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-background/60 p-2 focus-within:border-ink/50">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="max-h-36 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-ink outline-none placeholder:text-ink-faint"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        aria-label="Enviar"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

/* ================================================================== */
/* Cabecera + mapa de módulos                                          */
/* ================================================================== */

function ChatHeader({
  currentIndex,
  started,
}: {
  currentIndex: number;
  started: boolean;
}) {
  const pct = started
    ? Math.round(((currentIndex + 1) / MODULES.length) * 100)
    : 0;
  const mod = MODULES[currentIndex];
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
      <Avatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-ink">RSUNION IA</span>
          {started && (
            <span className="flex items-center gap-1 text-[11px] text-ink-mute">
              <span className="size-1.5 rounded-full bg-ink" /> en directo
            </span>
          )}
        </div>
        <div className="truncate text-[11px] text-ink-mute">
          {started ? `${ACTS[mod.act]} · ${mod.title}` : "Aprende IA usándola"}
        </div>
      </div>
      {started && (
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="font-mono text-[11px] text-ink-mute">{pct}%</span>
        </div>
      )}
      <ThemeToggle />
    </div>
  );
}

function ModuleMap({
  currentIndex,
  started,
}: {
  currentIndex: number;
  started: boolean;
}) {
  const acts = [1, 2, 3, 4];
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto rounded-3xl border border-line bg-card/40 p-4 backdrop-blur-xl lg:flex">
      <div className="px-1">
        <Logo className="h-6 w-[74px]" />
        <div className="mt-1.5 text-[11px] text-ink-mute">Aprende IA usándola</div>
      </div>
      {acts.map((act) => (
        <div key={act}>
          <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            {act}. {ACTS[act]}
          </div>
          <div className="flex flex-col gap-0.5">
            {MODULES.map((m, i) =>
              m.act === act ? (
                <div
                  key={m.id}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors ${
                    started && i === currentIndex
                      ? "bg-muted text-ink"
                      : started && i < currentIndex
                        ? "text-ink-mute"
                        : "text-ink-faint"
                  }`}
                >
                  <span
                    className={`grid size-4 shrink-0 place-items-center rounded-full text-[9px] ${
                      started && i < currentIndex
                        ? "bg-ink text-background"
                        : started && i === currentIndex
                          ? "border-2 border-ink"
                          : "border border-line"
                    }`}
                  >
                    {started && i < currentIndex ? "✓" : ""}
                  </span>
                  <span className="truncate">{m.short}</span>
                </div>
              ) : null,
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}
