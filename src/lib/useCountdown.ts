//src/lib/useCountdown.ts

import { useEffect, useState, useRef } from "react";

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
  const [time, setTime] = useState(initialMin * 60 + initialSec);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete?.();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  return {
    minutes: Math.floor(time / 60),
    seconds: time % 60,
    isRunning,
    start: () => setIsRunning(true),
    reset: () => {
      clearInterval(intervalRef.current!);
      setTime(initialMin * 60 + initialSec);
      setIsRunning(false);
    },
  };
}
