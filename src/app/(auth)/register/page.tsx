import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create account · SportsAura" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Create your account</h1>
      <RegisterForm />
    </>
  );
}
