"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  Users2,
  Menu,
  X,
  PhoneCall,
  Inbox,
  Sparkles,
  Star
} from "lucide-react";
import { MOCK_PROPERTIES, MockPropertyDoc } from "@/lib/data/mockProperties";
import HeroScrollAnimation from "@/components/hero/HeroScrollAnimation";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom Easing
const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Stagger Reveal Variants
const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easePremium }
  }
};

const FEATURED_PROPERTIES = MOCK_PROPERTIES.filter(p => p.featured);
const LATEST_LISTINGS = MOCK_PROPERTIES.filter(p => !p.featured);

const ACCORDIONS = [
  {
    id: 0,
    title: "Verified Listings",
    icon: ShieldCheck,
    content: "Every property on RentEase undergoes a rigorous verification process. We verify ownership records, check physical conditions, and validate listing details so you can rent with 100% confidence, avoiding scams entirely."
  },
  {
    id: 1,
    title: "Easy & AI-Powered Search",
    icon: Search,
    content: "Our advanced search engine goes beyond simple filters. Save custom searches, map precise neighborhoods, and receive instant push notifications the second a property matching your lifestyle hit the market."
  },
  {
    id: 2,
    title: "Direct Owner Contact",
    icon: Users2,
    content: "Cut out high brokerage fees and middlemen. Chat directly with verified owners, schedule viewings, negotiate terms, sign digital lease agreements, and manage monthly rent payments securely—all in one dashboard."
  }
];

export default function Home() {
  const { userDoc, loading } = useAuth();
  const [expanded, setExpanded] = useState<{
    property: MockPropertyDoc;
    rect: { top: number; left: number; width: number; height: number };
  } | null>(null);

  const openCard = (property: MockPropertyDoc, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setExpanded({
      property,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    });
  };

  const closeCard = () => setExpanded(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const colossalTextRef = useRef<HTMLDivElement>(null);
  const footerSectionRef = useRef<HTMLDivElement>(null);

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);

  // Sync sessionStorage for intro skip state on mount/client-navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("hasSeenIntro");
      if (hasSeen || document.documentElement.classList.contains("skip-intro")) {
        setSkipIntro(true);
        document.documentElement.classList.add("skip-intro");
      }
    }
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);



  // Initialize GSAP Footer Animation
  useEffect(() => {
    if (!colossalTextRef.current || !footerSectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        colossalTextRef.current,
        {
          opacity: 0.05,
          scale: 0.8,
          y: 80,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          scrollTrigger: {
            trigger: footerSectionRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Horizontal Carousel Navigation Controls
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative overflow-hidden">

      {/* A. Sticky Header / Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#050505]/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            Rent<span className="text-brand-green">Ease</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#featured" className="hover:text-brand-green transition-colors duration-200">Featured</Link>
            <Link href="#confidence" className="hover:text-brand-green transition-colors duration-200">Confidence</Link>
            <Link href="#categories" className="hover:text-brand-green transition-colors duration-200">Categories</Link>
            <Link href="/properties" className="hover:text-brand-green transition-colors duration-200">Listings</Link>
            <Link href="#contact" className="hover:text-brand-green transition-colors duration-200">Contact</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-9 bg-white/5 rounded-full animate-pulse" />
            ) : userDoc ? (
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-green hover:shadow-[0_0_15px_rgba(0,200,83,0.15)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand-green/5 to-brand-green/10 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                  <span>Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 ease-premium group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-green" />
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-green hover:shadow-[0_0_15px_rgba(0,200,83,0.2)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand-green/10 to-brand-green/20 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 ease-premium group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-green" />
                </span>
              </Link>
            )}

            <Link
              href="/properties"
              className="group relative inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300 hover:bg-brand-green hover:text-black hover:shadow-[0_0_20px_rgba(0,200,83,0.3)]"
            >
              <span>Explore Listings</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-brand-green transition-colors p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: easePremium }}
              className="absolute top-20 left-0 w-full bg-[#0a0a0a] border-b border-white/5 py-8 px-6 flex flex-col gap-6 md:hidden"
            >
              <Link
                href="#featured"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-brand-green transition-colors"
              >
                Featured
              </Link>
              <Link
                href="#confidence"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-brand-green transition-colors"
              >
                Confidence
              </Link>
              <Link
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-brand-green transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-brand-green transition-colors"
              >
                Listings
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-brand-green transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-brand-green text-black py-4 rounded-full font-bold text-base"
              >
                <span>Explore Listings</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {loading ? (
                <div className="w-full h-12 bg-white/5 rounded-full animate-pulse" />
              ) : userDoc ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 border border-brand-green/30 text-white py-4 rounded-full font-bold text-base hover:bg-brand-green/10 transition-colors"
                >
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-4 rounded-full font-bold text-base hover:bg-white/5 transition-colors"
                >
                  <span>Login</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* A. Cinematic Scroll Hero Animation */}
      <HeroScrollAnimation />

      {/* B. Featured Properties (Horizontal Carousel) */}
      <section id="featured" className="py-24 border-b border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header Row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">Curated Selection</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Featured Properties</h2>
            </div>

            {/* Custom Carousel Buttons */}
            <div className="flex gap-4 self-start md:self-auto">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-brand-green hover:border-brand-green transition-all duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-black hover:bg-brand-green hover:border-brand-green transition-all duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
          >
            {FEATURED_PROPERTIES.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: easePremium }}
                className="min-w-[280px] sm:min-w-[360px] md:min-w-[420px] snap-start"
              >
                <div
                  onClick={(e) => openCard(property, e.currentTarget)}
                  className="cursor-pointer group block bg-[#0d0d0d] border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden transition-all duration-300"
                >
                  {/* Image Container with scale-on-hover interaction */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-brand-green">
                      {property.tag}
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-brand-green transition-colors duration-300 line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="text-lg font-extrabold text-brand-green whitespace-nowrap">${property.price.toLocaleString()}/mo</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-white/50 mb-6">
                      <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span className="truncate">{property.location}, {property.city}</span>
                    </div>

                    {/* Attributes */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-brand-green" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-brand-green" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-brand-green" />
                        <span>{property.areaSqFt.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* C. Rent With Confidence (Accordion) */}
      <section id="confidence" className="py-24 border-b border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left Header Panel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={revealVariants}
              className="lg:col-span-5"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">Seamless Operations</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Rent With Confidence.
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-8">
                We remove the traditional frictions from rental discovery and leasing by providing direct, automated, and secure interactions between verified parties.
              </p>

              {/* Extra visual element */}
              <div className="hidden lg:block relative h-40 w-full rounded-2xl overflow-hidden border border-white/5">
                <Image
                  src="/hero_background.png"
                  alt="Architecture Details"
                  fill
                  className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-[#00C853]/10 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-center">
                    <span className="text-2xl font-extrabold text-brand-green block">0%</span>
                    <span className="text-xs text-white/60">Broker Commissions</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Accordion List */}
            <div className="lg:col-span-7 divide-y divide-white/10">
              {ACCORDIONS.map((item) => {
                const IconComponent = item.icon;
                const isOpen = activeAccordion === item.id;

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                      className="w-full flex items-center justify-between text-left py-4 group focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`p-3 rounded-2xl transition-all duration-300 ${isOpen ? "bg-brand-green text-black" : "bg-white/5 text-white/70 group-hover:bg-white/10"}`}>
                          <IconComponent className="w-6 h-6" />
                        </span>
                        <span className="text-xl md:text-2xl font-bold text-white group-hover:text-brand-green transition-colors duration-300">
                          {item.title}
                        </span>
                      </div>

                      {/* Plus icon rotated */}
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: easePremium }}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-300 ${isOpen ? "border-brand-green text-brand-green" : "border-white/10 text-white/40 group-hover:border-white/30"}`}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.div>
                    </button>

                    {/* Smooth AnimatePresence Accordion Content Height */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: easePremium }}
                          className="overflow-hidden"
                        >
                          <div className="pl-[76px] pr-4 pb-4 pt-2">
                            <p className="text-white/60 font-light leading-relaxed text-base">
                              {item.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* D. Visual Navigation ("What are you looking for?") */}
      <section id="categories" className="py-24 border-b border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">Discover By Type</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">What are you looking for?</h2>
            <p className="text-white/60 max-w-xl mx-auto font-light">Explore properties categorized by structural style and modern design elements.</p>
          </motion.div>

          {/* Categories Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Villa Estates", type: "villa", count: "48 Listings", image: "/property_villa.png" },
              { title: "Urban Apartments", type: "apartment", count: "112 Listings", image: "/property_apartment.png" },
              { title: "Sky Penthouses", type: "penthouse", count: "24 Listings", image: "/property_penthouse.png" }
            ].map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: easePremium }}
                className="group relative h-96 rounded-3xl overflow-hidden border border-white/5"
              >
                <Link href={`/properties?type=${cat.type}`} className="block w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover brightness-[0.4] transition-transform duration-700 ease-premium group-hover:scale-105"
                  />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent p-8 flex flex-col justify-end">
                    <span className="text-brand-green font-bold text-xs uppercase tracking-widest mb-1.5">{cat.count}</span>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-4 group-hover:text-brand-green transition-colors duration-300">{cat.title}</h3>
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
                      <span>Explore Category</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* D. Latest Listings (Grid with staggered reveals) */}
      <section id="listings" className="py-24 border-b border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">Newly Added</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Latest Listings</h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-white/60 hover:text-brand-green transition-colors font-medium self-start md:self-auto"
            >
              <span>Explore All Listings</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Staggered Grid Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LATEST_LISTINGS.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: easePremium }}
              >
                <div
                  onClick={(e) => openCard(property, e.currentTarget)}
                  className="cursor-pointer group block h-full bg-[#090909] border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-brand-green">
                      {property.tag}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-green transition-colors duration-300 line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="text-base font-extrabold text-brand-green whitespace-nowrap">${property.price.toLocaleString()}/mo</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/50 mb-5">
                      <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                      <span className="truncate">{property.location}, {property.city}</span>
                    </div>

                    {/* Attributes */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-white/60">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-3.5 h-3.5 text-brand-green" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-brand-green" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-brand-green" />
                        <span>{property.areaSqFt.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Call to Action (CTA) Block */}
      <section className="relative py-24 bg-brand-green text-black overflow-hidden select-none">

        {/* Background Accent Gradients */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-[-50%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-white blur-[120px]" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-white blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-3xl">
              Ready to find your next luxury home?
            </h2>
            <p className="text-lg md:text-xl text-black/75 max-w-xl mb-10 font-medium">
              Start browsing listings directly or connect with our support agents for custom requirements.
            </p>

            {/* Black Pill Button scale-on-hover */}
            <Link
              href="/properties"
              className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-base font-bold transition-transform duration-300 ease-premium hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
            >
              <span>Get Started Now</span>
              <ArrowUpRight className="w-5 h-5 text-brand-green transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* F. Contact info and Links Block */}
      <section id="contact" className="py-20 border-b border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-extrabold tracking-tight text-white mb-6 block">
                Rent<span className="text-brand-green">Ease</span>
              </Link>
              <p className="text-white/50 max-w-sm mb-6 text-sm font-light">
                Direct renting engineered for transparency. Luxury, comfort, and peace of mind with 0% broker commissions.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 bg-white/5 px-4 py-2.5 rounded-full border border-white/5">
                  <PhoneCall className="w-4 h-4 text-brand-green" />
                  <span>+1 (800) RENT-EASE</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 bg-white/5 px-4 py-2.5 rounded-full border border-white/5">
                  <Inbox className="w-4 h-4 text-brand-green" />
                  <span>hello@rentease.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Discover</h4>
              <ul className="space-y-4 text-sm text-white/50 font-light">
                <li><Link href="#featured" className="hover:text-brand-green transition-colors">Featured Estates</Link></li>
                <li><Link href="#categories" className="hover:text-brand-green transition-colors">Apartments & Suites</Link></li>
                <li><Link href="/properties" className="hover:text-brand-green transition-colors">Latest Properties</Link></li>
                <li><Link href="/properties" className="hover:text-brand-green transition-colors">Special Offers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/50 font-light">
                <li><Link href="#confidence" className="hover:text-brand-green transition-colors">Our Confidence Pledge</Link></li>
                <li><Link href="/" className="hover:text-brand-green transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-brand-green transition-colors">Careers</Link></li>
                <li><Link href="/" className="hover:text-brand-green transition-colors">Legal & Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* F. Massive Typography Footer (GSAP ScrollTrigger Scroll Binding) */}
      <footer
        ref={footerSectionRef}
        className="footer-section bg-[#050505] text-white pt-16 pb-12 overflow-hidden select-none border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between text-xs text-white/40 gap-4">
            <p>© {new Date().getFullYear()} RentEase Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/" className="hover:text-white transition-colors">Terms of Lease</Link>
              <Link href="/" className="hover:text-white transition-colors">Fair Housing Pledge</Link>
              <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Colossal Scale Footer text tied to ScrollTrigger */}
        <div className="w-full flex items-center justify-center overflow-hidden border-t border-white/5 pt-12">
          <div
            ref={colossalTextRef}
            className="colossal-footer-text font-black tracking-tighter text-center uppercase whitespace-nowrap text-[15vw] leading-none pointer-events-none text-white/10"
          >
            RentEase
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {expanded && (
          <ExpandedCard state={expanded} onClose={closeCard} />
        )}
      </AnimatePresence>

    </div>
  );
}

// Framer motion variants for Hero grid entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 15
    }
  }
};

function PriceCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      delay: 0.15,
      ease: easePremium,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{display.toLocaleString("en-US")}</>;
}

function ExpandedCard({
  state,
  onClose
}: {
  state: { property: MockPropertyDoc; rect: { top: number; left: number; width: number; height: number } };
  onClose: () => void;
}) {
  const { property, rect } = state;
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTextVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[998]"
      />
      <motion.div
        initial={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 24 }}
        animate={{ top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }}
        exit={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 24 }}
        transition={{ duration: 0.5, ease: easePremium }}
        className="fixed z-[999] bg-[#0c0c0e] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: textVisible ? 1 : 0 }}
          transition={{ duration: 0.4, delay: textVisible ? 0.05 : 0 }}
          className="flex-1 min-h-0 min-w-0 flex flex-col justify-start md:justify-center p-8 md:p-16 overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="self-start bg-white/5 border border-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center mb-8 hover:bg-white/10 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>

          <div className="text-2xl md:text-[30px] font-bold text-brand-green">
            $<PriceCounter value={property.price} />
            <span className="text-[15px] font-medium text-white/50">/mo</span>
          </div>
          <h2 className="text-2xl md:text-[34px] font-bold text-white mt-3.5 mb-1.5 tracking-tight">
            {property.title}
          </h2>
          <div className="flex items-center gap-1.5 text-[15px] text-white/60">
            <MapPin className="w-3.5 h-3.5 text-brand-green" />
            {property.location}, {property.city}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5 text-[15px] text-white/70">
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-brand-green" />
              {property.bedrooms} Bed{property.bedrooms === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-brand-green" />
              {property.bathrooms} Bath{property.bathrooms === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-brand-green" />
              {property.areaSqFt.toLocaleString()} Sq Ft
            </span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mt-6 max-w-lg">
            {property.description}
          </p>

          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center justify-center w-fit bg-brand-green text-black text-[15px] font-bold px-8 py-4 rounded-lg mt-9 hover:bg-white transition-colors"
          >
            View Details
          </Link>
        </motion.div>
        <div className="h-56 flex-shrink-0 md:flex-1 md:min-w-0 relative md:h-auto">
          <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
        </div>
      </motion.div>
    </>
  );
}
