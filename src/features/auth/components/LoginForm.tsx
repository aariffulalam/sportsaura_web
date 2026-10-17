"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { FormField } from "@/components/FormField";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { loginAction } from "@/features/auth/actions";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage message={state?.message} />
      <input type="hidden" name="next" value={next} />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        error={state?.errors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state?.errors?.password}
      />
      <SubmitButton label="Sign in" pendingLabel="Signing in…" />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        New to SportsAura?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
