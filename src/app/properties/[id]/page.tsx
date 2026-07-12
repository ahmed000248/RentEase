import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  Sofa,
  Car,
  Wifi,
  Zap,
  Droplet,
  Flame,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import {
  getPropertyById,
  getUserById,
  getReviewsForProperty,
  getReviewersById,
  isPropertyFavorited,
} from "@/lib/data/properties";
import { getSessionClaims } from "@/lib/auth/server";
import { isAdminConfigured } from "@/lib/firebase/admin";
import { formatPrice, titleCase } from "@/lib/format";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BackendNotConfigured from "@/components/ui/BackendNotConfigured";
import PropertyGallery from "@/components/property/PropertyGallery";
import FavoriteButton from "@/components/property/FavoriteButton";
import ReviewsSection from "@/components/property/ReviewsSection";
import OwnerCard from "@/components/property/OwnerCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
  "car parking": Car,
  wifi: Wifi,
  electricity: Zap,
  "water supply": Droplet,
  "sui gas": Flame,
};

function amenityIcon(name: string): LucideIcon {
  return AMENITY_ICONS[name.toLowerCase()] ?? CircleCheck;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isAdminConfigured()) return { title: "RentEase" };

  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return { title: "Property Not Found — RentEase" };

  return {
    title: `${property.title} — RentEase`,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  if (!isAdminConfigured()) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#050505]">
        <BackendNotConfigured message="Property listings are stored in Firestore, but no Firebase project credentials are configured yet. Once they're wired in, this page will show the real listing." />
      </div>
    );
  }

  const { id } = await params;
  const claims = await getSessionClaims();
  const viewer = claims ? { uid: claims.uid, isAdmin: claims.admin } : null;

  const property = await getPropertyById(id, viewer);
  if (!property) notFound();

  const [owner, reviews, isFavorited] = await Promise.all([
    getUserById(property.ownerId),
    getReviewsForProperty(property.id),
    claims ? isPropertyFavorited(claims.uid, property.id) : Promise.resolve(false),
  ]);

  const reviewerMap = await getReviewersById(reviews.map((r) => r.tenantId));
  const reviewsWithAuthors = reviews.map((r) => ({
    ...r,
    authorName: reviewerMap.get(r.tenantId)?.name ?? "RentEase User",
  }));

  const characteristics: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Home, label: "Type", value: titleCase(property.type) },
    { icon: BedDouble, label: "Bedrooms", value: String(property.bedrooms) },
    { icon: Bath, label: "Bathrooms", value: String(property.bathrooms) },
    { icon: Maximize2, label: "Area", value: `${property.areaSqFt.toLocaleString()} sqft` },
    { icon: MapPin, label: "City", value: property.city },
    { icon: MapPin, label: "Location", value: property.location },
    { icon: Sofa, label: "Furnishing", value: titleCase(property.furnishing) },
  ];
  if (property.type === "room" || property.type === "hostel") {
    characteristics.push({ icon: Home, label: "Preferred For", value: titleCase(property.preferredFor) });
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: property.title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main column */}
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images} title={property.title} />

            <div className="flex items-start justify-between gap-6 mt-8 mb-2 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>
                    {property.location}, {property.city}
                  </span>
                </div>
              </div>
              <FavoriteButton propertyId={property.id} initialFavorited={isFavorited} />
            </div>

            <div className="flex items-center gap-3 mb-10">
              <span className="text-2xl font-extrabold text-brand-green">{formatPrice(property.price)}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-green bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full">
                Available for Rent
              </span>
            </div>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <p className="text-white/60 leading-relaxed font-light whitespace-pre-line">
                {property.description}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6">Characteristics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {characteristics.map((c) => (
                  <div key={c.label} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-4">
                    <c.icon className="w-5 h-5 text-brand-green mb-2" />
                    <p className="text-xs text-white/40 mb-0.5">{c.label}</p>
                    <p className="text-sm font-semibold text-white">{c.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {property.amenities.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6">Amenities &amp; Utilities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 bg-[#0d0d0d] border border-white/5 rounded-full px-4 py-2.5 text-sm text-white/70"
                      >
                        <Icon className="w-4 h-4 text-brand-green" />
                        {amenity}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-white mb-6">Reviews &amp; Ratings</h2>
              <ReviewsSection propertyId={property.id} initialReviews={reviewsWithAuthors} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28">
            {owner ? (
              <OwnerCard
                owner={owner}
                ownerId={property.ownerId}
                propertyId={property.id}
                propertyTitle={property.title}
              />
            ) : (
              <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 text-white/40 text-sm">
                Owner information unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
