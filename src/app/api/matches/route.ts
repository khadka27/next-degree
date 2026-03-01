/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchSchools } from "@/lib/api/collegeScorecard";
import { fetchWorqnowUniversities } from "@/lib/api/worqnow";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "USA";
  const budget = parseFloat(searchParams.get("budget") || "0");
  const englishScore = parseFloat(searchParams.get("englishScore") || "0");
  const degreeLevel = searchParams.get("degreeLevel") || "";

  try {
    let matches: any[] = [];

    /* ─────────────────────────────────────────────
       USA — College Scorecard (official gov API)
    ───────────────────────────────────────────── */
    if (country === "USA") {
      const response = await fetchSchools({
        "school.degrees_awarded.predominant": "3",
        sort: "latest.student.size:desc",
        fields:
          "id,school.name,school.city,school.state,school.school_url," +
          "latest.cost.tuition.in_state,latest.admissions.admission_rate.overall",
        per_page: 50,
      });

      matches = (response.results ?? [])
        .filter((school: any) => {
          const tuition = school["latest.cost.tuition.in_state"];
          if (budget > 0 && tuition && tuition > budget) return false;
          // US universities generally require IELTS ≥ 6.0
          if (englishScore > 0 && englishScore < 6.0) return false;
          return true;
        })
        .map((school: any) => ({
          id: school.id,
          name: school["school.name"],
          location: `${school["school.city"]}, ${school["school.state"]}`,
          tuitionFee: school["latest.cost.tuition.in_state"],
          feeBand: null,
          englishReq: 6.0,
          admissionRate: school["latest.admissions.admission_rate.overall"],
          scholarships: [],
          website: school["school.school_url"]
            ? school["school.school_url"].startsWith("http")
              ? school["school.school_url"]
              : `https://${school["school.school_url"]}`
            : null,
        }))
        .slice(0, 15);

      /* ─────────────────────────────────────────────
       All other countries — WorqNow Education API
       Real response shape:
         { count, data: [...], <country>_info }
       Fields: code, name, city, region, website,
               international_fee_band, estimatedFeeUSD,
               courses, scholarships
    ───────────────────────────────────────────── */
    } else {
      const results = await fetchWorqnowUniversities(country);

      matches = results
        .filter((school) => {
          // Budget filter — compare against estimated USD fee
          const fee = school.estimatedFeeUSD ?? 0;
          if (budget > 0 && fee > 0 && fee > budget) return false;

          // Degree level filter — check if university offers the requested level
          if (degreeLevel && school.courses?.length) {
            const offersLevel = school.courses.some((c) =>
              c.level.includes(degreeLevel),
            );
            if (!offersLevel) return false;
          }

          // English score: WorqNow doesn't expose specific IELTS requirements,
          // so we apply a minimum of 6.0 (standard for most universities)
          if (englishScore > 0 && englishScore < 6.0) return false;

          return true;
        })
        .map((school) => ({
          id: school.code || school.name,
          name: school.name,
          location: school.city
            ? `${school.city}${school.region ? `, ${school.region}` : ""}`
            : country,
          tuitionFee: school.estimatedFeeUSD,
          feeBand: school.international_fee_band,
          englishReq: 6.0,
          rankingWorld: school.ranking_world,
          scholarships: school.scholarships ?? [],
          website: school.website ?? null,
        }))
        .slice(0, 15);
    }

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("Match Search Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university matches.", detail: String(error) },
      { status: 500 },
    );
  }
}
