"use client";

import { useCallback, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FRONTEND_URL } from "@/lib/constants";

const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onError: (error) => {
      console.error("Google login failed:", error);
      setError("Failed to authenticate with Google");
      setIsLoading(false);
    },
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${FRONTEND_URL}/api/auth/google`,
  });

  const handleGoogleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleLogin();
    } catch (error) {
      console.error("Google login error:", error);
      setError((error as Error).message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [googleLogin]);

  return {
    handleGoogleLogin,
    isLoading,
    error,
  };
};

export default useGoogleAuth;
