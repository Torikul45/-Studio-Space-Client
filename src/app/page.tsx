"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  MapPin,
  Star,
  Search,
  CalendarCheck,
  CreditCard,
  Clapperboard,
  ShieldCheck,
  UserCheck,
  Headphones,
  Camera,
  Music,
  Mic,
  Palette,
  ArrowRight,
  X,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  rating?: number;
};

const slides = [
  {
    title: "Find Your Perfect Creative Space",
    description: "Discover inspiring studios for your creative projects.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  {
    title: "Bring Your Creative Vision to Life",
    description: "Find the perfect space for your next project.",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb",
  },
  {
    title: "Share Your Creative Space",
    description: "List your studio and connect with other creators.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  },
];

const bookingSteps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore creative studios that match your project needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose your preferred date and available time slot.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book Instantly",
    description: "Submit your reservation and manage your booking easily.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Arrive at your studio and bring your ideas to life.",
    icon: Clapperboard,
  },
];

const guarantees = [
  {
    title: "Creator Protection",
    description: "Clear booking details and transparent studio policies.",
    details:
      "StudioSpace provides clear booking information, transparent pricing, and reservation details. Creators can review the booking terms before reserving a workspace.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description: "Connect with hosts through their registered accounts.",
    details:
      "Creators can review the host information available on each studio listing before making a reservation. This helps them make informed booking decisions.",
    icon: UserCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Review studio amenities and equipment details before booking.",
    details:
      "Each studio listing displays its available amenities and equipment information. Creators can inspect these details before choosing a space for their project.",
    icon: Camera,
  },
  {
    title: "Host Support",
    description: "Get help with your studio discovery and booking experience.",
    details:
      "StudioSpace provides a platform for creators and hosts to manage studio listings and bookings. For assistance, users can contact the platform support team.",
    icon: Headphones,
  },
];

const categories = [
  { name: "Photo Studios", icon: Camera },
  { name: "Sound Stages", icon: Clapperboard },
  { name: "Podcast Rooms", icon: Mic },
  { name: "Music Suites", icon: Music },
  { name: "Art Workshops", icon: Palette },
];

export default function Home() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedGuarantee, setSelectedGuarantee] = useState<
    (typeof guarantees)[number] | null
  >(null);

  const SelectedGuaranteeIcon = selectedGuarantee?.icon;

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const fetchFeaturedStudios = async () => {
      try {
        const response = await fetch("http://localhost:5000/studios/featured");

        if (!response.ok) {
          throw new Error("Failed to load featured studios");
        }

        const data: Studio[] = await response.json();
        setStudios(data.slice(0, 6));
      } catch (error) {
        console.error("Featured studios error:", error);
        setError("Unable to load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStudios();
  }, []);

  // Fix: scroll to How It Works / About Us when the URL contains a hash.
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;

      if (!hash) return;

      const id = decodeURIComponent(hash.slice(1));

      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    };

    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  useEffect(() => {
    if (!selectedGuarantee) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedGuarantee(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedGuarantee]);

  return (
    <main>
      {/* Hero Slider */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isMounted ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="overflow-hidden rounded-3xl"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative flex min-h-120 items-center overflow-hidden rounded-3xl">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-black/55" />

                  <div className="relative z-10 max-w-2xl px-8 py-16 text-white sm:px-16">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-purple-300">
                      Welcome to StudioSpace
                    </p>

                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href="/studios"
                        className="rounded-xl bg-[#6C4CF1] px-7 py-3.5 font-semibold text-white transition hover:bg-[#5839D6]"
                      >
                        Explore Studios
                      </Link>

                      <Link
                        href="/add-studio"
                        className="rounded-xl border border-white px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-gray-900"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="min-h-120 animate-pulse rounded-3xl bg-gray-200" />
        )}
      </section>

      {/* Featured Studios */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              Discover Spaces
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Studios
            </h2>

            <p className="mt-3 text-gray-600">
              Explore creative spaces for your next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="font-semibold text-[#6C4CF1] transition hover:text-[#5839D6]"
          >
            View All Studios →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200"
              >
                <div className="h-56 bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-6 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="rounded-xl bg-red-50 p-5 text-center text-red-600">
            {error}
          </p>
        ) : studios.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-8 text-center text-gray-600">
            No studios available yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio, index) => (
              <div
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6C4CF1] hover:shadow-xl"
              >
                <div className="relative h-56 bg-gray-100">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6C4CF1] shadow">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    {studio.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{studio.location}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-lg font-bold text-[#6C4CF1]">
                      ৳{studio.hourlyRate}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / hour
                      </span>
                    </p>

                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      New
                    </span>
                  </div>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="mt-5 block rounded-xl bg-[#6C4CF1] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#5839D6]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Browse by Categories */}
      <section className="bg-[#F8F7FC] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              Explore Your Options
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Browse by Categories
            </h2>

            <p className="mt-3 text-gray-600">
              Find a creative space that fits your vision.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/studios?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6C4CF1] hover:shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C4CF1] transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#6C4CF1] group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <span className="mt-2 flex items-center gap-1 text-sm font-medium text-[#6C4CF1]">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              Simple Booking Process
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>

            <p className="mt-3 text-gray-600">
              Four simple steps to start creating.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step) => {
              const Icon = step.icon;

              return (
                <Link
                  href="/studios"
                  key={step.number}
                  className="group block rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6C4CF1] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C4CF1]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C4CF1] transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#6C4CF1] group-hover:text-white">
                      <Icon size={27} />
                    </div>

                    <span className="text-3xl font-bold text-[#E8E3FF] transition-colors duration-300 group-hover:text-[#6C4CF1]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#6C4CF1]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {step.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6C4CF1]">
                    Explore Studios
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us / Host Guarantee */}
      <section id="about" className="scroll-mt-24 bg-[#F8F7FC] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              About StudioSpace
            </p>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              A Better Space for Every Creative Idea
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              StudioSpace connects creators with inspiring workspaces. Whether
              you are a photographer, filmmaker, podcaster, or musician,
              discover spaces that help turn your ideas into reality.
            </p>
          </div>

          <div className="mb-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Host Guarantee & Creator Support
            </h3>

            <p className="mt-3 text-gray-600">
              A transparent and supportive experience for every creator.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setSelectedGuarantee(item)}
                  className="group rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6C4CF1] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C4CF1]"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C4CF1] transition-all duration-300 group-hover:rotate-6 group-hover:bg-[#6C4CF1] group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#6C4CF1]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {item.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6C4CF1]">
                    Learn More
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6C4CF1] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5839D6] hover:shadow-lg"
            >
              Explore Studios
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Guarantee Details Modal */}
      {selectedGuarantee && SelectedGuaranteeIcon && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedGuarantee(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guarantee-title"
            className="relative w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedGuarantee(null)}
              aria-label="Close modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0EDFF] text-[#6C4CF1]">
              <SelectedGuaranteeIcon size={28} />
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              StudioSpace Assurance
            </p>

            <h2
              id="guarantee-title"
              className="pr-8 text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              {selectedGuarantee.title}
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              {selectedGuarantee.details}
            </p>

            <button
              type="button"
              onClick={() => setSelectedGuarantee(null)}
              className="mt-7 w-full rounded-xl bg-[#6C4CF1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#5839D6]"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
