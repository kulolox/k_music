import { useState, useRef, useEffect, useMemo, RefObject } from 'react';
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';

// 缓存hook
export function useLocalStorage<T> (key:string, initialValue:T | null): [T, Function]{
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch(error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue): value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch(error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}

// 计时器hook
export const useInterval = (callback:Function, delay:number) => {
  const savedCallback = useRef<Function | null>(null)

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current!();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 路由
export function useRouter() {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const match = useRouteMatch()
  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      match,
      location,
      history,
    };
  }, [params, match, location, history])
}

// 事件绑定hook
export function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: Function,
  element?: RefObject<T>,
) {
  // Create a ref that stores handler
  const savedHandler = useRef<Function>()
  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window
    if (!(targetElement && targetElement.addEventListener)) {
      return
    }
    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler
    }
    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event)
      }
    }
    targetElement.addEventListener(eventName, eventListener)
    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, handler])
}

// 他出点击hook
export function useOnClickOutside<T extends HTMLElement = HTMLDivElement>(ref:RefObject<T>, handler: Function) {
  useEffect(
    () => {
      const listener = (event: any) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

// debug用hook
export function useWhyDidYouUpdate(name: string, props:any) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef<any>(null);

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj: any = {};
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}
