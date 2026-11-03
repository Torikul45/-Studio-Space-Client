import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-base-100 px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <p className="mb-4 text-8xl font-extrabold text-primary">404</p>

        <h1 className="mb-3 text-3xl font-bold text-base-content">
          Oops! Page Not Found
        </h1>

        <p className="mb-8 text-base-content/60">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to StudioSpace.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary gap-2">
            <Home size={18} />
            Back to Home
          </Link>

          <Link href="/studios" className="btn btn-outline gap-2">
            <Search size={18} />
            Explore Studios
          </Link>
        </div>
      </div>
    </main>
  );
}
