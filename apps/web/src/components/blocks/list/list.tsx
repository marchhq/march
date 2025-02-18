import InputBox from "@/components/input/input-box";
import { ListItems } from "./list-items";
import { Separator } from "@/components/ui/separator";

interface Props {
  header: string;
}

export default function ListBlock({ header }: Props) {
  return (
    <section className="border-2 border-red-500 w-full">
      <header>
        <h1 className="font-medium text-lg mb-4">{header}</h1>
      </header>
      <section className="space-y-3">
        <InputBox />
        <Separator />
      </section>
      <section className="pt-2">
        <ListItems />
      </section>
    </section>
  );
}
