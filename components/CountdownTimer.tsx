import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

type Props = {
  duration: number;
  onFinish?: () => void;
  resetKey?: any;
};

const CountdownTimer: React.FC<Props> = ({ duration, onFinish, resetKey }) => {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    setSeconds(duration);
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onFinish) onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resetKey, duration]);

  return (
    <Text style={{ fontSize: 24, textAlign: 'center', color: 'green' }}>
      {seconds} soniya
    </Text>
  );
};

export default CountdownTimer;
