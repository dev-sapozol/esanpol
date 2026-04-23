import { useRef, useState, useCallback } from "react";

export function useBackendWarmup(delayMs = 4000) {
  const [warmingUp, setWarmingUp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    timerRef.current = setTimeout(() => setWarmingUp(true), delayMs);
  }, [delayMs]);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWarmingUp(false);
  }, []);

  return { warmingUp, start, stop };
}