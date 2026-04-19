"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Shield,
  User,
  X,
} from "lucide-react";

type AdditionalInfoForm = {
  email: string;
  phoneNumber: string;
  countryDialCode: string;
  phoneVerified: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  firstLanguage: string;
  citizenshipCountry: string;
  passportNumber: string;
  passportExpiryDate: string;
  maritalStatus: "Single" | "Married" | "";
  gender: "Male" | "Female" | "";
  addressLine: string;
  cityTown: string;
  country: string;
  provinceState: string;
  postalZipCode: string;
  countryOfEducation: string;
  highestEducation: string;
  gradeAverage: string;
  graduatedInstitution: boolean;
};

const COUNTRY_OPTIONS = [
  "Nepal",
  "India",
  "Canada",
  "United States",
  "United Kingdom",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
];

const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
];

const PROVINCE_OPTIONS = [
  "Province 1",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const REQUIRED_FIELDS: Array<keyof AdditionalInfoForm> = [
  "firstName",
  "lastName",
  "dob",
  "firstLanguage",
  "citizenshipCountry",
  "passportNumber",
  "passportExpiryDate",
  "maritalStatus",
  "gender",
  "addressLine",
  "cityTown",
  "country",
  "provinceState",
  "countryOfEducation",
  "highestEducation",
  "gradeAverage",
];

function defaultForm(): AdditionalInfoForm {
  return {
    email: "",
    phoneNumber: "",
    countryDialCode: "+1",
    phoneVerified: false,
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    firstLanguage: "",
    citizenshipCountry: "Nepal",
    passportNumber: "",
    passportExpiryDate: "",
    maritalStatus: "",
    gender: "",
    addressLine: "",
    cityTown: "",
    country: "Nepal",
    provinceState: "",
    postalZipCode: "",
    countryOfEducation: "",
    highestEducation: "",
    gradeAverage: "",
    graduatedInstitution: true,
  };
}

function splitName(fullName: string) {
  const [first = "", ...rest] = (fullName || "").trim().split(" ");
  if (!first) return { firstName: "", lastName: "" };
  return { firstName: first, lastName: rest.join(" ") };
}

/* ─── Sub-components ──────────────────────────────────────────── */

function SectionHeader({
  icon,
  title,
  subtitle,
  open,
  onToggle,
  filled,
  total,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  filled: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const complete = filled === total;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-4 text-left"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
          complete
            ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-200"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200"
        }`}
      >
        {complete ? <Check className="h-5 w-5" /> : icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
          {complete && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              Complete
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">{subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {filled}/{total}
          </span>
        </div>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600">
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
    </button>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-300 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${
        hasError
          ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
          : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
      }`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  hasError?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border bg-slate-50 px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${
          hasError
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ValidationMsg({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-rose-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {text}
    </p>
  );
}

function ToggleOption({
  label,
  checked,
  onClick,
  hasError,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  hasError?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
        checked
          ? "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm shadow-blue-100"
          : hasError
            ? "border-rose-200 bg-white text-slate-600 hover:bg-rose-50"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      {checked ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-slate-300" />
      )}
      {label}
    </button>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export default function AdditionalInformationPage() {
  const router = useRouter();
  const { status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<AdditionalInfoForm>(defaultForm());
  const [showErrors, setShowErrors] = useState(false);
  const [openSection, setOpenSection] = useState({
    personal: true,
    address: false,
    education: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      void loadProfile();
    }
  }, [status, router]);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        setError("Unable to load additional information.");
        return;
      }
      const data = await res.json();
      const p = data.profile || {};
      const names = splitName(data.name || "");
      setForm({
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        countryDialCode: data.countryDialCode || "+1",
        phoneVerified: !!data.phoneVerified,
        firstName: names.firstName,
        middleName: p.middleName || "",
        lastName: names.lastName,
        dob: p.dob || "",
        firstLanguage: p.firstLanguage || "",
        citizenshipCountry: p.citizenshipCountry || p.nationality || "Nepal",
        passportNumber: p.passportNumber || "",
        passportExpiryDate: p.passportExpiryDate || "",
        maritalStatus: p.maritalStatus || "",
        gender: p.gender || "",
        addressLine: p.addressLine || "",
        cityTown: p.cityTown || "",
        country: p.currentCountry || "Nepal",
        provinceState: p.provinceState || "",
        postalZipCode: p.postalZipCode || "",
        countryOfEducation: p.countryOfEducation || "",
        highestEducation: p.highestEducation || "",
        gradeAverage: p.gpa?.toString() || "",
        graduatedInstitution: p.graduatedInstitution ?? true,
      });
    } catch {
      setError("Unable to load additional information.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof AdditionalInfoForm>(
    key: K,
    value: AdditionalInfoForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fieldError = (key: keyof AdditionalInfoForm) => {
    if (!showErrors || !REQUIRED_FIELDS.includes(key)) return false;
    const value = form[key];
    if (typeof value === "string") return !value.trim();
    return !value;
  };

  const missingRequiredCount = useMemo(() => {
    return REQUIRED_FIELDS.filter((key) => {
      const value = form[key];
      if (typeof value === "string") return !value.trim();
      return !value;
    }).length;
  }, [form]);

  // Section fill counts
  const personalFields: Array<keyof AdditionalInfoForm> = [
    "firstName", "lastName", "dob", "firstLanguage",
    "citizenshipCountry", "passportNumber", "passportExpiryDate",
    "maritalStatus", "gender",
  ];
  const addressFields: Array<keyof AdditionalInfoForm> = [
    "addressLine", "cityTown", "country", "provinceState",
  ];
  const educationFields: Array<keyof AdditionalInfoForm> = [
    "countryOfEducation", "highestEducation", "gradeAverage",
  ];

  function countFilled(fields: Array<keyof AdditionalInfoForm>) {
    return fields.filter((k) => {
      const v = form[k];
      return typeof v === "string" ? v.trim().length > 0 : Boolean(v);
    }).length;
  }

  const handleVerifyPhone = async () => {
    setError("Phone verification is not yet enabled. Continue with save for now.");
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (missingRequiredCount > 0) return;
    setSaving(true);
    setError("");
    try {
      const fullName = [form.firstName, form.middleName, form.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      const payload = {
        name: fullName,
        email: form.email,
        nationality: form.citizenshipCountry,
        currentCountry: form.country,
        highestEducation: form.highestEducation,
        passingYear: "",
        gpa: form.gradeAverage,
        middleName: form.middleName,
        dob: form.dob,
        firstLanguage: form.firstLanguage,
        citizenshipCountry: form.citizenshipCountry,
        passportNumber: form.passportNumber,
        passportExpiryDate: form.passportExpiryDate,
        maritalStatus: form.maritalStatus,
        gender: form.gender,
        addressLine: form.addressLine,
        cityTown: form.cityTown,
        provinceState: form.provinceState,
        postalZipCode: form.postalZipCode,
        countryOfEducation: form.countryOfEducation,
        graduatedInstitution: form.graduatedInstitution,
      };
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save additional information.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
          </div>
          <p className="text-sm font-semibold text-slate-500">Loading your information…</p>
        </div>
      </div>
    );
  }

  const totalRequired = REQUIRED_FIELDS.length;
  const totalFilled = totalRequired - missingRequiredCount;
  const overallPct = Math.round((totalFilled / totalRequired) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-4 pb-16 pt-24 md:px-6 lg:pt-28">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl space-y-5">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/profile" className="flex items-center gap-1 transition-colors hover:text-blue-600">
                <ArrowLeft className="h-3.5 w-3.5" /> Profile
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-600">Additional Information</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
              Additional Information
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Complete your profile to unlock personalized university matches.
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>

        {/* ── Overall progress card ── */}
        <div className="rounded-3xl border border-white/80 bg-white/80 px-5 py-4 shadow-xl shadow-slate-200/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Overall Completion
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                {totalFilled} of {totalRequired} required fields filled
              </p>
            </div>
            <span
              className={`text-2xl font-black ${overallPct === 100 ? "text-emerald-500" : "text-blue-600"}`}
            >
              {overallPct}%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${overallPct === 100 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* ── Toasts ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <p className="flex-1 text-sm font-medium text-rose-700">{error}</p>
            <button type="button" onClick={() => setError("")} className="text-rose-400 hover:text-rose-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">
              Additional information saved successfully!
            </p>
          </div>
        )}
        {showErrors && missingRequiredCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">
              Please fill in all {missingRequiredCount} required field{missingRequiredCount > 1 ? "s" : ""} before saving.
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════
            SECTION 1 — Personal Information
        ════════════════════════════════════════ */}
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md">
          <div className="border-b border-slate-100 px-6 py-5">
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title="Personal Information"
              subtitle="Identity, passport & contact details"
              open={openSection.personal}
              onToggle={() =>
                setOpenSection((p) => ({ ...p, personal: !p.personal }))
              }
              filled={countFilled(personalFields)}
              total={personalFields.length}
            />
          </div>

          {openSection.personal && (
            <div className="space-y-5 p-6">
              {/* Email */}
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <FieldLabel label="Email Address" />
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex items-end">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-600">
                    <Check className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <FieldLabel label="Phone Number" />
                  <div className="flex">
                    <div className="flex items-center gap-1.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3.5 text-sm font-semibold text-slate-600">
                      +1 <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <input
                      value={form.phoneNumber}
                      onChange={(e) => updateField("phoneNumber", e.target.value)}
                      placeholder="Phone number"
                      className="min-w-0 flex-1 rounded-r-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  {!form.phoneVerified && (
                    <p className="mt-1.5 text-xs text-amber-600 font-medium">
                      Please verify your phone number before saving changes.
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleVerifyPhone}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 hover:shadow-lg transition-all"
                  >
                    <Phone className="h-3.5 w-3.5" /> Verify
                  </button>
                </div>
              </div>

              {/* Name row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <FieldLabel label="First Name" required />
                  <TextInput
                    value={form.firstName}
                    onChange={(v) => updateField("firstName", v)}
                    placeholder="John"
                    hasError={fieldError("firstName")}
                  />
                  <ValidationMsg show={fieldError("firstName")} text="First name is required" />
                </div>
                <div>
                  <FieldLabel label="Middle Name" />
                  <TextInput
                    value={form.middleName}
                    onChange={(v) => updateField("middleName", v)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <FieldLabel label="Last Name" required />
                  <TextInput
                    value={form.lastName}
                    onChange={(v) => updateField("lastName", v)}
                    placeholder="Doe"
                    hasError={fieldError("lastName")}
                  />
                  <ValidationMsg show={fieldError("lastName")} text="Last name is required" />
                </div>
              </div>

              {/* DOB / Language / Citizenship */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <FieldLabel label="Date of Birth" required />
                  <TextInput
                    type="date"
                    value={form.dob}
                    onChange={(v) => updateField("dob", v)}
                    hasError={fieldError("dob")}
                  />
                  <ValidationMsg show={fieldError("dob")} text="Date of birth is required" />
                </div>
                <div>
                  <FieldLabel label="First Language" required />
                  <TextInput
                    value={form.firstLanguage}
                    onChange={(v) => updateField("firstLanguage", v)}
                    placeholder="e.g. Nepali"
                    hasError={fieldError("firstLanguage")}
                  />
                  <ValidationMsg show={fieldError("firstLanguage")} text="First language is required" />
                </div>
                <div>
                  <FieldLabel label="Country of Citizenship" required />
                  <SelectInput
                    value={form.citizenshipCountry}
                    onChange={(v) => updateField("citizenshipCountry", v)}
                    options={COUNTRY_OPTIONS}
                    hasError={fieldError("citizenshipCountry")}
                  />
                </div>
              </div>

              {/* Passport */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel label="Passport Number" required />
                  <TextInput
                    value={form.passportNumber}
                    onChange={(v) => updateField("passportNumber", v)}
                    placeholder="e.g. A1234567"
                    hasError={fieldError("passportNumber")}
                  />
                  <ValidationMsg show={fieldError("passportNumber")} text="Passport number is required" />
                </div>
                <div>
                  <FieldLabel label="Passport Expiry Date" required />
                  <TextInput
                    type="date"
                    value={form.passportExpiryDate}
                    onChange={(v) => updateField("passportExpiryDate", v)}
                    hasError={fieldError("passportExpiryDate")}
                  />
                  <ValidationMsg show={fieldError("passportExpiryDate")} text="Passport expiry date is required" />
                </div>
              </div>

              {/* Marital & Gender */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel label="Marital Status" required />
                  <div className="flex gap-2">
                    {(["Single", "Married"] as const).map((v) => (
                      <ToggleOption
                        key={v}
                        label={v}
                        checked={form.maritalStatus === v}
                        onClick={() => updateField("maritalStatus", v)}
                        hasError={fieldError("maritalStatus")}
                      />
                    ))}
                  </div>
                  <ValidationMsg show={fieldError("maritalStatus")} text="Marital status is required" />
                </div>
                <div>
                  <FieldLabel label="Gender" required />
                  <div className="flex gap-2">
                    {(["Male", "Female"] as const).map((v) => (
                      <ToggleOption
                        key={v}
                        label={v}
                        checked={form.gender === v}
                        onClick={() => updateField("gender", v)}
                        hasError={fieldError("gender")}
                      />
                    ))}
                  </div>
                  <ValidationMsg show={fieldError("gender")} text="Gender is required" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            SECTION 2 — Address Detail
        ════════════════════════════════════════ */}
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md">
          <div className="border-b border-slate-100 px-6 py-5">
            <SectionHeader
              icon={<MapPin className="h-5 w-5" />}
              title="Address Details"
              subtitle="Your current residential address"
              open={openSection.address}
              onToggle={() =>
                setOpenSection((p) => ({ ...p, address: !p.address }))
              }
              filled={countFilled(addressFields)}
              total={addressFields.length}
            />
          </div>

          {openSection.address && (
            <div className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel label="Street Address" required />
                  <TextInput
                    value={form.addressLine}
                    onChange={(v) => updateField("addressLine", v)}
                    placeholder="e.g. 123 Main St"
                    hasError={fieldError("addressLine")}
                  />
                  <ValidationMsg show={fieldError("addressLine")} text="Address is required" />
                </div>
                <div>
                  <FieldLabel label="City / Town" required />
                  <TextInput
                    value={form.cityTown}
                    onChange={(v) => updateField("cityTown", v)}
                    placeholder="e.g. Kathmandu"
                    hasError={fieldError("cityTown")}
                  />
                  <ValidationMsg show={fieldError("cityTown")} text="City / Town is required" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <FieldLabel label="Country" required />
                  <SelectInput
                    value={form.country}
                    onChange={(v) => updateField("country", v)}
                    options={COUNTRY_OPTIONS}
                    hasError={fieldError("country")}
                  />
                </div>
                <div>
                  <FieldLabel label="Province / State" required />
                  <SelectInput
                    value={form.provinceState}
                    onChange={(v) => updateField("provinceState", v)}
                    options={PROVINCE_OPTIONS}
                    placeholder="Select…"
                    hasError={fieldError("provinceState")}
                  />
                  <ValidationMsg show={fieldError("provinceState")} text="Province / State is required" />
                </div>
                <div>
                  <FieldLabel label="Postal / Zip Code" />
                  <TextInput
                    value={form.postalZipCode}
                    onChange={(v) => updateField("postalZipCode", v)}
                    placeholder="e.g. 44600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            SECTION 3 — Education Summary
        ════════════════════════════════════════ */}
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-md">
          <div className="border-b border-slate-100 px-6 py-5">
            <SectionHeader
              icon={<GraduationCap className="h-5 w-5" />}
              title="Education Summary"
              subtitle="Your highest level of academic achievement"
              open={openSection.education}
              onToggle={() =>
                setOpenSection((p) => ({ ...p, education: !p.education }))
              }
              filled={countFilled(educationFields)}
              total={educationFields.length}
            />
          </div>

          {openSection.education && (
            <div className="space-y-5 p-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Enter information for the highest academic level you have completed.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel label="Country of Education" required />
                  <SelectInput
                    value={form.countryOfEducation}
                    onChange={(v) => updateField("countryOfEducation", v)}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select country…"
                    hasError={fieldError("countryOfEducation")}
                  />
                  <ValidationMsg show={fieldError("countryOfEducation")} text="Country of education is required" />
                </div>
                <div>
                  <FieldLabel label="Highest Level of Education" required />
                  <SelectInput
                    value={form.highestEducation}
                    onChange={(v) => updateField("highestEducation", v)}
                    options={EDUCATION_LEVEL_OPTIONS}
                    placeholder="Select level…"
                    hasError={fieldError("highestEducation")}
                  />
                  <ValidationMsg show={fieldError("highestEducation")} text="Education level is required" />
                </div>
                <div>
                  <FieldLabel label="Grade Average (Scale: 1–100)" required />
                  <TextInput
                    value={form.gradeAverage}
                    onChange={(v) => updateField("gradeAverage", v)}
                    placeholder="e.g. 85"
                    hasError={fieldError("gradeAverage")}
                  />
                  <ValidationMsg show={fieldError("gradeAverage")} text="Grade average is required" />
                </div>
              </div>

              {/* Graduated toggle */}
              <div>
                <FieldLabel label="I have graduated from this institution" required />
                <div className="flex gap-2">
                  <ToggleOption
                    label="Yes"
                    checked={form.graduatedInstitution === true}
                    onClick={() => updateField("graduatedInstitution", true)}
                  />
                  <ToggleOption
                    label="No"
                    checked={form.graduatedInstitution === false}
                    onClick={() => updateField("graduatedInstitution", false)}
                  />
                </div>
              </div>

              {/* Add school button */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 py-3 text-sm font-semibold text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Add Attended School
              </button>
            </div>
          )}
        </div>

        {/* ── Save button ── */}
        <div className="flex flex-col items-end gap-2">
          {showErrors && missingRequiredCount > 0 && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {missingRequiredCount} required field{missingRequiredCount > 1 ? "s" : ""} still missing
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-300 transition-all duration-200 hover:shadow-xl hover:shadow-blue-400 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Shield className="h-4 w-4" /> Save &amp; Continue</>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
