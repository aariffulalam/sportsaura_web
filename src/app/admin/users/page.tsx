import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RoleBadge } from "@/components/RoleBadge";
import { getCurrentUser } from "@/features/auth/current-user";
import { getAccessToken } from "@/features/auth/session";
import { formatDate } from "@/lib/format";
import { listUsers } from "@/lib/user-service";

export const metadata: Metadata = { title: "Users · SportsAura admin" };

export default function AdminUsersPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">All users</h1>
      <Suspense fallback={<p className="text-zinc-500">Loading users…</p>}>
        <UsersTable />
      </Suspense>
    </main>
  );
}

async function UsersTable() {
  const user = await getCurrentUser();
  const token = await getAccessToken();
  if (!user || !token) {
    redirect("/login?next=/admin/users");
  }
  if (user.role !== "ADMIN") {
    return (
      <p role="alert" className="text-zinc-600 dark:text-zinc-400">
        Only admins can see this page.
      </p>
    );
  }

  // The user service checks the ADMIN role again; this page never trusts the browser.
  const { content: users, page } = await listUsers(token);

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
          <tr>
            {["ID", "Name", "Email", "Phone", "Role", "Status", "Joined"].map((heading) => (
              <th key={heading} scope="col" className="px-4 py-3 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 text-zinc-500">{row.id}</td>
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3">{row.email}</td>
              <td className="px-4 py-3">{row.phone ?? "—"}</td>
              <td className="px-4 py-3">
                <RoleBadge role={row.role} />
              </td>
              <td className="px-4 py-3">{row.active ? "Active" : "Deactivated"}</td>
              <td className="px-4 py-3">{formatDate(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800">
        {page.totalElements} users
      </p>
    </div>
  );
}
