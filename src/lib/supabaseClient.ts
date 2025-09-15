import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export type StudentRow = {
    
  nis: string;
  nama: string;
  umur: number;
  jenis_kelamin: "Laki-laki" | "Perempuan" | "Lainnya";
  asal_sekolah: string;
  domisili: string;
};

export type GuideRow = {
  id: string;
  category: "evakuasi" | "luka" | "fraktur" | "sinkop";
  title: string;
  description: string | null;
  article_html: string | null;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  published: boolean;
};
