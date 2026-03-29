import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {

  return (
    <main className="min-h-screen overflow-x-hidden">

      <section className="pt-10 w-full  bg-[#fef2e4da]">
        <div className="w-11/12 max-w-7xl mx-auto p-0">

          <Navbar />
          <Hero />
        </div>
      </section>
    </main>
  );
}
