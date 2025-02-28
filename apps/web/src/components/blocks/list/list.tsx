"use client";

import InputBox from "@/components/input/input-box";
import { ListItems } from "./list-items";
import { BlockProvider } from "@/contexts/block-context";
import { useCreateObject } from "@/hooks/use-objects";
import { CreateObject } from "@/types/objects";

interface Props {
  header?: string;
  arrayType: "inbox" | "today";
}

export default function ListBlock({ arrayType }: Props) {
  const { mutate: createObject } = useCreateObject();

  const handleSubmit = (data: CreateObject) => {
    createObject(data);
  };

  return (
    <div className="w-full mx-auto">
      <BlockProvider arrayType={arrayType}>
        <section className="space-y-3 px-4 pt-2">
          <InputBox
            className="w-full"
            onSubmit={handleSubmit}
            arrayType={arrayType}
          />
        </section>
        <section className="pt-3 px-4">
          <ListItems />
        </section>
      </BlockProvider>
    </div>
  );
}
