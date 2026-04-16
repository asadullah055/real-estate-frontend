"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiLoader } from "react-icons/fi";

interface GoogleButtonProps {
  label?: string;
}

export default function GoogleButton({ label = "Continue with Google" }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Direct browser navigation avoids cross-domain cookie issues.
    // authClient.signIn.social() uses fetch, which causes state_mismatch
    // when frontend and backend are on different domains (Netlify + Vercel).
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    const callbackURL = `${window.location.origin}/dashboard`;
    window.location.href = `${apiUrl}/api/auth/sign-in/social/google?callbackURL=${encodeURIComponent(callbackURL)}`;
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
