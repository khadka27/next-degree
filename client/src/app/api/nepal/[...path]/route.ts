import { NextRequest, NextResponse } from "next/server";

const NEPAL_DATA_API_BASE =
  process.env.NEPAL_DATA_API_BASE || "https://nepaldata.subarnaman.com.np/api";

function normalizePath(pathParts: string[]): string | null {
  if (!pathParts.length) return null;

  if (
    pathParts.length === 1 &&
    ["province", "district"].includes(pathParts[0])
  ) {
    return pathParts[0];
  }

  if (
    pathParts.length === 2 &&
    ["province", "district"].includes(pathParts[0]) &&
    pathParts[1]
  ) {
    return `${pathParts[0]}/${pathParts[1]}`;
  }

  if (
    pathParts.length === 3 &&
    pathParts[0] === "district" &&
    pathParts[1] &&
    pathParts[2] === "locallevel"
  ) {
    return `district/${pathParts[1]}/locallevel`;
  }

  return null;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const params = await context.params;
    const normalized = normalizePath(params.path || []);

    if (!normalized) {
      return NextResponse.json(
        {
          error: "Unsupported Nepal API path",
          supported: [
            "province",
            "province/:id",
            "district",
            "district/:id",
            "district/:id/locallevel",
          ],
        },
        { status: 400 },
      );
    }

    const upstreamUrl = `${NEPAL_DATA_API_BASE}/${normalized}`;
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const contentType =
      upstreamResponse.headers.get("content-type") || "application/json";

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return new NextResponse(errorText || "Upstream request failed", {
        status: upstreamResponse.status,
        headers: { "Content-Type": contentType },
      });
    }

    const responseText = await upstreamResponse.text();
    return new NextResponse(responseText, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Nepal API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Nepal data" },
      { status: 500 },
    );
  }
}
