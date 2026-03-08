"use client"
import { useState, useCallback, useEffect } from "react"
import { PrefectureVisit } from "@/utils/types"

const STORAGE_KEY = "jpn-prefectures-visits"

type VisitMap = Record<number, PrefectureVisit>

function loadFromStorage(): VisitMap {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data: VisitMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useVisitedPrefectures() {
  const [visits, setVisits] = useState<VisitMap>({})

  useEffect(() => {
    setVisits(loadFromStorage())
  }, [])

  const toggleVisited = useCallback((id: number) => {
    setVisits((prev) => {
      const current = prev[id]
      const updated: VisitMap = {
        ...prev,
        [id]: current?.visited
          ? { ...current, visited: false }
          : { id, visited: true, visitedAt: undefined, notes: undefined },
      }
      saveToStorage(updated)
      return updated
    })
  }, [])

  const updateVisit = useCallback((id: number, changes: Partial<Pick<PrefectureVisit, "visitedAt" | "notes">>) => {
    setVisits((prev) => {
      const updated: VisitMap = {
        ...prev,
        [id]: { ...prev[id], id, visited: true, ...changes },
      }
      saveToStorage(updated)
      return updated
    })
  }, [])

  const visitedIds = Object.values(visits)
    .filter((v) => v.visited)
    .map((v) => v.id)

  return { visits, visitedIds, toggleVisited, updateVisit }
}
