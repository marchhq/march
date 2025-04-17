
import Hero from "@/components/home/hero";
import { Section } from "@/components/home/section";

const PageContent = () => {
  return (
    <Section className="flex flex-col gap-y-24">
      <Hero />
    </Section>
  );
};

export default PageContent;
