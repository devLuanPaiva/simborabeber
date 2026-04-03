import { Benefit } from "@/components/landing/Benefit";
import { Categories } from "@/components/landing/Categories";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WaveCard } from "@/components/ui/weveCard";

export default function HomePage() {
  return (
    <div>
      <main className="min-h-screen overflow-x-hidden bg-white">
        <section className="pt-10 w-full h-auto bg-[#fef2e4da] pb-32">
          <div className="w-11/12 max-w-7xl mx-auto p-0 ">
            <Navbar />
            <Hero />
          </div>
        </section>
        <div className="-mt-32 relative mx-auto w-11/12 max-w-7xl ">
          <Features />
        </div>
        <section className="-mt-32 pt-48 pb-8 bg-white w-full space-y-24">
          <HowItWorks />
          <Categories />
        </section>
        <section className="py-8 w-full h-auto bg-[#fef2e4da] ">
          <Benefit />
        </section>
      </main>
      <WaveCard />
      <Footer />
    </div>
  );
}
