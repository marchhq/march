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

  console.log("initial content: ", initialContent);

  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full"
    >
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
      </SheetHeader>
      <div className="w-full">
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
