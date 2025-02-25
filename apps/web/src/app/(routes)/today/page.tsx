import { Block } from "@/components/blocks/block";
import CalendarBlock from "@/components/blocks/calendar/calendar";
import GridWrapper from "@/components/wrappers/grid-wrapper";
import ListBlock from "@/components/blocks/list/list";

export default function Today() {
  return (
    <section className="h-full pt-2 pl-2 pr-4">
      <Block id="list-and-calendar">
        <GridWrapper>
          <ListBlock header="Today" arrayType="today" />
          <CalendarBlock />
        </GridWrapper>
      </Block>
    </section>
  );
}
