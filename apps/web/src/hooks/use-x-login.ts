import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseXLoginReturn {
  handleXLogin: () => Promise<void>;
  handleXRevoke: () => Promise<void>;
}

export function useXLogin(
  redirectAfterAuth: string,
  redirectAfterRevoke: string = redirectAfterAuth,
): UseXLoginReturn {
  const router = useRouter();

  const handleXLogin = useCallback(async () => {
    try {
      const { authUrl } = await apiClient.internal.get<{ authUrl: string }>(
        "/api/auth/x-url",
      );

      if (!authUrl) {
        throw new Error("No auth URL received");
      }

      console.log("Redirecting to X OAuth URL:", authUrl);
      window.location.href = authUrl;
    } catch (err) {
      console.error("failed to login to X", err);
      toast.error("Failed to login to X");
    }
  }, []);

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