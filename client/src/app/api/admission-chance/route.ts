import { NextRequest, NextResponse } from "next/server";

type MatchPayload = {
  admissionRate?: number;
  tuitionFee?: number;
  rankingWorld?: number;
  rankingNational?: number;
  englishReq?: number;
  gpaRequirement?: number;
  internationalPercentage?: number;
  countryCode?: string;
  name?: string;
};

type FormPayload = {
  gpa?: string;
  testType?: string;
  testScore?: string;
  backlogs?: string;
  studyGap?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function bandForScore(score: number) {
  if (score >= 80) {
    return {
      label: "Strong",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }

  if (score >= 60) {
    return {
      label: "Moderate",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }

  return {
    label: "Selective",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-100",
  };
}

function parseNumber(value: string | undefined, fallback = 0) {
  const parsed = Number.parseFloat(value || "");
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getEnglishScore(form: FormPayload) {
  const score = parseNumber(form.testScore, 0);
  switch ((form.testType || "").toUpperCase()) {
    case "IELTS":
      return clamp(Math.round((score / 9) * 100), 0, 100);
    case "TOEFL":
      return clamp(Math.round((score / 120) * 100), 0, 100);
    case "PTE ACADEMIC":
    case "PTE":
      return clamp(Math.round((score / 90) * 100), 0, 100);
    case "DUOLINGO":
      return clamp(Math.round((score / 160) * 100), 0, 100);
    case "GRE":
      return clamp(Math.round((score / 340) * 100), 0, 100);
    case "GMAT":
      return clamp(Math.round((score / 800) * 100), 0, 100);
    default:
      return clamp(Math.round(score), 0, 100);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      form?: FormPayload;
      match?: MatchPayload;
    };

    const form = body.form || {};
    const match = body.match || {};

    const gpa = parseNumber(form.gpa, 0);
    const backlogPenalty = Math.min(18, (parseNumber(form.backlogs) || 0) * 3);
    const gapPenalty = Math.min(14, (parseNumber(form.studyGap) || 0) * 2);
    const englishScore = getEnglishScore(form);

    const academicScore = clamp(Math.round((gpa / 4) * 100), 0, 100);
    const baselineAcceptance = clamp(match.admissionRate ?? 62, 18, 95);
    const academicLift = Math.round((academicScore - 62) * 0.42);
    const englishLift = Math.round((englishScore - 64) * 0.28);
    const gpaRequirement = match.gpaRequirement ?? 3.0;
    const englishRequirement = match.englishReq ?? 6.5;
    const requirementPenalty = clamp(
      Math.round((gpaRequirement - gpa) * 14 + (englishRequirement - 6.5) * 8),
      -18,
      18,
    );
    const internationalLift = Math.round(
      (match.internationalPercentage ?? 18) / 6,
    );
    const rankingAdjustment = match.rankingWorld
      ? clamp(
          Math.round((600 - Math.min(match.rankingWorld, 600)) / 40),
          -10,
          16,
        )
      : 0;

    const admissionPct = clamp(
      Math.round(
        baselineAcceptance +
          academicLift +
          englishLift -
          backlogPenalty -
          gapPenalty +
          internationalLift +
          rankingAdjustment -
          requirementPenalty,
      ),
      18,
      98,
    );

    const lowerBound = clamp(admissionPct - 7, 5, 95);
    const upperBound = clamp(admissionPct + 8, lowerBound + 5, 98);
    const band = bandForScore(admissionPct);

    return NextResponse.json({
      admissionPct,
      lowerBound,
      upperBound,
      band,
      factors: {
        academicScore,
        englishScore,
        backlogPenalty,
        gapPenalty,
        baselineAcceptance,
      },
      summary:
        admissionPct >= 78
          ? "Strong Proceed"
          : admissionPct >= 62
            ? "Proceed With Conditions"
            : "Refine Profile First",
      sources: {
        match: match.name || null,
        countryCode: match.countryCode || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate admission chance", detail: String(error) },
      { status: 500 },
    );
  }
}
