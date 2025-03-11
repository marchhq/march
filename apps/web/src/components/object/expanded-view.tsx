import { Objects } from "@/types/objects";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Editor from "../editor/editor";
import React from "react";
import { useDeleteObject, useUpdateObject } from "@/hooks/use-objects";
import { debounce } from "lodash";
import { TitleTextarea } from "./title-textarea";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { JSONContent } from "novel";

export default function ExpandedView({ item }: { item: Objects }) {
  const { mutate: updateObject } = useUpdateObject();
  const { mutate: deleteObject } = useDeleteObject();

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

  const getInitialContent = () => {
    if (!item.description) return defaultValue;

    try {
      // Parse stored JSON string
      return typeof item.description === "string"
        ? JSON.parse(item.description)
        : item.description;
    } catch {
      // Fallback for any non-JSON content
      return {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: String(item.description) }],
          },
        ],
      };
    }
  };

  return (
    <SheetContent
      side="right"
      className="sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl w-full flex flex-col h-full"
    >
      <SheetHeader className="flex flex-row items-center justify-between pb-2">
        <SheetTitle className="flex-1">
          <TitleTextarea
            title={item.title}
            setTitle={(title) => {
              updateObject({ _id: item._id, title });
            }}
          />
        </SheetTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            deleteObject({ _id: item._id });
          }}
          className="h-5 w-5 shrink-0 hover:text-red-500 hover:bg-transparent"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
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

export const defaultValue: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};
