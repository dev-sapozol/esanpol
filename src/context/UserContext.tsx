// src/context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import type { GetBasicDataUser } from "../types/graphql";   // ← nombre correcto
import { fetchBasicUserData } from "../services/userService/GetBasicDataUser";

type UserContextType = {
  user: GetBasicDataUser | null;
  setUser: React.Dispatch<React.SetStateAction<GetBasicDataUser | null>>;
  loading: boolean
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GetBasicDataUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBasicUserData();
        setUser(data || null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
}
