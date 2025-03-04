import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { FRONTEND_URL } from "@/lib/constants";

const useGmail = (
  redirectAfterAuth: string,
  redirectAfterRevoke: string = redirectAfterAuth,
): {
  handleGmailLogin: () => Promise<void>;
  handleGmailRevoke: () => Promise<void>;
} => {
  const router = useRouter();

  const handleGmailLogin = useCallback(async () => {
    try {
      const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const GOOGLE_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
      const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/api/auth/gmail`;

      if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
        throw new Error("Google Client ID or Redirect URI is not set");
      }

      const state = encodeURIComponent(
        JSON.stringify({ redirect: redirectAfterAuth }),
      );

      const gmailAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${GOOGLE_SCOPE}&access_type=offline&state=${state}`;

      console.log(gmailAuthUrl);
      router.push(gmailAuthUrl);
    } catch (error) {
      console.error("failed to initiate Gmail login:", error);
    }
  }, [router, redirectAfterAuth]);

  const handleGmailRevoke = useCallback(async () => {
    try {
      const response = await apiClient.get("/gmail/remove-access/");

      if (!response) {
        throw new Error(`Failed to revoke access`);
      }

      router.push(redirectAfterRevoke);
    } catch (error) {
      console.error("Failed to revoke Gmail access:", error);
    }
  }, [router, redirectAfterRevoke]);

  return { handleGmailLogin, handleGmailRevoke};
};

export default useGmail;
