"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, User, ArrowRight, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { href: "/matches", label: "Search Programs" },
  { href: "#", label: "Study Destinations", hasDropdown: true },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/guides", label: "Resources" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group no-underline">
            <div className="w-10 h-10 rounded-xl bg-[#3366FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className={`text-xl font-black tracking-tight transition-colors duration-300 text-[#0f172a]`}>
              Next<span className="text-[#3366FF]">Degree</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`text-[15px] font-bold transition-all flex items-center gap-1.5 hover:text-[#3366FF] ${
                    scrolled ? "text-gray-600" : "text-gray-900"
                  }`}
                >
                  {l.label}
                  {l.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform group-hover:rotate-180 ${scrolled ? "text-gray-400" : "text-gray-400"}`} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/profile"
              className={`p-2 transition-colors ${scrolled ? "text-gray-700 hover:text-[#3366FF]" : "text-gray-700 hover:text-[#3366FF]"}`}
            >
              <User className="w-6 h-6" strokeWidth={2} />
            </Link>

            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 bg-[#3366FF] text-white font-bold px-7 py-3 rounded-2xl text-[15px] shadow-xl shadow-blue-500/25 hover:bg-[#2952CC] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile burger */}
            <button
              className={`lg:hidden w-11 h-11 flex justify-center items-center rounded-2xl border transition-all shadow-sm bg-white border-gray-100 text-gray-900`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-b border-gray-100 bg-white px-6 py-10 flex flex-col gap-6 shadow-2xl animate-fade-in">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-extrabold text-[#0f172a] hover:text-[#3366FF] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#3366FF] text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
