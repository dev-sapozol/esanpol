import { useEffect, useRef } from "react";

/**
 * Recibe un array de endpoints y los pingea a todos en paralelo con
 * Promise.allSettled — si un backend falla, no bloquea ni cancela
 * el calentamiento de los demás.
 *
 * Añadir un nuevo dominio es tan simple como agregar una URL al array
 * en Home.tsx.
 */
export function useBackendPrewarm(endpoints: string[], delayMs = 1500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
  const warmedCount = sessionStorage.getItem("__backend_warmed_count__");
  if (warmedCount && parseInt(warmedCount) >= endpoints.length) return;

  timerRef.current = setTimeout(async () => {
    await Promise.allSettled(
      endpoints.map((endpoint) =>
        fetch(endpoint, {
          method: "GET",
          keepalive: true,
          signal: AbortSignal.timeout(30_000),
        })
      )
    );

    sessionStorage.setItem("__backend_warmed_count__", String(endpoints.length));
  }, delayMs);

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, [endpoints, delayMs]);
}