import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { RoleBadge } from "@/components/RoleBadge";
import { getCurrentUser } from "@/features/auth/current-user";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "My account · SportsAura" };

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">My account</h1>
      <Suspense fallback={<p className="text-zinc-500">Loading your profile…</p>}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}

async function AccountDetails() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/account");
  }

  const rows: [string, ReactNode][] = [
    ["Name", user.name],
    ["Email", user.email],
    ["Phone", user.phone ?? "Not added"],
    ["Role", <RoleBadge key="role" role={user.role} />],
    ["Member since", formatDate(user.createdAt)],
  ];

  return (
    <dl className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
          <dt className="text-zinc-500">{label}</dt>
          <dd className="col-span-2">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
