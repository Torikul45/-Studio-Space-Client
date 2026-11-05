"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  userName?: string;
  userEmail?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://studio-space-server-eight.vercel.app";

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const availableAmenities = [
  "Wi-Fi",
  "Air Conditioning",
  "Lighting Equipment",
  "Parking",
  "Soundproofing",
  "Musical Instruments",
];

function EditStudioContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const id = params.id;
  const currentEmail = (session?.user?.email || "").trim().toLowerCase();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Photo Studios",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    overview: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    if (sessionLoading) return;

    if (!currentEmail) {
      router.replace("/login");
      return;
    }

    let active = true;

    async function loadStudio() {
      try {
        const response = await fetch(`${API_URL}/studios/${id}`);

        if (!response.ok) {
          throw new Error("Could not load this studio.");
        }

        const studio: Studio = await response.json();

        if (!active) return;

        const studioEmail = (studio.userEmail || "").trim().toLowerCase();

        if (studioEmail && studioEmail !== currentEmail) {
          toast.error("You can only edit your own studio.");
          router.replace("/my-listings");
          return;
        }

        setForm({
          title: studio.title || "",
          category: studio.category || "Photo Studios",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location || "",
          image: studio.image || "",
          overview: studio.overview || "",
          amenities: Array.isArray(studio.amenities) ? studio.amenities : [],
        });
      } catch (error) {
        console.error("Load studio error:", error);

        if (active) {
          toast.error("Unable to load studio details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudio();

    return () => {
      active = false;
    };
  }, [id, sessionLoading, currentEmail, router]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((item) => item !== amenity)
        : [...previous.amenities, amenity],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentEmail) {
      toast.error("Please login first.");
      router.replace("/login");
      return;
    }

    if (!form.title.trim() || !form.location.trim() || !form.overview.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(form.hourlyRate)) ||
      Number(form.hourlyRate) <= 0 ||
      !Number.isFinite(Number(form.securityDeposit)) ||
      Number(form.securityDeposit) < 0 ||
      !Number.isFinite(Number(form.maxCapacity)) ||
      Number(form.maxCapacity) <= 0
    ) {
      toast.error("Please enter valid studio prices and capacity.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/studios/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          location: form.location.trim(),
          hourlyRate: Number(form.hourlyRate),
          securityDeposit: Number(form.securityDeposit),
          maxCapacity: Number(form.maxCapacity),
          image: form.image.trim(),
          overview: form.overview.trim(),
          userName: session?.user?.name || "",
          userEmail: currentEmail,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }

        if (response.status === 403) {
          throw new Error("You can only update your own studio.");
        }

        throw new Error(result?.message || "Failed to update studio.");
      }

      toast.success("Studio updated successfully.");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Update studio error:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update studio.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#6C4CF1]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#6C4CF1]"
        >
          <ArrowLeft size={18} />
          Back to My Listings
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Studio</h1>

          <p className="mt-2 text-gray-600">
            Update your studio details below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Studio Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                placeholder="Enter studio name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category *
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#6C4CF1]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Hourly Rate (৳) *
                </label>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => updateField("hourlyRate", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Security Deposit (৳) *
                </label>
                <input
                  required
                  min="0"
                  type="number"
                  value={form.securityDeposit}
                  onChange={(e) =>
                    updateField("securityDeposit", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Capacity *
                </label>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.maxCapacity}
                  onChange={(e) => updateField("maxCapacity", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Location *
              </label>
              <input
                required
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                placeholder="Area, city, country"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Amenities
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 accent-[#6C4CF1]"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Overview *
              </label>
              <textarea
                required
                rows={5}
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                placeholder="Describe your studio..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C4CF1] px-5 py-3.5 font-semibold text-white transition hover:bg-[#5839D6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              {saving ? "Updating Studio..." : "Update Studio"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function EditStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#6C4CF1]" />
        </div>
      }
    >
      <EditStudioContent />
    </Suspense>
  );
}
