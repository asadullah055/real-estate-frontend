import VerifyEmailClient from "./VerifyEmailClient";

export const metadata = {
  title: "Verify your email",
};

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <VerifyEmailClient />
    </main>
  );
}
