/* eslint-disable */
"use client";

import { useState, useEffect } from "react";

/**
 * Returns true only after the first client-side render (hydration complete)
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Runs after the app hydrates on the client
    setHydrated(true);
  }, []);

  return hydrated;
}
