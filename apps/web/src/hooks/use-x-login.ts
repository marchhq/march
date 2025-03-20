import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { getSession } from "@/actions/session";

interface UseXLoginReturn {
  handleXLogin: () => Promise<void>;
  handleXRevoke: () => Promise<void>;
}

export function useXLogin(
  redirectAfterAuth: string,
  redirectAfterRevoke: string = redirectAfterAuth
): UseXLoginReturn {
  const router = useRouter();

  const handleXLogin = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error("No session found");
      }

      const response = await apiClient.get<{ url: string; state: string; codeVerifier: string }>(
        `/x/connect`
      );

      if (!response?.url || !response?.codeVerifier) {
        throw new Error("Invalid response from X connect endpoint");
      }

      // Store both redirect URL and codeVerifier in state
      const state = encodeURIComponent(
        JSON.stringify({ 
          redirect: redirectAfterAuth,
          codeVerifier: response.codeVerifier,
        })
      );

      // Use the URL from the response but replace the state parameter
      const url = new URL(response.url);
      url.searchParams.set("state", state);

      window.location.href = url.toString();
    } catch (err) {
      console.error("failed to login to X", err);
      toast.error("Failed to login to X");
    }
  }, [redirectAfterAuth]);

  const handleXRevoke = useCallback(async () => {
    try {
      const response = await apiClient.post("/x/revoke-access/");

      if (!response) {
        throw new Error("failed to revoke X access");
      }
      router.push(redirectAfterRevoke);
    } catch (error) {
      console.error("failed to revoke X access", error);
      toast.error("Failed to revoke X access");
    }
  }, [router, redirectAfterRevoke]);

  return { handleXLogin, handleXRevoke };
}
