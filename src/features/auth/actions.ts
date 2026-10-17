"use server";

import { redirect } from "next/navigation";

import { safeRedirectPath, toFormState, type AuthFormState } from "@/features/auth/form-state";
import { clearSessionCookies, getRefreshToken, setSessionCookies } from "@/features/auth/session";
import { login, logout, register } from "@/lib/user-service";

export async function loginAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email").trim();
  const password = text(formData, "password");
  const next = safeRedirectPath(formData.get("next"));

  try {
    await setSessionCookies(await login({ email, password }));
  } catch (error) {
    return toFormState(error, { email });
  }
  // redirect() works by throwing, so it must stay outside the try block.
  redirect(next);
}

export async function registerAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: text(formData, "name").trim(),
    email: text(formData, "email").trim(),
    phone: text(formData, "phone").trim(),
    role: text(formData, "role") === "TRAINER" ? "TRAINER" : "USER",
  } as const;

  try {
    const auth = await register({
      ...values,
      phone: values.phone || undefined,
      password: text(formData, "password"),
    });
    await setSessionCookies(auth);
  } catch (error) {
    return toFormState(error, values);
  }
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await logout(refreshToken);
    } catch (error) {
      // The cookies are cleared anyway; an unused refresh token simply expires.
      console.error("Logout call to the user service failed", error);
    }
  }
  await clearSessionCookies();
  redirect("/");
}

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
