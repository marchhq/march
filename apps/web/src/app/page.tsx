import Hero from "@/components/home/hero";
import { Section } from "@/components/home/section";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center pt-24 md:pt-0">
      <PageContent />
    </div>
  );
}

export const PageContent = () => {
  return (
    <>
      <Section className="flex flex-col gap-y-24">
        <Hero />
      </Section>
    </>
  );
};
