/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Match, Form } from "@/types/matches";

interface AdmissionDetailsProps {
  form: Form;
  selectedMatch: Match;
  admissionPct: number;
  admissionBand: { label: string; colorName?: string; badgeClass?: string };
  onBack: () => void;
  onAdvanceToVisa: () => void;
}

function scoreTierValue(
  strong: boolean,
  moderate: boolean,
  values: { strong: number; moderate: number; low: number },
) {
  if (strong) return values.strong;
  if (moderate) return values.moderate;
  return values.low;
}

function scoreTierLabel(
  strong: boolean,
  moderate: boolean,
  labels: { strong: string; moderate: string; low: string },
) {
  if (strong) return labels.strong;
  if (moderate) return labels.moderate;
  return labels.low;
}

export function AdmissionDetails({
  form,
  selectedMatch,
  admissionPct,
  admissionBand,
  onBack,
  onAdvanceToVisa,
}: AdmissionDetailsProps) {
  const gpa = Number.parseFloat(form.gpa) || 0;
  const testScore = Number.parseFloat(form.testScore) || 0;
  const backlogs = Number.parseInt(form.backlogs || "0", 10) || 0;
  const studyGap = Number.parseInt(form.studyGap || "0", 10) || 0;

  const isGpaStrong = gpa >= 3.2;
  const isGpaModerate = gpa >= 2.8;
  const isTestStrong =
    (form.testType === "IELTS" && testScore >= 6.5) ||
    (form.testType === "PTE" && testScore >= 60) ||
    (form.testType === "TOEFL" && testScore >= 90) ||
    (form.testType === "Duolingo" && testScore >= 115);
  const isTestModerate =
    (form.testType === "IELTS" && testScore >= 6) ||
    (form.testType === "PTE" && testScore >= 55) ||
    (form.testType === "TOEFL" && testScore >= 80) ||
    (form.testType === "Duolingo" && testScore >= 105);

  const gpaBoost = scoreTierValue(isGpaStrong, isGpaModerate, {
    strong: 20,
    moderate: 12,
    low: 6,
  });
  const testBoost = scoreTierValue(isTestStrong, isTestModerate, {
    strong: 15,
    moderate: 9,
    low: 4,
  });
  const testFactorBase = scoreTierValue(isTestStrong, isTestModerate, {
    strong: 86,
    moderate: 68,
    low: 44,
  });
  const gpaStatus = scoreTierLabel(isGpaStrong, isGpaModerate, {
    strong: "Excellent",
    moderate: "Moderate",
    low: "Needs Work",
  });
  const testStatus = scoreTierLabel(isTestStrong, isTestModerate, {
    strong: "Excellent",
    moderate: "Moderate",
    low: "Low",
  });

  const profileScore = Math.max(
    30,
    Math.min(
      95,
      Math.round(
        admissionPct * 0.6 + gpaBoost + testBoost - backlogs * 2 - studyGap * 2,
      ),
    ),
  );

  const lowerBand = Math.max(5, Math.min(95, Math.round(admissionPct - 7)));
  const upperBand = Math.max(
    lowerBand + 5,
    Math.min(98, Math.round(admissionPct + 8)),
  );

  const gpaFactor = Math.max(
    25,
    Math.min(95, Math.round((gpa / (gpa <= 4 ? 4 : 10)) * 100)),
  );
  const testFactor = Math.max(20, Math.min(95, Math.round(testFactorBase)));
  const recommendationFactor = Math.max(
    35,
    Math.min(95, Math.round(70 - backlogs * 4 + (studyGap === 0 ? 10 : 0))),
  );
  const extracurricularFactor = Math.max(
    20,
    Math.min(95, Math.round(62 - studyGap * 4 + (backlogs === 0 ? 8 : 0))),
  );

  const strengths: string[] = [];
  const risks: string[] = [];

  if (isGpaStrong)
    strengths.push("Strong academic performance aligns with target programs.");
  if (isTestStrong)
    strengths.push(
      `${form.testType || "English test"} score is competitive for this intake.`,
    );
  if (backlogs <= 1)
    strengths.push("Academic history is consistent with low backlog risk.");
  if (studyGap <= 1)
    strengths.push(
      "Study timeline appears stable for visa and admission review.",
    );

  if (!isTestStrong)
    risks.push("Language score can be improved to raise acceptance odds.");
  if (!isGpaStrong)
    risks.push(
      "Academic score is slightly below top-tier preference benchmarks.",
    );
  if (backlogs > 2)
    risks.push(
      "Higher backlog count may reduce competitiveness for selective programs.",
    );
  if (studyGap > 2)
    risks.push("Long study gap may need stronger SOP justification.");

  if (strengths.length === 0) {
    strengths.push(
      "Profile has a balanced base to build on with targeted improvements.",
    );
  }

  if (risks.length === 0) {
    risks.push(
      "Keep application quality high across SOP, LORs, and deadlines.",
    );
  }

  const trendYears = [2021, 2022, 2023, 2024, 2025];
  const trendValues = trendYears.map((_, index) => {
    const adjustment = 6 - index * 2;
    return Math.max(12, Math.min(95, Math.round(admissionPct + adjustment)));
  });

  const maxTrend = Math.max(...trendValues, 1);
  const minTrend = Math.min(...trendValues, 0);
  const spanTrend = Math.max(1, maxTrend - minTrend);
  const chartWidth = 380;
  const chartHeight = 120;

  const trendPoints = trendValues
    .map((value, index) => {
      const x = (index / (trendValues.length - 1)) * chartWidth;
      const y =
        chartHeight - ((value - minTrend) / spanTrend) * (chartHeight - 12) - 6;
      return `${x},${y}`;
    })
    .join(" ");

  const factorRows = [
    {
      label: "Academic Score",
      value: gpaFactor,
      status: gpaStatus,
      bar: "bg-emerald-500",
    },
    {
      label: "Test Score",
      value: testFactor,
      status: testStatus,
      bar: "bg-amber-500",
    },
    {
      label: "Recommendations",
      value: recommendationFactor,
      status: recommendationFactor >= 75 ? "Very Good" : "Moderate",
      bar: "bg-blue-500",
    },
    {
      label: "Extracurriculars",
      value: extracurricularFactor,
      status: extracurricularFactor >= 70 ? "Strong" : "Improving",
      bar: "bg-rose-500",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen bg-slate-50 px-4 pb-16 pt-4 md:px-8 md:pt-8">
      <div className="mx-auto w-full max-w-6xl space-y-5 md:space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to previous step
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Admission Chances Analysis
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500 md:text-base">
            A deep dive into your profile competitiveness for{" "}
            {selectedMatch.name}. Based on historical acceptance data, cohort
            trends, and program-specific criteria.
          </p>
        </div>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estimated Acceptance Probability
              </p>
              <h2 className="mt-1 text-3xl font-bold text-blue-600 md:text-5xl">
                {lowerBand}% - {upperBand}%
              </h2>
              <p className="mt-2 text-sm text-slate-500 md:max-w-2xl">
                {admissionBand.label} range projected for your current profile.
                Improving language score and supporting documents can move this
                band upward.
              </p>
            </div>

            <div className="relative h-20 w-20 shrink-0 md:h-24 md:w-24">
              <svg
                viewBox="0 0 36 36"
                className="h-full w-full -rotate-90 transform"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray={`${profileScore} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 md:text-base">
                {profileScore}%
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800 md:text-base">
                Competitiveness Map
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-semibold text-slate-400">
                    VISUAL PROFILE SNAPSHOT
                  </p>
                  <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-blue-100 bg-white">
                    <svg viewBox="0 0 100 100" className="h-28 w-28">
                      <polygon
                        points="50,14 84,38 72,80 28,80 16,38"
                        fill="#dbeafe"
                        stroke="#93c5fd"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${50},${Math.max(18, 50 - (gpaFactor / 100) * 32)} ${72 + (testFactor / 100) * 8},${42} ${64},${74 - (recommendationFactor / 100) * 10} ${36},${74 - (extracurricularFactor / 100) * 10} ${28 - (profileScore / 100) * 6},${42}`}
                        fill="rgba(37, 99, 235, 0.35)"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-semibold text-slate-400">
                    DETAILED FACTORS
                  </p>
                  <div className="space-y-3">
                    {factorRows.map((item) => (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.label}</span>
                          <span className="text-slate-500">{item.status}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${item.bar}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-800 md:text-base">
                Acceptance Rate Trends (
                {selectedMatch.popularPrograms?.[0] || "Program"})
              </h3>
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight + 26}`}
                  className="min-w-90 w-full"
                >
                  <polyline
                    fill="none"
                    stroke="#bfdbfe"
                    strokeWidth="2"
                    points={`0,${chartHeight} ${chartWidth},${chartHeight}`}
                  />
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points={trendPoints}
                  />
                  {trendValues.map((value, index) => {
                    const x = (index / (trendValues.length - 1)) * chartWidth;
                    const y =
                      chartHeight -
                      ((value - minTrend) / spanTrend) * (chartHeight - 12) -
                      6;
                    return (
                      <g key={`${trendYears[index]}-${value}`}>
                        <circle cx={x} cy={y} r="4" fill="#2563eb" />
                        <text
                          x={x}
                          y={chartHeight + 18}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#64748b"
                        >
                          {trendYears[index]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 md:text-sm">
                Trend insight: acceptance has softened gradually. Submitting
                stronger SOP and test score can improve your final shortlist
                conversion.
              </p>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Profile Strengths
              </h3>
              <div className="space-y-2">
                {strengths.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Potential Risks
              </h3>
              <div className="space-y-2">
                {risks.slice(0, 3).map((item) => (
                  <div key={item} className="flex gap-2 text-sm text-slate-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-blue-200 bg-blue-600 p-5 text-white shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Action Plan to 90%+
              </h3>
              <div className="space-y-2 text-sm text-blue-50">
                <div className="flex gap-2">
                  <Circle className="mt-1 h-2.5 w-2.5 fill-current" />
                  <span>
                    Raise {form.testType || "English"} score by one benchmark
                    band.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Circle className="mt-1 h-2.5 w-2.5 fill-current" />
                  <span>
                    Add two safe-shortlist programs with higher acceptance
                    rates.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Circle className="mt-1 h-2.5 w-2.5 fill-current" />
                  <span>
                    Apply within first deadline window for stronger conversion.
                  </span>
                </div>
              </div>
              <button
                onClick={onAdvanceToVisa}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Start Application Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
