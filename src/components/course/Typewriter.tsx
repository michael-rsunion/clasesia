"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/RichText";

/** Quita el markdown para la fase de tecleo (luego lo re-renderizamos bonito). */
function toPlain(text: string): string {
  return text.replace(/\*\*|\*|`/g, "");
}

interface Props {
  text: string;
  /** caracteres por segundo aprox. */
  speed?: number;
  onDone?: () => void;
  className?: string;
}

export function Typewriter({ text, speed = 55, onDone, className }: Props) {
  const reduce = useReducedMotion();
  const plain = toPlain(text);
  const [count, setCount] = useState(reduce ? plain.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    if (reduce) {
      setCount(plain.length);
      onDone?.();
      return;
    }
    setCount(0);
    const step = Math.max(1, Math.round(plain.length / 90)); // frases largas van más rápido
    const interval = window.setInterval(() => {
      setCount((c) => {
        const next = Math.min(plain.length, c + step);
        if (next >= plain.length && !doneRef.current) {
          doneRef.current = true;
          window.clearInterval(interval);
          // deja ver la última letra antes de avisar
          window.setTimeout(() => onDone?.(), 90);
        }
        return next;
      });
    }, 1000 / speed * step);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce]);

  const done = count >= plain.length;

  return (
    <span className={className}>
      {done ? <RichText text={text} /> : plain.slice(0, count)}
      {!done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-violet align-middle" />
      )}
    </span>
  );
}
