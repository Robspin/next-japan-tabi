"use client"

import { useState, useCallback } from "react"
import JapanMap from "@/components/japan-map"
import { PrefectureProperties, PrefectureStyleConfig } from '@/utils/types'

/** Example region groupings — swap these colors for your own theme */
const REGION_COLORS: Record<string, string> = {
  hokkaido: "#93c5fd",
  tohoku: "#86efac",
  kanto: "#fca5a5",
  chubu: "#fde68a",
  kansai: "#c4b5fd",
  chugoku: "#fdba74",
  shikoku: "#67e8f9",
  kyushu: "#f9a8d4"
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
  45: "kyushu", 46: "kyushu", 47: "kyushu"
}

function buildRegionStyles(): Record<number, Partial<PrefectureStyleConfig>> {
  const styles: Record<number, Partial<PrefectureStyleConfig>> = {}

  for (const [idStr, region] of Object.entries(PREFECTURE_REGIONS)) {
    const id = Number(idStr)
    const color = REGION_COLORS[region]

    styles[id] = {
      default: {
        fill: color,
        stroke: "#ffffff",
        strokeWidth: 0.5
      }
    }
  }

  return styles
}

export default function JapanMapPage() {
  const [hovered, setHovered] = useState<PrefectureProperties | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [colorByRegion, setColorByRegion] = useState(true)

  const regionStyles = buildRegionStyles()

  const handleClick = useCallback((prefecture: PrefectureProperties) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.includes(prefecture.id)
      return isAlreadySelected
        ? prev.filter((id) => id !== prefecture.id)
        : [...prev, prefecture.id]
    })
  }, [])

  const handleHover = useCallback((prefecture: PrefectureProperties | null) => {
    setHovered(prefecture)
  }, [])

  return (
      <div
          style={{
              position: "fixed",
              inset: 0,
              overflow: "hidden",
              background: "#f8fafc"
          }}
      >
          <JapanMap
              selected={selected}
              onPrefectureClick={handleClick}
              onPrefectureHover={handleHover}
              multiSelect
              prefectureStyles={colorByRegion ? regionStyles : undefined}
              styleConfig={{
                  default: {
                      fill: "#e5e7eb",
                      stroke: "#ffffff",
                      strokeWidth: 0.5
                  },
                  hover: {
                      fill: "#a78bfa",
                      stroke: "#ffffff",
                      strokeWidth: 0.75
                  },
                  selected: {
                      fill: "#7c3aed",
                      stroke: "#ffffff",
                      strokeWidth: 1
                  }
              }}
          />

          {/* Overlay: tooltip (top-left) */}
          {hovered && (
              <div
                  style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      padding: "0.4rem 0.75rem",
                      borderRadius: 6,
                      fontSize: "0.875rem",
                      pointerEvents: "none",
                      zIndex: 10
                  }}
              >
                  <span style={{ fontWeight: 600 }}>{hovered.nam_ja}</span>
                  {" "}
                  <span style={{ opacity: 0.7 }}>({hovered.nam})</span>
              </div>
          )}

          {/* Overlay: controls (bottom-left) */}
          <div
              style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  zIndex: 10
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
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
                  }}
              >
                  {colorByRegion ? "Regions: ON" : "Regions: OFF"}
              </button>

              {selected.length > 0 && (
                  <button
                      onClick={() => setSelected([])}
                      style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: 6,
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
                      }}
                  >
                      Clear ({selected.length})
                  </button>
              )}
          </div>
      </div>
  )
}
