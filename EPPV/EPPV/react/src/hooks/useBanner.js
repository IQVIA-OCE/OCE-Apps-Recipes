import { useEffect, useState } from 'react';

export const useBanner = () => {
  const [banner, setBanner] = useState({
    variant: '',
    message: '',
    visible: false,
    icon: '',
  });

  useEffect(() => {
    const timer = setTimeout(
      () => setBanner(prev => ({ ...prev, visible: false })),
      4000
    );

    return () => clearTimeout(timer);
  }, [banner.visible]);

  return [banner, setBanner];
};
