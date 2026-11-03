"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Search, Star } from "lucide-react";

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
  ratingCount?: number;
};

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category")?.trim() || "All";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const query = params.toString();

    router.push(`/studios${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  // Fetch studios
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/studios");

        if (!response.ok) {
          throw new Error("Failed to load studios");
        }

        const data: Studio[] = await response.json();

        const validStudios = data.filter(
          (studio) =>
            studio.title?.trim() &&
            studio.category?.trim() &&
            studio.location?.trim(),
        );

        setStudios(validStudios);
      } catch (err) {
        console.error("Studio fetch error:", err);
        setError("Unable to load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(studios.map((studio) => studio.category.trim()))],
    [studios],
  );

  const filteredStudios = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return studios.filter((studio) => {
      const matchesSearch =
        studio.title.toLowerCase().includes(searchText) ||
        studio.location.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory.toLowerCase() === "all" ||
        studio.category.trim().toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [studios, search, selectedCategory]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="mx-auto h-9 w-72 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="h-52 bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-6 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
            Discover Spaces
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Explore Creative Studios
          </h1>

          <p className="mt-3 text-gray-600">
            Find the perfect creative space for your next project.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio name or location..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-800 outline-none transition focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/10"
            />
          </div>

          <p className="text-sm text-gray-500">
            {filteredStudios.length} studios found
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-9 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory.toLowerCase() === category.toLowerCase()
                  ? "bg-[#6C4CF1] text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#6C4CF1] hover:text-[#6C4CF1]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 py-10 text-center text-red-600">
            {error}
          </p>
        ) : filteredStudios.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Studios Found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                handleCategoryChange("All");
              }}
              className="mt-5 rounded-lg bg-[#6C4CF1] px-6 py-3 font-semibold text-white transition hover:bg-[#5839D6]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio, index) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 bg-gray-200">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#6C4CF1] shadow">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    {studio.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{studio.location}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
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
                      {studio.ratingCount && studio.ratingCount > 0
                        ? Number(studio.rating ?? 0).toFixed(1)
                        : "New"}
                    </span>
                  </div>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="mt-5 block rounded-xl bg-[#6C4CF1] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#5839D6]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 px-5 py-12 text-center text-gray-500">
          Loading studios...
        </div>
      }
    >
      <StudiosContent />
    </Suspense>
  );
}
