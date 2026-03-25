const DIRECTUS_ASSETS_PREFIX = "/api/directus-assets";

export function getDirectusAssetUrl(
  assetId: string | null | undefined,
): string | null {
  if (!assetId) {
    return null;
  }

  return `${DIRECTUS_ASSETS_PREFIX}/${assetId}`;
}

