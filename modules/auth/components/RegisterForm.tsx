"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import FormInput from "@/components/ui/FormInput";
import { authClient } from "@/lib/auth-client";
import { SignupFormData, signupSchema } from "@/lib/validations/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
      });

      if (result.error) {
        console.log("[RegisterForm] signUp error:", result.error);

        const status = result.error.status;
        const code = (result.error as { code?: string }).code ?? "";
        const msg = result.error.message?.toLowerCase() ?? "";

        const isDuplicate =
          status === 422 ||
          code === "USER_ALREADY_EXISTS" ||
          msg.includes("already exists") ||
          msg.includes("user already") ||
          msg.includes("taken");

        if (isDuplicate) {
          toast.error(
            "An account with this email already exists. Try signing in with Google or use the login page."
          );
        } else {
          toast.error(result.error.message ?? "Sign-up failed. Please try again.");
        }
        return;
      }

      // Redirect to "check your inbox" page
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FormInput
        label="Full Name"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <FormInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={0}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        }
        {...register("password")}
      />

      <FormInput
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={0}
          >
            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        }
        {...register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <FiLoader size={16} className="animate-spin" />}
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
