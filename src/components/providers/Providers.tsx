"use client";

import TanstackProvider from "./TanstackProvider";
import { Toaster } from "@/components/ui/sonner";
export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <TanstackProvider>
      {children}

      <Toaster />
    </TanstackProvider>
  );
}
