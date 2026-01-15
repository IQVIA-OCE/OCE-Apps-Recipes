import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 *
 * @param {Function} callback
 * @param {number} delay
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};
