import { createContext, useContext } from "react";
import type { User } from "../../types/auth";

const AuthContext = createContext<User | null>(null);

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw Error(
      "useAuthContext() hook must be used within AuthProvider component",
    );
  }
  return context;
}
