import type { Role } from "@/lib/user-service";

const STYLES: Record<Role, string> = {
  USER: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  TRAINER: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  ADMIN: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STYLES[role]}`}>{role}</span>
  );
}
