import { useCallback, useEffect, useState } from 'react';

export const useFetcher = (fetch, normalizer) => {
  const [value, setValue] = useState({
    loading: true,
    error: '',
    data: null,
    metadata: null,
  });

  const handleFetch = async () => {
    setValue(prevState => ({
      ...prevState,
      loading: true,
    }));

    try {
      let [data, metadata] = await fetch();
      if (typeof normalizer === 'function') {
        data = normalizer(data);
      }
      setValue({
        loading: false,
        error: '',
        data,
        metadata,
      });
    } catch (error) {
      setValue({
        loading: false,
        error: error,
        data: null,
        metadata: null,
      });
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return [value, { handleFetch, setValue }];
};
