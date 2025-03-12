"use client";

import axios from "axios";
import { User } from "@/types/types";
import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  checkSession: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  checkSession: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Función para verificar la sesión en el backend y actualizar el estado
  const checkSession = async () => {
    try {
      const { data } = await axios.get("/api/auth/verify", {
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para utilizar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
