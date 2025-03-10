import { Objects } from "@/types/objects";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Editor from "../editor/editor";

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export default function ExpandedView({ item }: { item: Objects }) {
  // Convert plain text description to JSONContent format
  const initialContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: item.description
          ? [
              {
                type: "text",
                text: item.description,
              },
            ]
          : [],
      },
    ],
  };

  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full flex flex-col h-full"
    >
      <SheetHeader className="flex-shrink-0">
        <SheetTitle>{item.title}</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <Editor
          initialValue={initialContent}
          onChange={(content) => {
            console.log(content);
          }}
          placeholder="write something..."
        />
      </div>
    </SheetContent>
  );
}
