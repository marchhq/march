import { Objects } from "@/types/objects";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Editor from "../editor/editor";
import React from "react";
import { useUpdateObject } from "@/hooks/use-objects";
import { debounce } from "lodash";
import { TitleTextarea } from "./title-textarea";

export default function ExpandedView({ item }: { item: Objects }) {
  const { mutate: updateObject } = useUpdateObject();

  const debouncedSave = React.useCallback(
    debounce((content: string) => {
      updateObject({
        _id: item._id,
        description: content,
      });
    }, 1000),
    [item._id, updateObject]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Convert HTML content to plain text for initial value
  const getInitialContent = () => {
    if (!item.description) return defaultValue;

    const plainText = item.description.replace(/<[^>]+>/g, "");

    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: plainText,
            },
          ],
        },
      ],
    };
  };

  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full flex flex-col h-full"
    >
      <SheetHeader className="flex-shrink-0">
        <SheetTitle className="flex items-center justify-between">
          <TitleTextarea
            title={item.title}
            setTitle={(title) => {
              updateObject({ _id: item._id, title });
            }}
          />
        </SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <Editor
          initialValue={getInitialContent()}
          onChange={debouncedSave}
          placeholder="write something..."
        />
      </div>
    </SheetContent>
  );
}

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};
