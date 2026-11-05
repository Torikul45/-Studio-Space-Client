
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Building2,
  Loader2,
  X,
} from "lucide-react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  userEmail?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://studio-space-server-eight.vercel.app";

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const userEmail = session?.user?.email?.trim().toLowerCase();

  useEffect(() => {
    if (sessionLoading) return;

    if (!userEmail) {
      router.replace("/login");
      return;
    }

    let isActive = true;

    const fetchMyStudios = async () => {
      try {
        setLoading(true);

        // Fetch only the logged-in user's studios using HTTPOnly Cookie.
        const response = await fetch(`${API_URL}/my-studios`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Authentication failed. Please login again."
            );
          }

          throw new Error(
            data?.message || "Failed to load studio listings."
          );
        }

        if (isActive) {
          setStudios(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("My listings error:", error);

        if (isActive) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load your studio listings."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchMyStudios();

    return () => {
      isActive = false;
    };
  }, [sessionLoading, userEmail, router]);

  const handleDelete = async () => {
    if (!selectedStudio) return;

    try {
      setDeleting(true);

      // Delete only the owner's studio using HTTPOnly Cookie.
      const response = await fetch(
        `${API_URL}/studios/${selectedStudio._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        }

        if (response.status === 403) {
          throw new Error("You can only delete your own studio.");
        }

        throw new Error(result?.message || "Failed to delete studio.");
      }

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== selectedStudio._id)
      );

      toast.success("Studio deleted successfully.");
      setSelectedStudio(null);
    } catch (error) {
      console.error("Delete studio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete studio. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (sessionLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#6C4CF1]" />
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Redirecting to login...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[#6C4CF1]" />
          <p className="text-sm text-gray-500">Loading your listings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6C4CF1]">
              Manage Your Spaces
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-3 text-gray-600">
              Manage and update your creative spaces.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6C4CF1] px-5 py-3 font-semibold text-white transition hover:bg-[#5839D6]"
          >
            <Plus size={19} />
            Add New Studio
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#6C4CF1]">
            <Building2 size={22} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Your Total Listings</p>
            <p className="text-xl font-bold text-gray-900">
              {studios.length}
            </p>
          </div>
        </div>

        {studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-[#6C4CF1]">
              <Building2 size={32} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No Studio Listings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You have not listed any studios yet. Add your creative space and
              start connecting with creators.
            </p>

            <Link
              href="/add-studio"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6C4CF1] px-6 py-3 font-semibold text-white transition hover:bg-[#5839D6]"
            >
              <Plus size={19} />
              Add Your First Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 bg-gray-100">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
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
                  <h2 className="text-xl font-bold text-gray-900">
                    {studio.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{studio.location}</span>
                  </div>

                  <p className="mt-4 text-lg font-bold text-[#6C4CF1]">
                    ৳{studio.hourlyRate}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / hour
                    </span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-[#6C4CF1] px-3 py-2.5 text-sm font-semibold text-[#6C4CF1] transition hover:bg-purple-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedStudio(studio)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStudio && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedStudio(null)}
              disabled={deleting}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={25} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Delete Studio?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedStudio.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedStudio(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
