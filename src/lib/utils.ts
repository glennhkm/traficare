import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safely convert a Google Drive file URL to an embeddable preview URL
// Supports:
// - https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
// - https://drive.google.com/open?id=<FILE_ID>
// - https://drive.google.com/uc?id=<FILE_ID>&export=download
// Only allows google.com hostnames and validates a plausible file id
export function toGoogleDriveEmbed(url?: string | null): string | null {
  if (!url) return null;
  let u: URL | null = null;
  try {
    u = new URL(url);
  } catch {
    console.warn("Invalid URL:", url);
    return null;
  }
  if (!u) return null;
  const host = u.hostname;
  if (!/\.google\.(com|[a-z]{2,6})$/.test(host) && host !== "google.com" && host !== "drive.google.com") {
    return null;
  }

  // Try extract file id from supported patterns
  let id: string | null = null;
  // /file/d/<id>/
  const pathMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (pathMatch && pathMatch[1]) id = pathMatch[1];
  // open?id=
  if (!id) id = u.searchParams.get("id");

  // Basic validation of the id
  if (!id || !/^[a-zA-Z0-9_-]{10,}$/.test(id)) return null;

  // Use preview to embed PDFs and most Drive files
  // For PDFs this renders an inline viewer; for others Drive preview UI
  return `https://drive.google.com/file/d/${id}/preview`;
}

// Convert a YouTube URL to an embed URL
export function toYouTubeEmbed(url?: string | null): string | null {
  if (!url) return null;
  try {
    // Support youtu.be/<id> and youtube.com/watch?v=<id>
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}