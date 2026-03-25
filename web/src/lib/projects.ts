import "server-only";

const KNITTDA_API_BASE_URL = "http://13.125.122.193:8080";
const PROJECT_ENDPOINT = `${KNITTDA_API_BASE_URL}/api/v1/projects`;

export interface ProjectDetail {
  id: number;
  nickname?: string;
  status?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  goalDate?: string;
  design?: {
    id?: number;
    title?: string;
    designer?: string;
  } | null;
}

interface ApiResponseProjectDto {
  success?: boolean;
  code?: string;
  message?: string;
  data?: ProjectDetail;
}

export async function fetchProjectById(
  projectId: number,
): Promise<ProjectDetail | null> {
  if (!Number.isFinite(projectId)) {
    return null;
  }

  const endpoint = `${PROJECT_ENDPOINT}/${projectId}`;
  let response: Response;

  try {
    response = await fetch(endpoint, {
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  let json: ApiResponseProjectDto;

  try {
    json = (await response.json()) as ApiResponseProjectDto;
  } catch {
    return null;
  }

  if (!json?.data || typeof json.data.id !== "number") {
    return null;
  }

  return json.data;
}

export async function fetchProjectsByIds(
  projectIds: number[],
): Promise<Map<number, ProjectDetail>> {
  const uniqueProjectIds = Array.from(
    new Set(projectIds.filter((id) => Number.isFinite(id))),
  );

  if (uniqueProjectIds.length === 0) {
    return new Map();
  }

  const details = await Promise.all(
    uniqueProjectIds.map(async (id) => {
      const detail = await fetchProjectById(id);
      return detail ? ([id, detail] as const) : null;
    }),
  );

  return new Map(details.filter((entry): entry is readonly [number, ProjectDetail] => entry !== null));
}
