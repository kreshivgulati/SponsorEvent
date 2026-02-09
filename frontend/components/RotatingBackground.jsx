'use client'

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "/creators/1.jpeg",
  "/creators/2.png",
  "/creators/3.jpeg",
  "/creators/4.jpeg",
  "/creators/5.jpeg",
  "/creators/6.png",
  "/creators/7.png",
];

export default function RotatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* ROW 1 */}
      <motion.div
        className="flex gap-6 absolute top-16 left-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={220}
            height={140}
            className="rounded-xl object-cover shadow-lg"
          />
        ))}
      </motion.div>

      {/* ROW 2 (reverse direction) */}
      <motion.div
        className="flex gap-6 absolute bottom-16 right-0"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 45,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={220}
            height={140}
            className="rounded-xl object-cover shadow-lg"
          />
        ))}
      </motion.div>
    </div>
  );
}
