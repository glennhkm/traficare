"use client";

import React, { useEffect } from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  BookOpen,
  Play,
  FileText,
  ChevronRight,
  CheckCircle,
  Target,
  Award,
  Clock,
  Activity,
  Globe,
  TrendingUp,
  Stethoscope,
  SearchSlash,
  CornerRightDown,
  Book,
} from "lucide-react";
import Image from "next/image";
import { supabase, type GuideRow } from "@/lib/supabaseClient";
import { toGoogleDriveEmbed, toYouTubeEmbed } from "@/lib/utils";

interface BiodataForm {
  nama: string;
  nis: string;
  umur: string; // disimpan sebagai string untuk kemudahan input
  jenisKelamin: string;
  asalSekolah: string;
  domisili: string;
}

type GuideCategory = "evakuasi" | "luka" | "fraktur" | "sinkop";

// Simplified color scheme - only red-800 and emerald-600
const guideCategories = {
  evakuasi: {
    title: "Evakuasi Korban",
    description: "Teknik memindahkan korban dengan aman",
    image: "/images/ambulance.PNG",
    color: "bg-emerald-600",
    gradient: "from-emerald-500/15 to-emerald-600/10",
  },
  luka: {
    title: "Luka & Pendarahan",
    description: "Penanganan luka dan menghentikan pendarahan",
    image: "/images/lukaPendarahan.png",
    // primary blue as main accent
    color: "bg-[#0066A5]",
    gradient: "from-[#0066A5]/15 to-[#00588E]/10",
  },
  fraktur: {
    title: "Fraktur",
    description: "Penanganan patah tulang dan cedera tulang",
    image: "/images/fraktur.png",
    color: "bg-gray-700",
    gradient: "from-gray-600/10 to-gray-700/5",
  },
  sinkop: {
    title: "Sinkop",
    description: "Penanganan pingsan dan kehilangan kesadaran",
    image: "/images/sinkop.png",
    color: "bg-emerald-600",
    gradient: "from-emerald-500/15 to-emerald-600/10",
  },
};

export default function TraficarePage() {
  const [biodata, setBiodata] = useState<BiodataForm>({
    nama: "",
    nis: "",
    umur: "",
    jenisKelamin: "",
    asalSekolah: "",
    domisili: "",
  });
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GuideCategory | null>(
    null
  );
  const [showContent, setShowContent] = useState(false);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const biodataRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Year is rendered directly to avoid SSR/CSR mismatch
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [studentNis, setStudentNis] = useState<string | null>(null);
  // Team slider state
  const teamSlides = [
    {
      src: "/images/pengembang-1.png",
      title: "Tim Pengembang",
      members: [
        "Ns. Jufrizal, S.Kep., M.Kep",
        "Ns. Rahmalia Amni, M.Kep",
        "Dr. Ns. Hilman Syarif, M.Kep., Sp.Kep. MB",
      ],
    },
    {
      src: "/images/pengembang-2.png",
      title: "Tim Pengembang",
      members: [
        "Ns. Jufrizal, S.Kep., M.Kep",
        "Ns. Rahmalia Amni, M.Kep",
        "Dr. Ns. Hilman Syarif, M.Kep., Sp.Kep. MB",
      ],
    },
  ];
  const [teamIndex, setTeamIndex] = useState(0);
  const [isTeamHover, setIsTeamHover] = useState(false);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBiodata = () => {
    biodataRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBiodataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !biodata.nama ||
      !biodata.nis ||
      !biodata.umur ||
      !biodata.jenisKelamin ||
      !biodata.asalSekolah ||
      !biodata.domisili
    ) {
      return;
    }
    const umur = Number(biodata.umur);
    const { error } = await supabase.from("students").upsert(
      {
        nis: biodata.nis.trim(),
        nama: biodata.nama.trim(),
        umur,
        jenis_kelamin: biodata.jenisKelamin,
        asal_sekolah: biodata.asalSekolah.trim(),
        domisili: biodata.domisili.trim(),
      },
      { onConflict: "nis" }
    );
    if (!error) {
      localStorage.setItem("traficare_nis", biodata.nis.trim());
      setStudentNis(biodata.nis.trim());
      setIsFormComplete(true);
      setTimeout(() => {
        guideRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      console.error("Failed to save biodata", error);
    }
  };

  const handleGuideSelect = (guide: GuideCategory) => {
    setSelectedGuide(guide);
    setShowContent(true);
    const guideRow = guides.find((g) => g.category === guide);
    if (guideRow && studentNis) {
      supabase.from("guide_views").insert({
        student_nis: studentNis,
        guide_id: guideRow.id,
      });
    }
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleBiodataChange = (field: keyof BiodataForm, value: string) => {
    setBiodata((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const stored = localStorage.getItem("traficare_nis");
    if (stored) {
      setStudentNis(stored);
      setIsFormComplete(true);
    }
    // Log page visit (best-effort)
    supabase.from("page_visits").insert({
      path: "/",
      student_nis: stored ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    // Load guides
    const load = async () => {
      setLoadingGuides(true);
      const { data, error } = await supabase
        .from("guides")
        .select(
          "id, category, title, description, pdf_url, youtube_url, youtube_embed_url, published"
        )
        .eq("published", true)
        .order("created_at", { ascending: true });
      if (!error && data) {
        setGuides(data as GuideRow[]);
      } else {
        console.error("Failed to fetch guides", error);
      }
      setLoadingGuides(false);
    };
    load();
  }, []);

  // Autoplay team slider every 4s, pause on hover
  useEffect(() => {
    if (teamSlides.length <= 1) return; // no need to autoplay for single slide
    if (isTeamHover) return;
    const id = setInterval(() => {
      setTeamIndex((prev) => (prev + 1) % teamSlides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isTeamHover, teamSlides.length]);

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold gradient-text-primary font-serif">
                Traficare
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToAbout}
                className="text-gray-600 hover:text-[#0066A5] transition-colors font-medium"
              >
                Tentang
              </button>
              <button
                onClick={scrollToBiodata}
                className="text-gray-600 hover:text-[#0066A5] transition-colors font-medium"
              >
                Mulai Belajar
              </button>
              <Button
                onClick={scrollToBiodata}
                className="bg-gradient-to-r from-[#0066A5] to-[#00588E] hover:from-[#00588E] hover:to-[#004a79] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
              >
                Bergabung Sekarang
              </Button>
            </div>
            {/* Mobile Menu (Dropdown) */}
            <div className="md:hidden relative">
              <button
                onClick={() => setIsShowMobileMenu((prev) => !prev)}
                aria-label="Toggle menu"
                aria-expanded={isShowMobileMenu}
                className={`h-10 w-10 flex flex-col ${
                  !isShowMobileMenu ? "gap-1.5" : "gap-0"
                } justify-center items-center rounded-lg transition-colors`}
              >
                <span
                  className={`w-7 h-[3px] rounded-full bg-[#0066A5] duration-300 transition-transform ${
                    isShowMobileMenu
                      ? "translate-y-[100%] rotate-45"
                      : "rotate-0"
                  }`}
                ></span>
                <span
                  className={`w-7 h-[3px] rounded-full bg-[#0066A5] transition-all duration-200 ${
                    isShowMobileMenu
                      ? "opacity-0 translate-x-4"
                      : "opacity-100 translate-x-0"
                  }`}
                ></span>
                <span
                  className={`w-7 h-[3px] rounded-full bg-[#0066A5] duration-300 transition-transform ${
                    isShowMobileMenu
                      ? "-translate-y-[100%] -rotate-45"
                      : "rotate-0"
                  }`}
                ></span>
              </button>

              {isShowMobileMenu && (
                <div className="absolute right-0 mt-4 w-48 glass-card rounded-2xl shadow-lg border border-slate-200/30 overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="flex flex-col py-2">
                    <button
                      onClick={() => {
                        scrollToAbout();
                        setIsShowMobileMenu(false);
                      }}
                      className="text-left px-5 py-3 text-gray-700 hover:bg-[#0066A5]/10 hover:text-[#0066A5] font-medium transition-colors"
                    >
                      Tentang
                    </button>
                    <button
                      onClick={() => {
                        scrollToBiodata();
                        setIsShowMobileMenu(false);
                      }}
                      className="text-left px-5 py-3 text-gray-700 hover:bg-[#0066A5]/10 hover:text-[#0066A5] font-medium transition-colors"
                    >
                      Mulai Belajar
                    </button>
                    <div className="px-5 pt-2">
                      <Button
                        onClick={() => {
                          scrollToBiodata();
                          setIsShowMobileMenu(false);
                        }}
                        className="w-full bg-gradient-to-r from-[#0066A5] to-[#00588E] hover:from-[#00588E] hover:to-[#004a79] text-white rounded-xl text-sm font-semibold"
                      >
                        Bergabung
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced Modern Design */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-medical-hero"></div>

        {/* Floating geometric shapes - simplified colors */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-[#0066A5]/10 to-[#0066A5]/20 rounded-2xl rotate-12 float-animation"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-emerald-200/20 to-emerald-300/20 rounded-full gentle-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-200/20 to-gray-300/20 rounded-lg -rotate-12 breathe"></div>
        <div
          className="absolute bottom-1/4 left-1/5 w-14 h-14 bg-gradient-to-br from-emerald-200/20 to-emerald-300/20 rounded-2xl rotate-45 float-animation"
          style={{ animationDelay: "1s" }}
        ></div>

        <div
          className="absolute bottom-1/3 left-1/6 gentle-pulse"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="w-14 h-14 glass-card rounded-xl flex items-center justify-center shadow-soft float-animation">
            <Shield className="w-7 h-7 text-emerald-600 opacity-30" />
          </div>
        </div>
        <div
          className="absolute top-1/2 left-1/4 gentle-pulse"
          style={{ animationDelay: "2.5s" }}
        >
          <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center shadow-soft float-animation">
            <Activity className="w-6 h-6 text-gray-600 opacity-30" />
          </div>
        </div>
        <div
          className="absolute top-1/3 left-1/3 gentle-pulse"
          style={{ animationDelay: "3s" }}
        >
          <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center shadow-soft float-animation">
            <Stethoscope className="w-5 h-5 text-[#0066A5] opacity-30" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Enhanced Content */}
            <div className="space-y-8 slide-in-left">
              <div className="inline-flex items-center gap-3 glass-card text-[#0066A5] px-6 py-3 rounded-full text-sm font-semibold shadow-soft ">
                Platform Edukasi Pertolongan Pertama Pada Kecelakaan untuk
                remaja
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-6xl md:text-[5.4rem] font-bold gradient-text-primary leading-tight hero-title">
                  Traficare
                </h1>
                <div className="w-24 h-1 bg-emerald-600 rounded-full"></div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl text-gray-800 font-bold">
                  Empower Yourself with{" "}
                  <span className="text-[#0066A5]">First Aid Skills!</span>
                </h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Pelajari teknik pertolongan pertama yang dapat menyelamatkan
                  nyawa dalam situasi darurat. Platform interaktif yang
                  dirancang khusus untuk remaja dengan pendekatan modern dan
                  mudah dipahami.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToBiodata}
                  size="lg"
                  className="bg-gradient-to-r from-[#0066A5] to-[#00588E] hover:from-[#00588E] hover:to-[#004a79] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-medical hover:shadow-lg transition-all duration-300 hover-lift shimmer-effect"
                >
                  Mulai Sekarang
                  <CornerRightDown className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Right Column - Enhanced Visual */}
            <div className="relative w-full h-full scale-in">
              <div className="relative w-full h-full md:h-full float-animation">
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src={"/images/IMG_4409.PNG"}
                    alt="Medical Education Illustration"
                    fill
                    className="object-contain rounded-3xl scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Enhanced Modern Design */}
      <section
        ref={aboutRef}
        className="py-24 px-4 bg-white relative overflow-hidden"
      >
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-medical-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-red-200/20 to-gray-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-gray-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-flex items-center gap-3 glass-card text-[#0066A5] px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-soft">
              <SearchSlash className="w-4 h-4" />
              Tentang Traficare
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Mengapa Memilih <span className="text-[#0066A5]">Traficare?</span>
            </h2>
            <div className="w-24 h-1 bg-emerald-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kami berkomitmen untuk memberikan edukasi Pertolongan Pertama Pada
              Kecelakaan terbaik yang dapat diakses kapan saja, di mana saja,
              dengan metode pembelajaran yang interaktif dan mudah dipahami.
            </p>
          </div>

          {/* Tim Pengembang & Visi Misi */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            {/* Foto Tim Pengembang - Slider */}
            <div
              className="w-full slide-in-left group overflow-hidden rounded-3xl"
              onMouseEnter={() => setIsTeamHover(true)}
              onMouseLeave={() => setIsTeamHover(false)}
            >
              <div className="w-full relative h-96 lg:h-full min-h-[500px]">
                {/* Slides Wrapper */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{
                      width: `${teamSlides.length * 100}%`,
                      transform: `translateX(-${
                        teamIndex * (100 / teamSlides.length)
                      }%)`,
                    }}
                  >
                    {teamSlides.map((slide, i) => (
                      <div
                        key={i}
                        className="relative h-full shrink-0 grow-0"
                        style={{ width: `${100 / teamSlides.length}%` }}
                      >
                        <Image
                          src={slide.src}
                          alt={slide.title}
                          fill
                          className="object-cover group-hover:scale-110 shadow-medical hover:shadow-lg transition-all duration-300 hover-lift scale-in"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 shadow-lg shadow-black/40 via-transparent to-transparent z-10"></div>
                        <div className="absolute bottom-12 left-8 text-white z-20">
                          <h3 className="text-4xl font-serif font-bold mb-2 group-hover:text-5xl group-hover:mb-4 duration-200">
                            {slide.title}
                          </h3>
                          {slide.members?.map((m, idx) => (
                            <p
                              key={idx}
                              className="duration-200 text-base group-hover:text-lg"
                            >
                              {m}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2">
                  {teamSlides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setTeamIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === teamIndex
                          ? "w-6 bg-white/60"
                          : "w-2.5 bg-white/20 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Visi & Misi Cards */}
            <div className="space-y-8 slide-in-right">
              <Card className="border-0 shadow-medical bg-gradient-to-br from-emerald-50/30 to-white p-8 rounded-3xl hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-gray-900">
                      Visi Kami
                    </h3>
                    <div className="w-12 h-0.5 bg-emerald-600 rounded-full mt-2"></div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Menjadi platform edukasi Pertolongan Pertama Pada Kecelakaan
                  terdepan di Indonesia yang menciptakan generasi muda yang siap
                  dan mampu memberikan pertolongan pertama dalam situasi
                  darurat, sehingga dapat mengurangi risiko kematian dan cedera
                  yang dapat dicegah.
                </p>
                <div className="mt-6 flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Impact Berkelanjutan
                  </span>
                </div>
              </Card>
              <Card className="border-0 shadow-medical bg-gradient-to-br from-[#eef6fb] to-white p-8 rounded-3xl hover-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0066A5] to-[#00588E] rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-gray-900">
                      Misi Kami
                    </h3>
                    <div className="w-12 h-0.5 bg-[#0066A5] rounded-full mt-2"></div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Memberikan akses mudah dan praktis kepada remaja untuk
                  mempelajari teknik pertolongan pertama yang dapat
                  menyelamatkan nyawa. Kami percaya bahwa setiap individu berhak
                  mendapatkan pengetahuan yang dapat membuat perbedaan dalam
                  situasi darurat.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#0066A5]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Akses Praktis & Mudah
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group scale-in bg-white/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/80 transition-all duration-300 hover-lift shadow-medical">
              <div className="w-20 h-20 bg-gradient-to-r from-[#0066A5] to-[#00588E] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Book className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Mudah Dipahami
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Konten disajikan dengan bahasa sederhana dan visual yang menarik
                untuk memudahkan pemahaman individu.
              </p>
            </div>

            <div
              className="text-center group scale-in bg-white/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/80 transition-all duration-300 hover-lift shadow-medical"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-[#0066A5] to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Video Interaktif
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Pembelajaran melalui video demonstrasi yang jelas dan mudah
                diikuti step-by-step.
              </p>
            </div>

            <div
              className="text-center group scale-in bg-white/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/80 transition-all duration-300 hover-lift shadow-medical"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Akses 24/7
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Belajar kapan saja dan di mana saja sesuai dengan waktu dan
                kecepatan belajar Anda.
              </p>
            </div>

            <div
              className="text-center group scale-in bg-white/50 backdrop-blur-sm p-8 rounded-3xl hover:bg-white/80 transition-all duration-300 hover-lift shadow-medical"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Standar Medis
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Semua materi disusun berdasarkan standar medis internasional dan
                mengikuti protokol terbaru.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Biodata Section - Enhanced Modern Design */}
      <section
        ref={biodataRef}
        className="py-24 px-4 bg-soft-gradient relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-[#0066A5]/15 to-gray-300/20 rounded-3xl rotate-12 float-animation"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-emerald-300/20 to-gray-300/20 rounded-2zl -rotate-12 gentle-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full breathe"></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12 fade-in-up">
            <div className="inline-flex items-center gap-3 glass-card text-emerald-600 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-soft">
              <Users className="w-4 h-4" />
              Bergabung dengan Komunitas
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Bergabung untuk Pelajari{" "}
              <span className="text-[#0066A5]">Panduan</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#0066A5] to-emerald-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Isi biodata Anda untuk melanjutkan ke panduan Pertolongan Pertama
              Pada Kecelakaan dan bergabung dengan ribuan individu lainnya
            </p>
          </div>

          <Card className="shadow-medical border-0 glass-card relative overflow-hidden hover-lift scale-in">
            {/* Biodata Form */}
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Biodata Siswa
              </CardTitle>
              <CardDescription className="text-gray-600">
                Isi data berikut untuk melanjutkan ke panduan Pertolongan
                Pertama pada Kecelakaan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={handleBiodataSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <Label
                    htmlFor="nama"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Nama
                  </Label>
                  <Input
                    id="nama"
                    placeholder="Nama lengkap"
                    value={biodata.nama}
                    onChange={(e) =>
                      handleBiodataChange("nama", e.target.value)
                    }
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="nis"
                    className="text-sm font-semibold text-gray-700"
                  >
                    NIS
                  </Label>
                  <Input
                    id="nis"
                    placeholder="Masukkan NIS"
                    value={biodata.nis}
                    onChange={(e) => handleBiodataChange("nis", e.target.value)}
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="umur"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Umur
                  </Label>
                  <Input
                    id="umur"
                    type="number"
                    inputMode="numeric"
                    min={10}
                    max={100}
                    placeholder="Contoh: 16"
                    value={biodata.umur}
                    onChange={(e) =>
                      handleBiodataChange("umur", e.target.value)
                    }
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="jenisKelamin"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Jenis Kelamin
                  </Label>
                  <select
                    id="jenisKelamin"
                    value={biodata.jenisKelamin}
                    onChange={(e) =>
                      handleBiodataChange("jenisKelamin", e.target.value)
                    }
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0066A5] focus:border-[#0066A5]"
                  >
                    <option value="" disabled>
                      Pilih jenis kelamin
                    </option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="asalSekolah"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Asal Sekolah
                  </Label>
                  <Input
                    id="asalSekolah"
                    placeholder="Nama sekolah"
                    value={biodata.asalSekolah}
                    onChange={(e) =>
                      handleBiodataChange("asalSekolah", e.target.value)
                    }
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="domisili"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Domisili
                  </Label>
                  <Input
                    id="domisili"
                    placeholder="Kota/Kabupaten"
                    value={biodata.domisili}
                    onChange={(e) =>
                      handleBiodataChange("domisili", e.target.value)
                    }
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#0066A5] hover:bg-[#00588E] text-white font-semibold rounded-xl transition-all"
                  >
                    Lanjutkan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Success Message */}
          {isFormComplete && (
            <div className="mt-8 glass-card p-6 rounded-2xl text-center fade-in-up border border-emerald-200">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Selamat Datang, {biodata.nama}! 🎉
              </h3>
              <p className="text-gray-600">
                Anda sekarang dapat mengakses semua panduan Pertolongan Pertama
                Pada Kecelakaan. Mari mulai belajar!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Guide Selection Section - Enhanced Modern Design */}
      {isFormComplete && (
        <section
          ref={guideRef}
          className="py-24 px-4 bg-gradient-to-br from-[#eef6fb]/60 via-white to-emerald-50/40 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-[#0066A5]/10 to-gray-200/20 rounded-3xl rotate-12 float-animation"></div>
            <div className="absolute bottom-24 right-16 w-20 h-20 bg-gradient-to-br from-emerald-200/20 to-gray-200/20 rounded-2zl -rotate-12 gentle-pulse"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 fade-in-up">
              <div className="inline-flex items-center gap-3 glass-card text-[#0066A5] px-8 py-4 rounded-full text-sm font-semibold mb-8 shadow-soft hover-lift">
                <BookOpen className="w-5 h-5" />
                Pilih Panduan P3K
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Choose Your First Aid{" "}
                <span className="bg-clip-text bg-gradient-to-r from-[#004a79] to-[#0066A5] text-transparent">
                  Journey
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#0066A5] to-emerald-600 rounded-full mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Pilih kategori panduan Pertolongan Pertama Pada Kecelakaan yang
                ingin Anda pelajari. Setiap panduan dilengkapi dengan video
                demonstrasi dan artikel lengkap yang mudah dipahami.
              </p>
              <div className="flex justify-center my-12">
                <div className="w-full max-w-3xl">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                      src="https://www.youtube.com/embed/vq3s1DIF6PQ"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(guideCategories).map(([key, category], index) => {
                const available = guides.find((g) => g.category === key);
                return (
                  <Card
                    key={key}
                    onClick={() =>
                      available && handleGuideSelect(key as GuideCategory)
                    }
                    className={`cursor-pointer border-0 shadow-medical hover:shadow-lg transition-all duration-300 hover-lift scale-in relative overflow-hidden group ${
                      selectedGuide === key
                        ? "ring-2 ring-[#0066A5] ring-offset-2"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Card Background Gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${category.gradient}`}
                    ></div>

                    <CardContent className="p-8 text-center relative z-10">
                      <div className="w-20 h-20 relative mx-auto mb-2">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-800">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {category.description}
                      </p>
                      {!available && (
                        <div className="text-xs text-gray-500">
                          Belum tersedia
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 text-[#0066A5] group-hover:text-[#004a79] font-medium">
                        <span>Mulai Belajar</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Features */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 glass-card px-6 py-4 rounded-2xl shadow-soft">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#0066A5]" />
                  <span className="text-sm font-medium text-gray-700">
                    Video HD
                  </span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Artikel Lengkap
                  </span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#0066A5]" />
                  <span className="text-sm font-medium text-gray-700">
                    Sertifikat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Display Section */}
      {showContent && selectedGuide && (
        <section
          ref={contentRef}
          className="py-24 px-4 bg-white slide-in-from-bottom"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#eef6fb] to-emerald-50 text-[#0066A5] px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
                Panduan Pertolongan Pertama Pada Kecelakaan
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                {guideCategories[selectedGuide].title}
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                {guideCategories[selectedGuide].description}
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue="video" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none h-16 bg-gradient-to-r from-[#eef6fb] to-emerald-50">
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-3 text-base font-semibold h-full data-[state=active]:bg-white data-[state=active]:text-[#0066A5] transition-all duration-300"
                    >
                      <Play className="w-5 h-5" />
                      Video Panduan
                    </TabsTrigger>
                    <TabsTrigger
                      value="artikel"
                      className="flex items-center gap-3 text-base font-semibold h-full data-[state=active]:bg-white data-[state=active]:text-[#0066A5] transition-all duration-300"
                    >
                      <FileText className="w-5 h-5" />
                      Artikel Panduan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="video" className="p-8 m-0">
                    <div className="space-y-8">
                      {(() => {
                        const g = guides.find(
                          (x) => x.category === selectedGuide
                        );
                        const embed =
                          g?.youtube_embed_url ||
                          toYouTubeEmbed(g?.youtube_url || undefined);
                        return embed ? (
                          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                            <iframe
                              src={embed}
                              title={g?.title || "Video Panduan"}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-[#0066A5]/20 to-emerald-900/20 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                            <div className="text-center text-white relative z-10">
                              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <Play className="w-12 h-12 text-white ml-1" />
                              </div>
                              <p className="text-xl font-semibold mb-2">
                                Video belum tersedia
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="bg-gradient-to-r from-[#eef6fb] to-emerald-50 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                          {guides.find((x) => x.category === selectedGuide)
                            ?.title || "Video Panduan"}
                        </h3>
                        <p className="text-stone-700 leading-relaxed text-lg">
                          {guides.find((x) => x.category === selectedGuide)
                            ?.description || "Demonstrasi praktis."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="artikel" className="p-8 m-0">
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-emerald-50 to-[#eef6fb] p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          {guides.find((x) => x.category === selectedGuide)
                            ?.title || "Artikel Panduan"}
                        </h3>

                        {(() => {
                          const g = guides.find(
                            (x) => x.category === selectedGuide
                          );
                          // Prefer explicit pdf_url if it's already an <iframe> embed
                          // Otherwise, try to parse a Google Drive link inside pdf_url as a fallback
                          const tryExtractDriveUrl = (url?: string | null) => {
                            if (!url) return null;
                            try {
                              // Very conservative: look for common drive patterns in plain text
                              const m = url.match(
                                /https?:\/\/(?:drive\.)?google\.com\S+/
                              );

                              return m ? m[0] : null;
                            } catch {
                              return null;
                            }
                          };
                          const driveSource = tryExtractDriveUrl(g?.pdf_url);
                          const embed = toGoogleDriveEmbed(
                            driveSource || undefined
                          );
                          return embed ? (
                            <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
                              <iframe
                                src={embed}
                                title={g?.title || "Dokumen"}
                                className="w-full"
                                style={{ height: "75vh" }}
                                allow="fullscreen"
                              />
                            </div>
                          ) : (
                            <p className="text-stone-700 leading-relaxed text-lg">
                              Dokumen belum tersedia.
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <Button
                onClick={() => {
                  setSelectedGuide(null);
                  setShowContent(false);
                  guideRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                size="lg"
                className="border-2 border-[#0066A5]/30 text-[#0066A5] hover:bg-[#0066A5]/10 px-8 py-3 font-semibold"
              >
                <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
                Kembali ke Pilihan Panduan
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Modern Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#0066A5] to-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-emerald-400 to-[#0066A5] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-[#004a79] to-[#0066A5] text-transparent font-serif">
              Traficare
            </h3>
            <p className="mt-3 text-gray-300">
              Platform edukasi Pertolongan Pertama pada Kecelakaan untuk Remaja.
              Bangun kesiapsiagaan dengan pengetahuan yang tepat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0066A5] to-[#00588E] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold">Menyelamatkan Nyawa</h4>
              <p className="text-gray-400 mt-2">
                Setiap detik berharga dalam situasi darurat.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold">Komunitas Peduli</h4>
              <p className="text-gray-400 mt-2">
                Bersama membangun masyarakat yang siap siaga.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold">Standar Medis</h4>
              <p className="text-gray-400 mt-2">
                Materi diverifikasi tenaga medis profesional.
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              Traficare • Dibuat dengan dedikasi untuk keselamatan bersama
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
