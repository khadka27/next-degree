/**
 * Utility functions for generating and resolving SEO-friendly school slugs.
 */

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // Remove acronyms in parens like (UofT)
    .replace(/&/g, "and") // Replace & with 'and'
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars
    .trim()
    .replace(/\s+/g, "-") // Replace whitespace with hyphens
    .replace(/-+/g, "-"); // Collapse consecutive hyphens
}

/**
 * Returns a human-readable SEO slug for a school.
 * E.g., { id: 2199, name: "University of Toronto (UofT) - Rotman School of Management" }
 * -> "university-of-toronto-rotman-school-of-management-2199"
 */
export function getSchoolSlug(
  school:
    | { id?: string | number; school_id?: string | number; name?: string; slug?: string }
    | string
    | number
    | null
    | undefined,
  fallbackName?: string
): string {
  if (!school) return "";

  if (typeof school === "string" || typeof school === "number") {
    const raw = String(school).trim();
    if (fallbackName) {
      const baseSlug = slugify(fallbackName);
      return baseSlug ? `${baseSlug}-${raw}` : raw;
    }
    return raw;
  }

  const schoolId = school.school_id || school.id;
  const schoolName = school.name || "";
  const baseSlug = school.slug || slugify(schoolName);

  if (baseSlug && schoolId) {
    if (baseSlug.endsWith(`-${schoolId}`)) {
      return baseSlug;
    }
    return `${baseSlug}-${schoolId}`;
  }

  return baseSlug || String(schoolId || "");
}

/**
 * Resolves the numeric school ID or clean search slug from a URL parameter.
 * E.g., "university-of-toronto-rotman-school-of-management-2199" -> "2199"
 * E.g., "2199" -> "2199"
 * E.g., "university-of-toronto" -> "university-of-toronto"
 */
export function resolveSchoolIdFromParam(param: string): string {
  if (!param) return "";
  const decoded = decodeURIComponent(param).trim();

  // If parameter is purely digits
  if (/^\d+$/.test(decoded)) {
    return decoded;
  }

  // If parameter ends with -<digits>
  const match = decoded.match(/-(\d+)$/);
  if (match && match[1]) {
    return match[1];
  }

  return decoded;
}
