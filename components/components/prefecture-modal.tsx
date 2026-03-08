"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PrefectureInfo } from "@/utils/prefectures"
import { PrefectureVisit } from "@/utils/types"

type Props = {
  prefecture: PrefectureInfo | null
  visit: PrefectureVisit | undefined
  open: boolean
  onClose: () => void
  onSave: (id: number, changes: Partial<Pick<PrefectureVisit, "visitedAt" | "notes">>) => void
}

export function PrefectureModal({ prefecture, visit, open, onClose, onSave }: Props) {
  const [date, setDate] = useState(visit?.visitedAt ?? "")
  const [notes, setNotes] = useState(visit?.notes ?? "")

  useEffect(() => {
    setDate(visit?.visitedAt ?? "")
    setNotes(visit?.notes ?? "")
  }, [visit, open])

  if (!prefecture) return null

  function handleSave() {
    onSave(prefecture!.id, {
      visitedAt: date || undefined,
      notes: notes || undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {prefecture.nam_ja}{" "}
            <span className="text-muted-foreground font-normal text-base">({prefecture.nam})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visited-date">Date visited</Label>
            <input
              id="visited-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Write about your visit, memories, highlights…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
