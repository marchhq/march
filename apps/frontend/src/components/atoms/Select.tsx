import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface Props {
  placeholder: string
  item: string
  item2?: string
}

export const SelectBox = ({ placeholder, item, item2 }: Props): JSX.Element => {
  return (
    <Select>
      <SelectTrigger className="max-w-[240px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="oliursahin">{item}</SelectItem>
        <SelectItem value="oliursahin">{item2}</SelectItem>
      </SelectContent>
    </Select>
  )
}
