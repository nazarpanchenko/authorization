import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import $api from "../http";
import type { AuthResponse } from "../types/auth";

export default function useAuth() {
  const navigate = useNavigate();

  async function signUp(email: string, password: string): Promise<void> {
    try {
      const response = await $api.post<AuthResponse>("/sign-up", {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err?.response?.data?.message);
      }
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const response = await $api.post<AuthResponse>("/sign-in", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err?.response?.status === 403) {
          alert(
            "Please activate your account via verficiation link sent to your email",
          );
        }
        if (err?.response?.status === 400) {
          alert("Password is incorrect");
        }
      }
    }
  }

  async function logout(): Promise<void> {
    try {
      await $api.post("/logout");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err?.response?.data?.message);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/sign-in");
    }
  }

  return { signUp, signIn, logout };
}
