"use client";

import InputBox from "@/components/input/input-box";
import { ListItems } from "./list-items";
import { BlockProvider } from "@/contexts/block-context";
import { useCreateObject } from "@/hooks/use-objects";
import { CreateObject } from "@/types/objects";

interface Props {
  header: string;
  arrayType: "inbox" | "today";
}

export default function ListBlock({ header, arrayType }: Props) {
  const { mutate: createObject } = useCreateObject();

  const handleSubmit = (data: CreateObject) => {
    createObject(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto -mt-1">
      <BlockProvider arrayType={arrayType}>
        <header className="pt-3 pb-2 mb-2 px-0">
          <h1 className="font-semibold text-xl text-gray-900">{header}</h1>
        </header>
        <section className="space-y-3">
          <InputBox
            className="w-full"
            onSubmit={handleSubmit}
            arrayType={arrayType}
          />
        </section>
        <section className="pt-1">
          <ListItems />
        </section>
      </BlockProvider>
    </div>
  );
}
