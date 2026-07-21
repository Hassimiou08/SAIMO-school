import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SchoolContent } from "@/components/SchoolContent";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SchoolContent />
      <FeaturesGrid />
      <Footer />
    </main>
  );
}
