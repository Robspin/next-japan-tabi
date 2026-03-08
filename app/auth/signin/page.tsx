"use client"
import { useActionState } from "react"
import { emailSignIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

export default function SignInPage() {
  const [state, action, pending] = useActionState(emailSignIn, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="size-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Japan Travel Log</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a sign-in link.
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending link…" : "Send magic link"}
          </Button>
        </form>
      </div>
    </div>
  )
}
