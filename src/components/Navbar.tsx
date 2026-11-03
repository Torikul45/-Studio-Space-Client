
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Camera,
  Menu,
  X,
  User,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const accountLinks = [
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { name: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

type UserAccountProps = {
  mobile?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  isActive: (href: string) => boolean;
  closeMenus: () => void;
  loggingOut: boolean;
  handleLogout: () => Promise<void>;
};

function UserAccount({
  mobile = false,
  user,
  isDropdownOpen,
  setIsDropdownOpen,
  isActive,
  closeMenus,
  loggingOut,
  handleLogout,
}: UserAccountProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={mobile ? "w-full" : "relative"}>
      <button
        type="button"
        aria-expanded={isDropdownOpen}
        aria-label="Toggle account menu"
        onClick={() => setIsDropdownOpen((previous) => !previous)}
        className={`flex items-center gap-2 ${
          mobile
            ? "w-full rounded-xl border border-gray-200 p-3"
            : "rounded-full border border-gray-200 px-3 py-2 transition hover:bg-gray-50"
        }`}
      >
        {user?.image && !imageError ? (
          <Image
            src={user.image}
            alt="Profile"
            width={36}
            height={36}
            unoptimized
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6C4CF1] text-white">
            <User size={19} />
          </div>
        )}

        <div className="min-w-0 text-left">
          <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
            {user?.name || "My Account"}
          </p>
          <p className="max-w-32 truncate text-xs text-gray-500">
            {user?.email}
          </p>
        </div>

        <ChevronDown
          size={17}
          className={`text-gray-500 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div
          className={`z-50 rounded-xl border border-gray-100 bg-white p-2 shadow-xl ${
            mobile ? "mt-2 w-full" : "absolute right-0 mt-3 w-60"
          }`}
        >
          {accountLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive(item.href)
                    ? "bg-purple-50 font-semibold text-[#6C4CF1]"
                    : "text-gray-700 hover:bg-purple-50 hover:text-[#6C4CF1]"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}

          <div className="my-2 border-t border-gray-100" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            ) : (
              <LogOut size={18} />
            )}
            {loggingOut ? "Logging Out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Load saved theme without synchronous state updates in the effect.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const darkMode = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", darkMode);

    const frame = requestAnimationFrame(() => {
      setIsDark(darkMode);
      setThemeLoaded(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Toggle and save theme.
  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  };

  const currentUrl = () => {
    const query = searchParams.toString();
    const hash =
      typeof window !== "undefined" ? window.location.hash : "";

    return `${pathname}${query ? `?${query}` : ""}${hash}`;
  };

  const loginUrl = `/login?callbackURL=${encodeURIComponent(currentUrl())}`;

  // Update active navigation while scrolling.
  useEffect(() => {
    if (pathname !== "/") return;

    let animationFrame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const howItWorks = document.getElementById("how-it-works");
        const about = document.getElementById("about");
        const scrollPosition = window.scrollY + 140;

        if (about && scrollPosition >= about.offsetTop) {
          setActiveHash("#about");
        } else if (
          howItWorks &&
          scrollPosition >= howItWorks.offsetTop
        ) {
          setActiveHash("#how-it-works");
        } else {
          setActiveHash("");
        }
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  // Scroll to a section when arriving at Home with a hash.
  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));

    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(id);

      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeHash === "";
    }

    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.substring(1);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (!href.startsWith("/#")) {
      setActiveHash("");
    }

    closeMenus();
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut();

      toast.success("Logged out successfully.");
      closeMenus();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const accountProps: UserAccountProps = {
    user,
    isDropdownOpen,
    setIsDropdownOpen,
    isActive,
    closeMenus,
    loggingOut,
    handleLogout,
  };

  const renderNavLinks = (mobile = false) =>
    navLinks.map((link) => {
      const className = `text-sm font-medium transition-colors ${
        isActive(link.href)
          ? "text-[#6C4CF1]"
          : mobile
            ? "text-gray-700 hover:text-[#6C4CF1]"
            : "text-gray-600 hover:text-[#6C4CF1]"
      }`;

      if (link.href.startsWith("/#")) {
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenus}
            className={className}
          >
            {link.name}
          </a>
        );
      }

      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => handleNavClick(link.href)}
          className={className}
        >
          {link.name}
        </Link>
      );
    });

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!themeLoaded}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="flex items-center justify-center rounded-full border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          onClick={() => {
            setActiveHash("");
            closeMenus();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C4CF1] text-white">
            <Camera size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Studio<span className="text-[#6C4CF1]">Space</span>
            </h1>
            <p className="text-[10px] tracking-[2px] text-gray-500">
              CREATE YOUR SPACE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {renderNavLinks()}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {themeButton}

          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
          ) : user ? (
            <UserAccount {...accountProps} />
          ) : (
            <>
              <Link
                href={loginUrl}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#6C4CF1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5839D6]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {themeButton}

          <button
            type="button"
            onClick={() => {
              setIsOpen((previous) => !previous);
              setIsDropdownOpen(false);
            }}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-4">
            {renderNavLinks(true)}

            <div className="border-t border-gray-200 pt-4">
              {isPending ? (
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
              ) : user ? (
                <UserAccount {...accountProps} mobile />
              ) : (
                <div className="flex gap-3">
                  <Link
                    href={loginUrl}
                    onClick={closeMenus}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="flex-1 rounded-lg bg-[#6C4CF1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#5839D6]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
