/**
 * Tokenizador "de mentira pero creíble".
 *
 * No es el tokenizador real de un LLM (esos usan BPE entrenado), pero
 * imita su comportamiento lo bastante bien para ENSEÑAR la idea:
 *  - las palabras cortas y comunes suelen ser 1 token
 *  - las palabras largas se parten en trozos (subwords)
 *  - los espacios y signos cuentan
 *
 * Regla mnemotécnica real que sí enseñamos: ~1 token ≈ 4 caracteres
 * en español/inglés, o ~¾ de una palabra.
 */

export interface Token {
  text: string;
  /** índice de color estable para pintarlo */
  hue: number;
}

const PALETTE_SIZE = 6;

/** Parte una palabra larga en trozos tipo subword. */
function splitWord(word: string): string[] {
  if (word.length <= 4) return [word];

  const chunks: string[] = [];
  let i = 0;
  // trozos de 3-5 caracteres, imitando subwords
  while (i < word.length) {
    const size = word.length - i <= 6 ? word.length - i : 3 + (i % 3);
    chunks.push(word.slice(i, i + size));
    i += size;
  }
  return chunks;
}

/**
 * Convierte un texto en una lista de tokens con color asignado.
 * Mantiene los espacios pegados al token siguiente (como hacen los
 * tokenizadores reales, que codifican el espacio inicial).
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  // separa en palabras conservando espacios y puntuación
  const parts = input.match(/\s+|[^\s]+/g) ?? [];

  let leadingSpace = "";
  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      leadingSpace = part;
      continue;
    }

    // separa signos de puntuación pegados
    const segments = part.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}\s]+/gu) ?? [part];

    segments.forEach((seg, segIndex) => {
      const pieces = /[\p{L}\p{N}]+/u.test(seg) ? splitWord(seg) : [seg];
      pieces.forEach((piece, pieceIndex) => {
        const prefix = segIndex === 0 && pieceIndex === 0 ? leadingSpace : "";
        tokens.push({
          text: prefix + piece,
          hue: tokens.length % PALETTE_SIZE,
        });
      });
    });

    leadingSpace = "";
  }

  return tokens;
}

/** Estimación amable del coste en tokens para textos que no partimos. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.trim().length / 4));
}
