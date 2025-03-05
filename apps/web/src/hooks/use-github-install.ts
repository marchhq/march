import { useState } from "react";
import { useCallback } from "react";

export const useGithubInstall = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubInstall = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = process.env.NEXT_PUBLIC_GITHUB_APP_URL
      if (!url) {
        throw new Error("GITHUB_INSTALL_URL is not set");
      }
      window.location.href = url;
    } catch (error) {
      console.error("Failed to install Github app:", error);
    }
  }, []);

  return { isLoading, handleGithubInstall };
};
