"use client";

import { ITokenPayload } from "../models";
import { ApiResponse } from "../hooks";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { decodeTokenToUser } from "../functions";

interface AuthenticationContextProps {
  login: (
    email: string,
    password: string
  ) => Promise<ApiResponse<{ access_token: string; refresh_token: string }[]>>;
  decodedToken: (token: string) => Promise<ITokenPayload | null>;
  logout: () => void;
  user: ITokenPayload | null;
}

export const AuthenticationContext = createContext<AuthenticationContextProps>(
  {} as AuthenticationContextProps
);

export function AuthenticationProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [user, setUser] = useState<ITokenPayload | null>(null);


  const updateSession = useCallback((accessToken: string, refreshToken: string) => {
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
    const userData = decodeTokenToUser(accessToken);
    setUser(userData);
  }, []);

 
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_BASE}/auth/refresh-token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.result?.access_token) {
        throw new Error(data.errors?.detail || "Falha ao renovar o token");
      }

      const { access_token, refresh_token } = data.result;
      updateSession(access_token, refresh_token);
      return true;
    } catch (error) {
      console.error("Erro ao renovar o token:", error);
      logout();
      return false;
    }
  }, [updateSession]);

  
  const startTokenWatcher = useCallback(() => {
    const interval = setInterval(async () => {
      const token = sessionStorage.getItem("access_token");
      if (!token) return;

      const decoded = decodeTokenToUser(token);
      if (!decoded) return;

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - now;

      if (expiresIn < 60) {
        await refreshAccessToken();
      }
    }, 30 * 1000); 

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      const userData = decodeTokenToUser(token);
      setUser(userData);
    }

    const stopWatcher = startTokenWatcher();
    return stopWatcher;
  }, [startTokenWatcher]);

 
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<ApiResponse<{ access_token: string; refresh_token: string }[]>> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BASE}/auth/login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const content = await response.json();
        if (!response.ok) {
          throw new Error(content.errors?.detail || "Falha no login");
        }

        const { access_token, refresh_token } = content.result;
        updateSession(access_token, refresh_token);

        return {
          count: 1,
          data: [{ access_token, refresh_token }],
          error: null,
          isLoading: false,
          next: null,
          previous: null,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";
        return {
          data: [],
          count: 0,
          error: {
            field: "email",
            code: "401",
            detail: message,
          },
          isLoading: false,
          next: null,
          previous: null,
        };
      }
    },
    [updateSession]
  );

 
  const decodedToken = useCallback(
    async (token: string): Promise<ITokenPayload | null> => {
      sessionStorage.setItem("access_token", token);
      const userData = decodeTokenToUser(token);
      setUser(userData);
      return userData;
    },
    []
  );


  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
    router.push("/");
  }, [router]);

 
  const values = useMemo(
    () => ({
      login,
      logout,
      user,
      decodedToken,
    }),
    [login, logout, user, decodedToken]
  );

  return (
    <AuthenticationContext.Provider value={values}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const useAuth = () => useContext(AuthenticationContext);
