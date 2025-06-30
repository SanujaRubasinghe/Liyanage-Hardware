import React, { useEffect, useRef } from 'react';
import './LoadingPage.css';

const LoadingScreen = () => {
  const rectRef = useRef(null);

  useEffect(() => {
    const rect = rectRef.current;
    if (rect) {
      rect.animate(
        [
          { height: '0%' },
          { height: '100%' }
        ],
        {
          duration: 2000,
          fill: 'forwards',
          easing: 'ease-in-out'
        }
      );
    }
  }, []);

  return (
    <div className="loading-screen">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <clipPath id="reveal-clip">
            <rect ref={rectRef} x="0" y="0" width="200" height="0" />
          </clipPath>
        </defs>
        <image
          href="/logo.png"
          x="0"
          y="0"
          width="200"
          height="200"
          clipPath="url(#reveal-clip)"
        />
      </svg>
    </div>
  );
};

export default LoadingScreen;
