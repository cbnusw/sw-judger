import { useState, useEffect } from 'react';
import { TimeDifference } from '@/utils/formatDate'; // TimeDifference 타입을 가져옵니다.

export const useCountdownTimer = (endDate: string): TimeDifference => {
  const calculateTimeDifference = (endDate: string): TimeDifference => {
    const now = new Date();
    const end = new Date(endDate);
    const difference = end.getTime() - now.getTime();

    const isPast = difference < 0;
    const absDifference = Math.abs(difference);

    const days = Math.floor(absDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDifference / (1000 * 60)) % 60);
    const seconds = Math.floor((absDifference / 1000) % 60);

    return {
      isPast,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeDiff, setTimeDiff] = useState<TimeDifference>(
    calculateTimeDifference(endDate),
  );

  useEffect(() => {
    const updateTimer = () => {
      const diff = calculateTimeDifference(endDate);
      setTimeDiff(diff);

      if (diff.isPast) {
        clearInterval(timerId);
      }
    };

    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [endDate]);

  return timeDiff;
};
