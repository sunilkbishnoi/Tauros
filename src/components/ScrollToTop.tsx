
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top on both pathname and search param changes
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
