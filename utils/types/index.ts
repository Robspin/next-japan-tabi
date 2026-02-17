export type PrefectureProperties = {
  nam: string
  nam_ja: string
  id: number
}

export type PrefectureStyleConfig = {
  default: PrefectureStyle
  hover: PrefectureStyle
  selected: PrefectureStyle
}

export type PrefectureStyle = {
  fill: string
  stroke: string
  strokeWidth: number
  outline?: string
}

export type JapanMapProps = {
  /** Custom styles per prefecture ID — overrides the base styleConfig for that prefecture */
  prefectureStyles?: Record<number, Partial<PrefectureStyleConfig>>
  /** Base style config applied to all prefectures */
  styleConfig?: PrefectureStyleConfig
  /** Currently selected prefecture IDs (controlled) */
  selected?: number[]
  /** Called when a prefecture is clicked */
  onPrefectureClick?: (prefecture: PrefectureProperties) => void
  /** Called on hover enter */
  onPrefectureHover?: (prefecture: PrefectureProperties | null) => void
  /** Allow selecting multiple prefectures */
  multiSelect?: boolean
  /** Min zoom level */
  minZoom?: number
  /** Max zoom level */
  maxZoom?: number
  /** Map width */
  width?: number
  /** Map height */
  height?: number
  /** Additional class name for the wrapper */
  className?: string
}
