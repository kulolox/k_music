import { useState, useRef, useEffect } from 'react';

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