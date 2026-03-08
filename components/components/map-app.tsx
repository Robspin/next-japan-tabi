"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import type { Session } from "next-auth"
import JapanMap from "@/components/components/japan-map"
import { Sidebar } from "@/components/components/sidebar"
import { PrefectureModal } from "@/components/components/prefecture-modal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PrefectureProperties, PrefectureStyleConfig, PrefectureVisit } from "@/utils/types"
import { useVisitedPrefectures } from "@/hooks/use-visited-prefectures"
import { PREFECTURE_BY_ID } from "@/utils/prefectures"
import { upsertVisit, deleteVisit, syncLocalVisits } from "@/app/actions/visits"

const STORAGE_KEY = "jpn-prefectures-visits"

const REGION_COLORS: Record<string, string> = {
  hokkaido: "#93c5fd",
  tohoku:   "#86efac",
  kanto:    "#fca5a5",
  chubu:    "#fde68a",
  kansai:   "#c4b5fd",
  chugoku:  "#fdba74",
  shikoku:  "#67e8f9",
  kyushu:   "#f9a8d4",
}

const PREFECTURE_REGIONS: Record<number, string> = {
  1: "hokkaido",
  2: "tohoku", 3: "tohoku", 4: "tohoku", 5: "tohoku", 6: "tohoku", 7: "tohoku",
  8: "kanto", 9: "kanto", 10: "kanto", 11: "kanto", 12: "kanto", 13: "kanto", 14: "kanto",
  15: "chubu", 16: "chubu", 17: "chubu", 18: "chubu", 19: "chubu", 20: "chubu",
  21: "chubu", 22: "chubu", 23: "chubu",
  24: "kansai", 25: "kansai", 26: "kansai", 27: "kansai", 28: "kansai", 29: "kansai", 30: "kansai",
  31: "chugoku", 32: "chugoku", 33: "chugoku", 34: "chugoku", 35: "chugoku",
  36: "shikoku", 37: "shikoku", 38: "shikoku", 39: "shikoku",
  40: "kyushu", 41: "kyushu", 42: "kyushu", 43: "kyushu", 44: "kyushu",
  45: "kyushu", 46: "kyushu", 47: "kyushu",
}

function buildRegionStyles(): Record<number, Partial<PrefectureStyleConfig>> {
  const styles: Record<number, Partial<PrefectureStyleConfig>> = {}
  for (const [idStr, region] of Object.entries(PREFECTURE_REGIONS)) {
    const color = REGION_COLORS[region]
    styles[Number(idStr)] = {
      default: { fill: color, stroke: "#ffffff", strokeWidth: 0.5 },
    }
  }
  return styles
}

const regionStyles = buildRegionStyles()

type DbVisit = { prefectureId: number; visitedAt: string | null; notes: string | null }
type VisitMap = Record<number, PrefectureVisit>

function dbVisitsToMap(visits: DbVisit[]): VisitMap {
  return Object.fromEntries(
    visits.map((v) => [
      v.prefectureId,
      {
        id: v.prefectureId,
        visited: true,
        visitedAt: v.visitedAt ?? undefined,
        notes: v.notes ?? undefined,
      },
    ])
  )
}

type Props = {
  session: Session | null
  initialDbVisits: DbVisit[] | null
}

export function MapApp({ session, initialDbVisits }: Props) {
  const isAuth = !!session?.user
  const syncedRef = useRef(false)

  // --- Guest state (localStorage) ---
  const localStore = useVisitedPrefectures()

  // --- Authenticated state (DB-backed) ---
  const [dbVisits, setDbVisits] = useState<VisitMap>(() =>
    initialDbVisits ? dbVisitsToMap(initialDbVisits) : {}
  )

  // Post-login sync: if the user just signed in and has local data, push it to DB
  useEffect(() => {
    if (!isAuth || syncedRef.current) return
    syncedRef.current = true

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const localMap = JSON.parse(raw) as VisitMap
      const toSync = Object.values(localMap).filter((v) => v.visited)
      if (toSync.length === 0) return

      syncLocalVisits(
        toSync.map((v) => ({ prefectureId: v.id, visitedAt: v.visitedAt, notes: v.notes }))
      ).then(() => {
        window.localStorage.removeItem(STORAGE_KEY)
        setDbVisits((prev) => {
          const merged = { ...prev }
          for (const v of toSync) merged[v.id] = v
          return merged
        })
      })
    } catch {
      // ignore parse errors
    }
  }, [isAuth])

  // --- Unified interface ---
  const visits = isAuth ? dbVisits : localStore.visits

  const visitedIds = Object.values(visits)
    .filter((v) => v.visited)
    .map((v) => v.id)

  const toggleVisited = useCallback(
    (id: number) => {
      if (isAuth) {
        setDbVisits((prev) => {
          const isVisited = prev[id]?.visited ?? false
          const updated = { ...prev, [id]: { ...prev[id], id, visited: !isVisited } }
          if (isVisited) {
            deleteVisit(id)
          } else {
            upsertVisit(id, {})
          }
          return updated
        })
      } else {
        localStore.toggleVisited(id)
      }
    },
    [isAuth, localStore]
  )

  const updateVisit = useCallback(
    (id: number, changes: Partial<Pick<PrefectureVisit, "visitedAt" | "notes">>) => {
      if (isAuth) {
        setDbVisits((prev) => ({
          ...prev,
          [id]: { ...prev[id], id, visited: true, ...changes },
        }))
        upsertVisit(id, changes)
      } else {
        localStore.updateVisit(id, changes)
      }
    },
    [isAuth, localStore]
  )

  // --- UI state ---
  const [hovered, setHovered] = useState<PrefectureProperties | null>(null)
  const [colorByRegion, setColorByRegion] = useState(true)
  const [modalPrefectureId, setModalPrefectureId] = useState<number | null>(null)

  const handleMapClick = useCallback(
    (prefecture: PrefectureProperties) => toggleVisited(prefecture.id),
    [toggleVisited]
  )

  const handleHover = useCallback((prefecture: PrefectureProperties | null) => {
    setHovered(prefecture)
  }, [])

  const handleEdit = useCallback(
    (id: number) => {
      setModalPrefectureId(id)
      if (!visits[id]?.visited) toggleVisited(id)
    },
    [visits, toggleVisited]
  )

  const modalPrefecture = modalPrefectureId != null ? PREFECTURE_BY_ID[modalPrefectureId] : null
  const modalVisit = modalPrefectureId != null ? visits[modalPrefectureId] : undefined

  return (
    <SidebarProvider style={{ "--sidebar-width": "19rem" } as React.CSSProperties}>
      <Sidebar
        visits={visits}
        onToggleVisit={toggleVisited}
        onEdit={handleEdit}
        session={session}
      />
      <SidebarInset>
        <div
          style={{
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            background: "#f8fafc",
          }}
        >
          <JapanMap
            selected={visitedIds}
            onPrefectureClick={handleMapClick}
            onPrefectureHover={handleHover}
            multiSelect
            prefectureStyles={colorByRegion ? regionStyles : undefined}
            styleConfig={{
              default:  { fill: "#e5e7eb", stroke: "#ffffff", strokeWidth: 0.5 },
              hover:    { fill: "#a78bfa", stroke: "#ffffff", strokeWidth: 0.75 },
              selected: { fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 1 },
            }}
          />

          {hovered && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: "0.4rem 0.75rem",
                borderRadius: 6,
                fontSize: "0.875rem",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <span style={{ fontWeight: 600 }}>{hovered.nam_ja}</span>{" "}
              <span style={{ opacity: 0.7 }}>({hovered.nam})</span>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              display: "flex",
              gap: "0.5rem",
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setColorByRegion((v) => !v)}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                background: colorByRegion ? "#7c3aed" : "#fff",
                color: colorByRegion ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: "0.875rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              {colorByRegion ? "Regions: ON" : "Regions: OFF"}
            </button>
          </div>
        </div>
      </SidebarInset>

      <PrefectureModal
        prefecture={modalPrefecture ?? null}
        visit={modalVisit}
        open={modalPrefectureId !== null}
        onClose={() => setModalPrefectureId(null)}
        onSave={updateVisit}
      />
    </SidebarProvider>
  )
}
