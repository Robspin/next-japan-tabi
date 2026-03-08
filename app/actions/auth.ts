"use server"
import { AuthError } from "next-auth"
import { signIn, signOut } from "@/auth"

export async function emailSignIn(_: unknown, formData: FormData) {
  try {
    await signIn("resend", {
      email: formData.get("email") as string,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Could not send sign-in email. Please try again." }
    }
    throw error // re-throw redirects so Next.js can handle them
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}
