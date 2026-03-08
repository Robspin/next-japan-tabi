"use client"
import { useState, useCallback, useMemo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps"
import type { JapanMapProps, PrefectureProperties, PrefectureStyleConfig } from "@/utils/types"
import {
  DEFAULT_STYLE_CONFIG,
  JAPAN_PROJECTION_CONFIG
} from "@/utils/map-config"
import { useContainerSize } from '@/utils/hooks/use-container-size'

const GEO_URL = "/data/japan.topojson"

/**
 * Scale the projection proportionally to the container.
 * The base scale (1600) was tuned for an 800×600 viewport.
 */
function computeProjectionScale(width: number, height: number): number {
    const base = Math.min(width, height)
    return (base / 600) * JAPAN_PROJECTION_CONFIG.scale
}

export default function JapanMap({
         styleConfig = DEFAULT_STYLE_CONFIG,
         prefectureStyles,
         selected: controlledSelected,
         onPrefectureClick,
         onPrefectureHover,
         multiSelect = false,
         minZoom = 1,
         maxZoom = 8,
         className
     }: JapanMapProps) {
    const [containerRef, { width, height }] = useContainerSize()
    const [internalSelected, setInternalSelected] = useState<number[]>([])
    const selected = controlledSelected ?? internalSelected
    const isControlled = controlledSelected !== undefined

    const projectionConfig = useMemo(() => ({
        rotate: JAPAN_PROJECTION_CONFIG.rotate,
        scale: computeProjectionScale(width, height)
    }), [width, height])

  const handleClick = useCallback(
    (geo: { properties: PrefectureProperties }) => {
      const props = geo.properties

      if (!isControlled) {
        setInternalSelected((prev) => {
          const isAlreadySelected = prev.includes(props.id)

          if (multiSelect) {
            return isAlreadySelected
              ? prev.filter((id) => id !== props.id)
              : [...prev, props.id]
          }

          return isAlreadySelected ? [] : [props.id]
        })
      }

      onPrefectureClick?.(props)
    },
    [isControlled, multiSelect, onPrefectureClick]
  )

  const handleMouseEnter = useCallback(
    (geo: { properties: PrefectureProperties }) => {
      onPrefectureHover?.(geo.properties)
    },
    [onPrefectureHover]
  )

  const handleMouseLeave = useCallback(() => {
    onPrefectureHover?.(null)
  }, [onPrefectureHover])

  const getStyleForPrefecture = useCallback(
    (prefectureId: number, isSelected: boolean): PrefectureStyleConfig => {
      const overrides = prefectureStyles?.[prefectureId]
      const base = isSelected ? styleConfig.selected : styleConfig.default
      const hoverBase = isSelected ? styleConfig.selected : styleConfig.hover

      if (!overrides) {
        return {
          default: base,
          hover: hoverBase,
          selected: styleConfig.selected
        }
      }

      return {
        default: { ...base, ...(isSelected ? overrides.selected : overrides.default) },
        hover: { ...hoverBase, ...(isSelected ? overrides.selected : overrides.hover) },
        selected: { ...styleConfig.selected, ...overrides.selected }
      }
    },
    [styleConfig, prefectureStyles]
  )

  return (
      <div
          ref={containerRef}
          className={className}
          style={{ width: "100%", height: "100%" }}
      >
          {width > 0 && height > 0 && (
              <ComposableMap
                  projection="geoMercator"
                  projectionConfig={projectionConfig}
                  width={width}
                  height={height}
                  style={{ width: "100%", height: "100%" }}
              >
                  <ZoomableGroup
                      minZoom={minZoom}
                      maxZoom={maxZoom}
                  >
                      <Geographies geography={GEO_URL}>
                          {({ geographies }) =>
                              geographies.map((geo) => {
                                  const props = geo.properties as PrefectureProperties
                                  const isSelected = selected.includes(props.id)
                                  const styles = getStyleForPrefecture(props.id, isSelected)

                                  return (
                                      <Geography
                                          key={geo.rsmKey}
                                          geography={geo}
                                          onClick={() => handleClick(geo as { properties: PrefectureProperties })}
                                          onMouseEnter={() =>
                                              handleMouseEnter(geo as { properties: PrefectureProperties })
                                          }
                                          onMouseLeave={handleMouseLeave}
                                          style={{
                                              default: {
                                                  fill: styles.default.fill,
                                                  stroke: styles.default.stroke,
                                                  strokeWidth: styles.default.strokeWidth,
                                                  outline: styles.default.outline ?? "none",
                                                  cursor: "pointer",
                                                  transition: "fill 0.2s ease"
                                              },
                                              hover: {
                                                  fill: styles.hover.fill,
                                                  stroke: styles.hover.stroke,
                                                  strokeWidth: styles.hover.strokeWidth,
                                                  outline: styles.hover.outline ?? "none",
                                                  cursor: "pointer",
                                                  transition: "fill 0.2s ease"
                                              },
                                              pressed: {
                                                  fill: styles.selected.fill,
                                                  stroke: styles.selected.stroke,
                                                  strokeWidth: styles.selected.strokeWidth,
                                                  outline: styles.selected.outline ?? "none",
                                                  cursor: "pointer"
                                              }
                                          }}
                                      />
                                  )
                              })
                          }
                      </Geographies>
                  </ZoomableGroup>
              </ComposableMap>
          )}
      </div>
  )
}
