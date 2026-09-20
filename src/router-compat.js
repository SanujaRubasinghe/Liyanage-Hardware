'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter as useNextRouter, usePathname, useSearchParams, useParams as useNextParams } from 'next/navigation';
import NextLink from 'next/link';

export { useSearchParams };

const NAV_STATE_STORAGE_KEY = '__next_nav_state_by_path';

const LocationStateContext = createContext({
  statesByPath: {},
  setLocationState: () => {},
});

function normalizePath(path) {
  if (!path || typeof path !== 'string') return '';

  try {
    const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return `${url.pathname}${url.search}`;
  } catch (e) {
    const [pathname, search = ''] = path.split('?');
    return `${pathname}${search ? `?${search}` : ''}`;
  }
}

export function RouterCompatProvider({ children }) {
  const [statesByPath, setStatesByPath] = useState({});

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(NAV_STATE_STORAGE_KEY);
      if (stored) {
        setStatesByPath(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const setLocationState = (path, state) => {
    const key = normalizePath(path);
    if (!key) return;

    setStatesByPath((previousStates) => {
      const nextStates = { ...previousStates };

      if (state === undefined || state === null) {
        delete nextStates[key];
      } else {
        nextStates[key] = state;
      }

      try {
        sessionStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(nextStates));
      } catch (e) {}

      return nextStates;
    });
  };

  return (
    <LocationStateContext.Provider value={{ statesByPath, setLocationState }}>
      {children}
    </LocationStateContext.Provider>
  );
}

export function useNavigate() {
  const router = useNextRouter();
  const { setLocationState } = useContext(LocationStateContext);

  return (path, options = {}) => {
    if (typeof path === 'number') {
      if (path === -1) router.back();
      else if (path === 1) router.forward();
      return;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'state')) {
      setLocationState(path, options.state);
    }

    router.push(path);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { statesByPath } = useContext(LocationStateContext);

  const search = searchParams ? searchParams.toString() : '';
  const currentPath = `${pathname || ''}${search ? `?${search}` : ''}`;

  return {
    pathname: pathname || '',
    search: search ? `?${search}` : '',
    state: statesByPath[currentPath] || null,
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
