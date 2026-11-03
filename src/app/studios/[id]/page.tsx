"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ReviewForm from "@/components/ReviewForm";
import { useSession } from "@/lib/auth-client";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity?: number;
  capacity?: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  rating?: number;
  ratingCount?: number;
  userName?: string;
  userEmail?: string;
};

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getAuthToken() {
  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error("Authentication token পাওয়া যায়নি। আবার login করো।");
  }

  return data.token as string;
}

function StudioDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, isPending } = useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Login-এর পর একই Studio Details পেজে ফেরত আসবে
  const loginUrl = `/login?callbackURL=${encodeURIComponent(`/studios/${id}`)}`;

  useEffect(() => {
    const fetchStudioDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [studioResponse, reviewsResponse] = await Promise.all([
          fetch(`http://localhost:5000/studios/${id}`),
          fetch(`http://localhost:5000/studios/${id}/reviews`),
        ]);

        if (!studioResponse.ok) {
          throw new Error("Studio information could not be loaded.");
        }

        if (!reviewsResponse.ok) {
          throw new Error("Reviews could not be loaded.");
        }

        const studioData = await studioResponse.json();
        const reviewsData = await reviewsResponse.json();

        setStudio(studioData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudioDetails();
    }
  }, [id]);

  const user = session?.user;

  const startMinutes =
    Number(startTime.split(":")[0]) * 60 + Number(startTime.split(":")[1]);

  const endMinutes =
    Number(endTime.split(":")[0]) * 60 + Number(endTime.split(":")[1]);

  const duration = (endMinutes - startMinutes) / 60;

  const hourlyAmount =
    studio && duration > 0 ? studio.hourlyRate * duration : 0;

  const totalAmount =
    studio && duration > 0 ? hourlyAmount + studio.securityDeposit : 0;

  const handleBooking = async () => {
    if (!studio || !user) {
      toast.error("Please sign in to book this studio.");
      router.push(loginUrl);
      return;
    }

    setBookingError("");

    if (!bookingDate || !startTime || !endTime) {
      const message = "Please select a date and time.";
      setBookingError(message);
      toast.error(message);
      return;
    }

    if (bookingDate < getTodayDate()) {
      const message = "Please select today or a future date.";
      setBookingError(message);
      toast.error(message);
      return;
    }

    if (duration <= 0) {
      const message = "End time must be later than start time.";
      setBookingError(message);
      toast.error(message);
      return;
    }

    try {
      setBookingLoading(true);

      const token = await getAuthToken();
      console.log("CLIENT BOOKING DATA:", {
        studioId: studio._id,
        bookingDate,
        startTime,
        endTime,
        totalAmount,
      });

      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking could not be completed.");
      }

      toast.success("Booking request submitted successfully!", {
        description: "Your booking status is Pending.",
      });

      setShowBookingModal(false);
      setBookingDate(getTodayDate());
      setStartTime("10:00");
      setEndTime("12:00");
      setBookingError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setBookingError(message);

      toast.error("Booking failed", {
        description: message,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium">Loading studio details...</p>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 text-center">
        <p className="text-lg text-red-600">{error || "Studio not found."}</p>
      </div>
    );
  }

  const capacity = studio.maxCapacity ?? studio.capacity ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
        {/* Studio image */}
        <div className="relative aspect-4/3 w-full self-start overflow-hidden rounded-2xl bg-gray-100">
          {studio.image ? (
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Studio information */}
        <div className="min-w-0 space-y-5">
          <div>
            <p className="font-medium text-green-700">{studio.category}</p>
            <h1 className="mt-2 wrap-break-word text-3xl font-bold text-gray-950 sm:text-4xl">
              {studio.title}
            </h1>
            <p className="mt-2 text-gray-600">{studio.location}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl text-yellow-500">★</span>
            <span className="font-semibold">{studio.rating ?? 0}</span>
            <span className="text-sm text-gray-500">
              ({studio.ratingCount ?? 0} reviews)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="mt-1 text-xl font-bold">
                ৳{studio.hourlyRate.toLocaleString("en-BD")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Security Deposit</p>
              <p className="mt-1 text-xl font-bold">
                ৳{studio.securityDeposit.toLocaleString("en-BD")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Maximum Capacity</p>
              <p className="mt-1 text-xl font-bold">{capacity} People</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Overview</h2>
            <p className="leading-7 text-gray-600">
              {studio.overview || "No overview available."}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Amenities</h2>

            {studio.amenities?.length ? (
              <div className="flex flex-wrap gap-2">
                {studio.amenities.map((amenity, index) => (
                  <span
                    key={`${amenity}-${index}`}
                    className="rounded-full bg-green-50 px-4 py-2 text-sm text-green-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </div>

          {/* Booking button */}
          {isPending ? (
            <p className="text-gray-500">Checking login...</p>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  router.push(loginUrl);
                  return;
                }

                setBookingError("");
                setShowBookingModal(true);
              }}
              className="w-full rounded-xl bg-[#6C4CF1] px-6 py-3.5 font-semibold text-white transition hover:bg-[#5839D6]"
            >
              Book Now
            </button>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Book This Studio
              </h2>

              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingLoading}
                className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100"
                aria-label="Close booking modal"
              >
                ×
              </button>
            </div>

            <p className="mb-5 font-medium text-gray-700">{studio.title}</p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Booking Date
                </label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6C4CF1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#6C4CF1]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#6C4CF1]"
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-gray-50 p-4">
                <div className="flex justify-between gap-4 text-sm text-gray-600">
                  <span>Hourly Rate</span>
                  <span>৳{studio.hourlyRate} / hour</span>
                </div>

                <div className="flex justify-between gap-4 text-sm text-gray-600">
                  <span>Duration</span>
                  <span>
                    {duration > 0 ? `${duration} hours` : "Invalid time"}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm text-gray-600">
                  <span>Studio Charges</span>
                  <span>৳{hourlyAmount.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between gap-4 text-sm text-gray-600">
                  <span>Security Deposit</span>
                  <span>৳{studio.securityDeposit.toLocaleString("en-BD")}</span>
                </div>

                <div className="flex justify-between gap-4 border-t border-gray-200 pt-3 font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>৳{totalAmount.toLocaleString("en-BD")}</span>
                </div>
              </div>

              {bookingError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {bookingError}
                </p>
              )}

              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingLoading || duration <= 0}
                className="w-full rounded-xl bg-[#6C4CF1] px-5 py-3 font-semibold text-white transition hover:bg-[#5839D6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading ? "Submitting..." : "Confirm Booking"}
              </button>

              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingLoading}
                className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer reviews */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-sm text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(Math.max(0, 5 - review.rating))}
                  </p>
                </div>

                <p className="mt-3 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-gray-50 p-5 text-gray-500">
            No reviews yet. Be the first to review this studio!
          </p>
        )}
      </section>

      {/* Review form */}
      <section className="mt-10">
        {isPending ? (
          <p>Checking login...</p>
        ) : user ? (
          <ReviewForm
            studioId={id}
            userName={user.name}
            userEmail={user.email}
          />
        ) : (
          <p className="rounded-xl bg-gray-50 p-5 text-gray-600">
            Please sign in to write a review.
          </p>
        )}
      </section>
    </main>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          Loading studio details...
        </div>
      }
    >
      <StudioDetailsContent />
    </Suspense>
  );
}
