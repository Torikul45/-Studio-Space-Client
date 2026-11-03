
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Camera, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const categories = [
  { name: "Photo Studios", href: "/studios?category=Photo%20Studios" },
  { name: "Sound Stages", href: "/studios?category=Sound%20Stages" },
  { name: "Podcast Rooms", href: "/studios?category=Podcast%20Rooms" },
  { name: "Music Suites", href: "/studios?category=Music%20Suites" },
  { name: "Art Workshops", href: "/studios?category=Art%20Workshops" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.success("Thanks for subscribing!", {
      description: "You're now on the StudioSpace newsletter list.",
    });

    setEmail("");
  };

  return (
    <footer className="bg-[#171525] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C4CF1]">
                <Camera size={25} />
              </div>

              <span className="text-2xl font-bold">
                Studio<span className="text-[#A99AFF]">Space</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              A creative space for every creator. Discover inspiring studios,
              connect with talented hosts, and bring your creative ideas to life.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold transition hover:bg-[#6C4CF1]"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl transition hover:bg-[#6C4CF1]"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg transition hover:bg-[#6C4CF1]"
              >
                ▶
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold transition hover:bg-[#6C4CF1]"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Popular Categories</h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-400 transition hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Inspired</h3>

            <p className="mb-5 text-sm leading-6 text-gray-400">
              Subscribe to our newsletter for creative ideas, studio updates,
              and exclusive offers.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white/10 px-3">
                <Mail size={18} className="shrink-0 text-gray-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  aria-label="Your email address"
                  className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                aria-label="Subscribe"
                className="rounded-lg bg-[#6C4CF1] p-3 transition hover:bg-[#5839D6]"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Terms */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-400">
            © 2026 StudioSpace. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>

            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
