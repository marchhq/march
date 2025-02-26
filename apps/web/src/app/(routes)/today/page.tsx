import { Block } from "@/components/blocks/block";
import GridWrapper from "@/components/wrappers/grid-wrapper";
import ListBlock from "@/components/blocks/list/list";
import { CalendarBlock } from "@/components/blocks/calendar/calendar";
import { CalendarProvider } from "@/contexts/calendar-context";

export default function Today() {
  return (
    <section className="pt-2 pl-2 pr-4">
      <Block id="list-and-calendar">
        <GridWrapper>
          <ListBlock header="Today" arrayType="today" />
          <CalendarProvider>
            <CalendarBlock />
          </CalendarProvider>
        </GridWrapper>
      </Block>
    </section>
  );
}
