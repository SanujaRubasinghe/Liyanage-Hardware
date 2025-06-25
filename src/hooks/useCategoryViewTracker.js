import { useEffect, useRef } from "react";
import { trackView } from "../services/categoryAnalytics";

export function useCategoryViewTracker(categoryId) {
  const ref = useRef();
  const hasTracked = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasTracked.current) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          trackView(categoryId);
          hasTracked.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 } 
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [categoryId]);

  return ref;
}
