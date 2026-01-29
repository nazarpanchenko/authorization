import { type JSX } from "react";
import { AuthContext } from "./AuthContext";
import useAuth from "../../hooks/useAuth";

export default function AuthProvider({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  return (
    <>
      <AuthContext value={user}>{children}</AuthContext>
    </>
  );
}
