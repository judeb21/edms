"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Detects route changes and triggers progress animations.
 */
export function useRouteProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Simulate slight transition delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return isLoading;
}
