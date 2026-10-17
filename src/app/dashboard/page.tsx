import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RoleBadge } from "@/components/RoleBadge";
import { CardGridSkeleton } from "@/components/Skeleton";
import { getCurrentUser } from "@/features/auth/current-user";
import { getAccessToken } from "@/features/auth/session";
import { getMyTrainerProfile } from "@/lib/trainer-service";
import type { User } from "@/lib/user-service";

export const metadata: Metadata = { title: "Dashboard · SportsAura" };

/** Where users land after signing in. What it shows depends on the role. */
export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <Suspense fallback={<CardGridSkeleton count={4} />}>
        <Dashboard />
      </Suspense>
    </main>
  );
}

type Card = { title: string; text: string; href?: string; icon: string };

async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }
  const cards = await cardsFor(user);

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Hi, {user.name.split(" ")[0]}</h1>
        <RoleBadge role={user.role} />
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <DashboardCard key={card.title} card={card} />
        ))}
      </div>
    </>
  );
}

async function cardsFor(user: User): Promise<Card[]> {
  const account: Card = {
    title: "My account",
    text: "Your name, email and phone.",
    href: "/account",
    icon: "👤",
  };

  if (user.role === "ADMIN") {
    return [
      { title: "Users", text: "Every account on SportsAura.", href: "/admin/users", icon: "👥" },
      {
        title: "Trainers",
        text: "See all published trainer profiles.",
        href: "/trainers",
        icon: "🏅",
      },
      { title: "Sports & page text", text: "Editing from the website is coming soon.", icon: "📝" },
      account,
    ];
  }

  if (user.role === "TRAINER") {
    const token = await getAccessToken();
    const profile = token ? await getMyTrainerProfile(token) : null;
    return [
      profile
        ? {
            title: "My trainer profile",
            text: `Published: ${profile.sports.map((sport) => sport.name).join(", ")} in ${profile.city}. Edit it any time.`,
            href: "/dashboard/trainer-profile",
            icon: "🏅",
          }
        : {
            title: "Create your trainer profile",
            text: "Players can't find you until you add your sports, city and price.",
            href: "/dashboard/trainer-profile",
            icon: "✍️",
          },
      ...(profile
        ? [
            {
              title: "View my public page",
              text: "See your profile the way players see it.",
              href: `/trainers/${profile.id}`,
              icon: "👀",
            },
          ]
        : []),
      { title: "My sessions", text: "Bookings from players are coming soon.", icon: "📅" },
      account,
    ];
  }

  return [
    { title: "Find a trainer", text: "Search by sport and city.", href: "/trainers", icon: "🔍" },
    { title: "Browse sports", text: "See every sport we offer.", href: "/sports", icon: "🏅" },
    { title: "My bookings", text: "Online booking is coming soon.", icon: "📅" },
    account,
  ];
}

function DashboardCard({ card }: { card: Card }) {
  const body = (
    <>
      <span className="text-2xl" aria-hidden>
        {card.icon}
      </span>
      <span className="font-semibold">{card.title}</span>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{card.text}</span>
    </>
  );
  const className = "flex flex-col gap-2 rounded-xl border p-5";
  if (!card.href) {
    return (
      <div className={`${className} border-dashed border-zinc-300 opacity-70 dark:border-zinc-700`}>
        {body}
      </div>
    );
  }
  return (
    <Link
      href={card.href}
      className={`${className} border-zinc-200 transition hover:border-emerald-500 hover:shadow-sm dark:border-zinc-800`}
    >
      {body}
    </Link>
  );
}
