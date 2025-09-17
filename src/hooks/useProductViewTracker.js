// hooks/useProductViewTracker.js
import { useEffect, useRef } from 'react';
import { checkConsent } from '../services/checkConsent';
import { trackProductView } from '../services/productAnalytics';

export function useProductViewTracker(productId) {

  
  const ref = useRef();
  const hasTracked = useRef(false);
  
  useEffect(() => {
    const hasConsent = checkConsent()
    if (!hasConsent) return
    const node = ref.current;
    if (!node || hasTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackProductView(productId);
          hasTracked.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [productId]);

  return ref;
}
