import { Block } from "@/components/blocks/block";
import GridWrapper from "@/components/wrappers/grid-wrapper";
import ListBlock from "@/components/blocks/list/list";
import { CalendarBlock } from "@/components/blocks/calendar/calendar";
import { CalendarProvider } from "@/contexts/calendar-context";

export default function Today() {
  return (
    <section className="h-full pl-12">
      <div className="w-full h-[calc(100vh-64px)] overflow-auto">
        <div className="max-w-4xl">
          <Block id="list-and-calendar" arrayType="today">
            <GridWrapper>
              <ListBlock header="Today" arrayType="today" />
              <CalendarProvider>
                <CalendarBlock />
              </CalendarProvider>
            </GridWrapper>
          </Block>
        </div>
      </div>
    </section>
  );
}
