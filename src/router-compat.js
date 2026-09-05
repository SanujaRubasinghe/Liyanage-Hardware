'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter as useNextRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation';
import NextLink from 'next/link';

export { useSearchParams };

const LocationStateContext = createContext({ state: null, setNavState: () => {} });

export function RouterCompatProvider({ children }) {
  const [navState, setNavState] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('__next_nav_state');
      if (stored) {
        setNavState(JSON.parse(stored));
        sessionStorage.removeItem('__next_nav_state');
      }
    } catch (e) {}
  }, []);

  return (
    <LocationStateContext.Provider value={{ state: navState, setNavState }}>
      {children}
    </LocationStateContext.Provider>
  );
}

export function useNavigate() {
  const router = useNextRouter();
  const { setNavState } = useContext(LocationStateContext);

  return (path, options = {}) => {
    if (options.state) {
      setNavState(options.state);
      try {
        sessionStorage.setItem('__next_nav_state', JSON.stringify(options.state));
      } catch (e) {}
    } else {
      setNavState(null);
    }

    if (typeof path === 'number') {
      if (path === -1) router.back();
      else if (path === 1) router.forward();
      return;
    }

    router.push(path);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useContext(LocationStateContext);

  const search = searchParams ? searchParams.toString() : '';

  return {
    pathname: pathname || '',
    search: search ? `?${search}` : '',
    state: state || null,
  };
}

export function useParams() {
  return useNextParams() || {};
}

export function Link({ to, href, children, className, onClick, ...props }) {
  const target = to || href || '#';
  return (
    <NextLink href={target} className={className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}
