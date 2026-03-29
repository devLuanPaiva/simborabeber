import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {

  return (
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
      <section className="-mt-32 pt-48 pb-8 bg-white w-full">
        <HowItWorks />
      </section>
    </main>
  );
}
