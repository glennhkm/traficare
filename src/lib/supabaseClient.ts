import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  pdf_url: string | null;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  published: boolean;
};
