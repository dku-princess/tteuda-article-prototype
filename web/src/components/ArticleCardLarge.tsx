import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/types/article";
import { getDirectusAssetUrl } from "@/lib/image";

interface ArticleCardLargeProps {
  article: Article;
}

export function ArticleCardLarge({ article }: ArticleCardLargeProps) {
  const imageUrl = getDirectusAssetUrl(article.thumbnail_image_large);

  const href = `/articles/${article.slug ?? article.id}`;

  return (
    <Link
      href={href}
      className="relative block w-full h-[360px] rounded-[6px] overflow-hidden"
      aria-label={article.title}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" aria-hidden="true">
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            이미지 준비 중
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0ABE8C] to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-4 pt-10 px-4 flex flex-col justify-end text-white">
        {article.interviewee && (
          <p className="text-[14px] font-medium leading-snug">
            {article.interviewee}
          </p>
        )}
        <h2 className="mt-1 text-[20px] font-semibold leading-snug line-clamp-2">
          {article.title}
        </h2>
      </div>
    </Link>
  );
}
