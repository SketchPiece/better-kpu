import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to throttle a function with a cooldown period and provide a countdown.
 *
 * @param callback - The function to be throttled.
 * @param cooldownSeconds - The cooldown period in seconds.
 * @returns A tuple containing the throttled function and the remaining cooldown seconds.
 */
function useCooldown<T extends (...args: unknown[]) => unknown>(
  callback: T,
  cooldownSeconds: number,
): [(...args: Parameters<T>) => void, number] {
  const [remaining, setRemaining] = useState<number>(0); // Countdown state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Reference to the timer

  /**
   * Function to execute the callback and start the cooldown.
   *
   * @param args - Arguments to pass to the callback function.
   */
  const runFunction = useCallback(
    (...args: Parameters<T>) => {
      if (remaining <= 0) {
        callback(...args); // Execute the callback
        setRemaining(cooldownSeconds); // Start the cooldown
      }
    },
    [callback, cooldownSeconds, remaining],
  );

  useEffect(() => {
    // If there's an active cooldown
    if (remaining > 0) {
      // Set up a timer that decrements the countdown every second
      timerRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup the timer when the component unmounts or when remaining changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remaining]);

  return [runFunction, remaining];
}

export default useCooldown;
