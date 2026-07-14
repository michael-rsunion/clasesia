/**
 * Prefija una ruta de /public con el basePath del despliegue.
 *
 * next/image y next/link aplican el basePath solos, pero las URLs sueltas
 * (mask-image en CSS, <video src>, <audio src>) no. Este helper lo añade.
 * El valor se incrusta en build (variable NEXT_PUBLIC_*).
 */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
