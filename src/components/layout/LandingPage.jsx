import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  BarChart3,
  Wallet,
  Bell,
  Smartphone,
  Download,
  Play,
} from "lucide-react";
import { Link } from "react-scroll";

export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 flex justify-between items-center px-10 py-5">
        <div className="flex items-center space-x-2">
          <img
            src="/wisenergylogo.png"
            alt="WisEnergy Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-[#24924B]">WisEnergy</h1>
        </div>
        <ul className="flex space-x-10 text-gray-700 font-medium">
          <li>
            <Link
              to="home"
              smooth
              duration={500}
              className="cursor-pointer hover:text-[#24924B]"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="features"
              smooth
              duration={500}
              className="cursor-pointer hover:text-[#24924B]"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              to="about"
              smooth
              duration={500}
              className="cursor-pointer hover:text-[#24924B]"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="contact"
              smooth
              duration={500}
              className="cursor-pointer hover:text-[#24924B]"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* HOME SECTION */}
      <section
        id="home"
        className="h-screen bg-cover bg-center flex flex-col justify-center px-10 md:px-20 pt-32 md:pt-40"
        style={{
          backgroundImage: "url('/LandingPagebg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight drop-shadow-sm">
            EMPOWER YOUR HOME WITH{" "}
            <span className="text-[#24924B] border-2 border-[#24924B] px-2">
              WISENERGY
            </span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <h3 className="text-lg md:text-xl font-semibold mt-6 text-gray-800">
              Transforming the Way You Use Energy
            </h3>
            <p className="text-gray-700 mt-3 leading-relaxed">
              WisEnergy helps households track appliance power usage in real
              time through IoT and AI. It provides insights, savings tips, and
              bill forecasts—empowering families to manage electricity
              efficiently and sustainably.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex space-x-4 pt-6"
          >
            <button className="flex items-center gap-2 bg-[#24924B] text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-transform duration-300 shadow-md">
              <Download className="w-5 h-5" />
              Download Now
            </button>
            <button className="flex items-center gap-2 border border-[#24924B] text-[#24924B] px-6 py-3 rounded-md font-semibold hover:bg-[#E8F6EF] transition">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="py-24 px-10 md:px-20 bg-cover bg-center text-gray-800"
        style={{
          backgroundImage: "url('/FeaturesBg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-[#24924B] mb-16"
        >
          WisEnergy Features
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "Zap",
              title: "Real-Time Monitoring",
              text: "Track live energy use from every connected appliance instantly.",
            },
            {
              icon: "Cpu",
              title: "AI Insights",
              text: "Get smart recommendations to improve efficiency and cut costs.",
            },
            {
              icon: "BarChart3",
              title: "Usage Reports",
              text: "Visualize your energy trends with clear daily, weekly, and monthly charts.",
            },
            {
              icon: "Wallet",
              title: "Budget & Forecasts",
              text: "Set monthly goals and predict upcoming bills with accuracy.",
            },
            {
              icon: "Bell",
              title: "Smart Alerts",
              text: "Receive notifications for energy-saving tips, budget notifications, over-budget warnings, and unusual consumption detections",
            },
            {
              icon: "Smartphone",
              title: "Mobile Access",
              text: "Monitor and control your home’s energy anytime, anywhere.",
            },
          ].map((f, i) => {
            const icons = { Zap, Cpu, BarChart3, Wallet, Bell, Smartphone };
            const Icon = icons[f.icon];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-[#24924B]" />
                </div>
                <h3 className="text-lg font-semibold text-[#24924B] mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-24 px-10 md:px-20 bg-[#F9FAFB]">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center text-[#24924B] mb-16"
        >
          Meet the WisEnergy Team
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Gerard Luis B. Mandado",
              role: "Hustler",
              img: "/Gerard.png",
            },
            {
              name: "Darin Jan D. Soriano",
              role: "Hacker",
              img: "/Darin.png",
            },
            {
              name: "Jholmer L. Damayo",
              role: "Tester",
              img: "/Jholmer.png",
            },
            {
              name: "Raily D. Sungahid",
              role: "Hipster",
              img: "/Raily.png",
            },
            {
              name: "Twinky Casidsid",
              role: "Project Manager",
              img: "/Twinky.png",
            },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#24924B] mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-[#24924B] font-medium text-sm mt-1">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-24 px-10 md:px-20 bg-cover bg-center text-black text-center"
        style={{
          backgroundImage: "url('/FeaturesBg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-8 drop-shadow-md"
        >
          Get in Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-lg mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow"
        >
          Have questions, feedback, or partnership inquiries? We’d love to hear
          from you and help you get started with WisEnergy.
        </motion.p>

        <motion.a
          href="mailto:support@wisenergy.io"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-white text-[#24924B] font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#E8F6EF] hover:scale-105 transition-transform"
        >
          Email Us: support@wisenergy.io
        </motion.a>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} WisEnergy. All rights reserved.
      </footer>
    </div>
  );
}
