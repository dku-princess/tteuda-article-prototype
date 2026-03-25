import "server-only";

import type { Article } from "@/types/article";

const DIRECTUS_BASE_URL = "http://13.125.122.193:8055";

/** CMS에서 프로토타입 공개용으로 쓰는 상태값 */
const ARTICLE_STATUS_PROTOTYPE_PUBLISHED = "prototype_published";

/**
 * Vercel 등 배포 환경별로 아티클 노출 범위를 나눕니다.
 * - `public` (기본): `prototype_published`만 조회
 * - `internal`: status 필터 없이 전체 조회
 */
function getArticleVisibility(): "public" | "internal" {
  return process.env.ARTICLE_VISIBILITY === "internal"
    ? "internal"
    : "public";
}

function shouldFilterToPrototypePublishedOnly(): boolean {
  return getArticleVisibility() !== "internal";
}

function applyArticleStatusFilter(params: URLSearchParams): void {
  if (shouldFilterToPrototypePublishedOnly()) {
    params.set("filter[status][_eq]", ARTICLE_STATUS_PROTOTYPE_PUBLISHED);
  }
}

const ARTICLE_DETAIL_FIELDS =
  "*,sections.*,sections.item.*.*,sections.item.qa_item_block.gallery.*,sections.item.pattern_item_block.gallery.*,sections.item.pattern_item_block.gallery_second.*,sections.item:note_section.*,sections.item:project_section.*,sections.item.project_item_block.*";

interface DirectusListResponse<T> {
  data: T[];
}

export async function fetchArticles(): Promise<Article[]> {
  const params = new URLSearchParams();
  params.set("fields", "*");
  applyArticleStatusFilter(params);

  const endpoint = `${DIRECTUS_BASE_URL}/items/articles?${params.toString()}`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[fetchArticles] Network error", error);
    throw new Error("네트워크 오류로 아티클을 불러오지 못했습니다.");
  }

  if (!response.ok) {
    console.error("[fetchArticles] Non-200 response", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("아티클 API 응답이 정상적이지 않습니다.");
  }

  let json: DirectusListResponse<Article>;

  try {
    json = (await response.json()) as DirectusListResponse<Article>;
  } catch (error) {
    console.error("[fetchArticles] Failed to parse JSON", error);
    throw new Error("아티클 데이터를 해석하는 데 실패했습니다.");
  }

  if (!json?.data || !Array.isArray(json.data)) {
    console.error("[fetchArticles] Invalid data format", json);
    throw new Error("아티클 데이터 형식이 올바르지 않습니다.");
  }

  return json.data.map((item) => normalizeArticle(item));
}

export async function fetchArticleBySlug(
  slugOrId: string,
): Promise<Article | null> {
  const searchParamKey = Number.isNaN(Number(slugOrId)) ? "slug" : "id";

  const params = new URLSearchParams();
  params.set("fields", ARTICLE_DETAIL_FIELDS);
  applyArticleStatusFilter(params);
  params.set(`filter[${searchParamKey}][_eq]`, slugOrId);

  const endpoint = `${DIRECTUS_BASE_URL}/items/articles?${params.toString()}`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[fetchArticleBySlug] Network error", error);
    throw new Error("네트워크 오류로 아티클을 불러오지 못했습니다.");
  }

  if (!response.ok) {
    console.error("[fetchArticleBySlug] Non-200 response", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("아티클 상세 API 응답이 정상적이지 않습니다.");
  }

  let json: DirectusListResponse<Article>;

  try {
    json = (await response.json()) as DirectusListResponse<Article>;
  } catch (error) {
    console.error("[fetchArticleBySlug] Failed to parse JSON", error);
    throw new Error("아티클 상세 데이터를 해석하는 데 실패했습니다.");
  }

  if (!json?.data || !Array.isArray(json.data)) {
    console.error("[fetchArticleBySlug] Invalid data format", json);
    throw new Error("아티클 상세 데이터 형식이 올바르지 않습니다.");
  }

  const first = json.data[0];

  if (!first) {
    return null;
  }

  return normalizeArticle(first);
}

function normalizeArticle(raw: Partial<Article>): Article {
  const base: Article = {
    id: Number(raw.id ?? 0),
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle ?? "",
    category: raw.category ?? "",
    editor: raw.editor ?? "",
    interviewee: raw.interviewee ?? "",
    thumbnail_image_large: raw.thumbnail_image_large ?? "",
    thumbnail_image_small: raw.thumbnail_image_small ?? "",
    cover_image:
      raw.cover_image === null || raw.cover_image === undefined
        ? null
        : String(raw.cover_image),
    published_at: raw.published_at ?? "",
    is_featured: Boolean(raw.is_featured),
    slug: String(raw.slug ?? ""),
    status: raw.status ?? "",
    sections: raw.sections ?? undefined,
  };

  return {
    ...raw,
    ...base,
  };
}


