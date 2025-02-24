import { Block } from "@/components/blocks/block";
import CalendarBlock from "@/components/blocks/calendar/calendar";
import ListBlock from "@/components/blocks/list/list";
import GridWrapper from "@/components/wrappers/grid-wrapper";

export default function Today() {
  return (
    <Block id="list-and-calendar">
      <GridWrapper>
        <ListBlock header="Today" arrayType="today" />
        <CalendarBlock />
      </GridWrapper>
    </Block>
  );
}
