import type { Metadata } from "next";

import { fetchArticles } from "@/lib/articles";
import { ArticleCardLarge } from "@/components/ArticleCardLarge";
import { ArticleCardSmall } from "@/components/ArticleCardSmall";
import { BottomTabBar } from "@/components/BottomTabBar";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "뜨다 아티클",
  description: "뜨다의 패턴 디자이너 인터뷰 및 아티클을 모아보는 페이지",
};

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  const featuredArticles = articles.filter((article) => article.is_featured);
  const normalArticles = articles.filter((article) => !article.is_featured);

  const featured = featuredArticles[0];

  const hasArticles = featuredArticles.length > 0 || normalArticles.length > 0;

  return (
    <div className="flex h-full flex-col bg-white w-full">
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <header className="w-full px-4 pt-6 pb-4">
          <h1 className="text-[24px] font-semibold text-black tracking-tight">
            뜨다 아티클
          </h1>
        </header>

        <section className="w-full px-4 space-y-6 pb-6">
          {!hasArticles && (
            <p className="text-sm text-gray-500">
              아직 등록된 아티클이 없습니다.
            </p>
          )}

          {featured && (
            <section aria-label="대표 아티클">
              <ArticleCardLarge article={featured} />
            </section>
          )}

          {normalArticles.length > 0 && (
            <section className="space-y-4" aria-label="아티클 목록">
              {normalArticles.map((article, index) => (
                <ArticleCardSmall
                  key={article.id}
                  article={article}
                  index={index + 1}
                />
              ))}
            </section>
          )}
        </section>
      </main>

      <BottomTabBar active="articles" />
    </div>
  );
}

