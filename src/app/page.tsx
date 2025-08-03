import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Navbar />
      <HeroSection />
    </main>
  );
}
