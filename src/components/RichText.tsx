import { Fragment, type ReactNode } from "react";

/**
 * Renderiza un subconjunto mínimo de markdown inline:
 *   **negrita**  ·  *cursiva*  ·  `código`
 * Suficiente para resaltar conceptos clave sin meter una librería entera.
 */
export function RichText({ text }: { text: string }) {
  return <>{parse(text)}</>;
}

const PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

function parse(text: string): ReactNode[] {
  const parts = text.split(PATTERN).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md bg-white/8 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-ink-soft">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
