import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/matches", label: "Find Universities" },
    { href: "/#features", label: "Features" },
    { href: "/#countries", label: "Destinations" },
    { href: "/#how-it-works", label: "How It Works" },
  ],
  Countries: [
    { href: "/matches?country=USA", label: "🇺🇸 United States" },
    { href: "/matches?country=UK", label: "🇬🇧 United Kingdom" },
    { href: "/matches?country=AU", label: "🇦🇺 Australia" },
    { href: "/matches?country=CA", label: "🇨🇦 Canada" },
    { href: "/matches?country=DE", label: "🇩🇪 Germany" },
    { href: "/matches?country=IE", label: "🇮🇪 Ireland" },
    { href: "/matches?country=NL", label: "🇳🇱 Netherlands" },
  ],
  "Data Sources": [
    { href: "https://collegescorecard.ed.gov", label: "US College Scorecard" },
    { href: "https://api.worqnow.ai", label: "WorqNow Education API" },
    { href: "https://api.data.gov", label: "Data.gov" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .nd-footer {
          background: #050510;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 72px 24px 36px;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        }
        .nd-footer-inner {
          max-width: 1160px;
          margin: 0 auto;
        }
        .nd-footer-top {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 64px;
        }
        @media (max-width: 900px) {
          .nd-footer-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .nd-footer-top { grid-template-columns: 1fr; gap: 36px; }
        }

        /* Brand column */
        .nd-footer-brand-logo {
          font-size: 22px;
          font-weight: 900;
          text-decoration: none;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .nd-footer-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #6366f1; box-shadow: 0 0 10px #6366f1;
          display: inline-block;
        }
        .nd-footer-tagline {
          font-size: 14px;
          color: #475569;
          line-height: 1.7;
          max-width: 260px;
          margin-bottom: 28px;
        }
        .nd-footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .nd-footer-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.5);
        }

        /* Column */
        .nd-col-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 18px;
        }
        .nd-col-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .nd-col-link {
          font-size: 14px;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nd-col-link:hover { color: #c7d2fe; }

        /* Bottom bar */
        .nd-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .nd-footer-copy {
          font-size: 13px;
          color: #334155;
        }
        .nd-footer-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .nd-badge {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 5px 12px;
          border-radius: 999px;
        }
      `}</style>

      <footer className="nd-footer">
        <div className="nd-footer-inner">
          {/* Top grid */}
          <div className="nd-footer-top">
            {/* Brand */}
            <div>
              <Link href="/" className="nd-footer-brand-logo">
                <span className="nd-footer-dot" />
                NextDegree
              </Link>
              <p className="nd-footer-tagline">
                Real-time university matching powered by government-grade
                education APIs. No login. No fees. Just results.
              </p>
              <Link href="/matches" className="nd-footer-cta">
                🎓 Find Universities →
              </Link>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <div className="nd-col-title">{group}</div>
                <ul className="nd-col-links">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="nd-col-link"
                        target={
                          l.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          l.href.startsWith("http") ? "noreferrer" : undefined
                        }
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="nd-footer-bottom">
            <p className="nd-footer-copy">
              © {year} NextDegree — Built for students, by students.
            </p>
            <div className="nd-footer-badges">
              <span className="nd-badge">✅ No Login Required</span>
              <span className="nd-badge">🌍 7 Countries</span>
              <span className="nd-badge">🏛️ Government Data</span>
              <span className="nd-badge">⚡ Real-Time</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
