import CalendarBlock from "@/components/blocks/calendar/calendar";
import ListBlock from "@/components/blocks/list/list";
import GridWrapper from "@/components/wrappers/grid-wrapper";

export default function Today() {
  return (
    <section>
      <GridWrapper>
        <ListBlock header="Today" />
        <CalendarBlock />
      </GridWrapper>
    </section>
  );
}
