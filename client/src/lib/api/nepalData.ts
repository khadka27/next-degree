export interface NepalProvince {
  id: string;
  name: string;
  districts: number;
}

export interface NepalDistrictSummary {
  id: string;
  name: string;
  localLevels?: number;
}

export interface NepalLocalLevel {
  id: string;
  name: string;
  wards: number;
}

export interface NepalProvinceDetail {
  id: string;
  province: string;
  districts: NepalDistrictSummary[];
  count: number;
}

export interface NepalDistrictDetail {
  id: string;
  name: string;
  provinceName: string;
  provinceId: string;
  locallevels: NepalLocalLevel[];
  count: number;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`/api/nepal/${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Nepal API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchNepalProvinces(): Promise<NepalProvince[]> {
  const payload = await getJson<{ data?: NepalProvince[] }>("province");
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchNepalProvinceById(
  provinceId: string | number,
): Promise<NepalProvinceDetail | null> {
  const payload = await getJson<{ data?: NepalProvinceDetail }>(
    `province/${provinceId}`,
  );
  return payload.data || null;
}

export async function fetchNepalDistricts(): Promise<NepalDistrictSummary[]> {
  const payload = await getJson<{ data?: NepalDistrictSummary[] }>("district");
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function fetchNepalDistrictById(
  districtId: string | number,
): Promise<NepalDistrictDetail | null> {
  const payload = await getJson<{ data?: NepalDistrictDetail }>(
    `district/${districtId}`,
  );
  return payload.data || null;
}

export async function fetchNepalLocalLevelsByDistrict(
  districtId: string | number,
): Promise<NepalLocalLevel[]> {
  const payload = await getJson<{ data?: NepalLocalLevel[] }>(
    `district/${districtId}/locallevel`,
  );
  return Array.isArray(payload.data) ? payload.data : [];
}
