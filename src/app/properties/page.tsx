import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getProperties } from "@/lib/data/properties";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";
import { isAdminConfigured } from "@/lib/firebase/admin";
import PropertyFilters from "@/components/property/PropertyFilters";
import ListingControls from "@/components/property/ListingControls";
import PropertyListingGrid from "@/components/property/PropertyListingGrid";
import type { Furnishing, PreferredFor } from "@/lib/firebase/types";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    city?: string;
    type?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    furnishing?: string;
    preferredFor?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "Browse Properties — RentEase",
  description: "Browse verified rental properties, rooms, hostels, apartments, and houses directly from owners. Zero broker commission.",
};

export default async function PropertiesPage({ searchParams }: PageProps) {
  if (!isAdminConfigured()) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0a0a0c]">
        <BackendNotConfigured message="Property listings are stored in Firestore, but no Firebase credentials are configured yet. Please configure the service account credentials first." />
      </div>
    );
  }

  const params = await searchParams;
  const filterParams = {
    searchQuery: params.query,
    city: params.city,
    type: params.type,
    bedrooms: params.bedrooms ? parseInt(params.bedrooms, 10) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    furnishing: params.furnishing as Furnishing | undefined,
    preferredFor: params.preferredFor as PreferredFor | undefined,
  };

  let properties: Awaited<ReturnType<typeof getProperties>> = [];
  let allProperties: Awaited<ReturnType<typeof getProperties>> = [];

  try {
    properties = await getProperties(filterParams);

    if (params.sort === "price-asc") {
      properties.sort((a, b) => a.price - b.price);
    } else if (params.sort === "price-desc") {
      properties.sort((a, b) => b.price - a.price);
    }

    allProperties = await getProperties();
  } catch (err) {
    console.error("Failed to fetch properties:", err);
  }

  const activeCities = Array.from(new Set(allProperties.map((p) => p.city))).filter(Boolean);
  const activeTypes = Array.from(new Set(allProperties.map((p) => p.type))).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f2f2f4]">
      {/* NAV */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0c]/85 backdrop-blur-md border-b border-white/8 h-20 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Rent<span className="text-brand-green">Ease</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="text-white/60 font-medium hover:text-white transition-colors">Home</Link>
            <Link
              href="/properties"
              className="text-brand-green font-semibold border border-brand-green rounded-lg px-3.5 py-1.5"
            >
              Properties
            </Link>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-brand-green text-white hover:text-brand-green px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-32 pb-20 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-3">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Properties" }]} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <h1 className="text-3xl md:text-[32px] font-bold text-white tracking-tight">Browse Properties</h1>
          <ListingControls />
        </div>

        <p className="text-xs sm:text-sm text-white/40 mb-6">
          Showing <span className="text-white font-semibold">{properties.length}</span>{" "}
          {properties.length === 1 ? "listing" : "listings"}
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <PropertyFilters cities={activeCities} types={activeTypes} />

          {properties.length > 0 ? (
            <PropertyListingGrid properties={properties} />
          ) : (
            <div className="flex-1 bg-[#141417] border border-white/8 rounded-2xl p-16 text-center">
              <p className="text-white/80 font-bold text-lg mb-2">No Properties Found</p>
              <p className="text-white/40 text-sm mb-6 leading-relaxed max-w-md mx-auto">
                We couldn&apos;t find any listings matching your search criteria. Try modifying your filters or keyword query.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-colors duration-300"
              >
                Reset All Filters
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/8 mt-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-11">
            <div className="md:col-span-2 max-w-sm">
              <div className="text-xl font-bold mb-3.5">
                Rent<span className="text-brand-green">Ease</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                RentEase is a smart, modern house rental platform designed to connect renters directly with
                property owners. Browse listings, apply smart filters, and find your next home, room, apartment,
                hostel, or shop with ease.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Quick Links</div>
              <div className="flex flex-col gap-3">
                <Link href="/" className="text-sm text-white/55 hover:text-brand-green transition-colors">Home</Link>
                <Link href="/properties" className="text-sm text-brand-green">Properties</Link>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Contact Info</div>
              <div className="flex flex-col gap-3 text-sm text-white/55">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-green" />
                  +1 (800) RENT-EASE
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-green" />
                  hello@rentease.com
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  Remote-first, worldwide
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 border-t border-white/8 text-xs text-white/35">
            <span>&copy; {new Date().getFullYear()} RentEase. All Rights Reserved.</span>
            <span>Designed &amp; Developed as a Semester Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
