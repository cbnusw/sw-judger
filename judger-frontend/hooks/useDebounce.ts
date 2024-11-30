import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 지연 시간 후에 value 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup 함수에서 timer를 clear
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value 또는 delay가 변경될 때마다 effect 실행

  return debouncedValue;
}

export default useDebounce;
