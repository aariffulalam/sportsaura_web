import Link from "next/link";
import { Suspense } from "react";

import { RoleBadge } from "@/components/RoleBadge";
import { logoutAction } from "@/features/auth/actions";
import { getCurrentUser } from "@/features/auth/current-user";

const PUBLIC_LINKS = [
  { href: "/sports", label: "Sports" },
  { href: "/trainers", label: "Trainers" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-trainers", label: "For trainers" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex min-h-14 w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="font-semibold tracking-tight">
            Sports<span className="text-emerald-600">Aura</span>
          </Link>
          <nav
            aria-label="Main"
            className="flex flex-wrap gap-4 text-sm text-zinc-700 dark:text-zinc-300"
          >
            {PUBLIC_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Reads the login cookie, so it streams in after the rest of the page. */}
        <Suspense fallback={<span className="text-sm text-zinc-400">…</span>}>
          <HeaderUser />
        </Suspense>
      </div>
    </header>
  );
}

async function HeaderUser() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <nav aria-label="Account" className="flex items-center gap-4 text-sm">
        <Link href="/login" className="hover:underline">
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700"
        >
          Create account
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Account" className="flex items-center gap-4 text-sm">
      <Link href="/dashboard" className="font-medium hover:underline">
        Dashboard
      </Link>
      {user.role === "ADMIN" ? (
        <Link href="/admin/users" className="hover:underline">
          Users
        </Link>
      ) : null}
      <Link href="/account" className="flex items-center gap-2 hover:underline">
        {user.name} <RoleBadge role={user.role} />
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="text-zinc-600 hover:underline dark:text-zinc-400">
          Sign out
        </button>
      </form>
    </nav>
  );
}
