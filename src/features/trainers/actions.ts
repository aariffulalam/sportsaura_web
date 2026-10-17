"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { toFormState, type AuthFormState } from "@/features/auth/form-state";
import { getAccessToken } from "@/features/auth/session";
import { saveMyTrainerProfile } from "@/lib/trainer-service";

/** Saves the signed-in trainer's profile. The trainer service checks the TRAINER role itself. */
export async function saveTrainerProfileAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login?next=/dashboard/trainer-profile");
  }

  const values = {
    displayName: text(formData, "displayName").trim(),
    headline: text(formData, "headline").trim(),
    bio: text(formData, "bio").trim(),
    city: text(formData, "city").trim(),
    experienceYears: text(formData, "experienceYears"),
    hourlyRateInr: text(formData, "hourlyRateInr"),
  };
  const sportIds = formData
    .getAll("sportIds")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  try {
    await saveMyTrainerProfile(token, {
      ...values,
      experienceYears: toInt(values.experienceYears),
      hourlyRateInr: toInt(values.hourlyRateInr),
      sportIds,
    });
  } catch (error) {
    return toFormState(error, { ...values, sportIds: sportIds.join(",") });
  }

  revalidatePath("/dashboard");
  return { success: "Your trainer profile is saved and visible to players." };
}

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Empty or non-numeric input becomes null, so the trainer service answers "... is required". */
function toInt(value: string): number | null {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? null : number;
}
