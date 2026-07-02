import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhyTarus } from "@/components/sections/WhyTarus";
import { Specializace } from "@/components/sections/Specializace";
import { CentralniSklad } from "@/components/sections/CentralniSklad";
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
  const skladImages = getSectionImages("sklad");
  const brandImages = getSectionImages("brands");
  const specializaceImages = getSectionImages("specializace");
  const tarusImages = getSectionImages("tarus");
  const navLogoSrc = tarusImages.find((f) => f.includes("bile")) ?? null;
  const wordmarkSrc = tarusImages.find((f) => f.includes("bez domecku")) ?? null;
  const footerLogoSrc = tarusImages.find((f) => f.includes("kompletní")) ?? null;

  return (
    <ContactModalProvider>
      <Navbar logoSrc={navLogoSrc} />
      <main id="main">
        <Hero images={heroImages} />
        <WhyTarus wordmarkSrc={wordmarkSrc} />
        <Specializace images={specializaceImages} />
        <CentralniSklad images={skladImages} />
        <OFirme images={aboutImages} />
        <NaseCesta />
        <Brands images={brandImages} />
        <FinalCta />
      </main>
      <Footer logoSrc={footerLogoSrc} />
    </ContactModalProvider>
  );
}
