"use client";

import React from "react";

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
  Heart,
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
  Star,
  Phone,
  AlertTriangle,
  Activity,
  Globe,
  TrendingUp,
  Stethoscope,
  Cross,
  Ambulance,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

interface BiodataForm {
  nama: string;
  nis: string;
  domisili: string;
}

type GuideCategory = "evakuasi" | "luka" | "fraktur" | "sinkop";

// Simplified color scheme - only red-800 and emerald-600
const guideCategories = {
  evakuasi: {
    title: "Evakuasi Korban",
    description: "Teknik memindahkan korban dengan aman",
    icon: Users,
    color: "bg-emerald-600",
  },
  luka: {
    title: "Luka & Pendarahan",
    description: "Penanganan luka dan menghentikan pendarahan",
    icon: Heart,
    color: "bg-red-800",
  },
  fraktur: {
    title: "Fraktur",
    description: "Penanganan patah tulang dan cedera tulang",
    icon: Shield,
    color: "bg-gray-700",
  },
  sinkop: {
    title: "Sinkop",
    description: "Penanganan pingsan dan kehilangan kesadaran",
    icon: BookOpen,
    color: "bg-emerald-600",
  },
};

const guideContent = {
  evakuasi: {
    video: {
      title: "Video Panduan Evakuasi Korban",
      content:
        "Video tutorial lengkap tentang teknik evakuasi korban yang aman dan efektif. Pelajari cara memindahkan korban tanpa memperparah cedera.",
      duration: "8 menit",
    },
    artikel: {
      title: "Artikel Panduan Evakuasi Korban",
      content: `
        <h3>Langkah-langkah Evakuasi Korban:</h3>
        <ol>
          <li><strong>Pastikan Keamanan:</strong> Periksa area sekitar untuk memastikan tidak ada bahaya tambahan</li>
          <li><strong>Evaluasi Kondisi Korban:</strong> Periksa kesadaran dan cedera yang terlihat</li>
          <li><strong>Panggil Bantuan:</strong> Hubungi 119 atau layanan darurat terdekat</li>
          <li><strong>Stabilisasi:</strong> Jangan memindahkan korban kecuali dalam bahaya langsung</li>
          <li><strong>Teknik Pemindahan:</strong> Gunakan teknik log roll atau drag carry jika diperlukan</li>
        </ol>
        <p><strong>Peringatan:</strong> Hindari memindahkan korban dengan cedera tulang belakang kecuali dalam situasi darurat.</p>
      `,
    },
  },
  luka: {
    video: {
      title: "Video Panduan Luka & Pendarahan",
      content:
        "Demonstrasi praktis cara menangani berbagai jenis luka dan menghentikan pendarahan dengan teknik yang benar.",
      duration: "6 menit",
    },
    artikel: {
      title: "Artikel Panduan Luka & Pendarahan",
      content: `
        <h3>Penanganan Luka & Pendarahan:</h3>
        <ol>
          <li><strong>Kontrol Pendarahan:</strong> Tekan langsung pada luka dengan kain bersih</li>
          <li><strong>Elevasi:</strong> Angkat bagian yang terluka lebih tinggi dari jantung jika memungkinkan</li>
          <li><strong>Pressure Point:</strong> Tekan titik tekanan arteri jika pendarahan tidak berhenti</li>
          <li><strong>Balut Luka:</strong> Gunakan perban steril untuk menutup luka</li>
          <li><strong>Monitor:</strong> Awasi tanda-tanda syok dan kehilangan darah berlebihan</li>
        </ol>
        <p><strong>Catatan:</strong> Jangan lepaskan perban yang sudah jenuh darah, tambahkan lapisan baru di atasnya.</p>
      `,
    },
  },
  fraktur: {
    video: {
      title: "Video Panduan Fraktur",
      content:
        "Pelajari cara mengenali dan menangani patah tulang, serta teknik pembidaian yang benar untuk stabilisasi.",
      duration: "10 menit",
    },
    artikel: {
      title: "Artikel Panduan Fraktur",
      content: `
        <h3>Penanganan Fraktur:</h3>
        <ol>
          <li><strong>Jangan Memindahkan:</strong> Stabilisasi korban di tempat</li>
          <li><strong>Kontrol Nyeri:</strong> Berikan dukungan emosional dan posisi nyaman</li>
          <li><strong>Immobilisasi:</strong> Bidai area yang patah termasuk sendi di atas dan bawahnya</li>
          <li><strong>Cek Sirkulasi:</strong> Pastikan aliran darah tidak terganggu</li>
          <li><strong>Transport:</strong> Siapkan evakuasi medis segera</li>
        </ol>
        <p><strong>Tanda Fraktur:</strong> Nyeri hebat, deformitas, bengkak, dan ketidakmampuan menggerakkan bagian tubuh.</p>
      `,
    },
  },
  sinkop: {
    video: {
      title: "Video Panduan Sinkop",
      content:
        "Teknik penanganan korban pingsan dan cara mengembalikan kesadaran dengan aman dan efektif.",
      duration: "5 menit",
    },
    artikel: {
      title: "Artikel Panduan Sinkop",
      content: `
        <h3>Penanganan Sinkop (Pingsan):</h3>
        <ol>
          <li><strong>Posisi Aman:</strong> Baringkan korban dengan kaki sedikit terangkat</li>
          <li><strong>Buka Jalan Napas:</strong> Pastikan tidak ada sumbatan di mulut atau hidung</li>
          <li><strong>Sirkulasi Udara:</strong> Berikan udara segar, longgarkan pakaian ketat</li>
          <li><strong>Stimulasi Ringan:</strong> Tepuk pipi atau panggil nama korban</li>
          <li><strong>Recovery Position:</strong> Jika tidak sadar dalam 2 menit, posisikan miring</li>
        </ol>
        <p><strong>Kapan Memanggil Bantuan:</strong> Jika pingsan lebih dari 2 menit atau ada cedera lain.</p>
      `,
    },
  },
};

export default function TraficarePage() {
  const [biodata, setBiodata] = useState<BiodataForm>({
    nama: "",
    nis: "",
    domisili: "",
  });
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GuideCategory | null>(
    null
  );
  const [showContent, setShowContent] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const biodataRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBiodata = () => {
    biodataRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBiodataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (biodata.nama && biodata.nis && biodata.domisili) {
      setIsFormComplete(true);
      setTimeout(() => {
        guideRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  const handleGuideSelect = (guide: GuideCategory) => {
    setSelectedGuide(guide);
    setShowContent(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleBiodataChange = (field: keyof BiodataForm, value: string) => {
    setBiodata((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-soft-gradient">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-800 to-emerald-600 rounded-lg flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-primary">Traficare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={scrollToAbout} className="text-gray-600 hover:text-red-800 transition-colors font-medium">
                Tentang
              </button>
              <button onClick={scrollToBiodata} className="text-gray-600 hover:text-red-800 transition-colors font-medium">
                Mulai Belajar
              </button>
              <Button 
                onClick={scrollToBiodata}
                className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-900 hover:to-red-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
              >
                Bergabung Sekarang
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced Modern Design */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-medical-hero"></div>
        
        {/* Floating geometric shapes - simplified colors */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-red-200/20 to-red-300/20 rounded-2xl rotate-12 float-animation"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-br from-emerald-200/20 to-emerald-300/20 rounded-full gentle-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-200/20 to-gray-300/20 rounded-lg -rotate-12 breathe"></div>
        <div className="absolute bottom-1/4 left-1/5 w-14 h-14 bg-gradient-to-br from-emerald-200/20 to-emerald-300/20 rounded-2xl rotate-45 float-animation" style={{animationDelay: '1s'}}></div>

        {/* Medical Icons Floating - simplified colors */}
        <div className="absolute top-1/4 right-1/3 gentle-pulse" style={{animationDelay: '0.5s'}}>
          <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center shadow-soft float-animation">
            <Heart className="w-8 h-8 text-red-800 opacity-30" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/6 gentle-pulse" style={{animationDelay: '1.5s'}}>
          <div className="w-14 h-14 glass-card rounded-xl flex items-center justify-center shadow-soft float-animation">
            <Shield className="w-7 h-7 text-emerald-600 opacity-30" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/4 gentle-pulse" style={{animationDelay: '2.5s'}}>
          <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center shadow-soft float-animation">
            <Activity className="w-6 h-6 text-gray-600 opacity-30" />
          </div>
        </div>
        <div className="absolute top-1/3 left-1/3 gentle-pulse" style={{animationDelay: '3s'}}>
          <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center shadow-soft float-animation">
            <Stethoscope className="w-5 h-5 text-red-800 opacity-30" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Enhanced Content */}
            <div className="space-y-8 slide-in-left">
              <div className="inline-flex items-center gap-3 glass-card text-red-800 px-6 py-3 rounded-full text-sm font-semibold shadow-soft ">
                <div className="w-6 h-6 bg-gradient-to-br from-red-800 to-emerald-600 rounded-full flex items-center justify-center ">
                  <Cross className="w-3 h-3 text-white" />
                </div>
                Platform Edukasi P3K untuk Siswa SMA
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-6xl md:text-[5.4rem] font-bold gradient-text-primary leading-tight hero-title">
                  Traficare
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-emerald-600 rounded-full"></div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl text-gray-800 font-bold">
                  Empower Yourself with{" "}
                  <span className="gradient-text-medical">First Aid Skills!</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Pelajari teknik pertolongan pertama yang dapat menyelamatkan nyawa dalam situasi darurat. 
                  Platform interaktif yang dirancang khusus untuk siswa SMA dengan pendekatan modern dan mudah dipahami.
                </p>
              </div>

              {/* Enhanced Stats */}
              {/* <div className="grid grid-cols-3 gap-6">
                <div className="text-center glass-card p-4 rounded-2xl hover-lift">
                  <div className="text-3xl md:text-4xl font-bold gradient-text-medical">4</div>
                  <div className="text-sm text-gray-600 font-medium">Panduan Lengkap</div>
                </div>
                <div className="text-center glass-card p-4 rounded-2xl hover-lift">
                  <div className="text-3xl md:text-4xl font-bold gradient-text-medical">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Akses Kapan Saja</div>
                </div>
                <div className="text-center glass-card p-4 rounded-2xl hover-lift">
                  <div className="text-3xl md:text-4xl font-bold gradient-text-medical">100%</div>
                  <div className="text-sm text-gray-600 font-medium">Gratis</div>
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToAbout}
                  size="lg"
                  className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-900 hover:to-red-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-medical hover:shadow-lg transition-all duration-300 hover-lift shimmer-effect"
                >
                  Mulai Sekarang
                  <ChevronDown className="ml-2 w-5 h-5" />
                </Button>
                {/* <Button
                  onClick={scrollToBiodata}
                  variant="outline"
                  size="lg"
                  className="glass-card border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover-lift"
                >
                  Mulai Sekarang
                </Button> */}
              </div>
            </div>

            {/* Right Column - Enhanced Visual */}
            <div className="relative w-full h-full scale-in">
              <div className="relative w-full h-96 md:h-[500px] float-animation">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-emerald-100/30 rounded-3xl transform rotate-3 hover-lift"></div>
                <div className="relative w-full h-full bg-white rounded-3xl shadow-medical overflow-hidden hover-lift">
                  <Image
                    src={"/images/hero.PNG"}
                    alt="Medical Education Illustration"
                    fill
                    className="object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent rounded-3xl"></div>
                </div>
              </div>

              {/* Floating feature badges */}
              <div className="absolute -top-4 -right-4 glass-card p-3 rounded-2xl shadow-soft float-animation">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Sertifikat</span>
                </div>
              </div>
              <div className="absolute -bottom-0 -left-4 glass-card p-3 rounded-2xl shadow-soft float-animation">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-800" />
                  <span className="text-sm font-medium text-gray-700">Komunitas</span>
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
          <div className="text-center mb-20 fade-in-up">
            <div className="inline-flex items-center gap-3 glass-card text-red-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-soft">
              <Target className="w-4 h-4" />
              Tentang Traficare
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Mengapa Memilih{" "}
              <span className="text-red-800">Traficare?</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-emerald-600 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kami berkomitmen untuk memberikan edukasi P3K terbaik yang dapat diakses kapan saja, 
              di mana saja, dengan metode pembelajaran yang interaktif dan mudah dipahami.
            </p>
          </div>

          {/* Enhanced Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <Card className="border-0 shadow-medical bg-gradient-to-br from-red-50/30 to-white p-8 rounded-3xl hover-lift slide-in-left">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-800 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold text-gray-900">Misi Kami</h3>
                  <div className="w-12 h-0.5 bg-red-800 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Memberikan akses mudah dan gratis kepada siswa SMA untuk mempelajari teknik pertolongan pertama 
                yang dapat menyelamatkan nyawa. Kami percaya bahwa setiap siswa berhak mendapatkan pengetahuan 
                yang dapat membuat perbedaan dalam situasi darurat.
              </p>
              <div className="mt-6 flex items-center gap-2 text-red-800">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Akses Gratis Selamanya</span>
              </div>
            </Card>

            <Card className="border-0 shadow-medical bg-gradient-to-br from-emerald-50/30 to-white p-8 rounded-3xl hover-lift slide-in-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold text-gray-900">Visi Kami</h3>
                  <div className="w-12 h-0.5 bg-emerald-600 rounded-full mt-2"></div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Menjadi platform edukasi P3K terdepan di Indonesia yang menciptakan generasi muda yang siap 
                dan mampu memberikan pertolongan pertama dalam situasi darurat, sehingga dapat mengurangi 
                risiko kematian dan cedera yang dapat dicegah.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Impact Berkelanjutan</span>
              </div>
            </Card>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="text-center group hover-lift scale-in">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Mudah Dipahami</h4>
              <p className="text-gray-600 leading-relaxed">
                Konten disajikan dengan bahasa sederhana dan visual yang menarik untuk 
                memudahkan pemahaman siswa.
              </p>
            </div>

            <div className="text-center group hover-lift scale-in" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Video Interaktif</h4>
              <p className="text-gray-600 leading-relaxed">
                Pembelajaran melalui video demonstrasi yang jelas dan mudah diikuti 
                step-by-step.
              </p>
            </div>

            <div className="text-center group hover-lift scale-in" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Akses 24/7</h4>
              <p className="text-gray-600 leading-relaxed">
                Belajar kapan saja dan di mana saja sesuai dengan waktu dan kecepatan 
                belajar Anda.
              </p>
            </div>

            <div className="text-center group hover-lift scale-in" style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-medical">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Standar Medis</h4>
              <p className="text-gray-600 leading-relaxed">
                Semua materi disusun berdasarkan standar medis internasional dan 
                mengikuti protokol terbaru.
              </p>
            </div>
          </div>

          {/* Enhanced Emergency Contact Info */}
          <Card className="border-0 shadow-medical bg-gradient-to-r from-red-50/50 via-white to-orange-50/50 p-8 rounded-3xl hover-lift">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-3xl font-bold gradient-text-primary">
                  Nomor Darurat Indonesia
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-4xl font-bold text-red-600 mb-2">119</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Pemadam Kebakaran & Ambulans</div>
                  <div className="text-sm text-gray-600">Emergency Response</div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-4xl font-bold text-blue-600 mb-2">110</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Kepolisian</div>
                  <div className="text-sm text-gray-600">Police Emergency</div>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover-lift">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">118</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">Ambulans</div>
                  <div className="text-sm text-gray-600">Medical Emergency</div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-6 max-w-3xl mx-auto">
                <strong>Selalu hubungi layanan darurat terbuka ketika berhadapan dengan situasi emergency yang memerlukan pertolongan profesional</strong>
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Biodata Section - Enhanced Modern Design */}
      <section
        ref={biodataRef}
        className="py-24 px-4 bg-soft-gradient relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 w-20 h-20 bg-gradient-to-br from-red-300/20 to-gray-300/20 rounded-3xl rotate-12 float-animation"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-emerald-300/20 to-gray-300/20 rounded-2xl -rotate-12 gentle-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full breathe"></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12 fade-in-up">
            <div className="inline-flex items-center gap-3 glass-card text-red-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-soft">
              <Users className="w-4 h-4" />
              Bergabung dengan Komunitas
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Tell Us About{" "}
              <span className="gradient-text-medical">Yourself</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-800 to-emerald-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Isi biodata Anda untuk melanjutkan ke panduan P3K dan bergabung dengan ribuan siswa lainnya
            </p>
          </div>

          <Card className="shadow-medical border-0 glass-card relative overflow-hidden hover-lift scale-in">
            {/* Enhanced Card Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100/30 to-gray-100/30 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/30 to-gray-100/30 rounded-full translate-y-16 -translate-x-16"></div>

            <CardHeader className="text-center pb-6 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-medical hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold gradient-text-primary mb-2">
                Biodata Siswa
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Data ini akan membantu kami memberikan pengalaman belajar yang lebih personal
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 p-8">
              <form onSubmit={handleBiodataSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="nama"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-red-800 rounded-full"></div>
                    Nama Lengkap
                  </Label>
                  <Input
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={biodata.nama}
                    onChange={(e) => handleBiodataChange("nama", e.target.value)}
                    className="h-14 text-base border-2 border-gray-200 focus:border-red-800 transition-all duration-300 rounded-2xl px-4 glass-card"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="nis"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    NIS (Nomor Induk Siswa)
                  </Label>
                  <Input
                    id="nis"
                    type="text"
                    placeholder="Masukkan NIS Anda"
                    value={biodata.nis}
                    onChange={(e) => handleBiodataChange("nis", e.target.value)}
                    className="h-14 text-base border-2 border-gray-200 focus:border-emerald-600 transition-all duration-300 rounded-2xl px-4 glass-card"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="domisili"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    Domisili
                  </Label>
                  <Input
                    id="domisili"
                    type="text"
                    placeholder="Kota/Kabupaten tempat tinggal"
                    value={biodata.domisili}
                    onChange={(e) => handleBiodataChange("domisili", e.target.value)}
                    className="h-14 text-base border-2 border-gray-200 focus:border-gray-500 transition-all duration-300 rounded-2xl px-4 glass-card"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-red-800 to-emerald-600 hover:from-red-900 hover:to-emerald-700 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-medical hover:shadow-lg hover-lift shimmer-effect"
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    Join the Community
                    <ChevronRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center items-center gap-2 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Data Aman</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Akses Instan</span>
                  </div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Selamat Datang, {biodata.nama}! 🎉</h3>
              <p className="text-gray-600">Anda sekarang dapat mengakses semua panduan P3K. Mari mulai belajar!</p>
            </div>
          )}
        </div>
      </section>

      {/* Guide Selection Section - Enhanced Modern Design */}
      {isFormComplete && (
        <section
          ref={guideRef}
          className="py-24 px-4 bg-gradient-to-br from-red-50/30 via-white to-emerald-50/30 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-red-200/20 to-gray-200/20 rounded-3xl rotate-12 float-animation"></div>
            <div className="absolute bottom-24 right-16 w-20 h-20 bg-gradient-to-br from-emerald-200/20 to-gray-200/20 rounded-2xl -rotate-12 gentle-pulse"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 fade-in-up">
              <div className="inline-flex items-center gap-3 glass-card text-red-800 px-8 py-4 rounded-full text-sm font-semibold mb-8 shadow-soft hover-lift">
                <BookOpen className="w-5 h-5" />
                Pilih Panduan P3K
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Choose Your First Aid{" "}
                <span className="gradient-text-medical">Journey</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-emerald-600 rounded-full mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Pilih kategori panduan P3K yang ingin Anda pelajari. Setiap panduan dilengkapi dengan 
                video demonstrasi dan artikel lengkap yang mudah dipahami.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(guideCategories).map(([key, category], index) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={key}
                    onClick={() => handleGuideSelect(key as GuideCategory)}
                    className={`cursor-pointer border-0 shadow-medical hover:shadow-lg transition-all duration-300 hover-lift scale-in relative overflow-hidden group ${
                      selectedGuide === key ? 'ring-2 ring-red-800 ring-offset-2' : ''
                    }`}
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    {/* Card Background Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${category.color.replace('bg-', 'bg-gradient-to-br from-').replace('-600', '-500/20 to-').replace('-600', '-600/20')}`}></div>
                    
                    <CardContent className="p-8 text-center relative z-10">
                      <div className={`w-20 h-20 ${category.color.replace('-600', '-500')} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-800">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-red-800 group-hover:text-red-900 font-medium">
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
                  <Play className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Video HD</span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">Artikel Lengkap</span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Sertifikat</span>
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
          className="py-24 px-4 bg-white slide-in-right"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-emerald-50 text-red-800 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
                {React.createElement(guideCategories[selectedGuide].icon, {
                  className: "w-4 h-4",
                })}
                Panduan P3K
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
                  <TabsList className="grid w-full grid-cols-2 rounded-none h-16 bg-gradient-to-r from-red-50 to-emerald-50">
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-3 text-base font-semibold h-full data-[state=active]:bg-white data-[state=active]:text-red-700 transition-all duration-300"
                    >
                      <Play className="w-5 h-5" />
                      Video Panduan
                    </TabsTrigger>
                    <TabsTrigger
                      value="artikel"
                      className="flex items-center gap-3 text-base font-semibold h-full data-[state=active]:bg-white data-[state=active]:text-red-700 transition-all duration-300"
                    >
                      <FileText className="w-5 h-5" />
                      Artikel Panduan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="video" className="p-8 m-0">
                    <div className="space-y-8">
                      <div className="aspect-video bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                        {/* Video Placeholder with Medical Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-emerald-900/20"></div>
                        <div className="text-center text-white relative z-10">
                          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Play className="w-12 h-12 text-white ml-1" />
                          </div>
                          <p className="text-xl font-semibold mb-2">
                            Video Tutorial
                          </p>
                          <p className="text-sm opacity-80">
                            Durasi: {guideContent[selectedGuide].video.duration}
                          </p>
                        </div>
                        {/* Medical Icons in Background */}
                        <div className="absolute top-4 left-4 opacity-10">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-10">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-red-50 to-emerald-50 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                          {guideContent[selectedGuide].video.title}
                        </h3>
                        <p className="text-stone-700 leading-relaxed text-lg">
                          {guideContent[selectedGuide].video.content}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="artikel" className="p-8 m-0">
                    <div className="space-y-8">
                      <div className="bg-gradient-to-r from-emerald-50 to-red-50 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          {guideContent[selectedGuide].artikel.title}
                        </h3>

                        <div
                          className="prose prose-lg max-w-none text-stone-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: guideContent[selectedGuide].artikel.content,
                          }}
                        />
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
                className="border-2 border-red-200 text-red-800 hover:bg-red-50 px-8 py-3 font-semibold"
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
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-red-400 to-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-emerald-400 to-red-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Cross className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold gradient-text-medical">Traficare</h3>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Platform edukasi P3K untuk siswa SMA - Menyebarkan pengetahuan yang dapat menyelamatkan nyawa 
              dengan pendekatan modern dan teknologi terdepan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-white">Menyelamatkan Nyawa</h4>
              <p className="text-gray-400 leading-relaxed">
                Setiap detik berharga dalam situasi darurat. Mari bersiap dengan pengetahuan yang tepat.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-white">Komunitas Peduli</h4>
              <p className="text-gray-400 leading-relaxed">
                Bersama membangun masyarakat yang siap siaga dan saling membantu dalam situasi darurat.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-white">Standar Medis</h4>
              <p className="text-gray-400 leading-relaxed">
                Materi terverifikasi oleh tenaga medis profesional sesuai standar internasional.
              </p>
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-6 glass-card px-8 py-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-300">Kontak Darurat: 119</span>
              </div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-red-800" />
                <span className="text-sm text-gray-300">24/7 Online</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-800 animate-pulse" />
                <span>Dibuat dengan dedikasi untuk keselamatan bersama</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>© 2025 Traficare - Platform Edukasi P3K Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
