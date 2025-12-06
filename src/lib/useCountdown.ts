import { useEffect, useState, useRef, useCallback } from "react";

type CountdownProps = {
  minutes: number;
  seconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
};

export default function useCountdown({
  minutes: initialMin,
  seconds: initialSec,
  autoStart = false,
  onComplete,
}: CountdownProps) {
  const initialTime = initialMin * 60 + initialSec;
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setTime((prev) => {
      if (prev <= 1) {
        clearTimer();
        setIsRunning(false);
        onComplete?.();
        return 0;
      }
      return prev - 1;
    });
  }, [onComplete]);

  useEffect(() => {
    if (isRunning) {
      clearTimer(); // Prevent multiple intervals
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isRunning, tick]);

  const start = () => {
    setIsRunning(true);
  };

  const reset = () => {
    clearTimer();
    setTime(initialTime);
    setIsRunning(false);
  };

  const restart = () => {
    reset();
    setTimeout(() => {
      start();
    }, 50); // Small delay ensures React state updates cleanly
  };

  return {
    minutes: Math.floor(time / 60),
    seconds: time % 60,
    isRunning,
    start,
    reset,
    restart,
  };
}
