import { useRef, useState, useCallback, useEffect } from "react";

export function useBackendWarmup(delayMs = 4000) {
  const [warmingUp, setWarmingUp] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    // Limpia timers anteriores
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setWarmingUp(true);
    }, delayMs);
  }, [delayMs]);

  const stop = useCallback(() => {
    // Cancela timer activo
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Oculta overlay
    setWarmingUp(false);
  }, []);

  // Cleanup al desmontar componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    warmingUp,
    start,
    stop,
  };
}