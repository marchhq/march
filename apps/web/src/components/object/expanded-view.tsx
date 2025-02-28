import { Objects } from "@/types/objects";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

export default function ExpandedView({ item }: { item: Objects }) {
  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full"
    >
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
        <SheetDescription>{item.description}</SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
