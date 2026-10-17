"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormField } from "@/components/FormField";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { registerAction } from "@/features/auth/actions";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, undefined);
  const values = state?.values ?? {};
  const errors = state?.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage message={state?.message} />
      <FormField
        label="Full name"
        name="name"
        autoComplete="name"
        required
        maxLength={100}
        defaultValue={values.name}
        error={errors.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={values.email}
        error={errors.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={72}
        hint="At least 8 characters."
        error={errors.password}
      />
      <FormField
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+919876543210"
        defaultValue={values.phone}
        error={errors.phone}
      />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">I want to</legend>
        <RoleOption value="USER" label="Find a trainer" checked={values.role !== "TRAINER"} />
        <RoleOption
          value="TRAINER"
          label="Offer training as a trainer"
          checked={values.role === "TRAINER"}
        />
      </fieldset>
      <SubmitButton label="Create account" pendingLabel="Creating account…" />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function RoleOption({ value, label, checked }: { value: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="radio"
        name="role"
        value={value}
        defaultChecked={checked}
        className="accent-emerald-600"
      />
      {label}
    </label>
  );
}
