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
  Quote,
  Brain,
  Clipboard,
} from "lucide-react";
import { Link } from "react-scroll";
import { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText("support@wisenergy.io");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="font-sans bg-white text-gray-800 overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 flex justify-between items-center px-6 md:px-10 py-4">
        <div className="flex items-center space-x-2">
          <img
            src="/wisenergylogo.png"
            alt="WisEnergy Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-[#24924B]">WisEnergy</h1>
        </div>

        {/* Hamburger icon */}
        <button
          className="md:hidden text-[#24924B] focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {["home", "features", "about", "testimonials", "contact"].map(
            (id) => (
              <li key={id}>
                <Link
                  to={id}
                  smooth
                  duration={500}
                  className="cursor-pointer hover:text-[#24924B]"
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Mobile menu */}
        {menuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
            {["home", "features", "about", "testimonials", "contact"].map(
              (id) => (
                <li key={id}>
                  <Link
                    to={id}
                    smooth
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                    className="cursor-pointer text-gray-700 hover:text-[#24924B]"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </nav>

      {/* HOME SECTION */}
      <section
        id="home"
        className="h-screen flex flex-col justify-center px-6 md:px-20 pt-28 md:pt-36 bg-cover bg-center"
        style={{
          backgroundImage: "url('/LandingPagebg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            EMPOWER YOUR HOME WITH{" "}
            <span className="text-[#24924B] border-2 border-[#24924B] px-2">
              WISENERGY
            </span>
          </h2>
          <p className="text-gray-700 mt-4 md:text-lg leading-relaxed">
            WisEnergy helps households track real-time appliance energy use
            through IoT and AI, providing insights, savings tips, and bill
            forecasts for smarter, sustainable living.
          </p>
          <div className="flex flex-wrap gap-4 pt-6">
            <button className="flex items-center gap-2 bg-[#24924B] text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-transform duration-300 shadow-md">
              <Download className="w-5 h-5" />
              Download Now
            </button>
            <button className="flex items-center gap-2 border border-[#24924B] text-[#24924B] px-6 py-3 rounded-md font-semibold hover:bg-[#E8F6EF] transition">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>
      {/* SECTION DIVIDER */}
      <div className="relative w-full overflow-hidden leading-none">
        <svg
          className="absolute block w-full h-12 text-[#24924B]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,69.3C672,43,768,21,864,21.3C960,21,1056,43,1152,69.3C1248,96,1344,128,1392,144L1440,160V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0Z"
          ></path>
        </svg>
      </div>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="relative py-24 px-6 md:px-20 text-gray-800 bg-cover bg-center"
        style={{
          backgroundImage: "url('/FeaturesBg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F6EF]/95 via-[#F3FAF6]/90 to-[#E0F5E9]/95"></div>

        <div className="relative z-10 max-w-[90rem] mx-auto text-center px-4 sm:px-8 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-[#24924B]"
          >
            What Makes WisEnergy Unique?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 mt-4 max-w-5xl mx-auto leading-relaxed px-4"
          >
            WisEnergy is a mobile app that combines AI and IoT to help
            households monitor and optimize electricity use in real time. It
            provides live appliance tracking, bill estimates, and smart insights
            to promote efficiency and sustainability. Designed for users in
            Mandaue and Lapu-Lapu City, it offers intuitive tools, automated
            reports, and instant alerts—all within a secure, cloud-connected
            system.
          </motion.p>

          {/* FIRST ROW (4 cards) */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-Time Monitoring",
                text: "IoT sensors display live appliance voltage, current, and power for real-time tracking.",
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                text: "Analyzes energy patterns to detect inefficiencies and provide smart, personalized saving tips.",
              },
              {
                icon: BarChart3,
                title: "Smart Usage Reports",
                text: "Visual dashboards summarize daily, weekly, and monthly consumption trends.",
              },
              {
                icon: Wallet,
                title: "Budget & Forecasts",
                text: "Estimates your monthly bill based on real-time usage and local electricity rates.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F6EF] p-4 rounded-full">
                      <Icon className="w-8 h-8 text-[#24924B]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.text}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* SECOND ROW (3 cards, centered) */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {[
              {
                icon: Bell,
                title: "Smart Alerts",
                text: "Receive warnings for unusual consumption, over-budget usage, and energy spikes.",
              },
              {
                icon: Smartphone,
                title: "Mobile App Access",
                text: "Monitor and optimize from your smartphone — anytime, anywhere.",
              },
              {
                icon: Cpu,
                title: "Plug-and-Play Setup",
                text: "Simply plug in the WisEnergy device, link via the app, and start tracking instantly.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-8 w-full sm:w-[45%] lg:w-[30%] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F6EF] p-4 rounded-full">
                      <Icon className="w-8 h-8 text-[#24924B]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-24 px-6 md:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#24924B] mb-6">
          Meet the WisEnergy Team
        </h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-relaxed">
          The WisEnergy team is composed of passionate innovators dedicated to
          building smarter, more efficient solutions for everyday households.
          Each member brings unique skills in software development, design,
          testing, and leadership—working together to make sustainable living
          accessible through technology.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Gerard Luis B. Mandado",
              role: "Hustler",
              img: "/Gerard.png",
            },
            { name: "Darin Jan D. Soriano", role: "Hacker", img: "/Darin.png" },
            {
              name: "Twinky Casidsid",
              role: "Project Manager",
              img: "/Twinky.png",
              center: true,
            },
            { name: "Jholmer L. Damayo", role: "Tester", img: "/Jholmer.png" },
            { name: "Raily D. Sungahid", role: "Hipster", img: "/Raily.png" },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all ${
                member.center
                  ? "lg:col-span-1 lg:scale-110 border-2 border-gray-200"
                  : ""
              }`}
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

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="relative py-24 px-6 md:px-20 text-gray-800 bg-cover bg-center"
        style={{
          backgroundImage: "url('/FeaturesBg.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* overlay for readability — matches Features/Contact */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F6EF]/95 via-[#F3FAF6]/90 to-[#E0F5E9]/95"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#24924B] mb-16">
            What People Say About WisEnergy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Lopez",
                feedback:
                  "WisEnergy changed how we track our power usage. I now understand which appliances consume the most!",
              },
              {
                name: "John Reyes",
                feedback:
                  "The AI insights are amazing. I saved around 15% on my electric bill within the first month.",
              },
              {
                name: "Ella Tan",
                feedback:
                  "Clean interface, fast updates, and reliable data. Definitely a must-have for every household.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition-all"
              >
                <Quote className="w-8 h-8 text-[#24924B] mx-auto mb-4" />
                <p className="text-gray-700 italic mb-4">"{t.feedback}"</p>
                <h4 className="font-semibold text-[#24924B]">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-24 px-6 md:px-20 bg-cover bg-center text-center"
        style={{
          backgroundImage: "url('/ContactBg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#24924B]">
          Get in Touch
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-700">
          Have questions or feedback? We’d love to hear from you. Reach out and
          start your WisEnergy journey today.
        </p>
        <button
          onClick={copyEmail}
          className="flex items-center justify-center gap-3 mx-auto bg-white text-[#24924B] font-semibold px-8 py-3 rounded-full shadow-md border border-[#D9F3E3] hover:bg-[#E8F6EF] hover:scale-105 transition-transform duration-300"
        >
          <Clipboard className="w-5 h-5" />
          {copied ? "Copied!" : "support@wisenergy.io"}
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center bg-[#24924B] text-white text-sm">
        © {new Date().getFullYear()} WisEnergy. All rights reserved.
      </footer>
    </div>
  );
}
