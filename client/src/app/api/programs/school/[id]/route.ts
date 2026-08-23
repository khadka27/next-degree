import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";
import { getAllSchoolsCached } from "@/lib/api/cache";
import { resolveSchoolIdFromParam, slugify } from "@/lib/slug";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rawParam = (await params).id;
  let schoolId = resolveSchoolIdFromParam(rawParam);

  try {
    if (!/^\d+$/.test(schoolId)) {
      const allSchools = await getAllSchoolsCached();
      const found = allSchools.find(
        (s: any) =>
          String(s.school_id || s.id) === schoolId ||
          s.slug === schoolId ||
          slugify(s.name) === schoolId ||
          slugify(s.name) === slugify(rawParam)
      );
      if (found) {
        schoolId = String(found.school_id || found._id || found.id);
      }
    }

    const data = await abroadliftApi.getProgramsBySchool(schoolId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy Programs for School GET error for School ID/slug ${rawParam}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch programs for this school" },
      { status: 500 }
    );
  }
}
