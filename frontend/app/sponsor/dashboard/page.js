"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import EventCard from "@/components/EventCard";
import LogoStrip from "@/components/LogoStrip";
import { mockEvents, mockOrganizerLogos } from "@/lib/mockData";

/* ================= SLIDES (Sponsor-focused) ================= */

const slides = [
  {
    image: "/images/1.png",
    title: "Secure Transactions",
    description:
      "Your privacy is our priority. We use the latest encryption technology to protect your data and sponsorship payments.",
    button: "LEARN MORE",
    target: "secure-transactions",
  },
  {
    image: "/images/2.png",
    title: "Connect with Organizers",
    description:
      "Reach the right events and negotiate sponsorship deals that match your brand goals.",
    button: "FIND EVENTS",
    target: "connect-sponsors",
  },
  {
    image: "/images/3.png",
    title: "Find Events",
    description:
      "Discover thousands of targeted sponsorship opportunities aligned with your audience.",
    button: "EXPLORE EVENTS",
    target: "find-events",
  },
];

/* ================= SLIDER ================= */

function SimpleSlider({ currentIndex }) {
  return (
    <div className="relative w-full max-w-2xl aspect-[16/9] mx-auto">
      <Image
        src={slides[currentIndex].image}
        alt="Slide"
        fill
        className="object-contain rounded-xl shadow-lg"
        priority
      />
    </div>
  );
}

/* ================= MAIN ================= */

export default function SponsorDashboard() {
  const recommendedEvents = mockEvents.slice(0, 3);
  const [index, setIndex] = useState(0);

  /* Auto Slide */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /* Scroll Handler */
  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    const yOffset = -80;
    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col
        text-gray-900

        bg-gradient-to-b
        from-[#F8FBFF]
        via-white
        to-[#F3F7FF]
      "
    >
      <Navbar />

      <div className="flex flex-1">
        <Sidebar type="sponsor" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">

            {/* ================= HERO ================= */}

            <section
              className="
                relative
                overflow-hidden
                rounded-2xl
                p-12
                mb-20

                bg-gradient-to-br
                from-[#021024]
                via-[#052659]
                to-[#5483B3]

                ring-1 ring-white/10
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 -z-10">

                <div
                  className="
                    absolute
                    top-[-20%]
                    left-[-10%]
                    w-[420px]
                    h-[420px]
                    bg-[#7DA0CA]/40
                    rounded-full
                    blur-[140px]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[-20%]
                    right-[-10%]
                    w-[420px]
                    h-[420px]
                    bg-[#C1E8FF]/40
                    rounded-full
                    blur-[140px]
                  "
                />

              </div>

              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">

                {/* Left */}
                <div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-5 text-white">
                    {slides[index].title}
                  </h1>

                  <p className="text-lg leading-relaxed text-[#C1E8FF]/90 max-w-xl">
                    {slides[index].description}
                  </p>

                  <button
                    onClick={() => scrollToSection(slides[index].target)}
                    className="
                      mt-7
                      px-7 py-3
                      rounded-lg
                      font-semibold

                      bg-[#C1E8FF]
                      text-[#021024]

                      hover:bg-white
                      transition
                      shadow-lg
                    "
                  >
                    {slides[index].button}
                  </button>

                </div>

                {/* Right */}
                <SimpleSlider currentIndex={index} />

              </div>

              {/* Dots */}
              <div className="flex justify-center mt-8 relative z-10">

                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`cursor-pointer mx-1 text-xl transition ${
                      i === index
                        ? "text-[#C1E8FF]"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    ●
                  </span>
                ))}

              </div>
            </section>

            {/* ================= FEATURE BAR ================= */}

            <div className="bg-white px-8 py-4 mb-6 flex items-center justify-between rounded-md shadow">

              <div className="flex gap-6 text-sm font-medium">

                <button
                  onClick={() => scrollToSection("find-events")}
                  className="hover:text-indigo-500 transition"
                >
                  FIND EVENTS
                </button>

                <span className="text-gray-300">|</span>

                <button
                  onClick={() => scrollToSection("connect-sponsors")}
                  className="hover:text-indigo-500 transition"
                >
                  CONNECT & NEGOTIATE
                </button>

                <span className="text-gray-300">|</span>

                <button
                  onClick={() => scrollToSection("secure-transactions")}
                  className="hover:text-indigo-500 transition"
                >
                  PRIVACY & PAYMENTS
                </button>

              </div>

              <button
                onClick={() => scrollToSection("find-events")}
                className="
                  bg-indigo-600
                  text-white
                  px-5 py-2
                  text-sm
                  font-semibold
                  rounded
                  hover:bg-indigo-700
                  transition
                "
              >
                REGISTER FOR FREE
              </button>

            </div>

            {/* ================= SECTION 1 ================= */}

            <section id="secure-transactions" className="py-24">
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div>

                  <h2 className="text-3xl font-bold mb-4">
                    Secure Payments & Privacy
                  </h2>

                  <p className="text-gray-700 leading-relaxed">
                    Pay securely on the platform. Communicate, negotiate, and
                    complete sponsorship deals with full transparency.
                  </p>

                </div>

                <Image
                  src="/images/1.png"
                  alt=""
                  width={500}
                  height={300}
                  className="rounded-lg shadow"
                />

              </div>
            </section>

            {/* ================= SECTION 2 ================= */}

            <section id="connect-sponsors" className="py-24">
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <Image
                  src="/images/2.png"
                  alt=""
                  width={500}
                  height={300}
                  className="rounded-lg shadow"
                />

                <div>

                  <h2 className="text-3xl font-bold mb-4">
                    Connect with Organizers
                  </h2>

                  <p className="text-gray-700 leading-relaxed">
                    Message organizers directly and negotiate sponsorship
                    terms that fit your brand.
                  </p>

                </div>

              </div>
            </section>

            {/* ================= SECTION 3 ================= */}

            <section id="find-events" className="py-24">
              <div className="grid md:grid-cols-2 gap-10 items-center">

                <div>

                  <h2 className="text-3xl font-bold mb-4">
                    Discover Sponsorship Opportunities
                  </h2>

                  <p className="text-gray-700 leading-relaxed">
                    Browse events filtered by category, location, and budget
                    to find the right fit for your brand.
                  </p>

                </div>

                <Image
                  src="/images/3.png"
                  alt=""
                  width={500}
                  height={300}
                  className="rounded-lg shadow"
                />

              </div>
            </section>

            {/* ================= RECOMMENDED EVENTS ================= */}

            <div className="mb-8">

              <div className="flex justify-between mb-6">

                <h2 className="text-2xl font-bold">
                  Recommended Events
                </h2>

                <Link
                  href="/sponsor/events"
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  View All →
                </Link>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {recommendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}

              </div>

            </div>

            {/* ================= LOGOS ================= */}

            <LogoStrip
              title="Event Organizers"
              logos={mockOrganizerLogos}
            />

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}