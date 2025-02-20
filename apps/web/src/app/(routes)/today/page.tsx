import CalendarBlock from "@/components/blocks/calendar/calendar";
import GridWrapper from "@/components/wrappers/grid-wrapper";
import ListBlock from "@/components/blocks/list/list";

export default function Today() {
  return (
    <section className="h-full pt-2 pl-2 pr-4">
      <GridWrapper>
        <ListBlock header="Inbox" />
        <CalendarBlock />
      </GridWrapper>
    </section>
  );
}
