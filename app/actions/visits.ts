"use server"
import { and, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { prefectureVisits } from "@/db/schema"

export type VisitPayload = {
  visitedAt?: string
  notes?: string
}

export async function getVisits() {
  const session = await auth()
  if (!session?.user?.id) return null

  return db
    .select()
    .from(prefectureVisits)
    .where(eq(prefectureVisits.userId, session.user.id))
}

export async function upsertVisit(prefectureId: number, data: VisitPayload) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const [existing] = await db
    .select({ id: prefectureVisits.id })
    .from(prefectureVisits)
    .where(
      and(
        eq(prefectureVisits.userId, session.user.id),
        eq(prefectureVisits.prefectureId, prefectureId)
      )
    )
    .limit(1)

  if (existing) {
    await db
      .update(prefectureVisits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(prefectureVisits.id, existing.id))
  } else {
    await db.insert(prefectureVisits).values({
      userId: session.user.id,
      prefectureId,
      ...data,
    })
  }
}

export async function deleteVisit(prefectureId: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db
    .delete(prefectureVisits)
    .where(
      and(
        eq(prefectureVisits.userId, session.user.id),
        eq(prefectureVisits.prefectureId, prefectureId)
      )
    )
}

/** Called after sign-in to sync localStorage visits into the DB. */
export async function syncLocalVisits(
  localVisits: Array<{ prefectureId: number } & VisitPayload>
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  for (const v of localVisits) {
    await upsertVisit(v.prefectureId, {
      visitedAt: v.visitedAt,
      notes: v.notes,
    })
  }
}
