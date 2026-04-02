import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formData, matchData } = body;

    if (!formData || !matchData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Try to find if the university exists in our DB to link it
    let universityId = null;
    if (matchData.id && typeof matchData.id === 'string') {
        const univ = await db.university.findUnique({
            where: { id: matchData.id }
        });
        if (univ) universityId = univ.id;
    }

    const record = await db.matchingRecord.create({
      data: {
        userId: session.user.id,
        universityId: universityId,
        formData: formData,
        matchData: matchData,
      },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error: unknown) {
    console.error("[MATCH_SAVE_ERROR]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
