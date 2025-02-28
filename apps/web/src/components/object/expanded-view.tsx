import { Objects } from "@/types/objects";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export default function ExpandedView({ item }: { item: Objects }) {
  return (
    <SheetContent side={"right"} className="">
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
        <SheetDescription>{item.description}</SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
