import Link from "next/link";
import CountryCard from "@/components/CountryCard";

/* ─────────────────────────────────────────────
   Static Data
───────────────────────────────────────────── */
const STATS = [
  { value: "65+", label: "API Endpoints" },
  { value: "7", label: "Countries" },
  { value: "6K+", label: "Universities" },
  { value: "100%", label: "Free to Use" },
];

const COUNTRIES = [
  {
    flag: "🇺🇸",
    name: "United States",
    universities: "4,000+",
    color: "#3b82f6",
  },
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    universities: "160+",
    color: "#8b5cf6",
  },
  { flag: "🇦🇺", name: "Australia", universities: "43+", color: "#10b981" },
  { flag: "🇨🇦", name: "Canada", universities: "100+", color: "#f59e0b" },
  { flag: "🇩🇪", name: "Germany", universities: "400+", color: "#ef4444" },
  { flag: "🇮🇪", name: "Ireland", universities: "30+", color: "#06b6d4" },
  { flag: "🇳🇱", name: "Netherlands", universities: "80+", color: "#ec4899" },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Smart Matching",
    desc: "Our engine scores thousands of universities against your budget, IELTS score, degree level, and preferred country — instantly.",
    color: "#6366f1",
  },
  {
    icon: "💰",
    title: "Budget-Aware",
    desc: "Set your maximum yearly tuition and get only universities you can actually afford. No surprises, no gatekeeping.",
    color: "#10b981",
  },
  {
    icon: "🌐",
    title: "Multi-Country Data",
    desc: "Powered by government-grade APIs covering 7 countries and 6,000+ institutions — always fresh, always accurate.",
    color: "#f59e0b",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "No waiting. Type your profile, hit search, and see a curated list of matching universities in under 2 seconds.",
    color: "#ec4899",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Fill Your Profile",
    desc: "Enter your name, degree level, GPA and intended field of study.",
  },
  {
    step: "02",
    title: "Add Academic Scores",
    desc: "Tell us your IELTS, TOEFL or PTE score — we check it against each university's requirement.",
  },
  {
    step: "03",
    title: "Set Your Budget",
    desc: "Pick your destination country and yearly tuition limit. Toggle scholarship interest.",
  },
  {
    step: "04",
    title: "Get Matches",
    desc: "We scan thousands of programs and surface only the ones that truly fit you.",
  },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: #080818;
          color: #f1f5f9;
          overflow-x: hidden;
        }

        /* Utility */
        .gradient-text {
          background: linear-gradient(135deg, #818cf8, #c084fc, #fb7185);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fade-up 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.45s; }
        .delay-5 { animation-delay: 0.6s; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.35);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #a5b4fc;
          margin-bottom: 28px;
        }
        .hero-badge span {
          width: 8px; height: 8px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 8px #6366f1;
          display: inline-block;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          padding: 16px 36px;
          border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 8px 30px rgba(99,102,241,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99,102,241,0.6);
        }
        .cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          animation: pulse-ring 2s ease-out infinite;
          z-index: -1;
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 16px;
          font-weight: 600;
          padding: 16px 28px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.09);
          color: #f1f5f9;
          border-color: rgba(255,255,255,0.25);
        }

        /* Sections */
        section { padding: 100px 24px; }

        .section-inner {
          max-width: 1160px;
          margin: 0 auto;
        }

        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 14px;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          line-height: 1.1;
          color: #f1f5f9;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 17px;
          color: #64748b;
          max-width: 560px;
          line-height: 1.7;
        }

        /* Feature Cards */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 56px;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 16px;
          display: block;
        }
        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }

        /* Country Grid */
        .country-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 48px;
        }
        .country-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px 16px;
          text-align: center;
          text-decoration: none;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .country-card:hover {
          transform: translateY(-4px);
        }
        .country-flag { font-size: 36px; display: block; margin-bottom: 10px; }
        .country-name { font-size: 14px; font-weight: 700; color: #e2e8f0; }
        .country-unis { font-size: 12px; color: #64748b; margin-top: 4px; }

        /* Stats bar */
        .stats-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .stat-item {
          flex: 1;
          min-width: 140px;
          padding: 36px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 13px; color: #64748b; margin-top: 6px; font-weight: 500; }

        /* Steps */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 56px;
          position: relative;
        }
        .step-card {
          position: relative;
          padding: 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
        }
        .step-number {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #6366f1;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .step-title {
          font-size: 17px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 10px;
        }
        .step-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.7;
        }

        /* Nav */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(8,8,24,0.7);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 0 32px;
        }
        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-size: 20px;
          font-weight: 900;
          text-decoration: none;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 10px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: #f1f5f9; background: rgba(255,255,255,0.06); }
        .nav-cta {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 9px 20px;
          border-radius: 10px;
          transition: opacity 0.2s;
        }
        .nav-cta:hover { opacity: 0.9; }

        /* Footer */
        footer {
          padding: 48px 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          text-align: center;
          color: #475569;
          font-size: 14px;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
          border-top: 1px solid rgba(99,102,241,0.2);
          border-bottom: 1px solid rgba(99,102,241,0.2);
          text-align: center;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .nav-link { display: none; }
          .hero-actions { flex-direction: column; }
          .stats-bar { flex-direction: column; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          section { padding: 72px 20px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            NextDegree
          </Link>
          <div className="nav-links">
            <Link href="#features" className="nav-link">
              Features
            </Link>
            <Link href="#countries" className="nav-link">
              Countries
            </Link>
            <Link href="#how-it-works" className="nav-link">
              How it works
            </Link>
            <Link href="/matches" className="nav-cta">
              Find Universities →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 120,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div className="hero-badge fade-up">
            <span /> Powered by real government university data
          </div>

          <h1
            className="fade-up delay-1"
            style={{
              fontSize: "clamp(40px, 6vw, 76px)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 28,
              letterSpacing: "-0.02em",
            }}
          >
            Find universities that{" "}
            <span className="gradient-text">actually fit you</span>
          </h1>

          <p
            className="fade-up delay-2"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#64748b",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 44px",
            }}
          >
            Enter your English score, budget, and dream country. We instantly
            match you against 6,000+ programs across 7 countries — no guesswork,
            no forms, no fees.
          </p>

          <div
            className="hero-actions fade-up delay-3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href="/matches" className="cta-primary">
              🎓 Find My Match
            </Link>
            <Link href="#how-it-works" className="cta-secondary">
              See How It Works ↓
            </Link>
          </div>

          {/* Trust note */}
          <p
            className="fade-up delay-4"
            style={{
              marginTop: 36,
              fontSize: 13,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span>🇺🇸 College Scorecard API</span>
            <span style={{ color: "#1e293b" }}>|</span>
            <span>🌍 WorqNow Education API</span>
            <span style={{ color: "#1e293b" }}>|</span>
            <span>✅ No account required</span>
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar fade-up delay-5">
        {STATS.map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features">
        <div className="section-inner">
          <div className="section-label">Why NextDegree</div>
          <h2 className="section-title">
            Built different for students
            <br />
            who want real answers
          </h2>
          <p className="section-sub">
            No paywalls. No fake rankings. Just your numbers, matched to real
            data.
          </p>

          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div
                className="feature-card"
                key={f.title}
                style={{ borderTop: `3px solid ${f.color}22` }}
              >
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title" style={{ color: f.color }}>
                  {f.title}
                </div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRIES ── */}
      <section id="countries" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-label">Destinations</div>
          <h2 className="section-title">
            7 countries,
            <br />
            one search
          </h2>
          <p className="section-sub">
            We pull live data for each country — tuition costs, entry
            requirements, visa guidance, and more.
          </p>

          <div className="country-grid">
            {COUNTRIES.map((c) => (
              <CountryCard
                key={c.name}
                flag={c.flag}
                name={c.name}
                universities={c.universities}
                color={c.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works">
        <div className="section-inner">
          <div className="section-label">Process</div>
          <h2 className="section-title">
            From zero to shortlist
            <br />
            in under 2 minutes
          </h2>
          <p className="section-sub">
            No account needed. No email required. Just fill in the form and let
            the engine do the rest.
          </p>

          <div className="steps-grid">
            {HOW_IT_WORKS.map((s, i) => (
              <div
                className="step-card"
                key={s.step}
                style={{
                  borderTop:
                    i === 0
                      ? "3px solid #6366f1"
                      : i === 1
                        ? "3px solid #8b5cf6"
                        : i === 2
                          ? "3px solid #10b981"
                          : "3px solid #f59e0b",
                }}
              >
                <span className="step-number">STEP {s.step}</span>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="cta-section">
        <div className="section-inner" style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              margin: "0 auto 24px",
              boxShadow: "0 0 40px rgba(99,102,241,0.4)",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            🎓
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 900,
              marginBottom: 16,
              color: "#f1f5f9",
            }}
          >
            Ready to find your match?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#64748b",
              maxWidth: 480,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Takes under 2 minutes. No login. No credit card. Just real results.
          </p>
          <Link
            href="/matches"
            className="cta-primary"
            style={{ display: "inline-flex" }}
          >
            🔍 Start Matching Now →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 12,
          }}
        >
          NextDegree
        </div>
        <p style={{ color: "#334155" }}>
          Powered by{" "}
          <a
            href="https://collegescorecard.ed.gov"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#6366f1", textDecoration: "none" }}
          >
            U.S. College Scorecard
          </a>
          {" & "}
          <a
            href="https://api.worqnow.ai"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#8b5cf6", textDecoration: "none" }}
          >
            WorqNow Education API
          </a>
        </p>
        <p style={{ marginTop: 8, color: "#1e293b" }}>
          © {new Date().getFullYear()} NextDegree. Built for students, by
          students.
        </p>
      </footer>
    </>
  );
}
