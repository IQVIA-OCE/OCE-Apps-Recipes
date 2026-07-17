import { useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useScrollbarWidth = () => {
  const [scrollbarWidth, setScrollbarWidth] = useState();

  useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);

      const inner = document.createElement('div');
      outer.appendChild(inner);

      setScrollbarWidth(outer.offsetWidth - inner.offsetWidth);
      outer.parentNode.removeChild(outer);
    }
  }, []);

  return scrollbarWidth;
}
