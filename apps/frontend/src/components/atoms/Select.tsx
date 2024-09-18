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
}

export const SelectBox = ({ placeholder, item }: Props): JSX.Element => {
  return (
    <Select>
      <SelectTrigger className="max-w-[240px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="oliursahin">{item}</SelectItem>
      </SelectContent>
    </Select>
  )
}
