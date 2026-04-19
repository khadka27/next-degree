/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Calculator,
  GraduationCap,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Settings,
  User,
  Calendar,
  Globe,
  TrendingUp,
  Award,
  ChevronRight,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

type TabKey =
  | "overview"
  | "saved-universities"
  | "saved-estimates"
  | "account-settings";

type MatchRecord = {
  id: string;
  createdAt?: string;
  costEstimate?: number;
  admissionChance?: number;
  visaSuccess?: number;
  matchData?: {
    id?: string;
    name?: string;
    country?: string;
    tuitionFee?: number;
  };
};

type ProfileState = {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  currentCountry: string;
  preferredCountry: string;
  degreeLevel: string;
  field: string;
  program: string;
  yearlyBudget: string;
  currency: string;
  hasEnglishTest: boolean | null;
  testType: string;
  englishScore: string;
  highestEducation: string;
  passingYear: string;
  gpa: string;
  dateOfBirth: string;
};

const DEFAULT_PROFILE: ProfileState = {
  name: "",
  username: "",
  email: "",
  phoneNumber: "",
  nationality: "",
  currentCountry: "",
  preferredCountry: "",
  degreeLevel: "",
  field: "",
  program: "",
  yearlyBudget: "",
  currency: "USD",
  hasEnglishTest: null,
  testType: "",
  englishScore: "",
  highestEducation: "",
  passingYear: "",
  gpa: "",
  dateOfBirth: "",
};

function sanitizeDate(dateString: string): string {
  if (!dateString) return "";
  const dt = new Date(dateString);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

function formatDateDisplay(dateString: string): string {
  if (!dateString) return "Not set";
  const dt = new Date(dateString);
  if (Number.isNaN(dt.getTime())) return "Not set";
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount?: number, currency = "USD") {
  if (!Number.isFinite(amount || Number.NaN) || (amount || 0) <= 0)
    return "N/A";
  return `${currency} ${(amount || 0).toLocaleString()}`;
}

function getEnglishAssessment(profile: ProfileState): string {
  if (profile.hasEnglishTest === false) return "Not taken";
  if (profile.testType && profile.englishScore) {
    return `${profile.testType}: ${profile.englishScore}`;
  }
  return "N/A";
}

function getGpaColor(gpa: string): string {
  const val = parseFloat(gpa);
  if (!gpa || isNaN(val)) return "from-slate-400 to-slate-500";
  if (val >= 3.7) return "from-emerald-400 to-teal-500";
  if (val >= 3.3) return "from-blue-400 to-indigo-500";
  if (val >= 2.7) return "from-amber-400 to-orange-500";
  return "from-red-400 to-rose-500";
}

function InfoRow({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/40 hover:shadow-sm">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"} transition-all duration-200`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
          {value || "Not set"}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-400" />
    </div>
  );
}

function StatBadge({
  value,
  label,
  gradient,
}: {
  value: string | number;
  label: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-px">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
      <div className="relative rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center">
        <p
          className={`bg-gradient-to-br ${gradient} bg-clip-text text-4xl font-black text-transparent`}
        >
          {value}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-300 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

const TABS = [
  { key: "overview" as TabKey, label: "Overview", icon: User },
  { key: "saved-universities" as TabKey, label: "Universities", icon: Bookmark },
  { key: "saved-estimates" as TabKey, label: "Estimates", icon: Calculator },
  { key: "account-settings" as TabKey, label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileState>(DEFAULT_PROFILE);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matchingRecords, setMatchingRecords] = useState<MatchRecord[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      void fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (!res.ok) {
        setError("Unable to load profile details.");
        return;
      }
      const data = await res.json();
      const fullName = data.name || "";
      const [first = "", ...rest] = fullName.split(" ");
      const p = data.profile || {};

      setFirstName(first);
      setLastName(rest.join(" "));
      setProfile({
        name: fullName,
        username: data.username || "",
        email: data.email || "",
        phoneNumber: data.phoneE164 || data.phoneNumber || "",
        nationality: p.nationality || "",
        currentCountry: p.currentCountry || "",
        preferredCountry: p.preferredCountry || "",
        degreeLevel: p.degreeLevel || "",
        field: p.field || "",
        program: p.program || "",
        yearlyBudget: p.yearlyBudget?.toString() || "",
        currency: p.currency || "USD",
        hasEnglishTest:
          typeof p.hasEnglishTest === "boolean" ? p.hasEnglishTest : null,
        testType: p.testType || "",
        englishScore: p.englishScore?.toString() || "",
        highestEducation: p.highestEducation || "",
        passingYear: p.passingYear?.toString() || "",
        gpa: p.gpa?.toString() || "",
        dateOfBirth: sanitizeDate(p.dob || ""),
      });
      setMatchingRecords(
        Array.isArray(data.matchingRecords) ? data.matchingRecords : [],
      );
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const combinedName = `${firstName} ${lastName}`.trim();
      const payload = {
        ...profile,
        name: combinedName || profile.name,
        countries: profile.preferredCountry ? [profile.preferredCountry] : [],
        degree: profile.degreeLevel,
        budget: profile.yearlyBudget,
        dob: profile.dateOfBirth || null,
      };
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile.");
        return;
      }
      setProfile((prev) => ({ ...prev, name: payload.name }));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
      await fetchProfile();
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    router.refresh();
  };

  const initials = useMemo(() => {
    const source = `${firstName} ${lastName}`.trim() || profile.name || "User";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [firstName, lastName, profile.name]);

  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`.trim() || profile.name || "Student";
  }, [firstName, lastName, profile.name]);

  const savedUniversities = useMemo(() => {
    const byId = new Map<string, MatchRecord>();
    for (const record of matchingRecords) {
      const key = record.matchData?.id || record.matchData?.name || record.id;
      if (!byId.has(key)) byId.set(key, record);
    }
    return Array.from(byId.values());
  }, [matchingRecords]);

  const savedEstimates = useMemo(() => {
    return matchingRecords.filter((item) => Number.isFinite(item.costEstimate));
  }, [matchingRecords]);

  const academicSummary = useMemo(() => {
    const pieces = [
      profile.highestEducation,
      profile.passingYear ? `Class of ${profile.passingYear}` : "",
    ].filter(Boolean);
    return pieces.length ? pieces.join(" • ") : "Not specified";
  }, [profile.highestEducation, profile.passingYear]);

  const profileCompleteness = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.phoneNumber,
      profile.nationality,
      profile.currentCountry,
      profile.preferredCountry,
      profile.degreeLevel,
      profile.field,
      profile.gpa,
      profile.highestEducation,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 pb-16 pt-24 md:px-6 lg:pt-28">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ——— Sidebar ——— */}
        <aside className="space-y-4">
          {/* Avatar card */}
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md">
            {/* Cover gradient */}
            <div className="h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600" />
            <div className="-mt-10 px-5 pb-5">
              <div className="mb-3 flex items-end justify-between">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-blue-200">
                    {initials || "S"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab("overview"); setIsEditing(true); }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">{fullName}</h2>
              <p className="text-xs font-medium text-slate-500">
                @{profile.username || "student"} · Student Account
              </p>
              {profile.currentCountry && (
                <div className="mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-500">{profile.currentCountry}</span>
                </div>
              )}

              {/* Profile completeness */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Profile Completion
                  </span>
                  <span className="text-xs font-bold text-blue-600">{profileCompleteness}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-3 shadow-xl shadow-slate-200/60 backdrop-blur-md">
            <nav className="space-y-1">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                    activeTab === key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === key ? "text-white" : "text-slate-400"}`} />
                  {label}
                  {key === "saved-universities" && savedUniversities.length > 0 && (
                    <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${activeTab === key ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                      {savedUniversities.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatBadge
              value={savedUniversities.length}
              label="Universities"
              gradient="from-blue-500 to-indigo-600"
            />
            <StatBadge
              value={savedEstimates.length}
              label="Estimates"
              gradient="from-violet-500 to-purple-600"
            />
          </div>
        </aside>

        {/* ——— Main content ——— */}
        <section className="space-y-0">
          {/* Toasts */}
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button type="button" onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {saved && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700">Profile saved successfully!</p>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md">
            {/* Tab header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {activeTab === "overview" && "Profile Overview"}
                  {activeTab === "saved-universities" && "Saved Universities"}
                  {activeTab === "saved-estimates" && "Saved Estimates"}
                  {activeTab === "account-settings" && "Account Settings"}
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  {activeTab === "overview" && "Your personal and academic information"}
                  {activeTab === "saved-universities" && `${savedUniversities.length} universities saved`}
                  {activeTab === "saved-estimates" && `${savedEstimates.length} cost estimates saved`}
                  {activeTab === "account-settings" && "Manage your account preferences"}
                </p>
              </div>
              {activeTab === "overview" && (
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                    isEditing
                      ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                  }`}
                >
                  {isEditing ? (
                    <><X className="h-4 w-4" /> Cancel</>
                  ) : (
                    <><Pencil className="h-4 w-4" /> Edit Profile</>
                  )}
                </button>
              )}
            </div>

            <div className="p-6">
              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && !isEditing && (
                <div className="space-y-8">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Personal Details */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                          <User className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                          Personal Details
                        </h2>
                      </div>
                      <div className="space-y-2">
                        <InfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={fullName} accent />
                        <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={profile.email || "Not set"} />
                        <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone Number" value={profile.phoneNumber || "Not set"} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Nationality" value={profile.nationality || "Not set"} />
                        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Current Country" value={profile.currentCountry || "Not set"} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={formatDateDisplay(profile.dateOfBirth)} />
                      </div>
                    </div>

                    {/* Academic Profile */}
                    <div>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                          Academic Profile
                        </h2>
                      </div>
                      <div className="space-y-2">
                        {/* GPA Hero Card */}
                        <div className="relative overflow-hidden rounded-2xl p-px">
                          <div className={`absolute inset-0 bg-gradient-to-br ${getGpaColor(profile.gpa)}`} />
                          <div className="relative rounded-2xl bg-white px-5 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                  GPA Score
                                </p>
                                <div className="mt-1 flex items-baseline gap-1">
                                  <span className={`bg-gradient-to-br ${getGpaColor(profile.gpa)} bg-clip-text text-4xl font-black text-transparent`}>
                                    {profile.gpa || "N/A"}
                                  </span>
                                  {profile.gpa && (
                                    <span className="text-lg font-bold text-slate-400">/ 4.0</span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs font-medium text-slate-500">{academicSummary}</p>
                              </div>
                              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getGpaColor(profile.gpa)} shadow-lg`}>
                                <Award className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Degree Level" value={profile.degreeLevel || "Not set"} />
                        <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Field & Program" value={[profile.field, profile.program].filter(Boolean).join(", ") || "Not specified"} />
                        <InfoRow icon={<TrendingUp className="h-4 w-4" />} label="English Test" value={getEnglishAssessment(profile)} />
                        <InfoRow icon={<MapPin className="h-4 w-4" />} label="Target Country" value={profile.preferredCountry || "Not set"} />
                      </div>
                    </div>
                  </div>

                  {/* Budget section */}
                  {profile.yearlyBudget && (
                    <div className="rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Annual Study Budget</p>
                          <p className="text-xl font-extrabold text-slate-900">
                            {formatCurrency(parseFloat(profile.yearlyBudget), profile.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── EDIT FORM ── */}
              {activeTab === "overview" && isEditing && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700">
                      ✦ Fill in your details to get more accurate university matches and visa success predictions.
                    </p>
                  </div>

                  {/* Personal info */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <User className="h-3.5 w-3.5" /> Personal Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <EditInput label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
                      <EditInput label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
                      <EditInput label="Email" type="email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} placeholder="john@example.com" />
                      <EditInput label="Date of Birth" type="date" value={profile.dateOfBirth} onChange={(v) => setProfile((p) => ({ ...p, dateOfBirth: v }))} />
                      <EditInput label="Nationality" value={profile.nationality} onChange={(v) => setProfile((p) => ({ ...p, nationality: v }))} placeholder="e.g. Nepali" />
                      <EditInput label="Current Country" value={profile.currentCountry} onChange={(v) => setProfile((p) => ({ ...p, currentCountry: v }))} placeholder="e.g. Nepal" />
                    </div>
                  </div>

                  {/* Academic info */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <GraduationCap className="h-3.5 w-3.5" /> Academic Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <EditInput label="Highest Education" value={profile.highestEducation} onChange={(v) => setProfile((p) => ({ ...p, highestEducation: v }))} placeholder="e.g. Bachelor's" />
                      <EditInput label="Passing Year" value={profile.passingYear} onChange={(v) => setProfile((p) => ({ ...p, passingYear: v }))} placeholder="e.g. 2023" />
                      <EditInput label="GPA" value={profile.gpa} onChange={(v) => setProfile((p) => ({ ...p, gpa: v }))} placeholder="e.g. 3.5" />
                      <EditInput label="Degree Level" value={profile.degreeLevel} onChange={(v) => setProfile((p) => ({ ...p, degreeLevel: v }))} placeholder="e.g. Master's" />
                      <EditInput label="Field of Study" value={profile.field} onChange={(v) => setProfile((p) => ({ ...p, field: v }))} placeholder="e.g. Computer Science" />
                      <EditInput label="Program" value={profile.program} onChange={(v) => setProfile((p) => ({ ...p, program: v }))} placeholder="e.g. Data Science" />
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      <Globe className="h-3.5 w-3.5" /> Preferences & Budget
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <EditInput label="Preferred Country" value={profile.preferredCountry} onChange={(v) => setProfile((p) => ({ ...p, preferredCountry: v }))} placeholder="e.g. Germany" />
                      <EditInput label="Yearly Budget" value={profile.yearlyBudget} onChange={(v) => setProfile((p) => ({ ...p, yearlyBudget: v }))} placeholder="e.g. 20000" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300 disabled:opacity-60"
                    >
                      {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                      ) : (
                        <><Check className="h-4 w-4" /> Save Profile</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── SAVED UNIVERSITIES ── */}
              {activeTab === "saved-universities" && (
                <div>
                  {savedUniversities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                        <Bookmark className="h-8 w-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-700">No saved universities yet</p>
                        <p className="mt-1 text-sm text-slate-400">Run a match to discover and save universities</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/matches")}
                        className="mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:shadow-lg"
                      >
                        Find Universities
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedUniversities.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/40 hover:shadow-sm"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-black text-blue-600">
                            {(item.matchData?.name || "U")[0]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900">
                              {item.matchData?.name || "University"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.matchData?.country || "Country not available"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Admission</p>
                            <p className="text-lg font-extrabold text-blue-600">
                              {item.admissionChance ?? "—"}
                              {item.admissionChance != null ? "%" : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SAVED ESTIMATES ── */}
              {activeTab === "saved-estimates" && (
                <div>
                  {savedEstimates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                        <Calculator className="h-8 w-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-700">No saved estimates yet</p>
                        <p className="mt-1 text-sm text-slate-400">Use the costing tool to generate and save estimates</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push("/costing")}
                        className="mt-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-200 hover:shadow-lg"
                      >
                        Estimate Costs
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedEstimates.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:border-violet-100 hover:bg-violet-50/40 hover:shadow-sm"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-xl font-black text-violet-600">
                            <Calculator className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900">
                              {item.matchData?.name || "Cost Estimate"}
                            </p>
                            <p className="text-sm text-slate-500">
                              Annual cost: {formatCurrency(item.costEstimate, profile.currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Visa</p>
                            <p className="text-lg font-extrabold text-violet-600">
                              {item.visaSuccess ?? "—"}
                              {item.visaSuccess != null ? "%" : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── ACCOUNT SETTINGS ── */}
              {activeTab === "account-settings" && (
                <div className="space-y-4">
                  <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/40">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Username</p>
                    <p className="mt-1 text-base font-bold text-slate-900">
                      @{profile.username || "Not set"}
                    </p>
                  </div>
                  <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/40">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                    <p className="mt-1 text-base font-bold text-slate-900">
                      {profile.email || "Not set"}
                    </p>
                  </div>
                  <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/40">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
                    <p className="mt-1 text-base font-bold text-slate-900">
                      {profile.phoneNumber || "Not set"}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => { setActiveTab("overview"); setIsEditing(true); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 hover:shadow-lg"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Profile Details
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
