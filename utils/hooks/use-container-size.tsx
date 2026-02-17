"use client"
import { useState, useEffect, useRef, type RefObject } from "react"

type Dimensions = {
    width: number
    height: number
}

export function useContainerSize(): [RefObject<HTMLDivElement | null>, Dimensions] {
    const ref = useRef<HTMLDivElement | null>(null)
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 800, height: 600 })

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return

            const { width, height } = entry.contentRect
            setDimensions({ width: Math.round(width), height: Math.round(height) })
        })

        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return [ref, dimensions]
}
