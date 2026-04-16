"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/**
 * Mount once per page to silently sign returning users in via Google One Tap.
 * Renders no visible UI — the One Tap prompt is injected by Google's script.
 *
 * The useRef guard prevents React StrictMode's double-invoke from firing two
 * concurrent FedCM requests (which causes the AbortError in the console).
 */
export default function GoogleOneTap() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed in with Google!");
          router.push("/dashboard");
        },
        onError: (ctx) => {
          // 401 = user dismissed the prompt — not a real error
          if (ctx.error.status !== 401) {
            toast.error("Google sign-in failed. Please try again.");
          }
        },
      },
    });
  }, [router]);

  return null;
}
