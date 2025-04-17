
import Hero from "@/components/home/hero";
import { Section } from "@/components/home/section";
import Footer from "@/components/home/footer";

const PageContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Section className="flex flex-col gap-y-24">
          <Hero />
        </Section>
      </div>
      <Footer />
    </div>
  );
};

export default PageContent;
