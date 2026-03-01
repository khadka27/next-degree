"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FormData {
  name: string;
  degreeLevel: string;
  fieldOfStudy: string;
  gpa: string;
  englishTestType: string;
  englishScore: string;
  budget: string;
  currency: string;
  scholarshipNeeded: boolean;
  country: string;
}

interface UniversityMatch {
  id: string | number;
  name: string;
  location?: string;
  tuitionFee?: number;
  feeBand?: string | null;
  englishReq?: number;
  website?: string;
  admissionRate?: number;
  rankingWorld?: number;
  scholarships?: { name: string; value: string }[];
}

/* ─────────────────────────────────────────────
   Static Data
───────────────────────────────────────────── */
const COUNTRIES = [
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "USA", flag: "🇺🇸", name: "U.S.A." },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "UK", flag: "🇬🇧", name: "U.K." },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "NL", flag: "🇳🇱", name: "Netherlands" },
];

const DEGREE_LEVELS = [
  { value: "foundation", label: "Foundation" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "phd", label: "PhD" },
];

const ENGLISH_TESTS = ["IELTS", "TOEFL", "PTE", "Duolingo", "Cambridge"];
const CURRENCIES = ["USD", "GBP", "AUD", "CAD", "EUR", "NPR"];

const STEPS = [
  {
    id: 0,
    title: "Destination Country",
    question: "Which countries are you interested in?",
  },
  {
    id: 1,
    title: "Degree Level",
    question: "What level of degree are you pursuing?",
  },
  {
    id: 2,
    title: "English Proficiency",
    question: "What's your English test score?",
  },
  { id: 3, title: "Budget", question: "What's your annual tuition budget?" },
  { id: 4, title: "Your Profile", question: "Tell us a bit about yourself." },
  { id: 5, title: "Field of Study", question: "What do you want to study?" },
  {
    id: 6,
    title: "Your Matches",
    question: "Here are universities that match you!",
  },
];

const DEFAULTS: FormData = {
  name: "",
  degreeLevel: "bachelor",
  fieldOfStudy: "",
  gpa: "",
  englishTestType: "IELTS",
  englishScore: "",
  budget: "",
  currency: "USD",
  scholarshipNeeded: false,
  country: "",
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function fmt(n: number, cur = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 0,
  }).format(n);
}

function ScoreBadge({ score, test }: { score: string; test: string }) {
  const n = parseFloat(score);
  if (!n) return null;
  let label = "Developing",
    color = "#ef4444";
  if (test === "IELTS") {
    if (n >= 8) {
      label = "Expert";
      color = "#10b981";
    } else if (n >= 7) {
      label = "Good";
      color = "#3b82f6";
    } else if (n >= 6) {
      label = "Competent";
      color = "#f59e0b";
    }
  }
  if (test === "TOEFL") {
    if (n >= 100) {
      label = "Expert";
      color = "#10b981";
    } else if (n >= 87) {
      label = "Good";
      color = "#3b82f6";
    } else if (n >= 72) {
      label = "Competent";
      color = "#f59e0b";
    }
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        color,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: 99,
        padding: "3px 10px",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Result Card
───────────────────────────────────────────── */
function ResultCard({ m, currency }: { m: UniversityMatch; currency: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "18px 20px",
        border: "1px solid #e8ecf4",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 15,
              color: "#1a1a2e",
              lineHeight: 1.3,
            }}
          >
            {m.name}
          </p>
          {m.location && (
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              📍 {m.location}
            </p>
          )}
        </div>
        <span
          style={{
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            color: "#10b981",
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: 99,
            padding: "3px 10px",
          }}
        >
          ✓ Match
        </span>
      </div>

      {/* Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {m.tuitionFee ? (
          <span
            style={{
              fontSize: 12,
              color: "#6366f1",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
            }}
          >
            💰 {fmt(m.tuitionFee, currency)}/yr
          </span>
        ) : m.feeBand ? (
          <span
            style={{
              fontSize: 12,
              color: "#6366f1",
              background: "#eef2ff",
              border: "1px solid #c7d2fe",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            💰 {m.feeBand} fees
          </span>
        ) : null}
        {m.englishReq && m.englishReq > 0 && (
          <span
            style={{
              fontSize: 12,
              color: "#d97706",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
            }}
          >
            📝 IELTS {m.englishReq}+
          </span>
        )}
        {m.admissionRate && (
          <span
            style={{
              fontSize: 12,
              color: "#db2777",
              background: "#fdf2f8",
              border: "1px solid #fbcfe8",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
            }}
          >
            🎯 {Math.round(m.admissionRate * 100)}% acceptance
          </span>
        )}
        {m.rankingWorld && (
          <span
            style={{
              fontSize: 12,
              color: "#059669",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
            }}
          >
            🏆 #{m.rankingWorld} World
          </span>
        )}
        {m.scholarships && m.scholarships.length > 0 && (
          <span
            style={{
              fontSize: 12,
              color: "#b45309",
              background: "#fefce8",
              border: "1px solid #fef08a",
              borderRadius: 8,
              padding: "5px 10px",
              fontWeight: 600,
            }}
          >
            🎓 {m.scholarships.length} scholarships
          </span>
        )}
      </div>

      {m.website && (
        <a
          href={m.website}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 13,
            color: "#6366f1",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Visit website →
        </a>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function MatchesPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(DEFAULTS);
  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoDismissed, setInfoDismissed] = useState(false);

  function setF<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function doSearch() {
    setLoading(true);
    setError("");
    setMatches([]);
    setStep(6);
    try {
      const qs = new URLSearchParams({
        country: form.country,
        budget: form.budget || "0",
        englishScore: form.englishScore || "0",
        degreeLevel: form.degreeLevel,
      });
      const res = await fetch(`/api/matches?${qs}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e: unknown) {
      setError((e as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canContinue = () => {
    if (step === 0) return !!form.country;
    if (step === 1) return !!form.degreeLevel;
    if (step === 2) return !!form.englishScore;
    if (step === 3) return !!form.budget;
    if (step === 4) return !!form.name;
    return true;
  };

  function handleContinue() {
    if (step < 5) setStep((s) => s + 1);
    else doSearch();
  }

  const currentStep = STEPS[step];

  /* ══════════════════════════════════════════
     STYLES
  ══════════════════════════════════════════ */
  const page: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #e8edf8 0%, #f0f4ff 50%, #dde9f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px 48px",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    borderRadius: 28,
    boxShadow: "0 8px 48px rgba(0,0,0,0.10)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1.5px solid #e2e8f0",
    fontSize: 15,
    color: "#1e293b",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  /* ══════════════════════════════════════════
     STEP CONTENT
  ══════════════════════════════════════════ */

  /* Step 0 — Country */
  const step0Content = (
    <>
      {/* Info Banner */}
      {!infoDismissed && (
        <div
          style={{
            margin: "4px 0 16px",
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(135deg,#1e3a5f,#2d6a4f)",
            minHeight: 100,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
            }}
          />
          <div style={{ position: "relative", padding: "16px 20px", flex: 1 }}>
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              🌟 Home to 8 of the world&apos;s top 10 universities.
              <br />
              <span style={{ fontWeight: 400, fontSize: 13 }}>
                We&apos;ll help you navigate the application process.
              </span>
            </p>
            <button
              onClick={() => setInfoDismissed(true)}
              style={{
                marginTop: 10,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 99,
                padding: "4px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Tap to dismiss
            </button>
          </div>
          {/* Floating flags */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 12,
              display: "flex",
              gap: 4,
              fontSize: 24,
              opacity: 0.85,
            }}
          >
            <span>🇺🇸</span>
            <span>🇨🇦</span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              fontSize: 24,
              opacity: 0.85,
            }}
          >
            <span>🇦🇺</span>
          </div>
        </div>
      )}

      {/* Country Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {COUNTRIES.map((c) => {
          const sel = form.country === c.code;
          return (
            <button
              key={c.code}
              onClick={() => setF("country", c.code)}
              style={{
                background: sel ? "#eef2ff" : "#f8fafc",
                border: sel ? "2px solid #6366f1" : "2px solid #e8ecf4",
                borderRadius: 16,
                padding: "18px 10px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
                transition: "all 0.18s",
                boxShadow: sel
                  ? "0 4px 16px rgba(99,102,241,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Checkmark */}
              {sel && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
              <span style={{ fontSize: 32, lineHeight: 1 }}>{c.flag}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: sel ? 700 : 500,
                  color: sel ? "#6366f1" : "#374151",
                }}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  /* Step 1 — Degree */
  const step1Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {DEGREE_LEVELS.map((d) => {
        const sel = form.degreeLevel === d.value;
        return (
          <button
            key={d.value}
            onClick={() => setF("degreeLevel", d.value)}
            style={{
              background: sel ? "#eef2ff" : "#f8fafc",
              border: sel ? "2px solid #6366f1" : "2px solid #e8ecf4",
              borderRadius: 14,
              padding: "14px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.15s",
              boxShadow: sel ? "0 2px 10px rgba(99,102,241,0.12)" : "none",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: sel ? 700 : 500,
                color: sel ? "#6366f1" : "#374151",
              }}
            >
              {d.label}
            </span>
            {sel && (
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#6366f1",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  /* Step 2 — English Score */
  const step2Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Test Type */}
      <div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Test Type
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ENGLISH_TESTS.map((t) => {
            const sel = form.englishTestType === t;
            return (
              <button
                key={t}
                onClick={() => setF("englishTestType", t)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: sel ? "2px solid #6366f1" : "2px solid #e2e8f0",
                  background: sel ? "#eef2ff" : "#f8fafc",
                  color: sel ? "#6366f1" : "#475569",
                  fontWeight: sel ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score */}
      <div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            display: "block",
            marginBottom: 8,
          }}
        >
          {form.englishTestType} Score{" "}
          {form.englishTestType === "IELTS" ? "(0–9)" : "(0–120)"}
        </label>
        <input
          type="number"
          value={form.englishScore}
          placeholder={
            form.englishTestType === "IELTS" ? "e.g. 6.5" : "e.g. 90"
          }
          min="0"
          max={form.englishTestType === "IELTS" ? "9" : "120"}
          step={form.englishTestType === "IELTS" ? "0.5" : "1"}
          onChange={(e) => setF("englishScore", e.target.value)}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />
        {form.englishScore && (
          <div style={{ marginTop: 10 }}>
            <ScoreBadge score={form.englishScore} test={form.englishTestType} />
          </div>
        )}
      </div>
    </div>
  );

  /* Step 3 — Budget */
  const step3Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Currency
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CURRENCIES.map((c) => {
            const sel = form.currency === c;
            return (
              <button
                key={c}
                onClick={() => setF("currency", c)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 10,
                  border: sel ? "2px solid #6366f1" : "2px solid #e2e8f0",
                  background: sel ? "#eef2ff" : "#f8fafc",
                  color: sel ? "#6366f1" : "#475569",
                  fontWeight: sel ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            display: "block",
            marginBottom: 8,
          }}
        >
          Max Annual Tuition ({form.currency})
        </label>
        <input
          type="number"
          value={form.budget}
          min="0"
          placeholder="e.g. 25000"
          onChange={(e) => setF("budget", e.target.value)}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
            e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Scholarship toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f8fafc",
          borderRadius: 14,
          padding: "14px 16px",
          border: "1.5px solid #e2e8f0",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 14,
              color: "#1e293b",
            }}
          >
            Open to Scholarships?
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
            Also show scholarship-eligible programs
          </p>
        </div>
        <button
          onClick={() => setF("scholarshipNeeded", !form.scholarshipNeeded)}
          style={{
            width: 46,
            height: 26,
            borderRadius: 13,
            border: "none",
            background: form.scholarshipNeeded ? "#6366f1" : "#cbd5e1",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.3s",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: form.scholarshipNeeded ? 22 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.3s",
              display: "block",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>
    </div>
  );

  /* Step 4 — Profile */
  const step4Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        {
          key: "name",
          label: "Full Name",
          placeholder: "e.g. Aarav Khadka",
          type: "text",
        },
        {
          key: "gpa",
          label: "GPA / Grade",
          placeholder: "e.g. 3.5",
          type: "number",
        },
      ].map((f) => (
        <div key={f.key}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              display: "block",
              marginBottom: 8,
            }}
          >
            {f.label}
          </label>
          <input
            type={f.type}
            value={form[f.key as keyof FormData] as string}
            placeholder={f.placeholder}
            onChange={(e) => setF(f.key as keyof FormData, e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      ))}
    </div>
  );

  /* Step 5 — Field of Study */
  const step5Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[
        "Computer Science",
        "Business & Management",
        "Engineering",
        "Medicine & Health",
        "Law",
        "Arts & Humanities",
        "Data Science",
        "Other",
      ].map((f) => {
        const sel = form.fieldOfStudy === f;
        return (
          <button
            key={f}
            onClick={() => setF("fieldOfStudy", f)}
            style={{
              background: sel ? "#eef2ff" : "#f8fafc",
              border: sel ? "2px solid #6366f1" : "2px solid #e8ecf4",
              borderRadius: 14,
              padding: "12px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: sel ? 700 : 500,
                color: sel ? "#6366f1" : "#374151",
              }}
            >
              {f}
            </span>
            {sel && (
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#6366f1",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  /* Step 6 — Results */
  const step6Content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 24px" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid #e8ecf4",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 18px",
            }}
          />
          <p
            style={{
              color: "#64748b",
              fontSize: 15,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Finding your universities…
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#ef4444",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            ⚠️ {error}
          </p>
          <button
            onClick={() => setStep(5)}
            style={{
              marginTop: 12,
              padding: "8px 18px",
              borderRadius: 10,
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              color: "#64748b",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ← Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Summary banner */}
          <div
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius: 16,
              padding: "16px 18px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            >
              Hi{" "}
              <strong style={{ color: "#fff" }}>{form.name || "there"}</strong>!
              Based on your profile:
            </p>
            <p
              style={{
                margin: "6px 0 0",
                color: "#fff",
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              {matches.length > 0
                ? `${matches.length} universities match 🎉`
                : "No matches found"}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 10,
              }}
            >
              {[
                COUNTRIES.find((c) => c.code === form.country)?.flag +
                  " " +
                  COUNTRIES.find((c) => c.code === form.country)?.name,
                `${form.englishTestType} ${form.englishScore}`,
                form.budget
                  ? `Budget: ${form.currency} ${Number(form.budget).toLocaleString()}`
                  : null,
              ]
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.9)",
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 99,
                      padding: "3px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* University cards */}
          {matches.map((m) => (
            <ResultCard key={m.id} m={m} currency={form.currency} />
          ))}

          {matches.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 16px",
                color: "#94a3b8",
              }}
            >
              <p style={{ fontSize: 32, margin: "0 0 10px" }}>🔍</p>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#475569",
                  margin: "0 0 6px",
                }}
              >
                No matches found
              </p>
              <p style={{ fontSize: 13, margin: 0 }}>
                Try increasing your budget or adjusting your English score.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={() => {
                setStep(3);
                setMatches([]);
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Refine ←
            </button>
            <button
              onClick={() => {
                setStep(0);
                setForm(DEFAULTS);
                setMatches([]);
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              Start Over
            </button>
          </div>
        </>
      )}
    </div>
  );

  const stepContents = [
    step0Content,
    step1Content,
    step2Content,
    step3Content,
    step4Content,
    step5Content,
    step6Content,
  ];

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div style={page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        button:active { transform: scale(0.97); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <div style={card}>
        {/* ── Top bar ── */}
        <div style={{ padding: "20px 24px 0" }}>
          {/* Step label + counter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
              {currentStep.title}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
              {step + 1}/{STEPS.length}
            </span>
          </div>

          {/* Progress track */}
          <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 99,
                  background: i <= step ? "#6366f1" : "#e2e8f0",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          {/* Mascot + Question */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {/* Mascot */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              🎓
            </div>
            {/* Bubble */}
            <div
              style={{
                background: "#f0f4ff",
                borderRadius: "0 16px 16px 16px",
                padding: "12px 16px",
                flex: 1,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  lineHeight: 1.35,
                }}
              >
                {currentStep.question}
              </p>
            </div>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div
          style={{
            padding: "0 24px",
            overflowY: "auto",
            flex: 1,
            maxHeight: 480,
          }}
        >
          {stepContents[step]}
          <div style={{ height: 24 }} />
        </div>

        {/* ── Fixed bottom button ── */}
        {step < 6 && (
          <div
            style={{
              padding: "16px 24px 28px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                style={{
                  width: "100%",
                  marginBottom: 10,
                  padding: "13px",
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: canContinue()
                  ? "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)"
                  : "#c4c9f0",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                cursor: canContinue() ? "pointer" : "not-allowed",
                boxShadow: canContinue()
                  ? "0 6px 24px rgba(99,102,241,0.45)"
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18 }}>✦</span>
              {step === 5 ? "Find My Universities" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
