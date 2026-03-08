import { auth } from "@/auth"
import { db } from "@/db"
import { prefectureVisits } from "@/db/schema"
import { eq } from "drizzle-orm"
import { MapApp } from "@/components/components/map-app"

export default async function Page() {
  const session = await auth()

  const initialDbVisits = session?.user?.id
    ? await db
        .select({
          prefectureId: prefectureVisits.prefectureId,
          visitedAt: prefectureVisits.visitedAt,
          notes: prefectureVisits.notes,
        })
        .from(prefectureVisits)
        .where(eq(prefectureVisits.userId, session.user.id))
    : null

  return <MapApp session={session} initialDbVisits={initialDbVisits} />
}
