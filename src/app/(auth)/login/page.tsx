import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in · SportsAura" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Sign in</h1>
      {/* LoginForm reads ?next= from the URL, which is only known at request time. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
