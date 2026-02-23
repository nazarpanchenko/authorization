import { type JSX } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: JSX.Element }) {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <>
      <AuthContext value={user}>{children}</AuthContext>
    </>
  );
}
