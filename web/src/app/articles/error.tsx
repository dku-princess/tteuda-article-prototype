"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ArticlesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ArticlesError({
  error,
  reset,
}: ArticlesErrorProps): ReactElement {
  const router = useRouter();

  useEffect(() => {
    console.error("Articles page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-xs text-center space-y-4">
        <h1 className="text-[18px] font-semibold text-gray-900">
          일시적인 오류가 발생했어요
        </h1>
        <p className="text-sm text-gray-600">
          아티클을 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={reset}
            className="h-10 rounded-full bg-[#0ABE8C] px-4 text-sm font-medium text-white"
          >
            다시 시도
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-10 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

