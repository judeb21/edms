"use client";

import { AuthenticatedUserInfo } from "@/types";
import { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  user: AuthenticatedUserInfo | null;
  setUser: (user: AuthenticatedUserInfo | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useAuthUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUserInfo | null>(null);

  // Fetch user from API route that reads cookie
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/me"); // returns user from cookie
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load user from cookie", err);
      }
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
