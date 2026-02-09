"use client";

import Image from "next/image";
import { useState } from "react";

export default function LogoStrip({ title, logos }) {
  return (
    <section className="mt-28">

      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Trusted by leading brands and institutions
        </p>
      </div>

      {/* Framed Container */}
      <div
        className="
          bg-zinc-900/60
          border
          border-zinc-800
          rounded-2xl
          px-8
          py-10
        "
      >
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-8
            items-center
          "
        >
          {logos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Logo Card */
/* ---------------------------------- */

function LogoCard({ logo }) {
  const [error, setError] = useState(false);

  return (
    <div
      className="
        bg-white/95
        backdrop-blur
        rounded-2xl
        h-[72px]
        flex
        items-center
        justify-center
        px-4

        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        hover:-translate-y-[3px]
        hover:scale-[1.03]
      "
    >
      {!error && logo.imageUrl ? (
        <Image
          src={logo.imageUrl}
          alt={logo.name}
          width={150}
          height={60}
          className="object-contain max-h-full max-w-full"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-gray-500 text-xs font-medium">
          {logo.name}
        </span>
      )}
    </div>
  );
}
