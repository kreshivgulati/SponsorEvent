'use client'
import ProblemSection from "./ProblemSection";

import RotatingBackground from "./RotatingBackground"
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
     

      {/* Main Hero Section */}
      <section className="relative overflow-hidden text-white py-20 px-4">

      <div className="absolute inset-0 bg-gradient-to-b from-[#0E86B6] to-[#064F74] hero-animated-bg opacity-100 pointer-events-none" />
      <div className="max-w-7xl mx-auto text-center relative z-10">
      <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.h1 variants={fadeUp} className="text-5xl  md:text-6xl font-bold mb-6">
              Connect Events with Perfect Sponsors
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Eliminate manual outreach. Automate sponsorship matching. Grow your events faster.
            </motion.p>
            <motion.div
              variants={stagger}
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp}>
                <Link href="/signup" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/events" className="btn-secondary bg-primary-500 text-white hover:bg-primary-400">
                  Browse Events
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Hero Section with Rotating Background */}
      <section className="relative h-[600px] bg-[#f4fff9] flex items-center justify-center overflow-hidden">
        <RotatingBackground />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent pointer-events-none" />
      </section>
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
className="text-4xl text-white font-bold text-center mb-12"
variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Why SponsorMatch?
          </motion.h2>
          <div className="grid text-white md:grid-cols-3 gap-8">            {[
              { icon: '🚀', title: 'Automated Matching', desc: "AI-powered matching connects you with sponsors that align with your event's goals and audience." },
              { icon: '📊', title: 'Smart Analytics', desc: 'Track sponsorship performance, engagement metrics, and ROI all in one dashboard.' },
              { icon: '🤝', title: 'Streamlined Process', desc: 'No more spreadsheets or cold calls. Manage everything from one platform.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="card text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 25px 40px -24px rgba(14,165,233,0.4)' }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <ProblemSection />

      {/* Stats Section */}
      <section className="bg-primary-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Events Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-gray-600">Active Sponsors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">₹16 Cr+</div>
              <div className="text-gray-600">Sponsorship Value</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Match Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl text-white font-bold mb-6">Ready to Transform Your Events?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of organizers and sponsors already using SponsorMatch
          </p>
          <Link href="/signup" className="btn-primary text-lg px-8 py-4">
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}


