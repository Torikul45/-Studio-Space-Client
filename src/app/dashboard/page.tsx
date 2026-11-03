"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  UserRound,
  PlusCircle,
  Building2,
  CalendarCheck,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

const dashboardItems = [
  {
    title: "My Profile",
    description: "View your personal account information.",
    href: "/profile",
    icon: UserRound,
  },
  {
    title: "Add New Studio",
    description: "List a new creative space on StudioSpace.",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    title: "My Studio Listings",
    description: "Manage your listed studios.",
    href: "/my-listings",
    icon: Building2,
  },
  {
    title: "My Bookings",
    description: "View and manage your studio bookings.",
    href: "/my-bookings",
    icon: CalendarCheck,
  },
];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-[#1c1c27]">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Please Sign In
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to access your dashboard.
          </p>
          <Link
            href="/login?callbackURL=/dashboard"
            className="mt-5 inline-block rounded-lg bg-[#6C4CF1] px-6 py-2.5 font-semibold text-white transition hover:bg-[#5939df]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-[#F8F7FC] px-4 py-12 dark:bg-[#111118]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-[#6C4CF1] dark:bg-purple-900/30">
              <LayoutDashboard size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Welcome back, {user.name}!
              </p>
            </div>
          </div>
        </div>

        <section className="mb-10 rounded-2xl bg-linear-to-r from-[#6C4CF1] to-[#9279FF] p-7 text-white shadow-lg sm:p-10">
          <p className="text-sm font-medium text-purple-100">
            Welcome to StudioSpace
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Your creative journey starts here.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100">
            Manage your account, explore your studio activities, and keep
            everything organized from one place.
          </p>
          <Link
            href="/studios"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[#6C4CF1] transition hover:bg-purple-50"
          >
            Explore Studios <ArrowRight size={17} />
          </Link>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
            Quick Access
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {dashboardItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#6C4CF1] hover:shadow-md dark:border-gray-700 dark:bg-[#1c1c27]"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-purple-100 p-3 text-[#6C4CF1] dark:bg-purple-900/30">
                      <Icon size={24} />
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#6C4CF1]"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
