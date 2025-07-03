import { useEffect, useState } from 'react';
import { clamp } from '../utils';

const useHintPosition = (value, hintWidth, progressWidth) => {
  const [hintPosition, setHintPosition] = useState(0);

  useEffect(() => {
    if (progressWidth && hintWidth) {
      const minHintLeft = 0;
      const maxHintLeft = progressWidth - hintWidth;

      const newHintPosition = clamp((value / 100) * progressWidth - hintWidth / 2, minHintLeft, maxHintLeft);

      setHintPosition(newHintPosition);
    }
  }, [value, hintWidth, progressWidth]);

  return hintPosition;
}

export default useHintPosition;
