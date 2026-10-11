import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * RouteScrollRestoration handles route-aware scroll behavior:
 * - On 'PUSH' navigation (clicking links to new products or pages), it instantly resets the window scroll to top (0, 0).
 * - Avoids laggy 'smooth' animation jumps which cause disorienting visual upward leaps on route entry.
 * - On 'POP' navigation (browser back/forward button), scroll position is preserved without forced jump to top.
 */
export const RouteScrollRestoration: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathnameRef = useRef<string>(location.pathname);

  useEffect(() => {
    // If the user navigated via browser back/forward (POP), do not overwrite the browser's restored scroll position
    if (navType === 'POP') {
      prevPathnameRef.current = location.pathname;
      return;
    }

    // When navigating to a new route via PUSH/REPLACE, instantly reset scroll to top
    // Using instant 'auto' rather than 'smooth' prevents the laggy jump/flicker
    if (prevPathnameRef.current !== location.pathname) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname, navType]);

  return null;
};
