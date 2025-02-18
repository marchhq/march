import InputBox from "@/components/input/input-box";
import { ListItems } from "./list-items";
import { Separator } from "@/components/ui/separator";

interface Props {
  header: string;
}

export default function ListBlock({ header }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto -mt-1">
      <header className="mb-3">
        <h1 className="font-semibold text-xl text-gray-900">{header}</h1>
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
