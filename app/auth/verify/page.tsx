import { MailOpen } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-sm text-center">
        <div className="flex justify-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <MailOpen className="size-5 text-primary" />
          </div>
        </div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          A sign-in link has been sent to your email address. Click it to continue.
        </p>
        <p className="text-xs text-muted-foreground">
          You can close this tab.
        </p>
      </div>
    </div>
  )
}
