"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface GoogleButtonProps {
  label?: string;
}

export default function GoogleButton({ label = "Continue with Google" }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });

      if (result?.error) {
        // Better Auth returned a structured error (provider not configured, etc.)
        toast.error(result.error.message ?? "Google sign-in failed. Please try again.");
        setLoading(false);
        return;
      }
      // On success Better Auth redirects the browser — loading stays true intentionally
    } catch (err) {
      // Network error or server unreachable
      console.error("[GoogleButton] signIn.social threw:", err);
      toast.error("Could not reach the server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <FiLoader size={18} className="animate-spin text-gray-400" />
      ) : (
        <FcGoogle size={18} />
      )}
      {label}
    </button>
  );
}
