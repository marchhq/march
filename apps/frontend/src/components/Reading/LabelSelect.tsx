import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useReadingStore from "@/src/lib/store/reading.store"
import { type ReadingLabelName } from "@/src/lib/@types/Items/Reading"

type ExtendedReadingLabel = ReadingLabelName | "all"

interface ReadingListSelectProps {
  selectedLabel: ExtendedReadingLabel
  setSelectedLabel: (label: ExtendedReadingLabel) => void
}

const ReadingListSelect: React.FC<ReadingListSelectProps> = ({
  selectedLabel,
  setSelectedLabel,
}) => {
  const { labels } = useReadingStore()

  const handleLabelChange = (value: string) => {
    setSelectedLabel(value as ExtendedReadingLabel)
  }

  return (
    <div className="fixed top-[7%] left-[7%] mb-4">
      <Select
        onValueChange={handleLabelChange}
        defaultValue={selectedLabel || "all"}
      >
        <SelectTrigger className="flex items-center justify-between w-[120px] px-2 py-6 !bg-background !border-none">
          <SelectValue placeholder="Select a label" className="w-full" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="flex items-center justify-between">
            <span className="inline-block w-4 h-4 rounded-full mr-2 border-2"></span>
            <span className="text-base">All</span>
          </SelectItem>
          {labels.map((label) => (
            <SelectItem
              key={label._id}
              value={label.name}
              className="flex items-center justify-between"
            >
              <span
                className="inline-block w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: label.color }}
              ></span>
              <span className="text-base">{label.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ReadingListSelect
