import { MyRuntimeProvider } from "@/components/provider/my-runtime-provider";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyRuntimeProvider>
      <main>{children}</main>;
    </MyRuntimeProvider>
  );
}
