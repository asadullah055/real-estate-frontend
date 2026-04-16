import LoginForm from "@/modules/auth/components/LoginForm";
import GoogleButton from "@/modules/auth/components/GoogleButton";
import GoogleOneTap from "@/components/ui/GoogleOneTap";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <GoogleOneTap />
      <div className="w-full max-w-md rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="flex flex-col gap-4">
          <GoogleButton label="Sign in with Google" />

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
