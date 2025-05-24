import { useState, useEffect } from 'react';

const DelayedSuspense = ({ fallback, children, minDelay = 500 }) => {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFallback(false);
    }, minDelay);

    return () => clearTimeout(timeout);
  }, [minDelay]);

  return showFallback ? fallback : children;
};

export default DelayedSuspense;
