import Hero from "@/components/landing/Hero";
import FeaturesHighlight from "@/components/landing/FeaturesHighlight";
import HowItWorks from "@/components/landing/HowItWorks";
import Cta from "@/components/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesHighlight />
      <HowItWorks />
      <Cta />
    </>
  );
}
