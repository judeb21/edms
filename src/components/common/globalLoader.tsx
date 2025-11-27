"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useHydration } from "@/hooks/useHydration";
import { useRouteProgress } from "@/hooks/useRouteProgress";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/**
 * Smooth, YouTube-style top progress bar + hydration loader
 */
export default function GlobalLoader({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration();
  const routeLoading = useRouteProgress();

  // TanStack Query global loading
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = routeLoading || isFetching > 0 || isMutating > 0;

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Animate YouTube-like progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isLoading) {
      setVisible(true);
      setProgress(10); // start visible
      interval = setInterval(() => {
        setProgress((p) => {
          if (p < 90) return p + Math.random() * 10; // grow gradually up to ~90%
          return p;
        });
      }, 200);
    } else {
      // finish bar
      setProgress(100);
      const timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Hydration loader: full screen spinner until first client render
  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="w-12 h-12 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <>
      {/* Top progress bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="progress-bar"
            className="fixed top-0 left-0 h-[3px] bg-brand-blue z-[60]"
            initial={{ width: "0%" }}
            animate={{
              width: `${progress}%`,
              transition: { ease: "easeInOut", duration: 0.2 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
