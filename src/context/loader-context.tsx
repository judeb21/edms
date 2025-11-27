"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type LoaderContextType = {
  loading: boolean;
  buttonLoader: boolean;
  setLoading: (state: boolean) => void;
  setButtonLoader: (state: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  return (
    <LoaderContext.Provider value={{ loading, buttonLoader, setLoading, setButtonLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used within LoaderProvider");
  return context;
};
