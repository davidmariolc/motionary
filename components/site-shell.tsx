import Link from "next/link";
import { animations } from "@/lib/animations";

export const Brand = () => {
  return (
    <Link href="/" className="brand" aria-label="Motionary home">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 23V5h5l6 10 6-10h5v18h-5V13l-6 9-6-9v10Z"
          fill="currentColor"
        />
      </svg>
      <span>
        motionary<span className="brand-dot">.</span>
      </span>
    </Link>
  );
};
export const SiteHeader = () => {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav aria-label="Main navigation">
          <Link href="/#collection">The library</Link>
          <Link href="/#how-it-works">
            How to use <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <span className="header-note mono">A REFERENCE FOR THE RESTLESS.</span>
      </div>
    </header>
  );
};
export const SiteFooter = () => {
  return (
    <footer className="site-footer container">
      <div>
        <Brand />
        <p>A growing collection of things that move.</p>
      </div>
      <p className="mono">
        MADE FOR CURIOUS MINDS.
        <br />
        <span>{animations.length} MOTIONS. ENDLESS POSSIBILITIES.</span>
      </p>
    </footer>
  );
};
