import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // 프로젝트 루트를 web으로 고정해 상위 디렉터리 스캔을 막고 컴파일 범위를 줄임
    root: path.resolve(process.cwd()),
  },
  experimental: {
    // dev 시 Turbopack 결과를 디스크에 캐시해 재실행 시 컴파일 시간 단축
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
