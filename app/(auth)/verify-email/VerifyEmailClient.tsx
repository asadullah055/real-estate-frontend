"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiMail, FiLoader } from "react-icons/fi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/dashboard",
      });
      if (result.error) {
        toast.error(result.error.message ?? "Failed to resend. Please try again.");
      } else {
        setSent(true);
        toast.success("Verification email resent!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <FiMail size={32} className="text-blue-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
      <p className="mt-3 text-sm text-gray-500 leading-relaxed">
        We sent a verification link to{" "}
        {email ? (
          <span className="font-medium text-gray-700">{email}</span>
        ) : (
          "your email address"
        )}
        . Click the link to activate your account.
      </p>

      <p className="mt-2 text-xs text-gray-400">
        The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
      </p>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">Didn&apos;t receive the email?</p>
        <button
          onClick={handleResend}
          disabled={resending || sent}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending && <FiLoader size={14} className="animate-spin" />}
          {sent ? "Email sent!" : resending ? "Sending…" : "Resend verification email"}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Back to sign in
        </a>
      </p>
    </div>
  );
}

export default function VerifyEmailClient() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
