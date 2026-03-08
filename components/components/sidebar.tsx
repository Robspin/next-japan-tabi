"use client"
import * as React from "react"
import { MapPin, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { PREFECTURES } from "@/utils/prefectures"
import { PrefectureVisit } from "@/utils/types"

type Props = React.ComponentProps<typeof SidebarComponent> & {
  visits: Record<number, PrefectureVisit>
  onToggleVisit: (id: number) => void
  onEdit: (id: number) => void
}

export function Sidebar({ visits, onToggleVisit, onEdit, ...props }: Props) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return PREFECTURES.filter(
      (p) => p.nam.toLowerCase().includes(q) || p.nam_ja.includes(search)
    )
  }, [search])

  const visitedCount = Object.values(visits).filter((v) => v.visited).length

  return (
    <SidebarComponent variant="floating" {...props}>
      <SidebarHeader className="pb-2">
        <div className="flex items-center gap-2 px-1 py-1">
          <MapPin className="size-5 shrink-0 text-primary" />
          <div className="flex flex-col leading-none">
            <span className="font-semibold text-sm">Japan Travel Log</span>
            <span className="text-muted-foreground text-xs">
              {visitedCount} / {PREFECTURES.length} visited
            </span>
          </div>
        </div>
        <div className="px-1 pt-1">
          <Input
            placeholder="Search prefectures…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pb-20">
          <SidebarGroupLabel>Prefectures</SidebarGroupLabel>
          <ul className="flex flex-col gap-0.5 px-1">
            {filtered.map((p) => {
              const visit = visits[p.id]
              const visited = visit?.visited ?? false
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent group"
                >
                  <Checkbox
                    id={`pref-${p.id}`}
                    checked={visited}
                    onCheckedChange={() => onToggleVisit(p.id)}
                  />
                  <label
                    htmlFor={`pref-${p.id}`}
                    className="flex-1 cursor-pointer select-none text-sm leading-none"
                  >
                    <span className={visited ? "font-medium" : "text-muted-foreground"}>
                      {p.nam}
                    </span>{" "}
                    <span className="text-xs text-muted-foreground">{p.nam_ja}</span>
                    {visit?.visitedAt && (
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {new Date(visit.visitedAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    )}
                  </label>
                  <button
                    onClick={() => onEdit(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-sidebar-accent-foreground/10"
                    title="Edit details"
                  >
                    <Pencil className="size-3.5 text-muted-foreground" />
                  </button>
                </li>
              )
            })}
          </ul>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  )
}
