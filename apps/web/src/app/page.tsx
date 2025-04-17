// import Hero from "@/components/home/hero";
// import { Section } from "@/components/home/section";

// export const PageContent = () => {
//   return (
//     <>
//       <Section className="flex flex-col gap-y-24">
//         <Hero />
//       </Section>
//     </>
//   );
// };

// export default function Home() {
//   return (
//     <div className="flex w-full flex-col items-center pt-24 md:pt-0">
//       <PageContent />
//     </div>
//   );
// }



import PageContent from "@/components/home/page-content";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center pt-24 md:pt-0">
      <PageContent />
    </div>
  );
}