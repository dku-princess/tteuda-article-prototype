"use client";

import { useEffect } from "react";

const LOG_ENDPOINT =
  "http://127.0.0.1:7247/ingest/a8420b9d-9a0e-479b-a523-2d8369319054";

function log(
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
) {
  fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: `log_${Date.now()}_gallery_${hypothesisId}`,
      timestamp: Date.now(),
      location: "GalleryImages.tsx",
      message,
      data,
      hypothesisId,
    }),
  }).catch(() => {});
}

export function GalleryImages({ urls }: { urls: string[] }) {
  // #region agent log
  useEffect(() => {
    if (typeof document === "undefined") return;
    log(
      "Gallery mount: page protocol",
      {
        protocol: document.location.protocol,
        urlCount: urls.length,
        firstUrl: urls[0] ?? null,
      },
      "H1",
    );
  }, [urls.length, urls[0]]);
  // #endregion agent log

  if (urls.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3">
      {urls.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          className="h-[200px] w-auto shrink-0 object-contain rounded-[6px] bg-gray-100"
          // #region agent log
          onLoad={() => {
            log(
              "Gallery image loaded",
              { index: i, src: url, loaded: true },
              "H5",
            );
          }}
          onError={() => {
            log(
              "Gallery image error",
              { index: i, src: url, error: true },
              "H4",
            );
          }}
          // #endregion agent log
        />
      ))}
    </div>
  );
}
