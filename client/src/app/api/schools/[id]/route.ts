import { NextRequest, NextResponse } from "next/server";
import { abroadliftApi } from "@/lib/api/abroadlift";
import { getAllSchoolsCached } from "@/lib/api/cache";
import { resolveSchoolIdFromParam, slugify } from "@/lib/slug";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rawParam = (await params).id;
  const schoolIdOrSlug = resolveSchoolIdFromParam(rawParam);

  try {
    // 1. If we resolved a numeric ID from slug or direct ID param
    if (/^\d+$/.test(schoolIdOrSlug)) {
      try {
        const data = await abroadliftApi.getSchoolById(schoolIdOrSlug);
        if (data && data.success) {
          return NextResponse.json(data);
        }
      } catch {
        // Continue to fallback lookup if primary ID fetch failed
      }
    }

    // 2. Lookup in cached schools by slugified name or slug
    const allSchools = await getAllSchoolsCached();
    const found = allSchools.find(
      (s: any) =>
        String(s.school_id || s.id) === schoolIdOrSlug ||
        s.slug === schoolIdOrSlug ||
        slugify(s.name) === schoolIdOrSlug ||
        slugify(s.name) === slugify(rawParam)
    );

    if (found) {
      const schoolId = found.school_id || found._id || found.id;
      const data = await abroadliftApi.getSchoolById(schoolId);
      return NextResponse.json(data);
    }

    // 3. Final fallback: request raw parameter from backend API
    const data = await abroadliftApi.getSchoolById(rawParam);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Proxy School GET error for ID/slug ${rawParam}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch school" },
      { status: 500 }
    );
  }
}
