import { Objects } from "@/types/objects";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Editor } from "../editor/editor";

export default function ExpandedView({ item }: { item: Objects }) {
  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full"
    >
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
      </SheetHeader>
      <Editor
        initialValue={item.description}
        onChange={(content) => {
          console.log(content);
        }}
      />
    </SheetContent>
  );
}
