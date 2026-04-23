// hooks/useScreenReaderRouteFocus.ts — Route heading focus management for screen readers.

"use client";

import { useEffect, useRef } from "react";

export function useScreenReaderRouteFocus<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) {
      return;
    }
    heading.focus();
  }, []);

  return ref;
}
