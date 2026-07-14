"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";

type Tab = "imagen" | "audio" | "video";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "imagen", label: "Imagen", icon: "🖼️" },
  { id: "audio", label: "Audio", icon: "🔊" },
  { id: "video", label: "Vídeo", icon: "🎬" },
];

export function Multimodal({ onDone }: { onDone?: () => void }) {
  const [tab, setTab] = useState<Tab>("imagen");

  useEffect(() => {
    const t = window.setTimeout(() => onDone?.(), 1600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/60">
      {/* pestañas */}
      <div className="flex gap-1 border-b border-line p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-ink text-background"
                : "text-ink-mute hover:bg-muted"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "imagen" && <ImagePanel />}
            {tab === "audio" && <AudioPanel />}
            {tab === "video" && <VideoPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2.5 text-center text-[12px] leading-relaxed text-ink-mute">
      {children}
    </p>
  );
}

function ImagePanel() {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
        <Image
          src={asset("/assets/demo-image.png")}
          alt="Imagen generada por inteligencia artificial: un faro sobre un acantilado."
          fill
          sizes="(max-width: 640px) 100vw, 520px"
          className="object-cover"
        />
      </div>
      <Caption>
        Esta foto no existe: la <b className="text-ink">generé</b> a partir de la
        frase “un faro sobre un acantilado, en blanco y negro”. Ningún píxel es
        real.
      </Caption>
    </div>
  );
}

function VideoPanel() {
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className="size-full object-cover"
          src={asset("/assets/demo-video.mp4")}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <Caption>
        Un <b className="text-ink">vídeo</b> creado desde otra frase de texto.
        Cada fotograma se generó de cero.
      </Caption>
    </div>
  );
}

function AudioPanel() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      void el.play();
    }
  }

  return (
    <div className="rounded-xl border border-line bg-muted/40 p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-background transition-transform hover:scale-105"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 text-sm font-medium text-ink">
            Voz generada por IA
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-strong">
            <div
              className="h-full bg-ink transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* barras decorativas que "laten" al reproducir */}
      <div className="mt-3 flex items-end justify-center gap-1" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-ink-faint"
            animate={
              playing
                ? { height: [4, 6 + ((i * 7) % 18), 4] }
                : { height: 4 }
            }
            transition={{
              repeat: playing ? Infinity : 0,
              duration: 0.6 + (i % 5) * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Caption>
        Escríbele una frase y la lee con voz humana. Esta voz no existía hace un
        momento.
      </Caption>

      <audio
        ref={audioRef}
        src={asset("/assets/demo-voice.mp3")}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress(el.currentTime / el.duration);
        }}
      />
    </div>
  );
}
