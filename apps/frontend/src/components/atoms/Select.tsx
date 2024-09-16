import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const SelectBox = (): JSX.Element => {
  return (
    <Select>
      <SelectTrigger className="max-w-[240px]">
        <SelectValue placeholder="oliursahin@gmail.com" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="oliursahin">oliursahin@gmail.com</SelectItem>
      </SelectContent>
    </Select>
  )
}
