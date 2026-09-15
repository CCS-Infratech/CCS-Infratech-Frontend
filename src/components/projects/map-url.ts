/**
 * Helpers for turning whatever Google Maps URL an editor pasted into the admin
 * into (a) something that can actually be framed and (b) a directions link.
 *
 * Google only allows `/maps/embed` URLs inside an iframe — every other Maps URL
 * is served with X-Frame-Options and renders as "refused to connect". So for a
 * normal share link we pull the coordinates out of it and frame a
 * `?q=<lat>,<lng>&output=embed` map instead, which is frameable AND drops a pin.
 */

export interface ResolvedMap {
  /** iframe src, or undefined when there is nothing sensible to show. */
  embedSrc?: string;
  /** Where "Get directions" should go. */
  directionsUrl: string;
  /** True when the framed map came from the pasted URL or its coordinates. */
  isPinned: boolean;
}

const COORD = "(-?\\d{1,3}\\.\\d{3,})";

/** Pull a lat/lng pair out of any Google Maps URL shape we can recognise. */
export function extractLatLng(url?: string): [number, number] | null {
  if (!url) return null;

  // /maps/place/... !3d<lat>!4d<lng> — the place's own coordinates.
  let match = url.match(new RegExp(`!3d${COORD}!4d${COORD}`));
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];

  // Embed "pb" strings encode longitude (!2d) before latitude (!3d).
  match = url.match(new RegExp(`!2d${COORD}!3d${COORD}`));
  if (match) return [parseFloat(match[2]), parseFloat(match[1])];

  // ?q=<lat>,<lng>, ?ll=, ?center= — comma may arrive percent-encoded.
  match =
    url.match(new RegExp(`[?&](?:q|ll|center|daddr)=${COORD},${COORD}`)) ||
    url.match(new RegExp(`[?&](?:q|ll|center|daddr)=${COORD}%2C${COORD}`, "i"));
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];

  // @<lat>,<lng>,<zoom>z — the viewport centre of a shared map view.
  match = url.match(new RegExp(`@${COORD},${COORD}`));
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];

  return null;
}

export function isEmbeddableMapUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes("/maps/embed") || url.includes("output=embed");
}

function searchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`;
}

export function resolveProjectMap(
  mapUrl: string | undefined,
  query: string,
): ResolvedMap {
  const trimmed = mapUrl?.trim() || undefined;
  const coords = extractLatLng(trimmed);

  // 1. A real embed URL — frame it exactly as pasted.
  if (isEmbeddableMapUrl(trimmed)) {
    return {
      embedSrc: trimmed,
      directionsUrl: coords
        ? searchUrl(`${coords[0]},${coords[1]}`)
        : searchUrl(query),
      isPinned: true,
    };
  }

  // 2. A share/place link we can read coordinates from — frame those, so the
  //    map shows a pin on the exact spot rather than a vague address match.
  if (coords) {
    return {
      embedSrc: `https://www.google.com/maps?q=${coords[0]},${coords[1]}&z=16&hl=en&output=embed`,
      directionsUrl: trimmed || searchUrl(`${coords[0]},${coords[1]}`),
      isPinned: true,
    };
  }

  // 3. A shortened link (maps.app.goo.gl) hides its coordinates behind a
  //    redirect we can't follow from the browser — fall back to the address.
  return {
    embedSrc: query
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          query,
        )}&hl=en&output=embed`
      : undefined,
    directionsUrl: trimmed || searchUrl(query),
    isPinned: false,
  };
}
