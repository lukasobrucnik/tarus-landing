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

export default function Home() {
  return (
    <ContactModalProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <WhyTarus />
        <Specializace />
        <Realizace />
        <OFirme />
        <NaseCesta />
        <Brands />
        <FinalCta />
      </main>
      <Footer />
    </ContactModalProvider>
  );
}
