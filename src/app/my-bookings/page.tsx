
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Loader2,
  X,
  ClipboardList,
  MapPin,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage?: string;
  studioLocation?: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null
  );
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (sessionLoading || !session?.user?.email) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);

        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        const userBookings: Booking[] = Array.isArray(data) ? data : [];

        setBookings(
          userBookings
            .filter((booking) => booking.status !== "Cancelled")
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        );
      } catch (error) {
        console.error("Fetch bookings error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, sessionLoading]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);

      const token = await getAuthToken();

      const response = await fetch(
        `${API_URL}/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.filter(
          (booking) => booking._id !== selectedBooking._id
        )
      );

      toast.success("Booking cancelled successfully.");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (sessionLoading || (session?.user?.email && loading)) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#faf9f7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-amber-500" size={36} />
          <p className="text-sm text-gray-500">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user?.email) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#faf9f7] px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <ClipboardList
            size={48}
            className="mx-auto mb-4 text-amber-500"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Login Required
          </h1>
          <p className="mt-2 text-gray-500">
            Please log in to view your bookings.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
          >
            Login <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <CalendarDays size={14} />
              Production Schedule
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Studio Bookings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Track reservation statuses, cancellation requests, and shoot times.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Explore Studios <ArrowRight size={17} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <ClipboardList
              size={52}
              className="mx-auto mb-4 text-gray-300"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              No Bookings Yet
            </h2>
            <p className="mt-2 text-gray-500">
              Explore studios and book a space for your next project.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
            >
              Explore Studios <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:min-h-47.5 sm:w-52">
                    {booking.studioImage ? (
                      <Image
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                        fill
                        loading={
                          booking.studioImage.includes(
                            "photo-1516035069371-29a1b244cc32"
                          ) || index === 0
                            ? "eager"
                            : "lazy"
                        }
                        sizes="(max-width: 640px) 100vw, 208px"
                        className="object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-40 items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon
                            size={38}
                            className="mx-auto mb-2"
                          />
                          <p className="text-xs">Image unavailable</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {booking.status === "Pending"
                              ? "Pending Host Approval"
                              : booking.status}
                          </span>

                          <span className="text-xs text-gray-400">
                            ID: {booking._id.slice(-7)}
                          </span>
                        </div>

                        <h2 className="mt-3 wrap-break-word text-lg font-bold text-gray-900 sm:text-xl">
                          {booking.studioTitle}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays
                              size={15}
                              className="shrink-0 text-amber-500"
                            />
                            {new Date(
                              `${booking.bookingDate}T00:00:00`
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock
                              size={15}
                              className="shrink-0 text-amber-500"
                            />
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </div>

                        {booking.studioLocation && (
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                            <MapPin
                              size={15}
                              className="shrink-0 text-amber-500"
                            />
                            {booking.studioLocation}
                          </p>
                        )}
                      </div>

                      <div className="sm:min-w-28 sm:text-right">
                        <p className="text-xs text-gray-400">
                          Total Charged / Due
                        </p>
                        <p className="mt-1 text-2xl font-bold text-amber-600">
                          ৳{booking.totalAmount?.toLocaleString("en-BD")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                      {booking.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                        >
                          <X size={16} />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !cancelling) {
              setSelectedBooking(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="cancel-booking-title"
                className="text-xl font-bold text-gray-900"
              >
                Cancel Booking?
              </h2>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              Are you sure you want to cancel your booking for{" "}
              <span className="font-semibold text-gray-900">
                {selectedBooking.studioTitle}
              </span>
              ?
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {cancelling && (
                  <Loader2 size={17} className="animate-spin" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
