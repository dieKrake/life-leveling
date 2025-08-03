import CalendarView from "@/components/CalendarView";
import Navbar from "@/components/Navbar";

export default async function Calendar() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Navbar />
      <CalendarView />
    </main>
  );
}
