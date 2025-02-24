import InputBox from "@/components/input/input-box";
import { ListItems } from "./list-items";
import { Separator } from "@/components/ui/separator";

interface Props {
  header: string;
}

export default function ListBlock({ header }: Props) {
  return (
    <div className="w-full h-full p-4">
      <header className="mb-4">
        <h1 className="font-medium text-lg text-gray-900">{header}</h1>
      </header>
      <section className="space-y-3">
        <InputBox className="w-full" />
        <Separator className="my-2" />
      </section>
      <section className="pt-2">
        <ListItems />
      </section>
    </div>
  );
}
