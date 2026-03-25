import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Article } from "@/types/article";
import { fetchArticleBySlug } from "@/lib/articles";
import { getDirectusAssetUrl } from "@/lib/image";
import { fetchProjectsByIds, type ProjectDetail } from "@/lib/projects";
import { BottomTabBar } from "@/components/BottomTabBar";
import { GalleryImages } from "@/components/GalleryImages";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getBestArticleImage(article: Article): string | null {
  const coverId =
    typeof article.cover_image === "string" ? article.cover_image : null;

  return getDirectusAssetUrl(coverId);
}

function formatPublishedDate(isoString?: string): string | null {
  if (!isoString) return null;

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeExternalUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function QaSectionContent({ item }: { item: unknown }) {
  const anyItem = item as {
    qa_item_block?: unknown;
  } | null;

  const blocks = Array.isArray(anyItem?.qa_item_block)
    ? anyItem?.qa_item_block
    : [];

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block, index) => {
        const qa = block as {
          id?: number;
          question?: unknown;
          answer?: unknown;
          image?: unknown;
          image_ratio?: unknown;
          gallery?: { directus_files_id?: string }[];
        } | null;

        const key = qa?.id ?? index;
        const question =
          typeof qa?.question === "string" ? qa.question : null;
        const answer = typeof qa?.answer === "string" ? qa.answer : null;
        const singleImageId =
          typeof qa?.image === "string" ? qa.image : null;
        const singleImageUrl = getDirectusAssetUrl(singleImageId);
        const singleImageAspectClass =
          qa?.image_ratio === "portrait_3_4" ? "aspect-[3/4]" : "aspect-[4/3]";
        const galleryItems = Array.isArray(qa?.gallery) ? qa.gallery : [];
        const galleryUrls = galleryItems
          .map((item) =>
            typeof item?.directus_files_id === "string"
              ? getDirectusAssetUrl(item.directus_files_id)
              : null,
          )
          .filter((url): url is string => url != null);

        // #region agent log
        if (galleryUrls.length > 0) {
          fetch(
            "http://127.0.0.1:7247/ingest/a8420b9d-9a0e-479b-a523-2d8369319054",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: `log_${Date.now()}_qa_urls`,
                timestamp: Date.now(),
                location: "page.tsx:QaSectionContent",
                message: "QA block image URLs",
                data: {
                  singleImageUrl: singleImageUrl ?? null,
                  galleryUrl0: galleryUrls[0] ?? null,
                  galleryCount: galleryUrls.length,
                },
                hypothesisId: "H2",
              }),
            },
          ).catch(() => {});
        }
        // #endregion agent log

        if (!question && !answer && !singleImageUrl && galleryUrls.length === 0) {
          return null;
        }

        return (
          <div
            key={key}
            className="rounded-[6px] px-3 py-3 space-y-2"
          >
            {question && (
              <div className="inline-flex items-center rounded-[6px] border border-[#27C08A] px-[10px] py-2">
                <p className="text-[14px] font-semibold leading-snug text-[#27C08A]">
                  {question}
                </p>
              </div>
            )}
            {answer && (
              <div
                className={`text-[14px] leading-relaxed text-[#444444] ${markdownBlockClassName}`}
              >
                <p className="mb-1 font-medium">A.</p>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {normalizeCmsMarkdown(answer)}
                </ReactMarkdown>
              </div>
            )}
            {singleImageUrl && (
              <div
                className={`relative w-full overflow-hidden rounded-[6px] bg-gray-100 ${singleImageAspectClass}`}
              >
                <Image
                  src={singleImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {galleryUrls.length > 0 && (
              <GalleryImages urls={galleryUrls} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PatternSectionContent({ item }: { item: unknown }) {
  const anyItem = item as {
    pattern_item_block?: unknown;
  } | null;

  const blocks = Array.isArray(anyItem?.pattern_item_block)
    ? anyItem?.pattern_item_block
    : [];

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block, index) => {
        const pattern = block as {
          id?: number;
          title?: unknown;
          description?: unknown;
          image?: unknown;
          image_ratio?: unknown;
          gallery?: { directus_files_id?: string }[];
          gallery_second?: { directus_files_id?: string }[];
        } | null;

        const key = pattern?.id ?? index;
        const title =
          typeof pattern?.title === "string" ? pattern.title : null;
        const description =
          typeof pattern?.description === "string"
            ? pattern.description
            : null;
        const imageId =
          typeof pattern?.image === "string" ? pattern.image : null;
        const imageUrl = getDirectusAssetUrl(imageId);
        const imageAspectClass =
          pattern?.image_ratio === "portrait_3_4"
            ? "aspect-[3/4]"
            : "aspect-[4/3]";

        const galleryItems = Array.isArray(pattern?.gallery)
          ? pattern.gallery
          : [];
        const galleryUrls = galleryItems
          .map((item) =>
            typeof item?.directus_files_id === "string"
              ? getDirectusAssetUrl(item.directus_files_id)
              : null,
          )
          .filter((url): url is string => url != null);
        const gallerySecondItems = Array.isArray(pattern?.gallery_second)
          ? pattern.gallery_second
          : [];
        const gallerySecondUrls = gallerySecondItems
          .map((item) =>
            typeof item?.directus_files_id === "string"
              ? getDirectusAssetUrl(item.directus_files_id)
              : null,
          )
          .filter((url): url is string => url != null);

        if (
          !title &&
          !description &&
          !imageUrl &&
          galleryUrls.length === 0 &&
          gallerySecondUrls.length === 0
        ) {
          return null;
        }

        return (
          <div
            key={key}
            className="space-y-2 rounded-[6px] bg-[#FDF7F2] px-3 py-3"
          >
            {title && (
              <p className="text-[14px] font-semibold text-[#CC7A3A]">
                {title}
              </p>
            )}
            {description && (
              <div
                className={`text-[14px] leading-relaxed text-[#5C4A3D] ${markdownBlockClassName}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {normalizeCmsMarkdown(description)}
                </ReactMarkdown>
              </div>
            )}
            {imageUrl && (
              <div
                className={`relative w-full overflow-hidden rounded-[6px] bg-gray-100 ${imageAspectClass}`}
              >
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {galleryUrls.length > 0 && <GalleryImages urls={galleryUrls} />}
            {gallerySecondUrls.length > 0 && (
              <GalleryImages urls={gallerySecondUrls} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const markdownBlockClassName =
  "[&_h1]:mb-3 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-[20px] [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:text-[16px] [&_h4]:font-semibold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-0.5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_hr]:my-3 [&_a]:underline [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/5 [&_pre]:p-3 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1";

/** Directus 등에서 마크다운에 섞인 HTML 줄바꿈을 CommonMark가 인식하는 줄바꿈으로 바꿉니다. */
function normalizeCmsMarkdown(raw: string): string {
  return raw.replace(/<br\s*\/?>/gi, "\n\n").trim();
}

function hasRenderableNoteSectionContent(item: unknown): boolean {
  const anyItem = item as {
    copyright_item_block?: unknown;
    note_item_block?: unknown;
  } | null;

  const copyrightMarkdown =
    typeof anyItem?.copyright_item_block === "string"
      ? normalizeCmsMarkdown(anyItem.copyright_item_block)
      : "";
  const noteMarkdown =
    typeof anyItem?.note_item_block === "string"
      ? normalizeCmsMarkdown(anyItem.note_item_block)
      : "";

  return Boolean(copyrightMarkdown || noteMarkdown);
}

function NoteSectionContent({ item }: { item: unknown }) {
  const anyItem = item as {
    copyright_item_block?: unknown;
    note_item_block?: unknown;
  } | null;

  const copyrightMarkdown =
    typeof anyItem?.copyright_item_block === "string"
      ? normalizeCmsMarkdown(anyItem.copyright_item_block)
      : "";
  const noteMarkdown =
    typeof anyItem?.note_item_block === "string"
      ? normalizeCmsMarkdown(anyItem.note_item_block)
      : "";

  if (!copyrightMarkdown && !noteMarkdown) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {noteMarkdown && (
        <div
          className={`text-[14px] leading-relaxed text-black ${markdownBlockClassName}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {noteMarkdown}
          </ReactMarkdown>
        </div>
      )}
      {copyrightMarkdown && (
        <div
          className={`text-[12px] leading-relaxed text-[#555555] ${markdownBlockClassName}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {copyrightMarkdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function PurchaseLinkSectionContent({ item }: { item: unknown }) {
  const anyItem = item as {
    button_text?: unknown;
    button_url?: unknown;
  } | null;

  const buttonText =
    typeof anyItem?.button_text === "string" ? anyItem.button_text : null;
  const buttonUrl = normalizeExternalUrl(
    typeof anyItem?.button_url === "string" ? anyItem.button_url : null,
  );

  if (!buttonText || !buttonUrl) {
    return null;
  }

  return (
    <div className="mt-4 flex justify-center">
      <a
        href={buttonUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-[80%] max-w-[320px] items-center justify-center rounded-[24px] bg-[#0ABE8C] px-4 py-3 text-[14px] font-semibold text-white"
      >
        {buttonText}
      </a>
    </div>
  );
}

function extractProjectIdsFromSections(sections: Article["sections"]): number[] {
  if (!sections || !Array.isArray(sections)) {
    return [];
  }

  const projectIds: number[] = [];

  for (const section of sections) {
    const anySection = section as {
      collection?: unknown;
      item?: {
        project_item_block?: unknown;
      } | null;
    } | null;

    if (anySection?.collection !== "project_section") {
      continue;
    }

    const blocks = Array.isArray(anySection?.item?.project_item_block)
      ? anySection.item.project_item_block
      : [];

    for (const block of blocks) {
      const projectBlock = block as {
        project_id?: unknown;
      } | null;

      const projectId =
        typeof projectBlock?.project_id === "number"
          ? projectBlock.project_id
          : typeof projectBlock?.project_id === "string"
            ? Number(projectBlock.project_id)
            : NaN;

      if (Number.isFinite(projectId)) {
        projectIds.push(projectId);
      }
    }
  }

  return projectIds;
}

function ProjectSectionContent({
  item,
  projectDetailMap,
}: {
  item: unknown;
  projectDetailMap: Map<number, ProjectDetail>;
}) {
  const anyItem = item as {
    project_item_block?: unknown;
  } | null;

  const blocks = Array.isArray(anyItem?.project_item_block)
    ? anyItem.project_item_block
    : [];

  if (!blocks.length) {
    return null;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {blocks.map((block, index) => {
        const projectBlock = block as {
          id?: number;
          project_id?: unknown;
        } | null;

        const key = projectBlock?.id ?? index;
        const projectId =
          typeof projectBlock?.project_id === "number"
            ? projectBlock.project_id
            : typeof projectBlock?.project_id === "string"
              ? Number(projectBlock.project_id)
              : NaN;

        if (!Number.isFinite(projectId)) {
          return null;
        }

        const matchedProject = projectDetailMap.get(projectId);
        const userName = matchedProject?.nickname ?? "작성자 정보 없음";
        const projectTitle =
          matchedProject?.design?.title ?? `프로젝트 #${projectId}`;
        const thumbnailUrl =
          typeof matchedProject?.thumbnailUrl === "string"
            ? matchedProject.thumbnailUrl
            : null;

        return (
          <div
            key={key}
            className="overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white shadow-sm"
          >
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={projectTitle}
                className="aspect-[4/3] w-full object-cover bg-gray-100"
              />
            )}
            <div className="px-3 py-3">
              <p className="truncate text-[14px] font-semibold text-black">
                {projectTitle}
              </p>
              <p className="mt-1 text-[12px] text-[#9A9A9A]">{userName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArticleSections({
  sections,
  projectDetailMap,
}: {
  sections: Article["sections"];
  projectDetailMap: Map<number, ProjectDetail>;
}) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pb-10 space-y-10">
      {sections.map((section, index) => {
        const key = section?.id ?? index;

        const anySection = section as unknown as {
          collection?: unknown;
          item?: {
            title?: unknown;
            description?: unknown;
            [k: string]: unknown;
          } | null;
        };

        const collection =
          typeof anySection.collection === "string"
            ? anySection.collection
            : null;
        const item = anySection.item ?? null;

        const title =
          typeof item?.title === "string" ? item.title : null;
        const subtitle =
          typeof item?.description === "string" ? item.description : null;

        const hasTitle = Boolean(title);
        const hasSubtitle = Boolean(subtitle);

        const hasNoteSectionBody =
          collection === "note_section" &&
          hasRenderableNoteSectionContent(item);
        const shouldRenderWithoutHeader =
          collection === "qa_section" ||
          collection === "pattern_section" ||
          collection === "purchase_link_section" ||
          collection === "project_section" ||
          hasNoteSectionBody;

        if (!hasTitle && !hasSubtitle && !shouldRenderWithoutHeader) {
          return null;
        }

        return (
          <article key={key} className="space-y-3">
            {hasTitle && (
              <h2 className="text-[18px] font-semibold leading-snug text-black">
                {title}
              </h2>
            )}
            {hasSubtitle && (
              <div
                className={`text-[13px] leading-relaxed text-[#666666] ${markdownBlockClassName}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {normalizeCmsMarkdown(subtitle ?? "")}
                </ReactMarkdown>
              </div>
            )}

            {collection === "qa_section" && <QaSectionContent item={item} />}
            {collection === "pattern_section" && (
              <PatternSectionContent item={item} />
            )}
            {collection === "purchase_link_section" && (
              <PurchaseLinkSectionContent item={item} />
            )}
            {collection === "note_section" && (
              <NoteSectionContent item={item} />
            )}
            {collection === "project_section" && (
              <ProjectSectionContent
                item={item}
                projectDetailMap={projectDetailMap}
              />
            )}
          </article>
        );
      })}
    </section>
  );
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  let article: Article | null = null;

  const resolvedParams = await params;

  try {
    article = await fetchArticleBySlug(resolvedParams.slug);
  } catch {
    // 메타데이터 생성 실패 시 기본 값 사용
  }

  if (!article) {
    return {
      title: "아티클 상세",
    };
  }

  const title = article.title || "아티클 상세";
  const description =
    typeof article.subtitle === "string" && article.subtitle.length > 0
      ? article.subtitle
      : "뜨다의 아티클 상세 페이지";

  return {
    title,
    description,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const resolvedParams = await params;

  // #region agent log
  fetch(
    "http://127.0.0.1:7247/ingest/a8420b9d-9a0e-479b-a523-2d8369319054",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `log_${Date.now()}_article_detail_params`,
        timestamp: Date.now(),
        location: "src/app/articles/[slug]/page.tsx:ArticleDetailPage",
        message: "ArticleDetailPage params resolved",
        runId: "initial",
        hypothesisId: "H1",
        data: {
          slug: resolvedParams.slug,
        },
      }),
    },
  ).catch(() => {});
  // #endregion agent log

  const article = await fetchArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const projectIds = extractProjectIdsFromSections(article.sections);
  const projectDetailMap = await fetchProjectsByIds(projectIds);

  const imageUrl = getBestArticleImage(article);
  const formattedDate = formatPublishedDate(article.published_at);

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <header className="w-full px-4 pt-6 pb-4 flex items-center gap-2">
          <Link
            href="/articles"
            className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-sm text-gray-700"
            aria-label="아티클 목록으로 돌아가기"
          >
            ←
          </Link>
          <h1 className="text-[20px] font-semibold text-black tracking-tight">
            뜨다 아티클
          </h1>
        </header>

        {imageUrl && (
          <div className="relative mx-4 mb-5 h-[260px] overflow-hidden rounded-[6px] bg-gray-200">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <section className="px-4 pb-6 space-y-3">
          <div className="inline-flex items-center rounded-full bg-[#EAF8F4] px-3 py-1">
            <span className="text-[11px] font-medium text-[#0ABE8C]">
              {article.category || "작가 인터뷰"}
            </span>
          </div>

          <h2 className="text-[22px] font-semibold leading-snug text-black">
            {article.title}
          </h2>

          {article.subtitle && (
            <div
              className={`text-[14px] leading-relaxed text-[#666666] ${markdownBlockClassName}`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {normalizeCmsMarkdown(article.subtitle)}
              </ReactMarkdown>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#888888]">
            {article.interviewee && (
              <span className="font-medium">{article.interviewee}</span>
            )}
            {formattedDate && (
              <span aria-label="발행일">{formattedDate}</span>
            )}
          </div>
        </section>

        <ArticleSections
          sections={article.sections}
          projectDetailMap={projectDetailMap}
        />
      </main>
    </div>
  );
}

