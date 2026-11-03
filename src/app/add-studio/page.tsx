"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

type StudioData = {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  userName: string;
  userEmail: string;
};

export default function AddStudioPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = session?.user?.name ?? "";
  const userEmail = session?.user?.email ?? "";

  const availableAmenities = [
    "Wi-Fi",
    "Air Conditioning",
    "Parking",
    "Lighting Equipment",
    "Sound System",
    "Restroom",
  ];

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isPending) {
      toast.info("Please wait while your account loads.");
      return;
    }

    if (!userEmail) {
      toast.error("Please log in to add a studio.");
      router.push("/login");
      return;
    }

    const form = formRef.current;

    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const studioData: StudioData = {
      title: String(values.title || "").trim(),
      category: String(values.category || ""),
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit),
      maxCapacity: Number(values.maxCapacity),
      location: String(values.location || "").trim(),
      image: String(values.image || "").trim(),
      amenities,
      overview: String(values.overview || "").trim(),
      userName,
      userEmail,
    };

    try {
      setIsSubmitting(true);

      // Get the BetterAuth JWT token from the Next.js server.
      const tokenResponse = await fetch("/api/auth/token", {
        method: "GET",
        cache: "no-store",
      });

      const tokenResult = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenResult.token) {
        throw new Error(
          tokenResult.message ||
            "Authentication token পাওয়া যায়নি। আবার login করো।",
        );
      }

      // Send the token to the protected Express API.
      const response = await fetch("http://localhost:5000/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenResult.token}`,
        },
        body: JSON.stringify(studioData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add studio.",
        );
      }

      toast.success("Studio added successfully!");

      form.reset();
      setAmenities([]);

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Error adding studio:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#6C4CF1]" />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Login Required
        </h1>

        <p className="text-gray-600">
          Please log in to add your studio.
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-lg bg-[#6C4CF1] px-6 py-3 font-semibold text-white transition hover:bg-[#5839D6]"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Add New Studio
        </h1>

        <p className="mt-3 text-gray-600">
          Share your creative space with other creators.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="mb-2 block font-medium">
              Studio Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Enter studio title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Photo Studios">Photo Studios</option>
              <option value="Sound Stages">Sound Stages</option>
              <option value="Podcast Rooms">Podcast Rooms</option>
              <option value="Music Suites">Music Suites</option>
              <option value="Art Workshops">Art Workshops</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              name="hourlyRate"
              required
              min="1"
              step="any"
              placeholder="Enter hourly rate"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Security Deposit ($)
            </label>
            <input
              type="number"
              name="securityDeposit"
              required
              min="0"
              step="any"
              placeholder="Enter security deposit"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Maximum Capacity
            </label>
            <input
              type="number"
              name="maxCapacity"
              required
              min="1"
              step="1"
              placeholder="Enter maximum capacity"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Location / Address
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="Enter studio location"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Studio Image URL
            </label>
            <input
              type="url"
              name="image"
              required
              placeholder="Enter studio image URL"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-3 block font-medium">
              Amenities
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {availableAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                >
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-4 w-4 accent-[#6C4CF1]"
                  />
                  <span className="text-gray-700">
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Studio Overview
            </label>
            <textarea
              name="overview"
              required
              rows={5}
              placeholder="Describe your studio and its facilities..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Host Name
            </label>
            <input
              type="text"
              name="userName"
              value={userName}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Host Email
            </label>
            <input
              type="email"
              name="userEmail"
              value={userEmail}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#6C4CF1] px-6 py-3 font-semibold text-white transition hover:bg-[#5839D6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add Studio"}
          </button>
        </form>
      </div>
    </div>
  );
}
