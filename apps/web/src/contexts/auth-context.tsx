"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { clearSession, getSession } from "@/actions/session";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: string;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [session, setSession] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function loadSessionFromCookie(): Promise<void> {
      try {
        setLoading(true);
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error("Failed to load session", error);
      } finally {
        setLoading(false);
      }
    }
    void loadSessionFromCookie();
  }, []);

  /**
   * Logs out the user.
   */
  const signOut = async (): Promise<void> => {
    try {
      await clearSession();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error", error);
      // toast.error("Logout error")
    }
  };

  const value = { session, loading, signOut };

  if (loading) {
    return <>...loading</>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
