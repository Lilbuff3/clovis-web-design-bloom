import { Marquee, Nav, SunCursor } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { FourSeconds } from "./components/FourSeconds";
import { Harvest } from "./components/Harvest";
import { Compare, Season } from "./components/Season";
import { FAQ, Grower, Letters, Stand } from "./components/Story";
import { Contact, Footer } from "./components/Contact";
import { useGlobalReveal } from "./lib/hooks";
import { PHONE_DISPLAY, SMS_LINK } from "./lib/data";

function MobileTextBar() {
  return (
    <a
      href={SMS_LINK}
      className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-full bg-ink py-2 pl-5 pr-2 text-cream shadow-2xl sm:hidden"
    >
      <span className="text-[15px]">Text Adam · {PHONE_DISPLAY}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-persimmon">→</span>
    </a>
  );
}

export default function App() {
  useGlobalReveal();
  return (
    <div className="grain relative">
      <SunCursor />
      <Nav />
      <main>
        <Hero />
        <Marquee
          className="bg-persimmon text-cream"
          items={["$500 landing pages", "Live in a week", "100/100 PageSpeed", "You own the code", "No monthly hostage fees", "English + Español", "Your cell, not a ticket queue"]}
        />
        <FourSeconds />
        <Harvest />
        <Season />
        <Compare />
        <Grower />
        <Stand />
        <Letters />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <MobileTextBar />
    </div>
  );
}
