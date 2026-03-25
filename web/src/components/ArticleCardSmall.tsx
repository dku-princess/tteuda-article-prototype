import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/types/article";
import { getDirectusAssetUrl } from "@/lib/image";

interface ArticleCardSmallProps {
  article: Article;
  index: number;
}

export function ArticleCardSmall({ article, index }: ArticleCardSmallProps) {
  const imageUrl = getDirectusAssetUrl(article.thumbnail_image_small);
  const href = `/articles/${article.slug ?? article.id}`;

  return (
    <Link
      href={href}
      className="flex h-[120px] w-full gap-3"
      aria-label={article.title}
    >
      <div className="w-[107px] h-full rounded-[8px] overflow-hidden bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            width={107}
            height={120}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-500">이미지 준비 중</span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 rounded-[4px] bg-[#66CCB0] px-2 py-1">
            <span className="text-[11px] font-medium text-white">
              {article.category || "작가 인터뷰"}
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-medium text-[#0ABE8C]">
              {index}
            </span>
          </div>
          <h3 className="text-[16px] font-semibold leading-snug text-[#666666] overflow-hidden text-ellipsis">
            {article.title}
          </h3>
        </div>

        {article.interviewee && (
          <p className="text-[12px] font-medium text-[#666666]">
            {article.interviewee}
          </p>
        )}
      </div>
    </Link>
  );
}

