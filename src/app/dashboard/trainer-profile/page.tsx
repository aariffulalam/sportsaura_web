import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { TextSkeleton } from "@/components/Skeleton";
import { getCurrentUser } from "@/features/auth/current-user";
import { getAccessToken } from "@/features/auth/session";
import { TrainerProfileForm } from "@/features/trainers/components/TrainerProfileForm";
import { getMyTrainerProfile, listSports } from "@/lib/trainer-service";

export const metadata: Metadata = { title: "My trainer profile · SportsAura" };

export default function TrainerProfilePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-zinc-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-semibold tracking-tight">My trainer profile</h1>
      <Suspense fallback={<TextSkeleton />}>
        <ProfileEditor />
      </Suspense>
    </main>
  );
}

async function ProfileEditor() {
  const user = await getCurrentUser();
  const token = await getAccessToken();
  if (!user || !token) {
    redirect("/login?next=/dashboard/trainer-profile");
  }
  if (user.role !== "TRAINER") {
    return (
      <p role="alert" className="text-zinc-600 dark:text-zinc-400">
        Only trainer accounts have a trainer profile.
      </p>
    );
  }

  const [profile, sports] = await Promise.all([getMyTrainerProfile(token), listSports()]);
  return <TrainerProfileForm profile={profile} sports={sports} accountName={user.name} />;
}
