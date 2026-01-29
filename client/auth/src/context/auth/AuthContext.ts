import { createContext } from "react";
import type { User } from "../../types/auth";

export const AuthContext = createContext<User | null>(null);
