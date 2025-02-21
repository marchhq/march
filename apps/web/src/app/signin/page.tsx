"use client";

import { Button } from "@/components/ui/button";
import useGoogleAuth from "@/hooks/use-google-login";
import { Github } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const { handleGoogleLogin } = useGoogleAuth();
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <Button
        variant={"outline"}
        className="rounded-xl"
        onClick={handleGoogleLogin}
      >
        <Image src={"icons/google.svg"} alt="google" width={20} height={20} />
        <span>continue with google</span>
      </Button>
      <Button variant={"outline"} className="rounded-xl">
        <Github />
        <span>continue with github</span>
      </Button>
    </div>
  );
}
