import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhyTarus } from "@/components/sections/WhyTarus";
import { Specializace } from "@/components/sections/Specializace";
import { Realizace } from "@/components/sections/Realizace";
import { OFirme } from "@/components/sections/OFirme";
import { NaseCesta } from "@/components/sections/NaseCesta";
import { Brands } from "@/components/sections/Brands";
import { FinalCta } from "@/components/sections/FinalCta";
import { ContactModalProvider } from "@/components/ContactModal";
import { getSectionImages } from "@/lib/getSectionImages";

export default function Home() {
  // Runs server-side: reads /public/images/{section}/ at build/request time.
  // Folders need not exist — getSectionImages returns [] for missing dirs.
  const heroImages = getSectionImages("hero");
  const aboutImages = getSectionImages("about");
  const realizaceImages = getSectionImages("realizace");
  const brandImages = getSectionImages("brands");
  const specializaceImages = getSectionImages("specializace");

  return (
    <ContactModalProvider>
      <Navbar />
      <main id="main">
        <Hero images={heroImages} />
        <WhyTarus />
        <Specializace images={specializaceImages} />
        <Realizace images={realizaceImages} />
        <OFirme images={aboutImages} />
        <NaseCesta />
        <Brands images={brandImages} />
        <FinalCta />
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
