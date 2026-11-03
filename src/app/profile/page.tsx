
"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { User, Mail, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
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
            Sign in to view your profile.
          </p>
          <a
            href="/login"
            className="mt-5 inline-block rounded-lg bg-[#6C4CF1] px-6 py-2.5 font-semibold text-white"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-[#F8F7FC] px-4 py-12 dark:bg-[#111118]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your personal account information.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1c1c27] sm:p-8">
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-[#6C4CF1]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={42} />
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
            <span className="mt-3 flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <ShieldCheck size={14} />
              Verified Account
            </span>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
              Account Information
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-100 p-3 text-[#6C4CF1]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-100 p-3 text-[#6C4CF1]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
