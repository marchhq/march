import { apiClient } from "@/lib/api";
import { BACKEND_URL } from "@/lib/constants";
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

      const state = encodeURIComponent(
        JSON.stringify({ redirect: redirectAfterAuth })
      );

      const response = await apiClient.get<{ url: string }>(
        `/x/connect?state=${state}`
      );

      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No redirect URL received");
      }
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
