"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#countries", label: "Countries" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .nd-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          background: rgba(8, 8, 24, 0.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .nd-nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        /* Logo */
        .nd-logo {
          font-size: 22px;
          font-weight: 900;
          text-decoration: none;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nd-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 10px #6366f1;
          display: inline-block;
          flex-shrink: 0;
        }

        /* Links */
        .nd-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
        }
        .nd-link {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
        }
        .nd-link:hover,
        .nd-link.active {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.07);
        }

        /* CTA */
        .nd-cta {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 9px 20px;
          border-radius: 10px;
          margin-left: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
          white-space: nowrap;
        }
        .nd-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }

        /* Mobile */
        @media (max-width: 700px) {
          .nd-links { display: none; }
        }
      `}</style>

      <nav className="nd-nav">
        <div className="nd-nav-inner">
          {/* Logo */}
          <Link href="/" className="nd-logo">
            <span className="nd-logo-dot" />
            NextDegree
          </Link>

          {/* Links */}
          <ul className="nd-links">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`nd-link${pathname === l.href ? " active" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/matches"
            className="nd-cta"
            aria-label="Find universities that match your profile"
          >
            🎓 Find Universities
          </Link>
        </div>
      </nav>
    </>
  );
}
