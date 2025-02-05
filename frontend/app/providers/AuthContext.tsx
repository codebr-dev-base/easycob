"use client";
import { createContext, useContext } from "react";

export const AuthContext = createContext<string | null>(null);

export default function AuthProvider({ token, children }: any) {
  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
}
