"use client";

import { useActionState } from "react";

import { FormField } from "@/components/FormField";
import { FormMessage } from "@/components/FormMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { saveTrainerProfileAction } from "@/features/trainers/actions";
import type { Sport, Trainer } from "@/lib/trainer-service";

type Props = {
  /** The saved profile, or null for a trainer who has not created one yet. */
  profile: Trainer | null;
  sports: Sport[];
  /** Used as the default display name for a new profile. */
  accountName: string;
};

export function TrainerProfileForm({ profile, sports, accountName }: Props) {
  const [state, action] = useActionState(saveTrainerProfileAction, undefined);
  const values = state?.values;
  const errors = state?.errors ?? {};
  const selected = new Set(
    values?.sportIds !== undefined
      ? values.sportIds.split(",").filter(Boolean).map(Number)
      : (profile?.sports.map((sport) => sport.id) ?? []),
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage message={state?.message} />
      {state?.success ? (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
        >
          {state.success}
        </p>
      ) : null}

      <FormField
        label="Display name"
        name="displayName"
        required
        maxLength={100}
        defaultValue={values?.displayName ?? profile?.displayName ?? accountName}
        error={errors.displayName}
      />
      <FormField
        label="Headline"
        name="headline"
        required
        maxLength={150}
        placeholder="e.g. AIFF D-licensed football coach"
        defaultValue={values?.headline ?? profile?.headline}
        error={errors.headline}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          About you
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          maxLength={2000}
          rows={5}
          defaultValue={values?.bio ?? profile?.bio}
          aria-invalid={errors.bio ? true : undefined}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {errors.bio ? <p className="text-sm text-red-600">{errors.bio}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          label="City"
          name="city"
          required
          maxLength={100}
          defaultValue={values?.city ?? profile?.city}
          error={errors.city}
        />
        <FormField
          label="Experience (years)"
          name="experienceYears"
          type="number"
          required
          min={0}
          max={60}
          defaultValue={values?.experienceYears ?? profile?.experienceYears}
          error={errors.experienceYears}
        />
        <FormField
          label="Hourly rate (₹)"
          name="hourlyRateInr"
          type="number"
          required
          min={100}
          max={100000}
          step={50}
          defaultValue={values?.hourlyRateInr ?? profile?.hourlyRateInr}
          error={errors.hourlyRateInr}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">Sports you teach (up to 5)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sports.map((sport) => (
            <label key={sport.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="sportIds"
                value={sport.id}
                defaultChecked={selected.has(sport.id)}
                className="accent-emerald-600"
              />
              {sport.icon} {sport.name}
            </label>
          ))}
        </div>
        {errors.sportIds ? <p className="text-sm text-red-600">{errors.sportIds}</p> : null}
      </fieldset>

      <SubmitButton label={profile ? "Save changes" : "Create profile"} pendingLabel="Saving…" />
    </form>
  );
}
