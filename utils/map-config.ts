import type { PrefectureStyleConfig } from "./types"

export const DEFAULT_STYLE_CONFIG: PrefectureStyleConfig = {
  default: {
    fill: "#e8e8e8",
    stroke: "#ffffff",
    strokeWidth: 0.5,
    outline: "none"
  },
  hover: {
    fill: "#c4b5fd",
    stroke: "#ffffff",
    strokeWidth: 0.75,
    outline: "none"
  },
  selected: {
    fill: "#7c3aed",
    stroke: "#ffffff",
    strokeWidth: 1,
    outline: "none"
  }
}

/**
 * The TopoJSON for Japan from dataofjapan/land uses the object key "japan".
 * Each geometry has properties: { nam: string, nam_ja: string, id: number }
 */
export const JAPAN_TOPOJSON_OBJECT_KEY = "japan"

/**
 * Projection config to nicely frame Japan in the viewport.
 * Uses Mercator rotated to center on Japan.
 */
export const JAPAN_PROJECTION_CONFIG = {
  rotate: [-138, -38, 0] as [number, number, number],
  scale: 1600
}
